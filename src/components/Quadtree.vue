<template>
  <div class="">
    <div>
      <button @click="start">start</button>
      <button @click="stop">stop</button>
    </div>
    <div class="main_box" ref="mainBox">
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, onBeforeUnmount } from 'vue'
const mainBox = ref<HTMLInputElement | null>(null)
let maxX = 300
let maxY = 300
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
  innerItems: ItemsList|[],
  children?: {
    [index: string]: Quadtree
  }
}

let itemCount = ref(20)
let itemsList = ref<ItemsList>(Array.from({ length: itemCount.value }).map((v,i )=> {
  return {
    position: {
      left: i*10,
      top: i*10,
    },
    size: {
      width: 1,
      height: 1
    },
    id:i.toString()
  }
}))

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
 * 递归生成四叉树
 * @param treeNode 四叉树节点
 */
function getFullQuadtree(treeNode: Quadtree) {
  if (treeNode.innerItems.length >= 5) {
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
        if (v.id == '13') {
          console.log('id',v.id)
          console.log('item中点', itemMid)
          console.log('左边界',childrenPosition.left)
          console.log('右边界',childrenSize.width + childrenPosition.left)
          console.log('上边界',childrenPosition.top)
          console.log('下边界',childrenSize.height + childrenPosition.top)
        }
        
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

  }
}

watchEffect(() => {
  
})
watch(itemsList, () => {
  getFullQuadtree(quadtree.value)
},{immediate:true})
const t = ref<number>(0)
function start() {
  console.log(quadtree.value)
}

function stop() {
 
}
onBeforeUnmount(() => {
  
})
</script>

<style scoped>
.main_box {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
}
.items{
  background-color: aqua;
  position: absolute;
}

.active {
  background-color: aqua;
}
</style>
