type RandomFn = (min: number, max: number) => number
type RandomNum = {
    [index:string]:RandomFn
}

// Omit 删除指定类型的key返回删除后的接口类型
interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;//一个页面或者视图多个路由会使用
  children?: AppRouteRecordRaw[];
  props?: any;
  fullPath?: string;
}
interface RouteMeta {
  title: string;
}
interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;//一个页面或者视图多个路由会使用
  children?: AppRouteRecordRaw[];
  props?: any;
  fullPath?: string;
}
type AppRouteModule = AppRouteRecordRaw;
