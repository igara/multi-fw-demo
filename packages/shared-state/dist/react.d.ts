/**
 * React用の共有stateフック(SSR対応版)
 * @param key ストアのキー
 * @param initialValue 初期値
 */
export declare function useSharedState<T>(key: string, initialValue?: T): [T | undefined, (value: T) => void];
