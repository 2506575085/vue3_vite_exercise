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
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import request from '@/utils/request'
import { onUnmounted } from 'vue';
const canvas = ref<HTMLCanvasElement>()

interface IMaze{
  h: (boolean|'out')[][]
  v: (boolean|'out')[][]
}
type configType = { ROW_NUM: number,ROW_LENGTH: number }
type WallData = {
  x: number,
  y: number,
  direction: 'v' | 'h'
}

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
  private maze: IMaze | null = null
  /**canvas对象 */
  private mazeCanvas: MazeCanvas
  /**配置 */
  private CONFIG = {
    ROW_NUM: 500,
    ROW_LENGTH: 10
  }
  constructor(canvasRef:Ref<HTMLCanvasElement>, config: configType){
    this.CONFIG = config
    this.mazeCanvas = new MazeCanvas(canvasRef)
    this.mazeCanvas.initCanvas()
  }

  public setMaze(maze: IMaze) {
    this.maze = maze
  }

  /**
   * 绘制
   * @effect_get
   * @effect_set
   */
  public drawMaze(){
    this.mazeCanvas.initCanvas()
    console.log(this.maze)
    this.maze!.h.forEach((row,rowIndex)=>{
      row.forEach((value,valueIndex)=>{
        if(value) this.drawLine(rowIndex,valueIndex,'h')
      })
    })
    this.maze!.v.forEach((row,rowIndex)=>{
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
    ctx.beginPath()
    const beginPoint = {
      x: valueIndex*CONFIG.ROW_LENGTH + 10,
      y: rowIndex*CONFIG.ROW_LENGTH + 10
    }
    ctx.moveTo(beginPoint.x, beginPoint.y)
    if(dir==='h'){
      ctx.lineTo(beginPoint.x + CONFIG.ROW_LENGTH, beginPoint.y)
    } else {
      ctx.lineTo(beginPoint.x, beginPoint.y + CONFIG.ROW_LENGTH)
    }
    ctx.strokeStyle = 'orange'
    ctx.stroke()
  }

  clearLine(rowIndex: number,valueIndex: number,dir: 'v'|'h') {
    const CONFIG = this.CONFIG
    const ctx = this.mazeCanvas.getCtx()
    if (dir === 'v') {
      let t = rowIndex
      rowIndex = valueIndex
      valueIndex = t
    }
    const beginPoint = {
      x: valueIndex*CONFIG.ROW_LENGTH + 10,
      y: rowIndex*CONFIG.ROW_LENGTH + 10
    }
    if(dir==='h'){
      ctx.clearRect(beginPoint.x + 1, beginPoint.y - 1, CONFIG.ROW_LENGTH - 2, 2)
    } else {
      ctx.clearRect(beginPoint.x - 1, beginPoint.y + 1, 2, CONFIG.ROW_LENGTH - 2)
    }
  }
}


function fetchFullMaze(rowCount: number) {
  return request({
    url: '/stream/maze_full',
    method: 'get',
    params: {
      row_count: rowCount
    }
  })
}

// stream方式获取应擦除的墙，每次返回值不一定是完整的json，需要处理异常情况
function fetchMazeStream(rowCount: number) {
  return fetch(`${import.meta.env.VITE_API_BASEPATH}/stream/maze?row_count=${rowCount}`,{
    method: 'GET'
  })
}

function streamInitMaze(maze: NewMaze, ROW_NUM: number) {
  fetchMazeStream(ROW_NUM).then(res => {
    const reader = res.body?.getReader()
    let lastJsonErrStr = ''
    reader?.read().then(async function textDecoder({ done, value }): Promise<any> {
      if (done) {
        console.log("done", value)
        return
      }
      const mazeData = new TextDecoder("utf-8").decode(value)
      mazeData.split('\n').forEach((clearJson) => {
        if (!clearJson) return
        try {
          const clear = JSON.parse(clearJson) as WallData
          maze.clearLine(clear.y, clear.x, clear.direction)
        } catch(e) {
          if (lastJsonErrStr && clearJson) {
            console.log("error-fixed:", lastJsonErrStr + "*" + clearJson)
            try {
              const clear = JSON.parse(lastJsonErrStr + clearJson) as WallData
              maze.clearLine(clear.y, clear.x, clear.direction)
              lastJsonErrStr = ''
            } catch (e) {
              lastJsonErrStr += clearJson
            }
          } else {
            lastJsonErrStr = clearJson
          }
        }
      })
      return reader.read().then(textDecoder)
    })
  })
}
let wsHandle: WebSocket
// websocket方式获取应擦除的墙，每次返回完整的json
function fetchMazeSocket(rowCount: number, onmessage: (data: string, ws: WebSocket) => void) {
  const ws = new WebSocket('ws://127.0.0.1:8000/api/socket/maze')
  ws.onmessage = function(e){
    console.log(e)
    onmessage(e.data, ws)
  }
  ws.onopen = function(){
    ws.send(`maze:${rowCount}`)
  }
  ws.onclose = function(){
    console.log('websocket closed')
  }
  wsHandle = ws
}


function socketInitMaze(maze: NewMaze, ROW_NUM: number) {
  fetchMazeSocket(ROW_NUM, (clearJson, ws) => {
    try {
      const clear = JSON.parse(clearJson) as WallData
      maze.clearLine(clear.y, clear.x, clear.direction)
    } catch (_) {
      if (clearJson === 'done') ws.close()
    }
  })
}

onMounted(async ()=>{
  const config = {
    ROW_NUM: 500,
    ROW_LENGTH: 3
  }
  const maze = new NewMaze(canvas as Ref<HTMLCanvasElement>, config)
  let fullMaze = await fetchFullMaze(config.ROW_NUM)
  maze.setMaze(fullMaze as unknown as IMaze)
  maze.drawMaze()
  socketInitMaze(maze, config.ROW_NUM)
  // streamInitMaze(maze, config.ROW_NUM)
})
onUnmounted(() => {
  wsHandle.close()
})
</script>

<style scoped>
.canvas{
  position: absolute;
  background-color: black;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
</style>