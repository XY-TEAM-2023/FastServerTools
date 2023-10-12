import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolvers: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  configureWebpack: {
    plugins: [],
  },
  // server: {
  //   port: 3000,
  //   open: true,
  //   // 配置代理，只对dev环境有效
  //   proxy: {
  //     // 请求的路径前缀只要是 /testaxios 就会被拦截走这个代理
  //     '/dev-api': {
  //       target: 'http://api-no1idc.com:8000',
  //       // 拦截到的请求路径 testaxios/httphwm/getList，/testaxios会被替换成空
  //       rewrite: (path) => path.replace('/^/dev-api/', ''),
  //       ws: true,
  //       changeOrigin: true,
  //     },
  //   },
  // },
})
