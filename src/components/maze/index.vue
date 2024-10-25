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
const canvas = ref<HTMLCanvasElement>()

interface IMaze{
  h: (boolean|'out')[][]
  v: (boolean|'out')[][]
}
type wallType = ['h'|'v',number,number]
type roomType = [number,number]

class MazeCanvas{
  private canvasRef: Ref<HTMLCanvasElement>
  private ctx: CanvasRenderingContext2D
  private vw = window.innerWidth
  private vh = window.innerHeight
  constructor(canvasRef:Ref<HTMLCanvasElement>){
    this.canvasRef = canvasRef
    this.ctx = this.initCtx(canvasRef)
  }
  /**
   * 获取canvas的ctx
   * @param canvasRef
   * @effect_get
   */
  private initCtx(canvasRef:Ref<HTMLCanvasElement>) {
    canvasRef.value!.width = this.vw
    canvasRef.value!.height = this.vh
    return canvasRef.value!.getContext("2d") as CanvasRenderingContext2D
  }
  /**
   * 清空画布
   * @effect_set
   */
  public initCanvas(){
    this.ctx.clearRect(0, 0, this.canvasRef.value!.width, this.canvasRef.value!.height)
  }
  public getCtx(){
    return this.ctx
  }
}

class NewMaze{
  /**迷宫对象 */
  private maze: IMaze
  /**canvas对象 */
  private mazeCanvas: MazeCanvas
  /**已联通网格集合 */
  private linkRoomSet: Set<string> = new Set()
  /**待判断墙壁集合 */
  private todoWallSet: Set<string> = new Set()
  /**已判断墙壁集合 */
  private removedWallSet: Set<string> = new Set()
  /**起点 */
  private startPoint: roomType = [0,0]
  /**配置 */
  private CONFIG = {
    ROW_NUM: 500,
    ROW_LENGTH: 2
  }
  constructor(canvasRef:Ref<HTMLCanvasElement>){
    const CONFIG = this.CONFIG
    this.mazeCanvas = new MazeCanvas(canvasRef)
    this.mazeCanvas.initCanvas()
    this.maze = this.getFullMaze()
    this.maze.h[0][0] = false
    this.maze.h[CONFIG.ROW_NUM][CONFIG.ROW_NUM-1] = false
    this.linkRoomSet.add(this.startPoint.join(','))
    this.addWallIntoTodo(this.startPoint)
  }
  /**
   * 获取全封闭迷宫
   * @effect_get
   */
  private getFullMaze(){
    const CONFIG = this.CONFIG
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
  /**
   * prim算法初始化
   * @effect_get
   * @effect_set
   */
  public initMaze(){
    const maze = this.maze
    while(this.todoWallSet.size!==0){
      const randomIndex = intFullClose(0,this.todoWallSet.size-1)
      const selectWall = Array.from(this.todoWallSet)[randomIndex]
      const rooms = this.getRoomsByWall(selectWall.split(',') as wallType)
      let linkNum = 0
      let unLinkIndex = 0
      rooms.forEach((room,index)=>{
        if(this.linkRoomSet.has(room.join(','))){
          linkNum ++
        } else {
          unLinkIndex = index
        }
      })
      if(linkNum===2){
        this.removedWallSet.add(selectWall)
        this.todoWallSet.delete(selectWall)
      } else {
        //未连接的room
        const room = rooms[unLinkIndex]
        this.linkRoomSet.add(room.join(','))
        this.addWallIntoTodo(room)
        maze[
          selectWall.split(',')[0] as 'h'|'v'
        ][
          Number(selectWall.split(',')[1])
        ][
          Number(selectWall.split(',')[2])
        ] = false
        this.removedWallSet.add(selectWall)
        this.todoWallSet.delete(selectWall)
      }
    }
  }
  /**
   * 将room的符合条件的wall加入todoWallSet
   * @param room 
   * @effect_set
   */
  private addWallIntoTodo(room: roomType){
    const CONFIG = this.CONFIG
    this.getWallByRoom(room).forEach(wall=>{
      if(
        wall[1]>0 &&
        wall[1]<CONFIG.ROW_NUM &&
        !this.removedWallSet.has(wall.join(','))
      ){
        this.todoWallSet.add(wall.join(','))
      }
    })
  }
  /**
   * 获取room的wall
   * @param room 
   */
  private getWallByRoom(room: roomType){
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
  private getRoomsByWall(wall: wallType):[number,number][]{
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
   * 绘制
   * @effect_get
   * @effect_set
   */
  public drawMaze(){
    this.maze.h.forEach((row,rowIndex)=>{
      row.forEach((value,valueIndex)=>{
        if(value) this.drawLine(rowIndex,valueIndex,'h')
      })
    })
    this.maze.v.forEach((row,rowIndex)=>{
      row.forEach((value,valueIndex)=>{
        if(value) this.drawLine(valueIndex,rowIndex,'v')
      })
    })
  }

  /**
   * 绘制线条
   * @param rowIndex 
   * @param valueIndex 
   * @param dir 
   * @effect_get
   * @effect_set
   */
  private drawLine(rowIndex: number,valueIndex: number,dir: 'v'|'h') {
    const CONFIG = this.CONFIG
    const ctx = this.mazeCanvas.getCtx()
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
}

onMounted(async ()=>{
  setTimeout(() => {
    const ts0 = Date.now()
    const maze = new NewMaze(canvas as Ref<HTMLCanvasElement>)
    maze.initMaze()
    console.log('耗时：',Date.now()-ts0)
    maze.drawMaze()
  }, 0)
  
})



</script>

<style lang="less" scoped>
.canvas{
  position: absolute;
  background-color: black;
  top: 0;
  left: 0;
}
</style>