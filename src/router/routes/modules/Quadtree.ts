const QuadtreeRoute: AppRouteModule = {
  path: '/Quadtree',
  name: 'Quadtree',
  component: () => import('@/components/Quadtree.vue'),
  meta: {
    title: "Quadtree",
  },
};
export default QuadtreeRoute;