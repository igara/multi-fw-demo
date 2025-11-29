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

const basePath = window.location.pathname.startsWith('/multi-fw-demo/nextjs')
  ? '/multi-fw-demo/nextjs/'
  : '/multi-fw-demo/vue2/'

const router = new VueRouter({
  mode: 'history',
  base: basePath,
  routes
})

export default router
