import Vue from 'vue';
import { getSharedStore } from './index';

/**
 * Vue2用の共有stateミックスイン
 */
export const sharedStateMixin = {
  methods: {
    /**
     * 共有stateの値を取得
     */
    getSharedState(key: string) {
      const store = getSharedStore();
      return store.get(key);
    },

    /**
     * 共有stateの値を設定
     */
    setSharedState(key: string, value: any) {
      const store = getSharedStore();
      store.set(key, value);
    },

    /**
     * 共有stateの変更を監視
     */
    subscribeSharedState(key: string, callback: (value: any) => void) {
      const store = getSharedStore();
      return store.subscribe(key, callback);
    },
  },
};

/**
 * Vue2のコンポーネントオプションとして使用できる関数
 */
export function useSharedStateVue2<T>(key: string, initialValue?: T) {
  return {
    data() {
      const store = getSharedStore();
      const current = store.get(key);
      if (current === undefined && initialValue !== undefined) {
        store.set(key, initialValue);
        return { [key]: initialValue };
      }
      return { [key]: current };
    },
    created() {
      const store = getSharedStore();
      const unsubscribe = store.subscribe(key, (newValue: T) => {
        (this as any)[key] = newValue;
      });
      (this as any)._sharedStateUnsubscribers = (this as any)._sharedStateUnsubscribers || [];
      (this as any)._sharedStateUnsubscribers.push(unsubscribe);
    },
    beforeDestroy() {
      if ((this as any)._sharedStateUnsubscribers) {
        (this as any)._sharedStateUnsubscribers.forEach((unsubscribe: () => void) => unsubscribe());
      }
    },
    methods: {
      [`update${key.charAt(0).toUpperCase() + key.slice(1)}`](value: T) {
        const store = getSharedStore();
        store.set(key, value);
      },
    },
  };
}
