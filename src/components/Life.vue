<template>
  <div class="view">
    <div class="top flex_center">
      <div class="flex">
        <div class="button" @click="running?()=>{}:start()">开始</div>
        <div class="button" @click="stop">暂停</div>
        <div class="button" @click="clear">清空</div>
        <div class="button" @click="random">随机添加</div>
      </div>
      
      <div class="total">总数:{{ selectList.length }}</div>
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
import { deepClone, randomNum } from '@/utils'
const { intFullClose } = randomNum
const mainBox = ref<HTMLInputElement | null>(null)
let maxX = 100
let maxY = 50
let running = ref(false)

//选择集合key为y，Set值为x
type SetList = { [index: number]: Set<number> }
const selectBox = ref<SetList>({
  // 1: new Set([3]),
  // 2: new Set([1, 3]),
  // 3: new Set([2, 3]),
  // 18: new Set([57, 59]),
  // 19: new Set([58, 51, 53]),
  // 20: new Set([55, 56, 60]),
  // 21: new Set([55, 59, 58, 63]),
  // 22: new Set([57, 60, 61]),
  // 23: new Set([55, 60, 63]),
  // 24: new Set([59, 63]),
  // 25: new Set([55, 57, 61, 59]),
  // 26: new Set([52, 63]),
  // 27: new Set([53, 59, 56])
})
function random() {
  for (let i = 0; i < 500; i++){
    let randomY = intFullClose(0, maxY-1)
    if (selectBox.value[randomY]) {
      selectBox.value[randomY].add(intFullClose(0,maxX-1))
    } else {
      selectBox.value[randomY]=new Set([intFullClose(0,maxX-1)])
    }
  }
}
random()
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
const t = ref<NodeJS.Timer>()
function start() {
  t.value = setInterval(() => {
    running.value = true
    let allBox:SetList = {}
    Object.keys(selectBox.value).forEach(strY => {
      let y = Number(strY)
      selectBox.value[y].forEach(x => {
        for (let j = x - 1; j <= x + 1; j++){
          for (let k = y - 1; k <= y + 1; k++){
            if ((j >= 0) && (k >= 0) && (j<maxX) && (k<maxY)) {
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

<style scoped lang="less">
.flex_center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main_box {
  cursor: pointer;
  width: 100%;
  padding-bottom: 50%;
  position: absolute;
  background-image: linear-gradient( 90deg,rgba(255,0,0,0.05) 0.5px,rgba(72,42,10,0) 0),linear-gradient( 1turn,rgba(0,0,0,0.05) 0.5px,rgba(255,153,44,0) 0);
  background-size: 1% 2%;
  box-sizing: border-box;
  border-top: 1px solid #fff2f2;
  background-color: antiquewhite;
}
.items{
  background-color:cornflowerblue;
  border-radius: 10%;
  position: absolute;
}
.view {
  position: relative;
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
.top {
  position: absolute;
  top: 10px;
  width: 100%;
  z-index: 99;
  .total {
    font-size: 30px;
    color: #666;
  }
  .button {
    cursor: pointer;
    color: #e300f8;
    background-color: rgba(0,0,0,0.05);
    border: #e300f8 1px solid;
    border-radius: 15px;
    width: 80px;
    padding: 10px 0;
    margin:5px 20px;
  }
  .button:hover{
    background-color: rgba(251, 144, 255,0.5);
  }
}

</style>

