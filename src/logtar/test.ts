import * as logtar from "./lib/config/log-config";
import * as rolling from "./lib/config/rolling-config";
import { stdout } from "node:process";

const config = logtar.buildLogConfig(
  logtar.addFilePrefix("Logtar_"),
  logtar.addLogLevel(logtar.LogLevel.Debug),
  logtar.addRollingConfig(rolling.buildRollingConfig())
);

stdout.write(JSON.stringify(config));
