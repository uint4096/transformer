import { defaultStore, Transformer } from "./store";

export function transform<T extends Object, U>(func: Transformer<T, U>) {
  return function t(target: T, key: keyof T): void {
    defaultStore.setMetadata(target, key, func);
  };
}

export function expose<T extends Object>() {
  return function e(target: T, key: keyof T): void {
    defaultStore.setMetadata(target, key, null);
  };
}

export function plainToInstance<
  T extends new () => InstanceType<T>,
  U extends { [k in keyof InstanceType<T>]?: unknown }
>(source: U, target: T): InstanceType<T> {
  const keys = Array.from(defaultStore.getKeys(target));

  const instance = keys.reduce<T>((t, val) => {
    const func = defaultStore.getTransformer(target, val);
    t[val] = func ? func(source) : source[<keyof U>val];
    return t;
  }, <T>{});

  return <InstanceType<T>>instance;
}
