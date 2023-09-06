import { buildLogConfig, type LogConfigState } from "./config/log-config";
import { applyBuilders, type Builder } from "./helpers";
import { LogLevel, logLevelToString } from "./utils/log-level";

type LoggingFn = (message: string) => void;

export type LoggerState = {
  config: LogConfigState;
};

type LoggingFunctions = "debug" | "info" | "warn" | "error" | "critical";

export type Logger = LoggerState & Record<LoggingFunctions, LoggingFn>;

const defaultLoggerState = () => ({ config: buildLogConfig() });

const buildLoggingFunction: (level: LogLevel) => LoggingFn = (level) => {
  const prefix = logLevelToString(level);
  return (message) => console.log(`${prefix}: ${message}`);
};

export const withConfig: (config: LogConfigState) => Builder<LoggerState> =
  (config) => (state) => ({ ...state, config });

export const buildLogger: (...builders: Builder<LoggerState>[]) => Logger = (
  ...builders
) => {
  const state = applyBuilders(defaultLoggerState(), ...builders);

  const debug = buildLoggingFunction(LogLevel.Debug);
  const info = buildLoggingFunction(LogLevel.Info);
  const warn = buildLoggingFunction(LogLevel.Warn);
  const error = buildLoggingFunction(LogLevel.Error);
  const critical = buildLoggingFunction(LogLevel.Critical);

  return {
    ...state,
    debug,
    info,
    warn,
    error,
    critical,
  };
};
