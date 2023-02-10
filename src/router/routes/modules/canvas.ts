
const canvasRoute: AppRouteModule = {
  path: '/canvas',
  name: 'Life',
  component: () => import('@/components/canvas/index.vue'),
  meta: {
    title: "canvas",
  },
};
export default canvasRoute;