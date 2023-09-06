export type Builder<S> = (state: S) => S;

export const applyBuilders = <S>(defaultState: S, ...builders: Builder<S>[]) =>
  builders.reduce((state, builder) => builder(state), defaultState);
