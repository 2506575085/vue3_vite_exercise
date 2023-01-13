import { Ref, ref } from 'vue'
import type {ItemsList,moveItem,UseQuadtreeReturn,Quadtree,CompareList} from './types'

/**
 * 生成四叉树
 * @param maxX x轴最大值 
 * @param maxY y轴最大值
 * @param IitemsList 内容元素列表
 * @param itemSize 内容元素尺寸
 * @returns quadtree:四叉树, compareList:检测列表 , getFullQuadtree: 获取完整四叉树方法, updateTree:更新四叉树方法
 */
export default  function useQuadtree(maxX: number, maxY: number, IitemsList: ItemsList, itemSize?:moveItem['size']):UseQuadtreeReturn {
  /**
   * 四叉树的根结点
   */
  let quadtree = ref<Quadtree>({
    index:'',
    size: {
      width: maxX,
      height:maxY
    },
    position: {
      left: 0,
      top:0
    },
    innerItems: IitemsList
  })
  /**
   * 比较列表
   */
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
      function getChildrenNode(position: { left: number, top: number },index:string): Quadtree {
        return {
          size: childrenSize,
          position,
          innerItems: getInnerItems(position),
          index
        }
      }

      const childrenI: Quadtree = getChildrenNode({
        left: midPoint.x,
        top: treeNode.position.top
      },treeNode.index+'1')
      const childrenII: Quadtree = getChildrenNode({
        left: midPoint.x,
        top: midPoint.y
      },treeNode.index+'2')
      const childrenIII: Quadtree = getChildrenNode({
        left: treeNode.position.left,
        top: midPoint.y
      },treeNode.index+'3')
      const childrenIV: Quadtree = getChildrenNode({
        left: treeNode.position.left,
        top: treeNode.position.top
      },treeNode.index+'4')

      const childrenList: Quadtree[`children`] = {
        '1': childrenI,
        '2': childrenII,
        '3': childrenIII,
        '4': childrenIV
      }
      treeNode.children=childrenList
      if (treeNode.children && treeNode.children['1']) {
        getFullQuadtree(childrenI)
      }
      if (treeNode.children && treeNode.children['2']) {
        getFullQuadtree(childrenII)
      }
      if (treeNode.children && treeNode.children['3']) {
        getFullQuadtree(childrenIII)
      }
      if (treeNode.children && treeNode.children['4']) {
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
  updateTree(IitemsList)

  function getItemsNearby(item: moveItem, quadtree: Quadtree) {
    let findFlag = false
    function find(treeNode: Quadtree) {
      if (findFlag) {
        return
      }
      const left = treeNode.position.left
      const right = treeNode.position.left + treeNode.size.width
      const top = treeNode.position.top
      const bottom = treeNode.position.top + treeNode.size.height
      const { x, y } = item.midPoint
      const index = treeNode.index
      // console.log(index)
      if ((x > left) && (x < right) && (y > top) && (y < bottom)) {
        if (treeNode.children) {
          find(treeNode.children['1'])
          find(treeNode.children['2'])
          find(treeNode.children['3'])
          find(treeNode.children['4'])
        } else {
          console.log('5在', treeNode.index)
          findFlag = true
          return 
        }
      } else {
        if ((Number(index[index.length - 1]) < 4)&&treeNode.children) {
          find(treeNode.children[(Number(index[index.length - 1])+1).toString()])
        } else {
        }
      }
    }
    find(quadtree)
  }

  return { quadtree, compareList , getFullQuadtree, updateTree, getItemsNearby}
}
