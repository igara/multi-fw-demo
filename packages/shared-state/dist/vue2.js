import { getSharedStore } from './index';
/**
 * Vue2用の共有stateミックスイン
 */
export const sharedStateMixin = {
    methods: {
        /**
         * 共有stateの値を取得
         */
        getSharedState(key) {
            const store = getSharedStore();
            return store.get(key);
        },
        /**
         * 共有stateの値を設定
         */
        setSharedState(key, value) {
            const store = getSharedStore();
            store.set(key, value);
        },
        /**
         * 共有stateの変更を監視
         */
        subscribeSharedState(key, callback) {
            const store = getSharedStore();
            return store.subscribe(key, callback);
        },
    },
};
/**
 * Vue2のコンポーネントオプションとして使用できる関数
 */
export function useSharedStateVue2(key, initialValue) {
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
            const unsubscribe = store.subscribe(key, (newValue) => {
                this[key] = newValue;
            });
            this._sharedStateUnsubscribers = this._sharedStateUnsubscribers || [];
            this._sharedStateUnsubscribers.push(unsubscribe);
        },
        beforeDestroy() {
            if (this._sharedStateUnsubscribers) {
                this._sharedStateUnsubscribers.forEach((unsubscribe) => unsubscribe());
            }
        },
        methods: {
            [`update${key.charAt(0).toUpperCase() + key.slice(1)}`](value) {
                const store = getSharedStore();
                store.set(key, value);
            },
        },
    };
}
