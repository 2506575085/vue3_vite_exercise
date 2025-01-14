<template>
  <!-- <div class="view" ref="topElementRef">
    <div class="inner">
      <div @click="st">1</div>
      <div class="bottom" @click="run">2</div>
    </div>
    
  </div> -->
  <!-- <div ref="div">
    <input type="text" v-model="message" @input="onInput">
    <span>{{ msg }}</span>
  </div> -->
  <!-- <div v-for="item in list">{{ item }}</div> -->
  <img :src="img" alt="">
</template>
<script setup lang="ts">
import QRCode from 'qrcode'
import { LinkedList } from "@/utils/linkedList"
import { Queue } from "@/utils/queue"
import { BinaryTree } from "@/utils/binaryTree"
import { onMounted, ref,  } from "vue"
import { useRoute } from "vue-router"
import "reflect-metadata"
const img = ref<string>()

const route = useRoute()

// function first() {
//   console.log("first")
//   return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
//     console.log("firstcall", target, propKey, descriptor)
//   }
// }
// function second() {
//   console.log("second")
//   return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
//     console.log("secondcall", target, propKey, descriptor)
//   }
// }

// function c <T extends { new (...args: any[]): {} }>(constructor: T) {
//   console.log("c", constructor)
//   Object.setPrototypeOf(constructor, {
//     hello() {
//       console.log("hello")
//     }
//   })
//   Object.setPrototypeOf(constructor.prototype, {
//     hello() {
//       console.log("hello")
//     }
//   })
// }
// @c
// class Example {
//   value = 1
//   @first()
//   @second()
//   static method() {

//   }
//   constructor(val: number) {
//     this.value = val
//   }
// }

// // 格式化字符串装饰器
// const formatMetadataKey = Symbol("format")
// function format(str: string) {
//   // 属性装饰器
//   return Reflect.metadata(formatMetadataKey, str)
// }
// function getFormatTemplate<T extends Object>(target: T, key: keyof T) {
//   return Reflect.getMetadata(formatMetadataKey, target, key as string | symbol)
// }

// // 运行时必要参数检测
// const requiredMetadataKey = Symbol("required")
// // 方法参数装饰器
// function required(target: Object, key: string | symbol, index: number) {
//   console.log("required", target, key, index)
//   const requiredParams: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, key) || []
//   requiredParams.push(index)
//   Reflect.defineMetadata(requiredMetadataKey, requiredParams, target, key)
// }
// // 方法装饰器
// function validate(target: Object, key: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) {
//   console.log("validate", target, key, descriptor)
//   let func = descriptor.value!
//   descriptor.value = function (...args: unknown[]) {
//     const requiredParams: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, key)
//     if (requiredParams) {
//       requiredParams.forEach(paramsIndex => {
//         if (paramsIndex >= args.length || args[paramsIndex] === undefined) {
//           throw new Error("缺少必要参数")
//         }
//       })
//     }
//     return func.apply(this, args)
//   }
// }


// function setTypeCheck<T>(target: any, key: string, descriptor: TypedPropertyDescriptor<T>) {
//   let func = descriptor.set!
//   descriptor.set = function (v: T) {
//     const type = Reflect.getMetadata("design:type", target, key)
//     console.log("typeCheck", target, key, descriptor,type,v)
//     console.log("typeCheck", v instanceof type)
//     func.call(this, v)
//   }
// }

// class Greeter {
//   @format("Hello, %s")
//   greeting: string
  
//   @format("%s ,XIXI, %s")
//   name: string

//   constructor({greeting, name}: {greeting: string, name: string}) {
//     this.greeting = greeting
//     this.name = name
//   }
//   @validate
//   getFormat(@required key: keyof Greeter): string {
//     const formatTemplate = getFormatTemplate(this, key)
//     return formatTemplate.replaceAll("%s", this[key])
//   }

//   @setTypeCheck
//   @Reflect.metadata("design:type", String)
//   set nameVisit(value: string) {
//     this.name = value
//   }
//   get nameVisit() {
//     return this.name
//   }
// }

// // 无论调用方提供方，均需多传少取才可兼容
// const provider = (a: number) => { return { a, b: 2, c: 3 } }
// const injector: (a: number, b: number, c: number) => { a: number } = provider
// const { a } = injector(1, 2, 3)

onMounted(()=>{
  // const g = new Greeter({greeting: "world", name: "cheng"})
  // console.log(g.getFormat("greeting"))
  // console.log(g.getFormat("name"))
  // g.nameVisit = "xixi"
  // const a = new Example(1)
  // Example.method()
  // console.log(route.query)
  // const generateQR = async (text: string) => {
  //   try {
  //     // console.log(await QRCode.toDataURL(text))
  //     img.value = await QRCode.toDataURL(text)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }
  // generateQR('https://open.douyin.com/platform/oauth/qr_auth/?client_key=awf4rhn9l2uzdwoy\u0026hide_nav_bar=1\u0026qr_source_aid=0\u0026token=923ca9c78ff46e1f8a9666d8080f59fa_lf')
})
// fetch('img.png')
//   .then(res=>{
//     const reader = res.body!.getReader()
//     return new ReadableStream({
//       start(controller){
//         return pump()
//         async function pump():Promise<ReadableStreamReadResult<Uint8Array> | null | undefined> {
//           return reader.read().then(({done, value}) =>{
//             if (done) {
//               controller.close()
//               return
//             }
//             controller.enqueue(value)
//             return pump()
//           })
//         }
//       }
//     })
//   })
//   .then(stream=>new Response(stream).blob())
//   .then(blob=>URL.createObjectURL(blob))
//   .then(url=>{
//     console.log(url)
//     img.value = url
//   })



// const div = ref<HTMLElement>()
// const message = ref("")
// const msg = ref("")
// const bc = new BroadcastChannel("BC")
// bc.addEventListener("message",(e)=>{
//   msg.value = e.data
// })

// function onInput(e:Event) {
//   div.value!.requestPointerLock()//锁定指针
//   bc.postMessage(message.value)
// }


// const arr = Array.from<number>({length:100})
// arr.forEach((v,i)=>{
//   arr[i] = i
// })
// const tree = new BinaryTree<number>(arr)
// tree.setChild(2,new BinaryTree<number>([null,1,2,3,4,5,6,7,8,9]))
// tree.setChild(3,new BinaryTree<number>([null,1,2,3,4,5,6,7,8,9]))
// tree.setNode(2,null)
// console.log(tree)
// console.log(tree.getLChild())
// console.log(tree.getRChild())
// tree.bfs((node,i)=>{console.log(node,i)},2)

// const arr = Array.from<number>({length:10000})
// arr.forEach((v,i)=>{
//   arr[i] = i
// })

// const list0 = new LinkedList<number>(arr)
// const list = ref(new LinkedList<number>(list0))
// setTimeout(()=>{
//   const list1 = new LinkedList<number>()

//   const listIter = list.value.iter()
//   const listIter2 = list.value.iter()

//   let i = 0


//   const unshiftIter = list.value.iter()
//   const pushIter = list.value.iter(true)
//   for(let i = 1; i < 1000; i++){
//     unshiftIter.add(-i)
//   }
//   while(listIter2.hasNext()){
//     listIter2.next()
//     if((listIter2.value()!%10)){
//       listIter2.remove()
//     }
//   }
//   for(let i = 1; i < 1000; i++) {
//     pushIter.add(-i)
//   }
//   unshiftIter.add(-1)
//   // unshiftIter.add(-2)
//   pushIter.add(-99999)

//   console.log(Array.from(list.value))
//   ;(window as any)?.microApp?.dispatch({type: 'computed_done'})
// },1000)


// const d1 = new Date().getTime()
// for(i = arr.length - 1; i >= 0; i--){
//   if(i%100){
//     arr.splice(i,1)
//   }
// }
// console.log('Array',new Date().getTime()-d1)

// console.log(arr,list.getHeadNode())
// console.log(list.size(),list.get(list.size()-1))
// console.log([...list])


// const queue = new Queue<number>()
// queue.add(1)
// queue.add(2)
// queue.add(3)
// console.log(queue.remove())
// console.log(queue.remove())
// console.log(queue.remove())
// queue.add(2)
// queue.add(3)
// console.log(queue.remove())
// console.log(queue.remove())

// console.log(queue)



// while(listIter2.hasPrevious()){
//   console.log(listIter2.previous())
// }
// console.log('get',list.get(7))

// import { onMounted, ref } from 'vue'
// import { useScrollTo } from '@/hooks/useTest'
// const topElementRef = ref<HTMLElement | null>(null)
// let run = ()=>{}
// let st = ()=>{}
// onMounted(()=>{
//   const { start,stop } = useScrollTo({
//     el:topElementRef.value!,
//     position:'scrollTop',
//     to:0,
//     callback:()=>{console.log(1)}
//   })
//   run = start
//   st = stop
// })

</script>
<style lang="less">
 /deep/.no-bg-scrollbar{
  display: none;
  background: red;
}
</style>
<style scoped lang="less">

.view {
  width: 100%;
  height: 100vh;
  overflow: auto;
  position: relative;
  .inner {
    position: relative;
    height: 180vh;
  }
}
.bottom {
  position: absolute;
  bottom: 0;
}
</style>