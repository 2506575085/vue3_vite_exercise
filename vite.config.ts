import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path' // 别名必备引入文件
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@':  path.resolve(__dirname, './src') //这里必须安装一个依赖 yarn add @types/node -D
    },
  },
  plugins: [vue()],
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
})
