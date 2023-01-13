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
      <!-- <div 
        class="items"
        :style="{
          backgroundColor:'red',
          left: controlItems.position.left / maxX * 100 + '%',
          top: controlItems.position.top / maxY * 100 + '%',
          width: controlItems.size.width / maxX * 100 + '%',
          height: controlItems.size.width / maxY * 100 + '%'
        }" 
        :key="-1"
      ></div> -->
    </div>
    <div class="right">
      <div class="button_box">
        <button @click="random">随机生成</button>
        <button @click="start">开始</button>
        <button @click="stop">暂停</button>
        <!-- <button @click="test">测试</button> -->
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
import useMoveItems from '@/hooks/useMoveItems'
import { moveItem, ItemsList } from '@/hooks/types'

const instance = getCurrentInstance()
const { fullClose,intFullClose } = randomNum
const mainBox = ref<HTMLInputElement | null>(null)
let maxX = 800
let maxY = 800
let running = ref(false)

/*****   元素总数    *****/
let itemCount = ref(100)
/*****   元素尺寸    *****/
let itemSize = ref<moveItem['size']>({ width: 10, height: 10 })

/**
 * 生成itemList,随机item方法，改变元素方向方法
 */
const { itemsList, randomItems, changeDir} = useMoveItems({size:itemSize.value},{maxX,maxY},itemCount.value)

/**
 * 生成四叉树的根结点
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
const { quadtree, compareList, getFullQuadtree, updateTree, getItemsNearby } = UseQuadTree(maxX,maxY,itemsList.value)
function test() {
  getItemsNearby(itemsList.value[5],quadtree.value)
}
/**
 * 生成碰撞检测
 */
const { ifCrash } = UseCollisionDetection(compareList,changeDir)

/**
 * 根据移动方向改变元素位置
 * @param item 
 */
 function itemsRun(item: moveItem) {
  //边界检测
  if ((item.position.top < 0) || (item.position.top > (maxY - item.size.height))) {
    item.direction.x=item.direction.x
    item.direction.y=-item.direction.y
  } else if ((item.position.left < 0) || (item.position.left > (maxX - item.size.width))) {
    item.direction.x=-item.direction.x
    item.direction.y=item.direction.y
  }
  item.position.top += item.direction.y
  item.position.left += item.direction.x
  
  item.midPoint = {
    x: item.position.left+(item.size.width/2),
    y: item.position.top+(item.size.height/2)
  }
}

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
  randomItems(itemsList)
  start()
}

/**
 * start按钮回调
 */
function start() {
  running.value = true
  run()
}

/**
 * stop按钮回调
 */
function stop() {
  running.value = false
  console.log(quadtree.value)
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
    border-radius: 50%;
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