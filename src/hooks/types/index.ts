import { Ref } from 'vue'
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
  direction: 'up' | 'down' | 'left' | 'right' | 'stop',
  crashSize?:number
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
/**
 * 比较列表
 */
type CompareList = Array<ItemsList>

/**
 * 返回值类型
 */
type UseQuadtreeReturn = {
  quadtree: Ref<Quadtree>,
  compareList: Ref<CompareList>,
  getFullQuadtree: (treeNode: Quadtree) => void,
  updateTree: (itemsList: ItemsList) => void,
}
export type { Quadtree, Items, CompareList, ItemsList, UseQuadtreeReturn }
