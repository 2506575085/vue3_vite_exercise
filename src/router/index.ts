import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import { basicRoutes } from './routes';
/**
 * 创建路由实例
 */
export const router = createRouter({
    history:createWebHashHistory(),
    routes:(basicRoutes as unknown) as RouteRecordRaw[]
});
/**
 * 路由拦截
 */
router.beforeEach((to,from)=>{
  // console.log('to :>> ', to,from);
})
/**
 * 挂载到vue实例函数
 * @param app vue实例
 */
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
