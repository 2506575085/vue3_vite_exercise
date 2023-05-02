declare type RandomFn = (min: number, max: number) => number
declare type RandomNum = {
    [index:string]:RandomFn
}

// Omit 删除指定类型的key返回删除后的接口类型
declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;//一个页面或者视图多个路由会使用
  children?: AppRouteRecordRaw[];
  props?: any;
  fullPath?: string;
}
declare interface RouteMeta {
  title: string;
}
declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;//一个页面或者视图多个路由会使用
  children?: AppRouteRecordRaw[];
  props?: any;
  fullPath?: string;
}
declare type AppRouteModule = AppRouteRecordRaw;

declare interface iHeadItem {
  x: number
  y: number
  width: number
  height: number
}

declare interface iFootItem extends iHeadItem {
  id:number
}

/***infer关键字练习 */
interface Logger {
  time: number;
  asyncLog:(msg: string) => Promise<string>
  syncLog:(msg: string) => number;
}

type FilterKeys<T, U> = {
  [Key in keyof T]: T[Key] extends U ? Key : never
}[keyof T]

type keys = FilterKeys<Logger, Function>

type Translate<T> = {
  [key in FilterKeys<T, Function>]: T[key] extends ((msg:infer U) => any) ? ((msg:U) => U) : never
}

// 要求 Translate
//  1. 提取出为函数类型的属性，丢弃掉其它类型的属性
//  2. 将函数返回类型调整为形参类型(假定有且只有一个参数)

// 实现效果如下:
type T0 = Translate<Logger>

// 等价于
// type T0 = {
//     // 其它属性被丢弃
//     asyncLog: (arg: string) => string; // return 类型被调整为跟 arg 保持一致
//     syncLog: (arg: string) => string; // return 类型被调整为跟 arg 保持一致
// }

const result: T0 = {
    asyncLog(msg: string) { return msg }
}