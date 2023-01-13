import { Ref } from 'vue'

/**
 * 需要配置的item信息
 */
interface defaultItemData{
  size: {
    width: number,
    height: number
  }
}

/**
 * 根据配置信息生成的随机item信息
 */
interface moveItem extends defaultItemData {
  id: string,
  /**元素左上角点位置*/
  position: {
    left: number,
    top: number
  },
  /**中心点坐标，自动计算*/
  midPoint: {
    x: number,
    y: number
  },
  /**方向向量*/
  direction: {
    x: number,
    y: number,
  },
  /**移动速度 */
  speed:number,
  crashSize?:number
}

/**
 * item集合
 */
type ItemsList = Array<moveItem>

 /**
  * 四叉树
  */
type Quadtree = {
  index: string,
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
  getItemsNearby: (item:moveItem,quadtree:Quadtree) => void
}
export type { Quadtree, CompareList, ItemsList, UseQuadtreeReturn, defaultItemData, moveItem }
