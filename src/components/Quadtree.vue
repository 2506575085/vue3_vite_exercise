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
import { randomNum } from '@/utils/index'

const instance = getCurrentInstance()
const { fullClose,intFullClose } = randomNum
const mainBox = ref<HTMLInputElement | null>(null)
let maxX = 200
let maxY = 200
let running = ref(false)
/**item的类型 */
interface Items {
  position: {
    left: number,
    top: number
  },
  size: {
    width: number,
    height: number
  },
  id?: string,
  direction:'up'|'down'|'left'|'right'|'stop'
}

/**
 * 控制item
 */
interface ControlItems extends Items{
  
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
 * 控制元素
 */
let controlItems = ref<ControlItems>({
  position: {
    left: maxX/2-1,
    top: maxY/2-1
  },
  size: {
    width: 2,
    height: 2
  },
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

const goTimer = ref<NodeJS.Timer>()

document.onkeydown = changeDir

/**
 * 根据移动方向改变元素位置
 * @param item 
 */
 function itemsRun(item: Items) {
  const dir = item.direction
  const speed = 0.1
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
 * 驱动控制元素
 * @param dir 
 */
function go(dir: ControlItems['direction']) {
  clearInterval(goTimer.value)
  goTimer.value = setInterval(() => {
    itemsRun(controlItems.value)
    if (dir == 'stop') {
      clearInterval(goTimer.value)
    }
  },0)
}

//方向改变时触发移动
watchEffect(() => {
  go(controlItems.value.direction)
})

/**
 * item集合
 */
type ItemsList = Array<Items>

/**
 * 四叉树
 */
type Quadtree = {
  size: {
    width: number,
    height: number
  },
  position: {
    left: number,
    top: number
  },
  innerItems: ItemsList,
  children?: {
    [index: string]: Quadtree
  }
}

/**
 * 元素总数
 */
let itemCount = ref(100)
/**
 * 元素列表
 */
let itemsList = ref<ItemsList>([])
function randomItems() {
  itemsList.value = Array.from({ length: itemCount.value }).map((v, i) => {
    const width = 2
    const height = 2
    return {
      size: {
        width,
        height
      },
      position: {
        left: fullClose(width/2,maxX-width/2),
        top: fullClose(height/2,maxX-height/2),
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
 */
let quadtree = ref<Quadtree>({
  size: {
    width: maxX,
    height:maxY
  },
  position: {
    left: 0,
    top:0
  },
  innerItems: itemsList.value
})

/**
 * 比较列表
 */
type CompareList = Array<ItemsList>
const compareList = ref<CompareList>([])

/**
 * 递归生成四叉树,同时更新compareList
 * @param treeNode 四叉树节点
 * @msg 输出状态仅依赖输入的根节点,执行前需要更新传入值
 */
function getFullQuadtree(treeNode: Quadtree) {
  if (treeNode.innerItems.length > 2) {
    /** 子节点的尺寸*/
    let childrenSize = {
      width: treeNode.size.width / 2,
      height: treeNode.size.height / 2,
    }
    /** 父节点的中点*/
    let midPoint = {
      x: (treeNode.size.width + treeNode.position.left*2) / 2,
      y: (treeNode.size.height + treeNode.position.top*2) / 2
    }

    /**
     * 将一部分元素放入上个子节点后本层级剩余的元素列表，不遍历所有节点四次以提升效率
     */
     let lastInnerItemsList: ItemsList = treeNode.innerItems

    /**
     * 获取应该放入子节点的元素列表
     * @param childrenPosition 子节点位置
     */
    function getInnerItems(childrenPosition: { left: number, top: number }) {
      /**
       * 子节点元素内
       * */
      const innerItemsArr: ItemsList = []
      /**
       * 剩余元素列表
       */
      const lastInnerItems:ItemsList = []
      //返回在范围内的item  
      lastInnerItemsList.forEach((v,i) => {
        /**每个item的中点 */
        let itemMid = {
          x: (v.size.width + v.position.left * 2) / 2,
          y: (v.size.height + v.position.top * 2) / 2
        }
        // if (v.id == '13') {
        //   console.log('id',v.id)
        //   console.log('item中点', itemMid)
        //   console.log('左边界',childrenPosition.left)
        //   console.log('右边界',childrenSize.width + childrenPosition.left)
        //   console.log('上边界',childrenPosition.top)
        //   console.log('下边界',childrenSize.height + childrenPosition.top)
        // }
        if ((itemMid.x >= (childrenPosition.left)) &&
        (itemMid.x < (childrenSize.width + childrenPosition.left)) &&
        (itemMid.y >= (childrenPosition.top)) &&
        (itemMid.y < (childrenSize.height + childrenPosition.top))) {
          innerItemsArr.push(v)
        } else {
          lastInnerItems.push(v)
        }
      })
      //更新剩余元素列表
      lastInnerItemsList = lastInnerItems
      // treeNode.innerItems = lastInnerItems //暴力删除，会导致大节点元素列表为空
      return innerItemsArr
    }

    /**
     * 根据position获取子节点
     * @param position 
     */
    function getChildrenNode(position: { left: number, top: number }): Quadtree {
      return {
        size: childrenSize,
        position,
        innerItems:getInnerItems(position)
      }
    }

    const childrenI: Quadtree = getChildrenNode({
      left: midPoint.x,
      top: treeNode.position.top
    })
    const childrenII: Quadtree = getChildrenNode({
      left: midPoint.x,
      top: midPoint.y
    })
    const childrenIII: Quadtree = getChildrenNode({
      left: treeNode.position.left,
      top: midPoint.y
    })
    const childrenIV: Quadtree = getChildrenNode({
      left: treeNode.position.left,
      top: treeNode.position.top
    })

    const childrenList: Quadtree[`children`] = {
      I: childrenI,
      II: childrenII,
      III: childrenIII,
      IV: childrenIV
    }
    treeNode.children=childrenList
    if (treeNode.children && treeNode.children.I) {
      getFullQuadtree(childrenI)
    }
    if (treeNode.children && treeNode.children.II) {
      getFullQuadtree(childrenII)
    }
    if (treeNode.children && treeNode.children.III) {
      getFullQuadtree(childrenIII)
    }
    if (treeNode.children && treeNode.children.IV) {
      getFullQuadtree(childrenIV)
    }
  } else {
    if (treeNode.innerItems.length != 0) {
      //注意此处为push,递归会多次执行，因此执行函数前需要清空compareList
      compareList.value.push(treeNode.innerItems)
    }
  }
}

/**
 * 更新四叉树和compareList
 * @param itemsList
 */
function updateTree(itemsList: ItemsList) {
  //更新根节点
  quadtree.value.innerItems = itemsList
  //清空compareList
  compareList.value = []
  getFullQuadtree(quadtree.value)
}

/**
 * 碰撞检测
 */
function ifCrash() {
  /**
   * 使item反向
   * @param item 
   */
  function changeDirection(item: Items) {
    if (item.direction=='down') {
      item.direction = 'up'
    } else if (item.direction == 'up') {
      item.direction = 'down'
    } else if (item.direction == 'left') {
      item.direction = 'right'
    } else if (item.direction == 'right') {
      item.direction = 'left'
    } else if (item.direction == 'stop') {
      item.direction = 'down'
    }
  }
  compareList.value.forEach(compareItem => {
    if (compareItem.length == 2) {
      const f = compareItem[0]
      const s = compareItem[1]
      let crashed = false
      // console.log(f, s)
      if (f.position.top > s.position.top) {
        if ((f.position.top - s.position.top) <= s.size.height) {
          if (f.position.left > s.position.left) {
            if ((f.position.left - s.position.left) <= s.size.width) {
              crashed = true
              console.log( f.id,'从右下面碰撞了'+s.id)
            }
          }
          if (f.position.left <= s.position.left) {
            if ((s.position.left - f.position.left) <= f.size.width) {
              crashed = true
              console.log( f.id,'从左下面碰撞了'+s.id)
            }
          }
        }
      }
      if (f.position.top <= s.position.top) {
        if ((s.position.top - f.position.top)<=f.size.height) {
          if (f.position.left > s.position.left) {
            if ((f.position.left - s.position.left) <= s.size.width) {
              crashed = true
              console.log( f.id,'从右上面碰撞了'+s.id)
            }
          }
          if (f.position.left <= s.position.left) {
            if ((s.position.left - f.position.left) <= f.size.width) {
              crashed = true
              console.log( f.id,'从左上面碰撞了'+s.id)
            }
          }
        }
      }
      if (crashed) {
        changeDirection(s)
        changeDirection(f)
        // instance!.proxy!.$forceUpdate()
      }
    }
  });
}

//根据元素列表更新四叉树并判断碰撞改变元素方向
watchEffect(() => {
  updateTree(itemsList.value)
  ifCrash()
})

/**
 * 所有item的移动计时器
 */
const allBoxTimer = ref<NodeJS.Timer>()

/**
 * random按钮回调
 */
function random() {
  randomItems()
  // console.log(quadtree.value)
  // console.log(compareList.value)
  start()
}

/**
 * start按钮回调
 */
function start() {
  allBoxTimer.value = setInterval(() => {
    itemsList.value.forEach(item => {
      itemsRun(item)
    });
  },0)
}

/**
 * stop按钮回调
 */
function stop() {
  clearInterval(allBoxTimer.value)
}

onMounted(() => {
  random()
})

onBeforeUnmount(() => {
  clearInterval(allBoxTimer.value)
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
