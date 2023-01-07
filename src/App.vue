<template>
  <button @click="change(Life)">life</button>
  <button @click="change(Quadtree)">Quadtree</button>
  <Component :is="component"></Component>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import Quadtree from './components/Quadtree.vue'
import Life from './components/Life.vue'

type Comp = typeof Quadtree|typeof Life

const component = shallowRef<Comp>(Life)
function change(comp:Comp) {
  component.value = comp
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: white;
}
body {
  padding: 0;
  margin: 0;
}
</style>

