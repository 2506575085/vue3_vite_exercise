const LoginRoute: AppRouteModule = {
  path: '/Quadtree',
  name: 'Quadtree',
  component: () => import('@/components/Quadtree.vue'),
  meta: {
    title: "Quadtree",
  },
};
export default LoginRoute;