<template>
  <div>
    <!-- <canvas id="glcanvas" ref="canvas" width="640" height="480">
      你的浏览器似乎不支持或者禁用了 HTML5 <code>&lt;canvas&gt;</code> 元素。
    </canvas> -->
    <canvas id="canvas" ref="canvas" class="canvas">
      你的浏览器似乎不支持或者禁用了 HTML5 <code>&lt;canvas&gt;</code> 元素。
    </canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, Ref, watchEffect } from 'vue'
import { randomNum, debounce } from '@/utils/index'
const { fullClose,intFullClose } = randomNum
const CONFIG = {
  ROW_NUM: 100,
  ROW_LENGTH: 10
}
const canvas = ref<HTMLCanvasElement>()
let { vw, vh } = { vw: window.innerWidth, vh: window.innerHeight }

let ctx: CanvasRenderingContext2D

//初始化画布
function initCanvas() {
  canvas.value!.width = vw
  canvas.value!.height = vh
  return canvas.value!.getContext("2d") as CanvasRenderingContext2D
}

interface IMaze{
  h: (boolean|'out')[][]
  v: (boolean|'out')[][]
}

onMounted(() => {
  ctx = initCanvas()
  ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
  const maze = new Maze()
  maze.h[0][0] = false
  maze.h[CONFIG.ROW_NUM][CONFIG.ROW_NUM-1] = false
  maze.initMaze()
  maze.drawMaze()
})

class Maze implements IMaze{
  h: (boolean|'out')[][]
  v: (boolean|'out')[][]
  constructor(){
    const { h, v } = getFullMaze()
    this.h = h
    this.v = v
  }
  initMaze(){
    prim(this)
  }
  drawMaze(){
    drawMaze(this)
  }
}

type wallType = ['h'|'v',number,number]
type roomType = [number,number]
/**已联通网格集合 */
const linkRoomSet: Set<string> = new Set()
/**待判断墙壁集合 */
const todoWallSet: Set<string> = new Set()
/**已判断墙壁集合 */
const removedWallSet: Set<string> = new Set()
/**起点 */
const startPoint: roomType = [0,0]
/**将起点网格及其墙壁加入数据结构 */
linkRoomSet.add(startPoint.join(','))
addWallIntoTodo(startPoint)
/**
 * 获取room的wall
 * @param room 
 */
function getWallByRoom(room: roomType){
  const [ vi, hi ] = room
  const dirList: wallType[] = [
    ['h', vi, hi], //上
    ['v', hi+1, vi], //右
    ['h', vi+1, hi], //下
    ['v', hi, vi], //左
  ]
  return dirList
}
/**
 * 获取wall两侧的room
 * @param wall 
 */
function getRoomsByWall(wall: wallType):[number,number][]{
  //因传入值可能为字符串分割后产生的字符串，此处处理为number类型
  let [dir,fi,si] = wall
  fi = Number(fi)
  si = Number(si)
  if(dir=='h') {
    return [[fi-1,si],[fi,si]]
  } else {
    return [[si,fi-1],[si,fi]]
  }
}
/**
 * 将room的符合条件的wall加入todoWallSet
 * @param room 
 */
function addWallIntoTodo(room: roomType){
  getWallByRoom(room).forEach(wall=>{
    if(
      wall[1]>0 &&
      wall[1]<CONFIG.ROW_NUM &&
      !removedWallSet.has(wall.join(','))
    ){
      todoWallSet.add(wall.join(','))
    }
  })
}

/**
 * prim迷宫生成算法
 */
function prim(maze:Maze){
  while(todoWallSet.size!==0){
    const randomIndex = intFullClose(0,todoWallSet.size-1)
    const selectWall = Array.from(todoWallSet)[randomIndex]
    const rooms = getRoomsByWall(selectWall.split(',') as wallType)
    let linkNum = 0
    let unLinkIndex = 0
    rooms.forEach((room,index)=>{
      if(linkRoomSet.has(room.join(','))){
        linkNum ++
      } else {
        unLinkIndex = index
      }
    })
    if(linkNum===2){
      removedWallSet.add(selectWall)
      todoWallSet.delete(selectWall)
    } else {
      //未连接的room
      const room = rooms[unLinkIndex]
      linkRoomSet.add(room.join(','))
      addWallIntoTodo(room)
      maze[
        selectWall.split(',')[0] as 'h'|'v'
      ][
        Number(selectWall.split(',')[1])
      ][
        Number(selectWall.split(',')[2])
      ] = false
      removedWallSet.add(selectWall)
      todoWallSet.delete(selectWall)
    }
  }
}

// function initMaze(maze:IMaze){
//   const roomList: null[][] = []
//   roomList.length = CONFIG.ROW_NUM
//   const row: null[] = []
//   row.length = CONFIG.ROW_NUM
//   row.fill(null)
//   roomList.fill(row)
//   let num = 0
//   roomList.forEach((row,vi)=>{
//     row.forEach((value,hi)=>{
//       const dirList:['h'|'v',number,number][] = [
//         ['h', vi, hi], //上
//         ['v', hi+1, vi], //右
//         ['h', vi+1, hi], //下
//         ['v', hi, vi], //左
//       ]
//       const list = [
//         maze[dirList[0][0]][dirList[0][1]][dirList[0][2]],
//         maze[dirList[1][0]][dirList[1][1]][dirList[1][2]],
//         maze[dirList[2][0]][dirList[2][1]][dirList[2][2]],
//         maze[dirList[3][0]][dirList[3][1]][dirList[3][2]]
//       ]
//       let outFlag = false
//       const totalNum = list.filter(item=>{
//         if(item=='out') outFlag = true
//         return item
//       }).length
//       if(totalNum>=3) {
//         let index = intFullClose(0,3)
//         while(
//           maze[dirList[index][0]][dirList[index][1]][dirList[index][2]] === 'out'||
//           maze[dirList[index][0]][dirList[index][1]][dirList[index][2]] === false
//         ) {
//           index = (index+1) % 4
//         }
//         maze[dirList[index][0]][dirList[index][1]][dirList[index][2]] = false
//       } else {
//         num++
//       }
//       // console.log(list)
//     })
//   })
//   // console.log(maze)
//   if(num !== CONFIG.ROW_NUM*CONFIG.ROW_NUM) {
//     initMaze(maze)
//   }
// }

function getFullMaze(){
  const maze: IMaze = {
    h:[],
    v:[]
  }
  function newRow(outFlag:boolean) {
    const row: Array<boolean|'out'> = []
    const rowLength = CONFIG.ROW_NUM
    while(row.length < rowLength){
      row.push(outFlag ? 'out' : true)
    }
    return row
  }
  Array.from({length: CONFIG.ROW_NUM + 1}).forEach((v,i)=>{
    maze.v[i] = newRow((i===0)||(i===CONFIG.ROW_NUM))
    maze.h[i] = newRow((i===0)||(i===CONFIG.ROW_NUM))
  })
  return maze
}

function drawMaze(maze:IMaze){
  maze.h.forEach((row,rowIndex)=>{
    row.forEach((value,valueIndex)=>{
      if(value) drawLine(rowIndex,valueIndex,'h')
    })
  })
  maze.v.forEach((row,rowIndex)=>{
    row.forEach((value,valueIndex)=>{
      if(value) drawLine(valueIndex,rowIndex,'v')
    })
  })
}

function drawLine(rowIndex: number,valueIndex: number,dir: 'v'|'h') {
  ctx.beginPath();
  const beginPoint = {
    x: valueIndex*CONFIG.ROW_LENGTH + 10,
    y: rowIndex*CONFIG.ROW_LENGTH + 10
  }
  ctx.moveTo(beginPoint.x, beginPoint.y);
  if(dir==='h'){
    ctx.lineTo(beginPoint.x + CONFIG.ROW_LENGTH, beginPoint.y);
  } else {
    ctx.lineTo(beginPoint.x, beginPoint.y + CONFIG.ROW_LENGTH);
  }
  ctx.strokeStyle = 'orange'
  ctx.stroke()
}

</script>

<style lang="less" scoped>
.canvas{
  position: absolute;
  background-color: black;
  top: 0;
  left: 0;
}
</style>