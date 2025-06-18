import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


export default defineConfig({
  plugins: [vue(),
     AutoImport({
      resolvers: [ElementPlusResolver()]
    }),

    // ✅ 自动注册组件（如 <el-dialog>、<el-button> 等）
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/lab-admin': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
