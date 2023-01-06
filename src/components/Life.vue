<template>
  <div class="hello">
    <div>
      <button @click="running?()=>{}:start()">start</button>
      <button @click="stop">stop</button>
      <button @click="clear">clear</button>
      <div>total:{{ selectList.length }}</div>
      <!-- <div>{{ selectBox }}</div> -->
    </div>
    <div class="main_box" @click="changeSelect" ref="mainBox">
      <div 
        v-for="(box,index) in selectList" 
        :key="box.x+'-'+box.y" 
        v-memo="[box]" 
        :style="{
          left: box.x / maxX * 100 + '%',
          top: Number(box.y) / maxY * 100 + '%',
          width: 1 / maxX * 100 + '%',
          height: 1 / maxY * 100 + '%'
        }" 
        class="items">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, onBeforeUnmount } from 'vue'
import { deepClone } from '../utils'
const mainBox = ref<HTMLInputElement | null>(null)
let maxX = 200
let maxY = 200
let running = ref(false)

//选择集合key为y，Set值为x
type SetList = { [index: number]: Set<number> }
const selectBox = ref<SetList>({
  // 1: new Set([3]),
  // 2: new Set([1, 3]),
  // 3: new Set([2, 3]),
  18: new Set([87, 89]),
  19: new Set([88, 91, 93]),
  20: new Set([85, 86, 90]),
  21: new Set([85, 89, 88, 93]),
  22: new Set([87, 90, 91]),
  23: new Set([85, 90, 93]),
  24: new Set([89, 93]),
  25: new Set([85, 87, 91, 89]),
  26: new Set([92, 93]),
  27: new Set([93, 89, 86])
})
const selectBoxClone = ref<SetList>({})
interface Select{
  x: number;
  y: number
}
type SelectList = Array<Select>
//根据选择集合修改dataList
const selectList = ref<SelectList>([])
//修改单个状态,修改克隆值，需要在前后分别克隆操作
function changeOne(select: Select, to: boolean) {
  if (to) {
    if (!selectBoxClone.value[select.y]) {
      selectBoxClone.value[select.y] = new Set([])
    }
    selectBoxClone.value[select.y].add(select.x)
  } else {
    if (selectBoxClone.value[select.y]) {
      selectBoxClone.value[select.y].delete(select.x)
      if (selectBoxClone.value[select.y].size == 0) {
        delete selectBoxClone.value[select.y]
      }
    }
  }
}
function changeSelect(e:MouseEvent) {
  let x = e.x - mainBox.value!.getBoundingClientRect().x
  let y = e.y - mainBox.value!.getBoundingClientRect().y
  let xNum = Math.floor(x / mainBox.value!.offsetWidth * maxX)
  let yNum = Math.floor(y / mainBox.value!.offsetHeight * maxY)
  selectBoxClone.value = deepClone(selectBox.value)!
  changeOne({ x: xNum, y: yNum }, !(selectBox.value[yNum] && selectBox.value[yNum].has(xNum)))
  selectBox.value = deepClone(selectBoxClone.value)!
}

watchEffect(() => {
  const list:SelectList = []
  Object.keys(selectBox.value).forEach(strY => {
    let y = Number(strY)
    selectBox.value[y].forEach(x => {
      list.push({x,y})
    })
  })
  selectList.value = [...list]
})
//计时器两种方案不知道有没有区别
// async function delayFn(delay:number):Promise<any> {
//   await new Promise(function (res:Function, reject) {
//     setTimeout(() => {
//       let allBox:setList = {}
//       Object.keys(selectBox.value).forEach(y => {
//         selectBox.value[y].forEach(x => {
//           for (let j = x - 1; j <= x + 1; j++){
//             for (let k = Number(y) - 1; k <= Number(y) + 1; k++){
//               if ((j >= 0) && (k >= 0) && (j<=maxX) && (k<=maxY)) {
//                 if (!allBox[k]) {
//                   allBox[k] = new Set([])
//                 }
//                 allBox[k].add(j)
//               }
//             }
//           }
//         })
//       })
//       // console.log("ALL", allBox)
//       Object.keys(allBox).forEach(y => {
//         allBox[y].forEach(x => {
//           let count = 0
//           for (let j = x - 1; j <= x+1; j++){
//             for (let k = Number(y) - 1; k <= Number(y) + 1; k++){
//               if ((j >= 0) && (k >= 0) && (j <= maxX) && (k <= maxY) && ((j != x) || (k != Number(y)))) {
//                 if (selectBox.value[k]&&selectBox.value[k].has(j)) {
//                   count++
//                 }
//                 // if (dataList.value[k][j].selected) {
//                 //   count++
//                 // }
//               }
//             }
//           }
//           if (count == 3) {
//             changeOne({ x,y:Number(y) },true)
//           } else if((count >= 4)||(count <= 1)) {
//             changeOne({ x,y:Number(y) },false)
//           }
//         })
//       })
//       res()
//     },delay)
//   })
// }
// async function start(res?:Promise<any>) {
//   if (res) {
//     res.then(async () => {
//       res = await delayFn(10)
//     })
//   } else {
//     res = await delayFn(10)
//   }
//   start()
//   return res
// }
const t = ref<number>(0)
function start() {
  t.value = setInterval(() => {
    running.value = true
    let allBox:SetList = {}
    Object.keys(selectBox.value).forEach(strY => {
      let y = Number(strY)
      selectBox.value[y].forEach(x => {
        for (let j = x - 1; j <= x + 1; j++){
          for (let k = y - 1; k <= y + 1; k++){
            if ((j >= 0) && (k >= 0) && (j<=maxX) && (k<=maxY)) {
              if (!allBox[k]) {
                allBox[k] = new Set([])
              }
              allBox[k].add(j)
            }
          }
        }
      })
    })
    selectBoxClone.value = deepClone(selectBox.value)!
    Object.keys(allBox).forEach(strY => {
      let y = Number(strY)
      allBox[y].forEach(x => {
        let count = 0
        for (let j = x - 1; j <= x+1; j++){
          for (let k = y - 1; k <= y + 1; k++){
            if ((j >= 0) && (k >= 0) && (j <= maxX) && (k <= maxY) && ((j != x) || (k != y))) {
              if (selectBox.value[k]&&selectBox.value[k].has(j)) {
                count++
              }
            }
          }
        }
        if (count == 3) {
          changeOne({ x,y },true)
        } else if((count >= 4)||(count <= 1)) {
          changeOne({ x,y },false)
        }
      })
    })
    selectBox.value = deepClone(selectBoxClone.value)!
  },50)
}

function stop() {
  running.value = false
  clearInterval(t.value)
}
onBeforeUnmount(() => {
  clearInterval(t.value)
})
function clear() {
  running.value = false
  clearInterval(t.value)
  selectBox.value = {}
}
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

.flex {
  display: flex;
}
.item {
  flex: 1;
  /* padding-bottom: 10px; */
  display: flex;
  cursor: pointer;
}
.item::after{
  content: '';
  padding-top: 100%;
}
.active {
  background-color: aqua;
}
</style>

