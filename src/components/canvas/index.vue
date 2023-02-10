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

let { vw, vh } = { vw: window.innerWidth, vh: window.innerHeight }
let size = 10
let footSize = 5
let footLength = 120
let footNum = 20
let speed = 4
let ctx: CanvasRenderingContext2D
class HeadItem implements iHeadItem{
  x = 0
  y = 0
  width = 0
  height = 0
  moveTo(x:number,y:number,xSpeed:number,ySpeed:number) {
    itemMoveTo(this,x,y,xSpeed,ySpeed)
  }
  constructor(x:number,y:number,width:number,height:number) {
    this.height = height
    this.width = width
    this.x = x
    this.y = y
  }
}
class FootItem implements iFootItem{
  x = 0
  y = 0
  width = 0
  height = 0
  id = 0
  moveTo(x:number,y:number,xSpeed:number,ySpeed:number) {
    itemMoveTo(this,x,y,xSpeed,ySpeed)
  }
  constructor(x:number,y:number,width:number,height:number,id:number) {
    this.height = height
    this.width = width
    this.x = x
    this.y = y
    this.id = id
  }
}

/**随机生成item */
function initItems() {
  const headItem = ref<HeadItem>(new HeadItem(vw / 2, vh / 2, size, size))
  const itemList = ref<Array<FootItem>>([])
  itemList.value = getNewFoot({x:headItem.value.x,y:headItem.value.y})
  return { headItem,itemList }
}
const { headItem, itemList } = initItems()

//初始化画布
function initCanvas() {
  canvas.value!.width = vw
  canvas.value!.height = vh
  return canvas.value!.getContext("2d") as CanvasRenderingContext2D
}
onMounted(() => {
  ctx = initCanvas()
  let lineargradient = ctx.createLinearGradient(0,0,vw,vh)
  lineargradient.addColorStop(0, 'blue')
  lineargradient.addColorStop(1, 'red')
  ctx.strokeStyle = lineargradient

  let radialgradient = ctx.createRadialGradient(0,0,vw/2,vw,vh,vw/2)
  radialgradient.addColorStop(0, '#FF5F98')
  radialgradient.addColorStop(0.75, '#FF0188')
  radialgradient.addColorStop(1, 'rgba(255,1,136,0)')
  ctx.fillStyle = radialgradient
  //矩形样式
  // ctx.fillStyle = "rgb(0,0,200)"
  //边框样式
  // ctx.strokeStyle = "rgb(0,0,200)"
  ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)

  drawAllItem(headItem,itemList)
})

/**
 * 获取随机foot数组
 * @param headPosition head位置
 */
function getNewFoot(headPosition:{x:number,y:number}) {
  let newFootList:Array<FootItem> = []
  newFootList = Array.from({ length: footNum }).map((v, id) => {
    const x = intFullClose(headPosition.x-footLength, headPosition.x+footLength)
    const y = intFullClose(headPosition.y-footLength, headPosition.y+footLength)
    const width = footSize
    const height = footSize
    return new FootItem(x,y,width,height,id)
  })
  return newFootList
}

/**
 * 绘制单个元素
 * @param item 
 */
function drawItem(item:HeadItem|FootItem) {
  let circle = new Path2D()
  circle.moveTo(item.x, item.y)
  circle.arc(item.x, item.y, item.height, 0, 2 * Math.PI)
  ctx.fill(circle)
}
/**
 * 绘制全部元素
 * @param headItem 
 * @param itemList 
 */
function drawAllItem(headItem: Ref<HeadItem>, itemList: Ref<Array<FootItem>>) {
  ctx.fillStyle = "rgb(0,0,200)"
  itemList.value.forEach(v => {
    drawItem(v)
    ctx.beginPath()
    ctx.moveTo(v.x, v.y)
    const qX = Math.max(v.x, headItem.value.x)
    const qY = Math.min(v.y,headItem.value.y)
    ctx.quadraticCurveTo( qX, qY, headItem.value.x, headItem.value.y)
    ctx.stroke()
  })
  ctx.fillStyle = "rgb(200,0,0)"
  drawItem(headItem.value)
}

const mouseX = ref<number>(0)
const mouseY = ref<number>(0)

/**移动到达终点id的Set */
const doneSet = new Set<number>([])

/**鼠标移动后的foot目标数组 */
let newFootList:Array<FootItem>

/**
 * 根据移动的坐标生成移动动画
 */
function itemMove() {
  if (doneSet.size >= (footNum + 1)) {
    return
  }
  footRun(newFootList)
  headRun(mouseX.value, mouseY.value)
  ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
  drawAllItem(headItem, itemList)
  requestAnimationFrame(itemMove)
}

/**
 * 防抖的移动
 */
const run = debounce((e:MouseEvent) => {
  doneSet.clear()
  mouseX.value = e.pageX
  mouseY.value = e.pageY
  newFootList = getNewFoot({ x: mouseX.value, y: mouseY.value })
  itemMove()
}, 100)

/**
 * 鼠标状态更新的回调
 * @param e 
 */
function updateMouse(e:MouseEvent) {
  run(e)
}

onMounted(() => {
  window.addEventListener('mousemove',updateMouse)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
})

/**
 * 
 * @param x 新的目标x
 * @param y 新的目标y
 */
function headRun(x: number, y: number) {
  const {xSpeed,ySpeed} = getSpeed({x:headItem.value.x,y:headItem.value.y},{x,y})
  // itemRun(headItem.value, x, y, xSpeed, ySpeed)
  headItem.value.moveTo(x,y,xSpeed,ySpeed)
}

/**
 * 
 * @param newFootList 新的目标数组
 */
function footRun(newFootList: Array<FootItem>) {
  newFootList.forEach((newItem, index) => {
    const {xSpeed,ySpeed} = getSpeed({x:itemList.value[index].x,y:itemList.value[index].y},{x:newItem.x,y:newItem.y})
    // itemRun(itemList.value[index], newItem.x, newItem.y, xSpeed, ySpeed)
    itemList.value[index].moveTo(newItem.x,newItem.y,xSpeed,ySpeed)
  })
}

/**
 * 根据方向获取水平竖直速度
 * @param itemChange 
 * @param to 
 */
function getSpeed(itemChange:{x:number,y:number},to:{x:number,y:number}) {
  let Xdir = to.x - itemChange.x
  let Ydir = to.y - itemChange.y
  let xSpeed = Math.abs(Xdir *speed) / Math.sqrt(Math.pow(Ydir, 2) + Math.pow(Xdir, 2))
  xSpeed = (Xdir>0) ? xSpeed : (-xSpeed)
  let ySpeed = Math.abs((xSpeed / Xdir) * Ydir)
  ySpeed = (Ydir > 0) ? ySpeed : (-ySpeed)
  return { xSpeed, ySpeed }
}

/**
 * 
 * @param item 要移动的item
 * @param x 目标x
 * @param y 目标y
 */
function itemMoveTo(item: HeadItem | FootItem, x: number, y: number,xSpeed:number,ySpeed:number) {
  if (Math.abs(x - item.x)>2) {
    item.x += xSpeed
  }
  if (Math.abs(y - item.y)>2) {
    item.y += ySpeed
  }
  if ((Math.abs(x - item.x) <= 2) && (Math.abs(y - item.y) <= 2)) {
    if ('id' in item) {
      doneSet.add(item.id)
    } else {
      doneSet.add(-1)
    }
  }
}



///////////////////////////////练习内容
// //animation
// function animation(ctx: CanvasRenderingContext2D) {
//   ctx.setLineDash([4, 2])
//   ctx.lineDashOffset = 0
//   function run() {
//     ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
//     ctx.lineDashOffset += 0.05
//     let lineargradient = ctx.createLinearGradient(0,0,150,150)
//     lineargradient.addColorStop(0, 'blue')
//     lineargradient.addColorStop(1, 'red')
//     ctx.strokeStyle = lineargradient
//     ctx.strokeRect(0, 0, 150, 150)
//     requestAnimationFrame(run)
//   }
//   run()
// }

// //style
// function drawStyle(ctx: CanvasRenderingContext2D) {
//   ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
//   //虚线，第一个值为实线长，第二个为间隔长
//   ctx.setLineDash([4, 2])
//   //初始偏移
//   ctx.lineDashOffset = 1

//   //渐变
//   let lineargradient = ctx.createLinearGradient(0,0,150,150)
//   lineargradient.addColorStop(0, 'blue')
//   lineargradient.addColorStop(1, 'red')
//   ctx.strokeStyle = lineargradient

//   ctx.strokeRect(0, 0, 150, 150)

//   let radialgradient = ctx.createRadialGradient(105,105,20,112,120,50)
//   radialgradient.addColorStop(0, '#FF5F98')
//   radialgradient.addColorStop(0.75, '#FF0188')
//   radialgradient.addColorStop(1, 'rgba(255,1,136,0)')
//   ctx.fillStyle = radialgradient
//   ctx.fillRect(0,0,150,150)
// }

// //path2D
// function drawPath2D(ctx: CanvasRenderingContext2D) {
//   let rectangle = new Path2D()
//   rectangle.rect(50, 50, 50, 50)
//   ctx.stroke(rectangle)

//   var circle = new Path2D()
//   circle.moveTo(125, 35)
//   circle.arc(100, 35, 25, 0, 2 * Math.PI)
//   ctx.stroke(circle)
// }

// //path
// function drawLine(ctx: CanvasRenderingContext2D) {
//   // 填充三角形
//   ctx.beginPath();
//   ctx.moveTo(25, 25);
//   ctx.lineTo(105, 25);
//   ctx.lineTo(25, 105);
//   ctx.fill();

//   // 描边三角形
//   ctx.beginPath();
//   ctx.moveTo(255, 255);
//   ctx.lineTo(125, 45);
//   ctx.lineTo(45, 125);
//   ctx.closePath();
//   ctx.stroke();

//   //圆弧
//   ctx.beginPath()
//   ctx.arc(100, 100, 50, 0, 2 * Math.PI)
//   ctx.fill()

//   //二次贝塞尔曲线
//   ctx.beginPath()
//   ctx.moveTo(180,180)
//   ctx.quadraticCurveTo(210, 180, 210, 210)
//   ctx.stroke()

//   ctx.fillStyle = "rgba(200,0,0,0.3)"
//   //三次贝塞尔曲线
//   ctx.beginPath();
//   ctx.moveTo(75, 40);
//   ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
//   ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
//   ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
//   ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
//   ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
//   ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
//   ctx.fill();
// }

// //矩形
// function drawBox(ctx: CanvasRenderingContext2D) { 
//   //绘制实心矩形
//   ctx.fillRect(0, 0, 50, 50)
//   //绘制矩形边框
//   ctx.strokeRect(5, 5, 50, 50)
//   ctx.clearRect(0, 0, 50, 50)
//   ctx.fillStyle = "rgba(0, 0, 200, 0.5)"
//   ctx.fillRect(50, 50, 50, 50);

//   ctx.rect(150, 150, 20, 20)
// }


/////  WebGL
// const canvas = ref<HTMLCanvasElement|null>()
// onMounted(() => {
//   const gl = canvas.value!.getContext("webgl")!
//   if (!gl) {
//     alert("无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。");
//     return;
//   }
//   //数据源
//   const vertexShaderSource = `
//     attribute vec4 a_position;
//     // 添加矩阵代码
//     uniform mat4 u_mat;
//     // 变量
//     varying vec4 v_color;
//     void main() {
//       gl_Position = u_mat * a_position;
//       v_color =  gl_Position * 0.5 + 0.5;
//     }
//   `
//   const fragmentShaderSource = `
//     precision lowp float;
//     varying vec4 v_color;
//     void main() {
//       gl_FragColor = v_color;
//       //gl_FragColor = vec4(1.0,0.0,0.0,1.0);
//     }
//   `
//   const pointArr = [0.0, 0.0, -0.3, -0.3, 0.3, -0.3]
//   const program = initCanvas(gl,vertexShaderSource,fragmentShaderSource,pointArr)
//   //从缓冲中读取数据
//   const aposlocation = gl.getAttribLocation(program, 'a_position')
//   gl.enableVertexAttribArray(aposlocation)
//   gl.vertexAttribPointer(aposlocation, 2, gl.FLOAT, false, 0, 0)

//   let Tx = 1.0 //x坐标的位置
//   let Ty = 1.0 //y坐标的位置
//   let Tz = 1.0 //z坐标的位置
//   let Tw = 1.0 //差值
//   let isOver = true
//   let step = 0.08
//   function run() {
//     if (Tx >= 3) {
//       isOver = false
//     }
//     if (Tx <= 0) {
//       isOver = true
//     }
//     if (isOver) {
//       Tx += step
//       Ty += step
//     } else {
//       Tx -= step
//       Ty -= step
//     }
//     const mat = new Float32Array([
//       Tx,  0.0, 0.0, 0.0,
//       0.0,  Ty, 0.0, 0.0,
//       0.0, 0.0,  Tz, 0.0,
//       0.0, 0.0, 0.0, Tw,
//     ]);
//     const matlocation = gl.getUniformLocation(program, 'u_mat')
//     gl.uniformMatrix4fv(matlocation, false, mat)
//     //绘制三角形
//     gl.drawArrays(gl.TRIANGLES, 0, 3)
//     // gl.drawArrays(gl.LINE_LOOP, 0, 4)
//     // 使用此方法实现一个动画
//     // requestAnimationFrame(run)
//   }
//   run()
// })

// /**
//  * 初始化gl和program
//  * @param gl 
//  * @param vertexShaderSource 
//  * @param fragmentShaderSource 
//  * @param pointArr 
//  * @return program
//  */
// function initCanvas(gl:WebGLRenderingContext,vertexShaderSource:string,fragmentShaderSource:string,pointArr:number[]) {
//   // 创建着色器
//   const vertexShader = gl.createShader(gl.VERTEX_SHADER)!//顶点着色器 
//   const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!//片元着色器

//   //绑定数据源
//   gl.shaderSource(vertexShader, vertexShaderSource)
//   gl.shaderSource(fragmentShader, fragmentShaderSource)
//   // 编译着色器
//   gl.compileShader(vertexShader)
//   gl.compileShader(fragmentShader)
//   // 创建着色器程序
//   const program = gl.createProgram()!
//   gl.attachShader(program, vertexShader)
//   gl.attachShader(program, fragmentShader)
//   // 链接 并使用着色器
//   gl.linkProgram(program)

//   //检测错误
//   const success = gl.getProgramParameter(program, gl.LINK_STATUS)
//   if (success) {
//     gl.useProgram(program)
//     // return program
//   } else {
//     console.error(gl.getProgramInfoLog(program), 'test---')
//     gl.deleteProgram(program)
//   }
  
//   //数据存入缓冲区
//   const buffer = gl.createBuffer()!
//   gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
//   //数组值为顶点坐标，两两一组
//   const data = new Float32Array(pointArr)
//   gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

//   //清除canvas
//   gl.clearColor(0, 0, 0, 0)
//   gl.clear(gl.COLOR_BUFFER_BIT)

//   return program
// }

</script>

<style lang="less" scoped>
.canvas{
  position: absolute;
  background-color: black;
  top: 0;
  left: 0;
}
</style>