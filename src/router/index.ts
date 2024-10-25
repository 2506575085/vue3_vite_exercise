import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHashHistory } from "vue-router"

const basicRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/mazeRequest",
    name: "index",
    meta: {
      title: "index",
    },
  },
  {
    path: "/webSocket",
    name: "webSocket",
    component: () => import("@/components/webSocket/index.vue"),
    meta: {
      title: "webSocket",
    },
  },
  {
    path: "/Quadtree",
    name: "Quadtree",
    component: () => import("@/components/Quadtree/index.vue"),
    meta: {
      title: "Quadtree",
    },
  },
  {
    path: "/Life",
    name: "Life",
    component: () => import("@/components/Life/index.vue"),
    meta: {
      title: "Life",
    },
  },
  {
    path: "/canvas",
    name: "canvas",
    component: () => import("@/components/canvas/index.vue"),
    meta: {
      title: "canvas",
    },
  },
  {
    path: "/maze",
    name: "maze",
    component: () => import("@/components/maze/index.vue"),
    meta: {
      title: "maze",
    },
  },
  {
    path: "/svg",
    name: "svg",
    component: () => import("@/components/svg/index.vue"),
    meta: {
      title: "svg",
    },
  },
  {
    path: "/three",
    name: "three",
    component: () => import("@/components/three/index.vue"),
    meta: {
      title: "test",
    },
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/components/test/index.vue"),
    meta: {
      title: "test",
    },
  },
  {
    path: "/mazeRequest",
    name: "mazeRequest",
    component: () => import("@/components/maze_request/index.vue")
  }
]

/**
 * 创建路由实例
 */
export const router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes,
})
/**
 * 路由拦截
 */
router.beforeEach((to, from) => {
  // console.log('to :>> ', to,from);
})
/**
 * 挂载到vue实例函数
 * @param app vue实例
 */
export function setupRouter(app: App<Element>) {
  app.use(router)
}

export default router
