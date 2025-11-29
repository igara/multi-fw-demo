<template>
  <div id="vue2-app">
    <img
      alt="Vue logo"
      src="./assets/logo.png"
      width="200"
    >
    <h1>{{ message }}</h1>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  data() {
    return {
      message: 'Vue 2 Project'
    }
  }
})
</script>

<style>
#vue2-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
