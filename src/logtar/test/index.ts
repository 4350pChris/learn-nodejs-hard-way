import path from "path";
import { Logger, LogConfig } from "../index";

const configFile = path.join(__dirname, "config.json");

const logger = Logger.buildLogger(
  Logger.withConfig(LogConfig.buildLogConfig(LogConfig.fromFile(configFile)))
);

logger.init(logger.state).then(() => {
  logger.debug("Debugging");
  logger.error("My error");
});
