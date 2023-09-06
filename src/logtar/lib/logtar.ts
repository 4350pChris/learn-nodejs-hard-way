import * as _LogConfig from "./config/log-config";
import * as _RollingConfig from "./config/rolling-config";
import { LogLevel } from "./utils/log-level";
import {
  RollingSizeOptions,
  RollingTimeOptions,
} from "./utils/rolling-options";

export * as Logger from "./logger";

export const LogConfig = {
  ..._LogConfig,
  LogLevel,
};

export const RollingConfig = {
  ..._RollingConfig,
  RollingSizeOptions,
  RollingTimeOptions,
};
