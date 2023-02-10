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