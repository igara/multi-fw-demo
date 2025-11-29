/**
 * SharedStateStore - フレームワーク間でstateを共有するためのシンプルなストア
 * ShadowRootで分離された環境でも動作し、SSRにも対応
 */

type Listener<T> = (value: T) => void;

export class SharedStateStore<T = any> {
  private state: Map<string, T> = new Map();
  private listeners: Map<string, Set<Listener<T>>> = new Map();

  constructor() {
    // ブラウザ環境の場合のみCustomEventリスナーを設定
    if (typeof window !== 'undefined') {
      this.setupCrossContextSync();
    }
  }

  /**
   * 異なるShadowRoot間でstateを同期するためのCustomEventを設定
   */
  private setupCrossContextSync(): void {
    if (typeof window === 'undefined') return;

    // 他のインスタンスからの更新を受信
    window.addEventListener('shared-state-update', ((event: CustomEvent) => {
      const { key, value } = event.detail;
      // 無限ループを防ぐため、通知なしで更新
      this.state.set(key, value);
      this.notifyLocal(key, value);
    }) as EventListener);
  }

  /**
   * stateの値を取得
   */
  get<K extends keyof T>(key: string): T | undefined {
    return this.state.get(key);
  }

  /**
   * stateの値を設定
   */
  set<K extends keyof T>(key: string, value: T): void {
    this.state.set(key, value);
    this.notifyLocal(key, value);
    this.notifyGlobal(key, value);
  }

  /**
   * stateの変更を監視
   */
  subscribe<K extends keyof T>(key: string, listener: Listener<T>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);

    // 初回実行（既に値がある場合）
    const currentValue = this.state.get(key);
    if (currentValue !== undefined) {
      listener(currentValue);
    }

    // unsubscribe関数を返す
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(listener);
      }
    };
  }

  /**
   * ローカルのリスナーに通知
   */
  private notifyLocal(key: string, value: T): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach((listener) => listener(value));
    }
  }

  /**
   * グローバル(他のインスタンス)に通知
   */
  private notifyGlobal(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    const event = new CustomEvent('shared-state-update', {
      detail: { key, value },
      bubbles: true,
    });
    window.dispatchEvent(event);
  }

  /**
   * すべてのstateをクリア
   */
  clear(): void {
    this.state.clear();
    this.listeners.clear();
  }

  /**
   * 特定のkeyのstateを削除
   */
  delete(key: string): void {
    this.state.delete(key);
    this.listeners.delete(key);
  }
}

// SSR対応のグローバルストアマネージャー
let globalStore: SharedStateStore | null = null;

/**
 * グローバルな共有ストアのインスタンスを取得(SSR対応)
 */
export function getSharedStore(): SharedStateStore {
  if (!globalStore) {
    globalStore = new SharedStateStore();
  }
  return globalStore;
}

// React用のhook
export { useSharedState } from './react';
// Vue2用のmixin
export { sharedStateMixin } from './vue2';
