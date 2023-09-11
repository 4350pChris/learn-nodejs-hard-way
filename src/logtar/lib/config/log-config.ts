import { type RollingConfigState, buildRollingConfig } from "./rolling-config";
import { type Builder, applyBuilders } from "../utils/helpers";
import { type PathOrFileDescriptor, readFileSync } from "node:fs";
import { LogLevel } from "../utils/log-level";

export type LogConfigState = {
  level: LogLevel;
  rollingConfig: RollingConfigState;
  filePrefix: string;
};

export const addLogLevel =
  (level: LogConfigState["level"]) => (state: LogConfigState) => ({
    ...state,
    level,
  });

export const addRollingConfig =
  (rollingConfig: LogConfigState["rollingConfig"]) =>
  (state: LogConfigState) => ({
    ...state,
    rollingConfig,
  });

export const addFilePrefix =
  (filePrefix: LogConfigState["filePrefix"]) => (state: LogConfigState) => ({
    ...state,
    filePrefix,
  });

const defaultLogConfig: () => LogConfigState = () => ({
  level: LogLevel.Info,
  rollingConfig: buildRollingConfig(),
  filePrefix: "Logtar_",
});

export const fromJson: (
  json: Partial<LogConfigState>
) => Builder<LogConfigState> = (json) => (state) => ({
  ...state,
  ...json,
});

export const fromFile = (path: PathOrFileDescriptor) => {
  const content = readFileSync(path, { encoding: "utf-8" });
  return fromJson(JSON.parse(content));
};

export const buildLogConfig = (...builders: Builder<LogConfigState>[]) =>
  applyBuilders(defaultLogConfig(), ...builders);
