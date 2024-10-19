import { defineConfig } from 'vite'
import {fileURLToPath} from 'node:url'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  define:{
    __VUE_PROD_DEVTOOLS__:true
  },
  plugins: [vue()],
  resolve:{
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    hmr:{
      overlay:false
    },
    port: 3004,   //访问端口
    proxy: {
      "/api": {
        target: "http://localhost:7070",
        changeOrigin: true,
        pathRewrite: {
          "^api": "/api"
        }
      }
    },
    host:'0.0.0.0',
    open:true
  }
})
