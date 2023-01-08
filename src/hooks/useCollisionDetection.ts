import { Ref, ref } from 'vue'
import type { Items, CompareList } from './types'

export default function useCollisionDetection(compareList:Ref<CompareList>) {
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
                // console.log( f.id,'从右下面碰撞了'+s.id)
              }
            }
            if (f.position.left <= s.position.left) {
              if ((s.position.left - f.position.left) <= f.size.width) {
                crashed = true
                // console.log( f.id,'从左下面碰撞了'+s.id)
              }
            }
          }
        }
        if (f.position.top <= s.position.top) {
          if ((s.position.top - f.position.top)<=f.size.height) {
            if (f.position.left > s.position.left) {
              if ((f.position.left - s.position.left) <= s.size.width) {
                crashed = true
                // console.log( f.id,'从右上面碰撞了'+s.id)
              }
            }
            if (f.position.left <= s.position.left) {
              if ((s.position.left - f.position.left) <= f.size.width) {
                crashed = true
                // console.log( f.id,'从左上面碰撞了'+s.id)
              }
            }
          }
        }
        if (crashed) {
          // console.log(f.position,s.position)
          // console.log(f.direction,f.crashSize)
          changeDirection(s)
          changeDirection(f)
          // instance!.proxy!.$forceUpdate()
        } else {
          f.crashSize = 0
        }
      } else {
        compareItem[0].crashSize = 0
      }
    });
  }
  return {ifCrash}
}