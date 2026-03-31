import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import VueLazyload from 'vue-lazyload'


const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(VueLazyload, {
  preLoad: 1.3,
  error: new URL('@/assets/images/robot-fill.png', import.meta.url).href,
  loading: new URL('@/assets/images/robot-fill.png', import.meta.url).href,
  attempt: 1
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')