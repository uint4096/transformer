import { defaultStore } from "./store";

type Transform = (targetInstance: any) => any;

export function transform(func: Transform) {
  return function t(target: any, key: any): void {
    defaultStore.setMetadata(target, key, func);
  };
}

export function expose() {
  return function e(target: any, key: any): void {
    defaultStore.setMetadata(target, key, null);
  };
}

export function plainToInstance(source: any, target: any): any {
  const keys = Array.from(defaultStore.getKeys(target));
  return keys.reduce<{ [k: string]: any }>((t, val) => {
    const func = defaultStore.getTransformer(target, val);
    t[val] = func ? func(source) : source[val];
    return t;
  }, {});
}
