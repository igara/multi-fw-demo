<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>
      This is a Vue 2 project created with Vite and TypeScript.
    </p>
    <button @click="count++">
      Count: {{ count }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      count: 0
    }
  }
})
</script>

<style scoped>
.hello {
  margin: 20px 0;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

button:hover {
  background-color: #35a372;
}

h2 {
  color: #42b983;
}
</style>
