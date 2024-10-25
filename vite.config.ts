import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path' // 别名必备引入文件
const root = process.cwd()
// https://vitejs.dev/config/
export default ({ mode }) => {
  let env = loadEnv(mode, root)
  return {
    resolve: {
      alias: {
        '@':  path.resolve(__dirname, './src') //这里必须安装一个依赖 yarn add @types/node -D
      },
    },
    plugins: [vue()],
    server: {
      https: false,
      port: env.VITE_PORT,
      host: '0.0.0.0',
      open: env.VITE_OPEN === 'true',
      cors: true,
      proxy: {
        [env.VITE_API_BASEPATH]: {
          target: env.VITE_BASE_API,
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api') // 路径重写，把'/api'替换为''
        }
      }
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        less: {
          charset: false,
          additionalData: '@import "./src/assets/style/global.less";',
        },
      },
    },
    base:'./'
  }
}
