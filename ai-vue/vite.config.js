import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')//__dirname为根目录
    }
  },
  server: {// 配置代理
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: 'all',
    cors: true,// 开启跨域
    strictPort: true,// 严格5173端口
    headers: {
      'ngrok-skip-browser-warning': 'true'
    },
    proxy: {
      '/api': {
        target: 'http://159.75.169.224:1235',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus'],
          'echarts': ['echarts']
        }
      }
    }
  }
})
