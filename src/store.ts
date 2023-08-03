export const store = () => {
  const store = new Map();

  return {
    setMetadata: <T extends { new (): InstanceType<T> }>(
      target: T,
      key: any,
      func: any
    ) => {
      if (store.has(target.constructor)) {
        const keyStore = store.get(target.constructor);
        if (keyStore.has(key)) {
          const transformerStore = keyStore.get(key);
          transformerStore.set(key, func);
        } else {
          keyStore.set(key, func);
        }
      } else {
        const keyStore = new Map().set(key, func);
        store.set(target.constructor, keyStore);
      }
    },

    getKeys: <T extends { new (): InstanceType<T> }>(target: T) => {
      const keyStore: Map<any, any> = store.get(target);
      return keyStore.keys();
    },

    getTransformer: <T extends { new (): InstanceType<T> }>(
      target: T,
      key: keyof T
    ) => {
      const keyStore = store.get(target);
      if (keyStore) {
        return keyStore.get(key);
      }

      return null;
    },
  };
};

export const defaultStore = store();
