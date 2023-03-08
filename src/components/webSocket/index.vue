<template>
  <div class="view">
    <input type="text" v-model="text" @input="onInput">
    <button @click="connect" v-if="!connectFlag">connect</button>
    <button @click="disconnect" v-if="connectFlag">disconnect</button>
    <button @click="send">send</button>
  </div>
  <div class="data">{{ data }}</div>
</template>

<script setup lang="ts">
import { send } from 'process';
import { ref, watchEffect, watch, onBeforeUnmount, onMounted, getCurrentInstance } from 'vue'
let ws:WebSocket
let text = ref<string>('')
let data = ref<string>('')
const connectFlag = ref<boolean>(false)
function onInput(){
  
}
function send(){
  if(!connectFlag.value){
    alert("链接已关闭")
    return
  }
  ws.send(text.value)
}
function disconnect(){
  ws.close()
}
function connect(){
  ws = new WebSocket('ws://localhost:7181/')
  ws.onmessage = function(e){
    console.log(e)
    data.value += e.data+'\n'
  }
  ws.onopen = function(){
    data.value += '//open//\n'
    connectFlag.value = true
  }
  ws.onclose = function(){
    data.value += '//close//\n'
    connectFlag.value = false
  }
}
onMounted(()=>{
  connect()
})
</script>

<style scoped lang="less">
.view {
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
}
.data {
  white-space: pre-wrap;
}
</style>