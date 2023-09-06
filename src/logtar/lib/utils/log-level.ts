export enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
  Critical,
}

export const logLevelToString = (level: LogLevel) => {
  switch (level) {
    case LogLevel.Debug:
      return "Debug";
    case LogLevel.Info:
      return "Info";
    case LogLevel.Warn:
      return "Warn";
    case LogLevel.Error:
      return "Error";
    case LogLevel.Critical:
      return "Critical";
    default:
      throw new Error(`Unsupported log level: ${level}`);
  }
};
