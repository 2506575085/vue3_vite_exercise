<template>
  <div class="view">
    <div class="main_box" ref="mainBox">
      <div 
        v-for="(box,index) in itemsList" 
        :key="box.id" 
        >
        <div
          :style="{
            left: box.position.left / maxX * 100 + '%',
            top: box.position.top / maxY * 100 + '%',
            width: box.size.width / maxX * 100 + '%',
            height: box.size.width / maxY * 100 + '%'
          }" 
          v-if="box.id!='-1'"
          class="items"
        >
          {{ box.id }}
        </div>
      </div>
      <div 
        class="items"
        :style="{
          backgroundColor:'red',
          left: controlItems.position.left / maxX * 100 + '%',
          top: controlItems.position.top / maxY * 100 + '%',
          width: controlItems.size.width / maxX * 100 + '%',
          height: controlItems.size.width / maxY * 100 + '%'
        }" 
        :key="-1"
      ></div>
    </div>
    <div class="right">
      <div class="button_box">
        <button @click="random">随机生成</button>
        <button @click="start">开始</button>
        <button @click="stop">暂停</button>
      </div>
      <div class="title">碰撞检测数组</div>
      <span class="list" v-for="compitem in compareList">{{ compitem.map(v=>v.id) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, onBeforeUnmount, onMounted, getCurrentInstance } from 'vue'
import { randomNum, sleep} from '@/utils/index'
import UseQuadTree from '@/hooks/useQuadtree'
import UseCollisionDetection from '@/hooks/useCollisionDetection'
import { Items,ItemsList } from './types'

const instance = getCurrentInstance()
const { fullClose,intFullClose } = randomNum
const mainBox = ref<HTMLInputElement | null>(null)
let maxX = 200
let maxY = 200
let running = ref(false)

/*****   元素总数    *****/
let itemCount = ref(20)
/*****   元素尺寸    *****/
let itemSize = ref<Items['size']>({ width: 10, height: 10 })
/**
 * 元素列表
 */
let itemsList = ref<ItemsList>([])
 
/**
 * 键盘控制的元素，id为-1
 */
let controlItems = ref<Items>({
  position: {
    left: maxX/2-1,
    top: maxY/2-1
  },
  size: {...itemSize.value},
  id: '-1',
  direction:'stop'
})

/**
 * 根据键盘按键改变移动方向
 * @param e 
 */
function changeDir(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowUp':
      controlItems.value.direction = 'up'
      e.preventDefault()
      break
    case 'ArrowDown':
      controlItems.value.direction = 'down'
      e.preventDefault()
      break
    case 'ArrowLeft':
      controlItems.value.direction = 'left'
      e.preventDefault()
      break
    case 'ArrowRight':
      controlItems.value.direction = 'right'
      e.preventDefault()
      break
    case ' ':
      controlItems.value.direction = 'stop'
      e.preventDefault()
      break
    default:
      break
  }
}

document.onkeydown = changeDir

/**
 * 根据移动方向改变元素位置
 * @param item 
 */
function itemsRun(item: Items) {
  const dir = item.direction
  const speed = item.crashSize||0.05
  function ifOut() {
    if ((item.position.top < 0) ||
      (item.position.top > (maxY - item.size.height)) ||
      (item.position.left < 0) ||
      (item.position.left > (maxX - item.size.width))) {
      return true
    } else {
      return false
    }
  }
  if (dir == 'up') {
    if (ifOut()) {
      item.direction = 'down'
      item.position.top += speed
    } else {
      item.position.top -= speed
    }
  }
  if (dir == 'down') {
    if (ifOut()) {
      item.direction = 'up'
      item.position.top -= speed
    } else {
      item.position.top += speed
    }
  }
  if (dir == 'left') {
    if (ifOut()) {
      item.direction = 'right'
      item.position.left += speed
    } else {
      item.position.left -= speed
    }
  }
  if (dir == 'right') {
    if (ifOut()) {
      item.direction = 'left'
      item.position.left -= speed
    } else {
      item.position.left += speed
    }
  }
  if (dir == 'stop') {
    
  }
}

/**
 * 获取随机方向
 */
 function randomDirect() {
  let randomNum = intFullClose(1, 4)
  switch (randomNum) {
    case 1:
      return 'up'
    case 2:
      return 'down'
    case 3:
      return 'left'
    case 4:
      return 'right'
  }
}
/**
 * 随机生成元素
 */
function randomItems() {
  itemsList.value = Array.from({ length: itemCount.value }).map((v, i) => {
    return {
      size: {...itemSize.value},
      position: {
        left: fullClose(0,maxX-itemSize.value.width),
        top: fullClose(0,maxY-itemSize.value.height),
      },
      id: i.toString(),
      direction:randomDirect()!
    }
  })
  itemsList.value.push(
    controlItems.value
  )
}

/**
 * 四叉树的根结点
 * 
 * 比较列表
 * 
 * 递归生成四叉树,同时更新compareList
 * @param treeNode 四叉树节点
 * @msg 输出状态仅依赖输入的根节点,执行前需要更新传入值
 * 
 * 更新四叉树和compareList
 * @param itemsList
 */
const { quadtree, compareList, getFullQuadtree, updateTree } = UseQuadTree(maxX,maxY,itemsList.value)

/**
 * 碰撞检测
 */
const { ifCrash } = UseCollisionDetection(compareList)


let timeout = ref<NodeJS.Timeout>()

/**
 * 计时器驱动全部元素移动
 */
function run() {
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => {
    itemsList.value.forEach(item => {
      itemsRun(item)
    });
    updateTree(itemsList.value)
    ifCrash()
    if (running.value) {
      run()
    }
  },1)
}

/**
 * random按钮回调
 */
 function random() {
  randomItems()
  start()
}

/**
 * start按钮回调
 */
function start() {
  console.log(quadtree.value)
  running.value = true
  run()
}

/**
 * stop按钮回调
 */
function stop() {
  running.value = false
}

onMounted(() => {
  // random()
})

onBeforeUnmount(() => {
  running.value = false
})
</script>

<style scoped lang="less">
.view {
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
}
.main_box {
  width: 50%;
  padding-bottom: 50%;
  position: relative;
  background-image: linear-gradient( 90deg,rgba(255,0,0,0.05) 1px,rgba(72,42,10,0) 0),linear-gradient( 1turn,rgba(0,0,0,0.05) 1px,rgba(255,153,44,0) 0);
  background-size: 12.5% 12.5%;
  box-sizing: border-box;
  border-right: 1px solid #bb979746;
  .items{
    background-color: aqua;
    position: absolute;
    font-size: 1px;
  }

  .active {
    background-color: aqua;
  }
}
.right{
  width: 50%;
  .button_box {
    margin-top: 20px;
  }
  button {
    cursor: pointer;
    color: #e300f8;
    background-color: rgba(0,0,0,0.05);
    border: #e300f8 1px solid;
    border-radius: 15px;
    width: 80px;
    padding: 10px 0;
    margin:5px 20px;
  }
  .title {
    position: relative;
    top: 50px;
    font-size: 30px;
  }
  .list{
    position: relative;
    top: 100px;
    display: inline-block;
    width: 20%;
  }
}

</style>