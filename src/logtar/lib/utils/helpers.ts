import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

export type Builder<S> = (state: S) => S;

export const applyBuilders = <S>(defaultState: S, ...builders: Builder<S>[]) =>
  builders.reduce((state, builder) => builder(state), defaultState);

export const checkAndCreateLogDir = (pathToDir: string) => {
  const logDir = path.resolve(require.main?.path ?? "", pathToDir);
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }

  return logDir;
};

export const getCallerInfo = () => {
  const error: { stack: string } = { stack: "" };
  Error.captureStackTrace(error);

  const callerFrame = error.stack.split("\n")[3];
  console.log(callerFrame);
  const metaData = callerFrame!.split("at ").pop();
  return metaData;
};
