
import { RouteRecordRaw } from 'vue-router';
// import.meta.globEager 是vite提供的函数可以引入指定目录里面的所有指定类型文件返回数组
const modules:any = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  // console.log('mod :>> ', mod);
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
  // console.log(routeModuleList)
});


// 处理好数据后统一返回到 路由实例
export const basicRoutes:RouteRecordRaw[] =routeModuleList;