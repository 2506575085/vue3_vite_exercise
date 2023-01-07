<template>
  <div class="topbar">
    <RouterLink class="item" :to="'/Life'" active-class="active">生命游戏</RouterLink>
    <RouterLink class="item" :to="'/Quadtree'" active-class="active">四叉树碰撞检测</RouterLink>
  </div>
  <RouterView/>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'


</script>

<style scoped lang="less">
.topbar {
  width: 100%;
  height: 60px;
  display: flex;
  .item {
    cursor: pointer;
    text-decoration:none;
    font-size: 30px;
    line-height: 60px;
    border: 0.5px rgb(63, 114, 138) solid;
    background-color:rgba(128, 201, 235, 0.913);
    flex: 1;
    align-items: center;
  }
  .active {
    background-color: rgb(128, 201, 235);
    color: #000;
  }
}
</style>

<style>
.router-link-active {    
  text-decoration: none;
  color: #ffd04b;
}
a {
  text-decoration: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: antiquewhite;
}
body {
  padding: 0;
  margin: 0;
}
</style>