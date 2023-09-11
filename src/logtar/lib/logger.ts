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

export type Logger = LoggerState &
  Record<LoggingFunctions, LoggingFn> & { init: () => Promise<void> };

const defaultLoggerState = () => ({
  config: buildLogConfig(),
  fileHandle: undefined,
});

const buildLoggingFunction: (
  state: LoggerState
) => (level: LogLevel) => LoggingFn = (state) => (level) => {
  const prefix = logLevelToString(level);
  return async (message) => {
    if (level < state.config.level || !state.fileHandle?.fd) {
      return;
    }
    const dateIso = new Date().toISOString();
    await state.fileHandle.write(
      `[${dateIso}] [${prefix}]: ${getCallerInfo()} ${message}\n`
    );
  };
};

export const withConfig: (config: LogConfigState) => Builder<LoggerState> =
  (config) => (state) => ({ ...state, config });

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

  const init = async () => {
    const logDirPath = checkAndCreateLogDir("logs");
    const fileName =
      state.config.filePrefix +
      new Date().toISOString().replace(/[\.:]+/, "-") +
      ".log";
    state.fileHandle = await open(path.join(logDirPath, fileName), "a+");
  };

  return {
    ...state,
    init,
    debug,
    info,
    warn,
    error,
    critical,
  };
};
