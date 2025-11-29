# @multi-fw-demo/shared-state

異なるフレームワーク(React, Vue2など)とShadowRoot間で状態を共有するための軽量ライブラリ。

## 特徴

- ✅ **SSR対応**: Next.js App RouterなどのSSR環境で安全に動作
- ✅ **ShadowRoot対応**: 異なるShadowRoot間でCustomEventを使って状態を同期
- ✅ **型安全**: TypeScriptで完全に型付け
- ✅ **フレームワーク非依存**: React、Vue2などどのフレームワークでも使用可能
- ✅ **軽量**: 依存関係なし、シンプルなイベント駆動アーキテクチャ

## インストール

```bash
pnpm add @multi-fw-demo/shared-state
```

## 使い方

### React (Next.js App Router対応)

```tsx
"use client"; // Next.jsの場合は必須

import { useSharedState } from "@multi-fw-demo/shared-state";

export function Counter() {
  const [count, setCount] = useSharedState<number>("counter", 0);

  return (
    <div>
      <p>Count: {count ?? 0}</p>
      <button onClick={() => setCount((count || 0) + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Vue 2

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { getSharedStore } from "@multi-fw-demo/shared-state";

export default {
  data() {
    return {
      count: 0,
    };
  },
  mounted() {
    const store = getSharedStore();
    
    // 初期値を設定
    const current = store.get("counter");
    if (current !== undefined) {
      this.count = current;
    }
    
    // 変更を監視
    this.unsubscribe = store.subscribe("counter", (value) => {
      this.count = value;
    });
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    increment() {
      const store = getSharedStore();
      store.set("counter", (this.count || 0) + 1);
    },
  },
};
</script>
```

### 直接APIを使用

```typescript
import { getSharedStore } from "@multi-fw-demo/shared-state";

const store = getSharedStore();

// 値を設定
store.set("counter", 0);

// 値を取得
const count = store.get("counter");

// 変更を監視
const unsubscribe = store.subscribe("counter", (value) => {
  console.log("Counter changed:", value);
});

// 監視を解除
unsubscribe();
```

## アーキテクチャ

### SSR対応

- `typeof window !== 'undefined'` でブラウザ環境を検出
- SSR時は状態の同期をスキップ
- React 18の `useSyncExternalStore` を使用してハイドレーションエラーを防止

### ShadowRoot間の同期

異なるShadowRoot(Web Components)で分離されたコンテキスト間でも状態を共有できます:

1. **CustomEvent**: `window.dispatchEvent` でグローバルに状態変更を通知
2. **イベントリスナー**: 各インスタンスが `shared-state-update` イベントを監視
3. **無限ループ防止**: 受信時はローカルリスナーのみに通知

```
┌─────────────┐      CustomEvent      ┌─────────────┐
│ ShadowRoot1 │ ──────────────────▶  │ ShadowRoot2 │
│  (React)    │  shared-state-update  │  (Vue2)     │
└─────────────┘                       └─────────────┘
      │                                      ▲
      └──────────────────────────────────────┘
            同じ "counter" キーを共有
```

## API

### `SharedStateStore`

```typescript
class SharedStateStore<T = any> {
  get<K extends keyof T>(key: string): T | undefined;
  set<K extends keyof T>(key: string, value: T): void;
  subscribe<K extends keyof T>(key: string, listener: (value: T) => void): () => void;
  clear(): void;
  delete(key: string): void;
}
```

### `getSharedStore()`

グローバルな共有ストアのシングルトンインスタンスを取得します。

### `useSharedState<T>(key: string, initialValue?: T)`

React用のフック。SSR対応済み。

**戻り値**: `[T | undefined, (value: T) => void]`

## 改善点(以前のバージョンから)

### 🔧 SSR対応

**Before:**
```typescript
// window オブジェクトを直接使用 → SSRでエラー
if (!window.__sharedStateStore) {
  window.__sharedStateStore = new SharedStateStore();
}
```

**After:**
```typescript
// 環境チェックとモジュールスコープの変数を使用
let globalStore: SharedStateStore | null = null;

export function getSharedStore(): SharedStateStore {
  if (!globalStore) {
    globalStore = new SharedStateStore();
  }
  return globalStore;
}
```

### 🔧 Reactフックの改善

**Before:**
```typescript
// useStateとuseEffect → ハイドレーションエラーの可能性
const [value, setValue] = useState(() => store.get(key));
```

**After:**
```typescript
// useSyncExternalStore → SSR対応でハイドレーションエラーなし
const value = useSyncExternalStore(
  (callback) => store.subscribe(key, callback),
  () => store.get(key) ?? initialValue,  // クライアント
  () => initialValue                      // サーバー
);
```

### 🔧 CustomEventによる同期

**Before:**
```typescript
// グローバル変数のみ → 各ShadowRootで独立したインスタンス
window.__sharedStateStore
```

**After:**
```typescript
// CustomEventで全インスタンスに通知
window.dispatchEvent(new CustomEvent('shared-state-update', {
  detail: { key, value }
}));
```

## ライセンス

MIT
