import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // ✅ 引入路由


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)               // ✅ 挂载路由系统
app.mount('#app')            // ✅ 启动应用
