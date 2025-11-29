/**
 * Vue2用の共有stateミックスイン
 */
export declare const sharedStateMixin: {
    methods: {
        /**
         * 共有stateの値を取得
         */
        getSharedState(key: string): any;
        /**
         * 共有stateの値を設定
         */
        setSharedState(key: string, value: any): void;
        /**
         * 共有stateの変更を監視
         */
        subscribeSharedState(key: string, callback: (value: any) => void): () => void;
    };
};
/**
 * Vue2のコンポーネントオプションとして使用できる関数
 */
export declare function useSharedStateVue2<T>(key: string, initialValue?: T): {
    data(): {
        [key]: any;
    };
    created(): void;
    beforeDestroy(): void;
    methods: {
        [x: string]: (value: T) => void;
    };
};
