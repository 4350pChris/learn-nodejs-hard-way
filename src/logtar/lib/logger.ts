import { open, type FileHandle } from "node:fs/promises";
import { buildLogConfig, type LogConfigState } from "./config/log-config";
import {
  applyBuilders,
  checkAndCreateLogDir,
  type Builder,
  getCallerInfo,
} from "./utils/helpers";
import { LogLevel, logLevelToString } from "./utils/log-level";
import path from "node:path";

type LoggingFn = (message: string) => void;

export type LoggerState = {
  config: LogConfigState;
  fileHandle?: FileHandle;
};

type LoggingFunctions = "debug" | "info" | "warn" | "error" | "critical";

export type Logger = { state: LoggerState; init: typeof init } & Record<
  LoggingFunctions,
  LoggingFn
>;

const init = async (state: LoggerState) => {
  const logDirPath = checkAndCreateLogDir("logs");
  const fileName =
    state.config.filePrefix +
    new Date().toISOString().replace(/[\.:]+/, "-") +
    ".log";
  state.fileHandle = await open(path.join(logDirPath, fileName), "a+");
};

const defaultLoggerState = () => ({
  config: buildLogConfig(),
  fileHandle: undefined,
  init,
});

const writeToHandle = async (fh: FileHandle, level: string, msg: string) => {
  const dateIso = new Date().toISOString();
  await fh.write(`[${dateIso}] [${level}]: ${getCallerInfo()} ${msg}\n`);
};

const buildLoggingFunction: (
  state: LoggerState
) => (level: LogLevel) => LoggingFn = (state) => (level) => {
  const prefix = logLevelToString(level);
  return async (message) => {
    if (level < state.config.level || !state.fileHandle?.fd) {
      return;
    }
    await writeToHandle(state.fileHandle, prefix, message);
    await rollingCheck(state);
  };
};

export const withConfig: (config: LogConfigState) => Builder<LoggerState> =
  (config) => (state) => ({ ...state, config });

const rollingCheck = async (state: LoggerState) => {
  const { sizeThreshold, timeThreshold } = state.config.rollingConfig;
  if (!state.fileHandle) {
    return;
  }
  const { size, birthtimeMs } = await state.fileHandle.stat();
  const currentTime = new Date().getTime();

  if (
    size >= sizeThreshold ||
    currentTime - birthtimeMs >= timeThreshold * 1000
  ) {
    await state.fileHandle.close();
    await init(state);
  }
};

export const buildLogger: (...builders: Builder<LoggerState>[]) => Logger = (
  ...builders
) => {
  const state = applyBuilders(defaultLoggerState(), ...builders);

  const boundLoggingBuilder = buildLoggingFunction(state);

  const debug = boundLoggingBuilder(LogLevel.Debug);
  const info = boundLoggingBuilder(LogLevel.Info);
  const warn = boundLoggingBuilder(LogLevel.Warn);
  const error = boundLoggingBuilder(LogLevel.Error);
  const critical = boundLoggingBuilder(LogLevel.Critical);

  return {
    state,
    init,
    debug,
    info,
    warn,
    error,
    critical,
  };
};
