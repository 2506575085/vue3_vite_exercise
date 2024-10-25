<template>
  <div class="view">
    <div class="top flex_center">
      <div class="flex">
        <div class="button" @click="running?()=>{}:start()">开始</div>
        <div class="button" @click="stop">暂停</div>
        <div class="button" @click="clear">清空</div>
        <div class="button" @click="random">随机添加</div>
      </div>
      
      <div class="total">总数:{{ selectList.length }}</div>
      <!-- <div>{{ selectBox }}</div> -->
    </div>
    <div class="main_box" @click="changeSelect" ref="mainBox">
      <div 
        v-for="(box,index) in selectList" 
        :key="box.x+'-'+box.y" 
        v-memo="[box]" 
        :style="{
          left: box.x / maxX * 100 + '%',
          top: Number(box.y) / maxY * 100 + '%',
          width: 1 / maxX * 100 + '%',
          height: 1 / maxY * 100 + '%'
        }" 
        class="items">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, onBeforeUnmount, onMounted } from 'vue'
import { deepClone, randomNum } from '@/utils'
import { SetList,Select,SelectList } from './types'
const { intFullClose } = randomNum
const mainBox = ref<HTMLInputElement | null>(null)
let maxX = 100
let maxY = 50
onMounted(() => {
  //控制显示网格
  mainBox.value!.style.backgroundSize = `${100/maxX}% ${100/maxY}%`
})

let running = ref(false)

const selectBox = ref<SetList>({})
function random() {
  for (let i = 0; i < 500; i++){
    let randomY = intFullClose(0, maxY-1)
    if (selectBox.value[randomY]) {
      selectBox.value[randomY].add(intFullClose(0,maxX-1))
    } else {
      selectBox.value[randomY]=new Set([intFullClose(0,maxX-1)])
    }
  }
}
random()
const selectBoxClone = ref<SetList>({})

//根据选择集合修改dataList
const selectList = ref<SelectList>([])
//修改单个状态,修改克隆值，需要在前后分别克隆操作
function changeOne(select: Select, to: boolean) {
  if (to) {
    if (!selectBoxClone.value[select.y]) {
      selectBoxClone.value[select.y] = new Set([])
    }
    selectBoxClone.value[select.y].add(select.x)
  } else {
    if (selectBoxClone.value[select.y]) {
      selectBoxClone.value[select.y].delete(select.x)
      if (selectBoxClone.value[select.y].size == 0) {
        delete selectBoxClone.value[select.y]
      }
    }
  }
}
function changeSelect(e:MouseEvent) {
  let x = e.x - mainBox.value!.getBoundingClientRect().x
  let y = e.y - mainBox.value!.getBoundingClientRect().y
  let xNum = Math.floor(x / mainBox.value!.offsetWidth * maxX)
  let yNum = Math.floor(y / mainBox.value!.offsetHeight * maxY)
  selectBoxClone.value = deepClone(selectBox.value)!
  changeOne({ x: xNum, y: yNum }, !(selectBox.value[yNum] && selectBox.value[yNum].has(xNum)))
  selectBox.value = deepClone(selectBoxClone.value)!
}

watchEffect(() => {
  const list:SelectList = []
  Object.keys(selectBox.value).forEach(strY => {
    let y = Number(strY)
    // let y = strY
    selectBox.value[y].forEach(x => {
      list.push({x,y})
    })
  })
  selectList.value = [...list]
})

function updateStatus() {
  let allBox:SetList = {}
  Object.keys(selectBox.value).forEach(strY => {
    let y = Number(strY)
    // let y = strY
    selectBox.value[y].forEach(x => {
      for (let j = x - 1; j <= x + 1; j++){
        for (let k = y - 1; k <= y + 1; k++){
          if ((j >= 0) && (k >= 0) && (j<maxX) && (k<maxY)) {
            if (!allBox[k]) {
              allBox[k] = new Set([])
            }
            allBox[k].add(j)
          }
        }
      }
    })
  })
  selectBoxClone.value = deepClone(selectBox.value)!
  Object.keys(allBox).forEach(strY => {
    let y = Number(strY)
    // let y = strY
    allBox[y].forEach(x => {
      let count = 0
      for (let j = x - 1; j <= x+1; j++){
        for (let k = y - 1; k <= y + 1; k++){
          if ((j >= 0) && (k >= 0) && (j <= maxX) && (k <= maxY) && ((j != x) || (k != y))) {
            if (selectBox.value[k]&&selectBox.value[k].has(j)) {
              count++
            }
          }
        }
      }
      if (count == 3) {
        changeOne({ x,y },true)
      } else if((count >= 4)||(count <= 1)) {
        changeOne({ x,y },false)
      }
    })
  })
  selectBox.value = deepClone(selectBoxClone.value)!
}

const timeout = ref<NodeJS.Timeout>()

function run() {
  timeout.value = setTimeout(() => {
    updateStatus()
    clearTimeout(timeout.value)
    if (running.value) {
      start()
    }
  },50)
}
function start() {
  running.value = true
  run()
}
function stop() {
  running.value = false
}
onBeforeUnmount(() => {
  running.value = false
})
function clear() {
  running.value = false
  selectBox.value = {}
}
</script>

<style scoped lang="less">
.flex_center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main_box {
  cursor: pointer;
  width: 100%;
  padding-bottom: 50%;
  position: absolute;
  background-image: linear-gradient( 90deg,rgba(255,0,0,0.05) 0.5px,rgba(72,42,10,0) 0),linear-gradient( 1turn,rgba(0,0,0,0.05) 0.5px,rgba(255,153,44,0) 0);
  background-size: 0.5% 1%;
  box-sizing: border-box;
  border-top: 1px solid #fff2f2;
  background-color: antiquewhite;
}
.items{
  background-color:cornflowerblue;
  border-radius: 10%;
  position: absolute;
}
.view {
  position: relative;
}
.flex {
  display: flex;
}
.item {
  flex: 1;
  /* padding-bottom: 10px; */
  display: flex;
  cursor: pointer;
}
.item::after{
  content: '';
  padding-top: 100%;
}
.active {
  background-color: aqua;
}
.top {
  position: absolute;
  top: 10px;
  width: 100%;
  z-index: 99;
  .total {
    font-size: 30px;
    color: #666;
  }
  .button {
    cursor: pointer;
    color: #e300f8;
    background-color: rgba(0,0,0,0.05);
    border: #e300f8 1px solid;
    border-radius: 15px;
    width: 80px;
    padding: 10px 0;
    margin:5px 20px;
  }
  .button:hover{
    background-color: rgba(251, 144, 255,0.5);
  }
}

</style>