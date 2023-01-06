<template>
  <div class="">
    <div>
      <button @click="random">random</button>
      <button @click="stop">stop</button>
    </div>
    <div class="main_box" ref="mainBox">
      <div 
        v-for="(box,index) in itemsList" 
        :key="box.position.left+'-'+box.position.top" 
        v-memo="[box]" 
        :style="{
          left: box.position.left / maxX * 100 + '%',
          top: box.position.top / maxY * 100 + '%',
          width: box.size.width / maxX * 100 + '%',
          height: box.size.width / maxY * 100 + '%'
        }" 
        class="items">
        {{ box.id }}
      </div>
      
    </div>
    <div class="right">
      <p v-for="compitem in compareList">{{ compitem.map(v=>v.id) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, onBeforeUnmount, onMounted } from 'vue'
const mainBox = ref<HTMLInputElement | null>(null)
let maxX = 200
let maxY = 200
let running = ref(false)
/**item的类型 */
type Items = {
  position: {
    left: number,
    top: number
  },
  size: {
    width: number,
    height: number
  }
  id?:string
}
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

let itemCount = ref(100)
/**
 * 元素列表
 */
let itemsList = ref<ItemsList>([])
function randomItems() {
  itemsList.value = Array.from({ length: itemCount.value }).map((v,i )=> {
    return {
      position: {
        left: Math.random()*maxX,
        top: Math.random()*maxY,
      },
      size: {
        width: 1,
        height: 1
      },
      id:i.toString()
    }
  })
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
 * 递归生成四叉树
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
    /** 获取子节点的items*/
    function getInnerItems(childrenPosition:{left:number,top:number}) {
      let innerItemsArr: Array<Items> = []
      //返回在范围内的item  
      treeNode.innerItems.forEach((v,i) => {
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
        if (
          (itemMid.x >= (childrenPosition.left)) &&
          (itemMid.x < (childrenSize.width + childrenPosition.left)) &&
          (itemMid.y >= (childrenPosition.top)) &&
          (itemMid.y < (childrenSize.height + childrenPosition.top))
        ) {
          innerItemsArr.push({...v})
        }
      })
      return innerItemsArr
    }
    
    let childrenI: Quadtree = {
      size: childrenSize,
      position: {
        left: midPoint.x,
        top: treeNode.position.top
      },
      innerItems:getInnerItems({left:midPoint.x,top:treeNode.position.top})
    }
    let childrenII: Quadtree = {
      size: childrenSize,
      position: {
        left: midPoint.x,
        top: midPoint.y
      },
      innerItems: getInnerItems({left:midPoint.x,top:midPoint.y})
    }
    let childrenIII: Quadtree = {
      size: childrenSize,
      position: {
        left: treeNode.position.left,
        top: midPoint.y
      },
      innerItems: getInnerItems({left:treeNode.position.left,top:midPoint.y})
    }
    let childrenIV: Quadtree = {
      size: childrenSize,
      position: {
        left: treeNode.position.left,
        top: treeNode.position.top
      },
      innerItems: getInnerItems({left:treeNode.position.left,top:treeNode.position.top})
    }
    let childrenList: Quadtree[`children`] = {
      I: childrenI,
      II: childrenII,
      III: childrenIII,
      IV: childrenIV
    }
    treeNode.children={...childrenList}
    // console.log("treeNode",treeNode)
    if (treeNode.children && treeNode.children.I) {
      // console.log(1)
      getFullQuadtree(childrenI)
    }
    if (treeNode.children && treeNode.children.II) {
      // console.log(2)
      getFullQuadtree(childrenII)
    }
    if (treeNode.children && treeNode.children.III) {
      // console.log(3)
      getFullQuadtree(childrenIII)
    }
    if (treeNode.children && treeNode.children.IV) {
      // console.log(4)
      getFullQuadtree(childrenIV)
    }
  } else {
    if (treeNode.innerItems.length != 0) {
      //注意此处为push,递归会多次执行，因此执行函数前需要清空compareList
      compareList.value.push(treeNode.innerItems)
    }
  }
}

watchEffect(() => {
  
})
watch(itemsList, () => {
  quadtree.value.innerItems = itemsList.value
  //清空compareList
  compareList.value = []
  getFullQuadtree(quadtree.value)
},{immediate:true})
const t = ref<number>(0)
function random() {
  randomItems()
  console.log(quadtree.value)
  console.log(compareList.value)
}

function stop() {
 
}
onMounted(() => {
  randomItems()
})
onBeforeUnmount(() => {
  
})
</script>

<style scoped>
.main_box {
  width: 50%;
  padding-bottom: 50%;
  position: relative;
  background-image: linear-gradient( 90deg,rgba(255,0,0,0.05) 1px,rgba(72,42,10,0) 0),linear-gradient( 1turn,rgba(0,0,0,0.05) 1px,rgba(255,153,44,0) 0);
    background-size: 12.5% 12.5%;
    box-sizing: border-box;
    border-top: 1px solid #fff2f2;
}
.right{
  width: 50%;
  position: absolute;
  top: 50px;
  right: 0;
}
.items{
  background-color: aqua;
  position: absolute;
}

.active {
  background-color: aqua;
}
</style>
