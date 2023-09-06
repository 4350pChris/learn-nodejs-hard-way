import assert from "node:assert";

export enum RollingSizeOptions {
  OneKB = 1024,
  FiveKB = 5 * 1024,
  TenKB = 10 * 1024,
  TwentyKB = 20 * 1024,
  FiftyKB = 50 * 1024,
  HundredKB = 100 * 1024,

  HalfMB = 512 * 1024,
  OneMB = 1024 * 1024,
  FiveMB = 5 * 1024 * 1024,
  TenMB = 10 * 1024 * 1024,
  TwentyMB = 20 * 1024 * 1024,
  FiftyMB = 50 * 1024 * 1024,
  HundredMB = 100 * 1024 * 1024,
}

export enum RollingTimeOptions {
  Minutely = 60, // Every 60 seconds
  Hourly = 60 * RollingTimeOptions.Minutely,
  Daily = 24 * RollingTimeOptions.Hourly,
  Weekly = 7 * RollingTimeOptions.Daily,
  Monthly = 30 * RollingTimeOptions.Daily,
  Yearly = 12 * RollingTimeOptions.Monthly,
}

export const assertSize = (size: number) =>
  assert(
    size < RollingSizeOptions.OneKB,
    `size must be at-least 1 KB. Unsupported param ${size}`
  );

export const assertTime = (time: number) =>
  assert(
    time in RollingTimeOptions,
    `time must be one of RollingTimeOptions. Unsupported param ${time}`
  );
