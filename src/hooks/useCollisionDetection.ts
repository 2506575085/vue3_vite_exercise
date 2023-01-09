import { Ref, ref } from 'vue'
import type {moveItem, CompareList } from './types'

export default function useCollisionDetection(compareList: Ref<CompareList>, changeDirection:(item:moveItem,crashDir:moveItem['direction'])=>void) {
  /**
   * 碰撞检测
   */
  function ifCrash() {
    compareList.value.forEach(compareItem => {
      if (compareItem.length == 2) {
        const f = compareItem[0]
        const s = compareItem[1]
        let crashed = false
        // console.log(f, s)
        let l = Math.sqrt(Math.pow(Math.abs(f.midPoint.x - s.midPoint.x),2)+Math.pow(Math.abs(f.midPoint.y - s.midPoint.y),2))
        if (l <= ((f.size.width+s.size.width)/2)) {
          crashed = true
          console.log('crash')
        }
        if (crashed) {
          let sXSpeed = s.midPoint.x - f.midPoint.x
          let sYSpeed = s.midPoint.y - f.midPoint.y
          let sx = Math.pow(s.speed, 2) * (Math.pow(sYSpeed, 2) / (Math.pow(sYSpeed, 2) + Math.pow(sXSpeed, 2)))
          sx = sXSpeed>0?sx:-sx
          let sy = sx / sXSpeed * sYSpeed
          sx = sXSpeed>0?sx:-sx

          let fXSpeed = f.midPoint.x - s.midPoint.x
          let fYSpeed = f.midPoint.y - s.midPoint.y
          let fx = Math.pow(f.speed, 2) * (Math.pow(fYSpeed, 2) / (Math.pow(fYSpeed, 2) + Math.pow(fXSpeed, 2)))
          fx = fXSpeed>0?fx:-fx
          let fy = fx / fXSpeed * fYSpeed
          fy = fYSpeed>0?fy:-fy
          // console.log(f.position,s.position)
          // console.log(f.direction,f.crashSize)
          changeDirection(s,{x:sx,y:sy})
          changeDirection(f,{x:fx,y:fy})
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