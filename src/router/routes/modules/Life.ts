
const LoginRoute: AppRouteModule = {
  path: '/Life',
  name: 'Life',
  component: () => import('@/components/Life.vue'),
  meta: {
    title: "Life",
  },
};
export default LoginRoute;
