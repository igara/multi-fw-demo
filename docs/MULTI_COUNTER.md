# Multi Counter - フレームワーク間のGlobal State共有

このデモでは、Vue2、React、Next.jsの3つのフレームワーク間でカウンターの状態を共有する実装を紹介しています。

## 概要

`multi_counter` ページは、異なるフレームワークで構築されたアプリケーション間でグローバルステートを共有するデモです。各アプリケーションはShadowRootで分離されていますが、`@multi-fw-demo/shared-state` パッケージを通じて同じカウンター値を共有し、リアルタイムで同期します。

## アーキテクチャ

### 1. Shared State Store (`@multi-fw-demo/shared-state`)

#### コアメカニズム

`SharedStateStore` クラスは、フレームワーク間で状態を共有するための中核となるストアです。

```typescript
export class SharedStateStore<T = any> {
  private state: Map<string, T> = new Map();
  private listeners: Map<string, Set<Listener<T>>> = new Map();
  
  // ブラウザ環境のみでCustomEventリスナーを設定
  constructor() {
    if (typeof window !== 'undefined') {
      this.setupCrossContextSync();
    }
  }
}
```

**主な機能:**

- **状態管理**: `Map` を使用してキーバリュー形式で状態を保存
- **ローカル通知**: 同じインスタンス内のリスナーに変更を通知
- **グローバル同期**: CustomEventを使用して異なるShadowRoot間で状態を同期
- **SSR対応**: サーバーサイドでも安全に動作（Eventリスナーはクライアント側のみ）

#### ShadowRoot間の同期メカニズム

```typescript
private setupCrossContextSync(): void {
  window.addEventListener('shared-state-update', ((event: CustomEvent) => {
    const { key, value } = event.detail;
    // 無限ループを防ぐため、通知なしで更新
    this.state.set(key, value);
    this.notifyLocal(key, value);
  }) as EventListener);
}

private notifyGlobal(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('shared-state-update', {
        detail: { key, value },
      })
    );
  }
}
```

ShadowRootで分離されたコンテキスト間でも、`window` オブジェクトは共有されるため、CustomEventを使うことで異なるShadowRoot内のコンポーネント間で状態を同期できます。

### 2. React向けフック (`useSharedState`)

ReactおよびNext.jsアプリケーション用のフックで、SSRに完全対応しています。

```typescript
export function useSharedState<T>(
  key: string,
  initialValue?: T
): [T | undefined, (value: T) => void] {
  const store = getSharedStore();
  
  // SSR対応: クライアントサイドでのみstoreを初期化
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const current = store.get(key);
    if (current === undefined && initialValue !== undefined) {
      store.set(key, initialValue);
    }
  }, []);

  // useSyncExternalStoreを使用してstoreの変更を購読
  const value = useSyncExternalStore(
    (callback) => {
      if (!isClient) return () => {};
      return store.subscribe(key, callback);
    },
    () => {
      if (!isClient) return initialValue;
      return store.get(key) ?? initialValue;
    },
    () => {
      // SSR時の値を返す
      return initialValue;
    }
  );

  const updateValue = (newValue: T) => {
    if (isClient) {
      store.set(key, newValue);
    }
  };

  return [value, updateValue];
}
```

**特徴:**

- **`useSyncExternalStore`**: React 18の外部ストア購読API。ストアの変更を効率的に追跡
- **SSRハイドレーション対策**: `isClient` フラグでクライアント/サーバーを判定し、ハイドレーションエラーを防ぐ
- **初期値の自動設定**: クライアント側で初めてアクセスした時に初期値を設定

### 3. Vue2向けAPI

Vue2では、Options APIに適したミックスインと関数を提供しています。

```typescript
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
      this._unsubscribe = store.subscribe(key, (newValue: T) => {
        this[key] = newValue;
      });
    },
    beforeDestroy() {
      if (this._unsubscribe) {
        this._unsubscribe();
      }
    },
  };
}
```

## 実装例

### Vue2 (`packages/vue2/src/components/CounterApp.vue`)

```vue
<template>
  <div class="counter-container">
    <h2>Shared Counter (Vue2 App)</h2>
    <div class="counter-value">Count: {{ counter }}</div>
    <div class="counter-buttons">
      <button @click="incrementCounter">Increment</button>
      <button @click="decrementCounter">Decrement</button>
      <button @click="resetCounter">Reset</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSharedStore } from '@multi-fw-demo/shared-state'

export default Vue.extend({
  name: 'CounterApp',
  data() {
    return {
      counter: 0
    }
  },
  created() {
    const store = getSharedStore()
    
    // 初期値を設定
    const currentCount = store.get('counter')
    if (currentCount !== undefined) {
      this.counter = currentCount
    } else {
      store.set('counter', 0)
    }
    
    // 変更を監視
    this._unsubscribe = store.subscribe('counter', (newValue: number) => {
      this.counter = newValue
    })
  },
  beforeDestroy() {
    if (this._unsubscribe) {
      this._unsubscribe()
    }
  },
  methods: {
    incrementCounter() {
      const store = getSharedStore()
      store.set('counter', this.counter + 1)
    },
    decrementCounter() {
      const store = getSharedStore()
      store.set('counter', this.counter - 1)
    },
    resetCounter() {
      const store = getSharedStore()
      store.set('counter', 0)
    }
  }
})
</script>
```

**ポイント:**
- `created` フックで初期値を読み込み、変更を購読
- `beforeDestroy` で購読を解除してメモリリークを防止
- ストアを直接操作して状態を更新

### React (`packages/react/src/routes/multi_counter.tsx`)

```tsx
import { Button } from "@multi-fw-demo-igarashi/shadcn";
import { useSharedState } from "@multi-fw-demo/shared-state";

export function MultiCounter() {
  const [count, setCount] = useSharedState<number>("counter", 0);

  const increment = () => {
    setCount((count || 0) + 1);
  };

  const decrement = () => {
    setCount((count || 0) - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div style={{ /* ... */ }}>
      <h2>Shared Counter (React App)</h2>
      <div>Count: {count ?? 0}</div>
      <div>
        <Button onClick={increment}>Increment</Button>
        <Button onClick={decrement} variant="secondary">Decrement</Button>
        <Button onClick={reset} variant="outline">Reset</Button>
      </div>
    </div>
  );
}
```

**ポイント:**
- `useSharedState` フックを使用してシンプルに状態管理
- useState風のAPIで直感的に扱える
- 自動的にクリーンアップされる

### Next.js (`packages/nextjs/app/multi_counter/components/ShadcnCounter.tsx`)

```tsx
"use client";

import { useSharedState } from "@multi-fw-demo/shared-state";
import { Button } from "@multi-fw-demo-igarashi/shadcn";

export function ShadcnCounter() {
  const [count, setCount] = useSharedState<number>("counter", 0);

  const increment = () => {
    setCount((count || 0) + 1);
  };

  const decrement = () => {
    setCount((count || 0) - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="p-6 border-2 border-orange-500 rounded-lg bg-orange-50">
      <h3 className="text-lg font-bold mb-4 text-orange-700">
        Shared Counter (Next.js App)
      </h3>
      <div className="text-4xl font-bold mb-6 text-orange-600">
        Count: {count ?? 0}
      </div>
      <div className="flex gap-4">
        <Button onClick={increment} variant="default">Increment</Button>
        <Button onClick={decrement} variant="secondary">Decrement</Button>
        <Button onClick={reset} variant="outline">Reset</Button>
      </div>
    </div>
  );
}
```

**ポイント:**
- `"use client"` ディレクティブでクライアントコンポーネントとして宣言
- Reactと同じ `useSharedState` フックを使用
- SSR中は初期値を使用し、ハイドレーション後にストアと同期

## 状態の同期フロー

1. **ユーザーがボタンをクリック** (例: Vue2アプリのIncrement)
2. **ローカルストアの更新**: `store.set('counter', newValue)`
3. **ローカル通知**: 同じインスタンス内のリスナーに通知
4. **グローバル通知**: `window.dispatchEvent(new CustomEvent('shared-state-update', ...))`
5. **他のShadowRootで受信**: 各ストアインスタンスがCustomEventをリッスン
6. **他のアプリの更新**: 受信したイベントからローカルのリスナーに通知
7. **UIの自動更新**: 各フレームワークのリアクティブシステムが変更を検知してUIを更新

```
Vue2 App (ShadowRoot #1)         React App (ShadowRoot #2)        Next.js App (メインDOM)
     │                                  │                                │
     │ [Increment ボタン]                │                                │
     ├─> store.set('counter', 1)        │                                │
     │                                  │                                │
     ├─> notifyLocal() ──> counter更新  │                                │
     │                                  │                                │
     ├─> notifyGlobal()                 │                                │
     │     └─> CustomEvent ─────────────┼───────────────> 受信            │
     │                                  │                 │               │
     │                                  ├<─ notifyLocal() │               │
     │                                  │   └─> counter更新              │
     │                                  │                 │               │
     │                                  │                 └──────────────>│
     │                                  │                                 │
     │                                  │                    counter更新  │
```

## メリット

### 1. フレームワーク非依存
各フレームワークのエコシステムに依存せず、シンプルなイベント駆動で状態を共有。

### 2. ShadowRoot対応
Web Componentsやマイクロフロントエンドで必須のShadowRoot分離にも対応。

### 3. SSR対応
Next.js App RouterなどのSSR環境でも、ハイドレーションエラーなく動作。

### 4. 型安全
TypeScriptの型システムを活用し、型安全な状態管理を実現。

### 5. 軽量
依存関係なし、わずか数百行のシンプルな実装。

## ユースケース

- **マイクロフロントエンド**: 異なるチームが異なるフレームワークで開発した機能間での状態共有
- **段階的移行**: レガシーアプリケーション(Vue2)から新しいフレームワーク(React/Next.js)への移行時の橋渡し
- **Web Componentsの統合**: ShadowRootで分離されたコンポーネント間の通信
- **共有ウィジェット**: 複数のページやアプリケーションで共有される状態を持つウィジェット

## 関連ファイル

- `packages/shared-state/src/index.ts` - コアストア実装
- `packages/shared-state/src/react.ts` - React/Next.js用フック
- `packages/shared-state/src/vue2.ts` - Vue2用API
- `packages/vue2/src/components/CounterApp.vue` - Vue2実装例
- `packages/react/src/routes/multi_counter.tsx` - React実装例
- `packages/nextjs/app/multi_counter/components/ShadcnCounter.tsx` - Next.js実装例
- `packages/nextjs/app/multi_counter/page.tsx` - 統合ページ
