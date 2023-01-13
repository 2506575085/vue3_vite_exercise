import { ref, Ref } from 'vue'
import { defaultItemData, moveItem } from './types'
import { randomNum} from '@/utils/index'

const { fullClose,intFullClose } = randomNum
class Item implements moveItem{
  id = '0'
  position = {
    left: 0,
    top: 0
  }
  size = {
    width: 0,
    height: 0
  }
  midPoint = {
    x: 0,
    y: 0
  }
  direction = {
    x: 0,
    y: 0,
  }
  speed = 0
  crashSize = 0
  constructor(itemData: moveItem) {
    this.id = itemData.id
    this.position = itemData.position
    this.size = itemData.size
    this.midPoint = itemData.midPoint
    this.direction = itemData.direction
    this.speed = itemData.speed
    this.crashSize = itemData.crashSize||0
  }
}

type ItemList = Array<moveItem>

/**
 * 
 * @param inputItemData 默认item信息，目前仅size
 * @param container 容器信息
 * @param itemCount 生成的item总数
 */
export default function useMoveItems(inputItemData: defaultItemData, container: { maxX: number, maxY: number }, itemCount: number) {
  const { maxX, maxY } = container
  //speed暂时固定
  const speed = 0.5
  /**
  * 元素列表
  */
  let itemsList = ref<ItemList>([])

  /**
   * 随机生成元素
   * @param itemList 
   */
  function randomItems(itemList:Ref<ItemList>) {
    itemList.value = Array.from({ length: itemCount }).map((v, i) => {
      const left = fullClose(0, maxX - inputItemData.size.width)
      const top = fullClose(0, maxY - inputItemData.size.height)
      let xDir = fullClose(-speed, speed)
      let yDirAbs = Math.sqrt(Math.pow(speed, 2) - Math.pow(xDir, 2))
      let yDir = (intFullClose(0,1)==0)?(yDirAbs):(-yDirAbs)
      const item = new Item({
        ...inputItemData,
        speed,
        id: i.toString(),
        position: {
          left,
          top
        },
        midPoint: {
          x: left+(inputItemData.size.width/2),
          y: top+(inputItemData.size.height/2)
        },
        direction: {
          x: xDir,
          y: yDir
        }
      })
      return item
    })
  }
  function changeDir(item:moveItem,toDir:moveItem['direction']) {
    item.direction = {
      x: toDir.x,
      y: toDir.y,
    }
  }
  randomItems(itemsList)
  return { itemsList, randomItems, changeDir }
}