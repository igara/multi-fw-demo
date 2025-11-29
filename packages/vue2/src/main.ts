import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// ShadowRoot内でマウントできるようにグローバル関数を作成
declare global {
  interface Window {
    mountVue2App: (container: HTMLElement) => void
  }
}

window.mountVue2App = (container: HTMLElement) => {
  new Vue({
    router,
    render: (h) => h(App),
  }).$mount(container)
}

// 通常のマウント（開発時やスタンドアロン実行時）
const appElement = document.getElementById('vue2-app')
if (appElement) {
  new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#vue2-app')
}
