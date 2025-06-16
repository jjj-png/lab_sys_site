import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // ✅ 引入路由

const app = createApp(App)

app.use(router)               // ✅ 挂载路由系统
app.mount('#app')            // ✅ 启动应用
