import { type Builder, applyBuilders } from "../helpers";
import {
  RollingSizeOptions,
  RollingTimeOptions,
  assertSize,
  assertTime,
} from "../utils/rolling-options";

export type RollingConfigState = {
  timeThreshold: RollingTimeOptions;
  sizeThreshold: RollingSizeOptions;
};

export const addSizeThreshold: (
  sizeThreshold: number
) => Builder<RollingConfigState> = (sizeThreshold) => (state) => {
  assertSize(sizeThreshold);
  return { ...state, sizeThreshold };
};

export const addTimeThreshold: (
  timeThreshold: RollingTimeOptions
) => Builder<RollingConfigState> = (timeThreshold) => (state) => {
  assertTime(timeThreshold);
  return { ...state, timeThreshold };
};

const defaultState: () => RollingConfigState = () => ({
  timeThreshold: RollingTimeOptions.Hourly,
  sizeThreshold: RollingSizeOptions.FiveMB,
});

export const buildRollingConfig = (
  ...builders: Builder<RollingConfigState>[]
) => applyBuilders(defaultState(), ...builders);

export const fromJson: (
  json: Partial<RollingConfigState>
) => Builder<RollingConfigState> = (json) => (state) => ({
  ...state,
  ...json,
});
