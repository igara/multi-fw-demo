import { useEffect, useState, useSyncExternalStore } from 'react';
import { getSharedStore } from './index';
/**
 * React用の共有stateフック(SSR対応版)
 * @param key ストアのキー
 * @param initialValue 初期値
 */
export function useSharedState(key, initialValue) {
    const store = getSharedStore();
    // SSR対応: クライアントサイドでのみstoreを初期化
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
        // クライアントサイドで初期値を設定
        const current = store.get(key);
        if (current === undefined && initialValue !== undefined) {
            store.set(key, initialValue);
        }
    }, []);
    // useSyncExternalStoreを使用してstoreの変更を購読
    const value = useSyncExternalStore((callback) => {
        // クライアントサイドでのみ購読
        if (!isClient)
            return () => { };
        return store.subscribe(key, callback);
    }, () => {
        // クライアントサイドの値を取得
        if (!isClient)
            return initialValue;
        return store.get(key) ?? initialValue;
    }, () => {
        // SSR時の値を返す
        return initialValue;
    });
    const updateValue = (newValue) => {
        if (isClient) {
            store.set(key, newValue);
        }
    };
    return [value, updateValue];
}
