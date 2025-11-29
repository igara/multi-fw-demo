import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld
  },
  {
    path: '/multi.html',
    name: 'MultiFramework',
    component: HelloWorld
  }
]

let basePath = '/multi-fw-demo/vue2/';
if (window.location.pathname.startsWith('/multi-fw-demo/nextjs')) {
  basePath = '/multi-fw-demo/nextjs/';
}
if (window.location.pathname.startsWith('/multi-fw-demo/react')) {
  basePath = '/multi-fw-demo/react/';
}

const router = new VueRouter({
  mode: 'history',
  base: basePath,
  routes
})

export default router
