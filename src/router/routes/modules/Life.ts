
const LifeRoute: AppRouteModule = {
  path: '/Life',
  name: 'Life',
  component: () => import('@/components/Life/index.vue'),
  meta: {
    title: "Life",
  },
};
export default LifeRoute;
