/**
 * SharedStateStore - フレームワーク間でstateを共有するためのシンプルなストア
 * ShadowRootで分離された環境でも動作し、SSRにも対応
 */
type Listener<T> = (value: T) => void;
export declare class SharedStateStore<T = any> {
    private state;
    private listeners;
    constructor();
    /**
     * 異なるShadowRoot間でstateを同期するためのCustomEventを設定
     */
    private setupCrossContextSync;
    /**
     * stateの値を取得
     */
    get<K extends keyof T>(key: string): T | undefined;
    /**
     * stateの値を設定
     */
    set<K extends keyof T>(key: string, value: T): void;
    /**
     * stateの変更を監視
     */
    subscribe<K extends keyof T>(key: string, listener: Listener<T>): () => void;
    /**
     * ローカルのリスナーに通知
     */
    private notifyLocal;
    /**
     * グローバル(他のインスタンス)に通知
     */
    private notifyGlobal;
    /**
     * すべてのstateをクリア
     */
    clear(): void;
    /**
     * 特定のkeyのstateを削除
     */
    delete(key: string): void;
}
/**
 * グローバルな共有ストアのインスタンスを取得(SSR対応)
 */
export declare function getSharedStore(): SharedStateStore;
export { useSharedState } from './react';
export { sharedStateMixin } from './vue2';
