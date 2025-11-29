<template>
  <div class="counter-container">
    <h2>Shared Counter (Vue2 App)</h2>
    <div class="counter-value">Count: {{ counter }}</div>
    <div class="counter-buttons">
      <button @click="incrementCounter" class="btn btn-primary">Increment</button>
      <button @click="decrementCounter" class="btn btn-secondary">Decrement</button>
      <button @click="resetCounter" class="btn btn-outline">Reset</button>
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

<style scoped>
.counter-container {
  padding: 1.5rem;
  border: 2px solid #42b983;
  border-radius: 8px;
  background-color: #f0fdf4;
  text-align: center;
}

.counter-container h2 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: bold;
  color: #166534;
}

.counter-value {
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #15803d;
}

.counter-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover {
  background-color: #359268;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-outline {
  background-color: white;
  color: #42b983;
  border: 1px solid #42b983;
}

.btn-outline:hover {
  background-color: #f0fdf4;
}
</style>
