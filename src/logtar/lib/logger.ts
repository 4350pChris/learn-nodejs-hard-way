import { buildLogConfig, type LogConfigState } from "./config/log-config";
import { applyBuilders, type Builder } from "./helpers";

export type LoggerState = {
  config: LogConfigState;
};

const defaultLoggerState = () => ({ config: buildLogConfig() });

export const withConfig: (config: LogConfigState) => Builder<LoggerState> =
  (config) => (state) => ({ ...state, config });

export const buildLogger = (...builders: Builder<LoggerState>[]) =>
  applyBuilders(defaultLoggerState(), ...builders);
