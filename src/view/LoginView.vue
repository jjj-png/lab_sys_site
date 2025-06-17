<!-- LoginView.vue -->
<template>
  <div class="login-page">
    <!-- 原有登录表单 -->
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  username: 'admin',
  password: 'admin123',
  role: '2' // 系统管理员
})

// 开发环境自动登录
onMounted(() => {
  if (process.env.NODE_ENV === 'development') {
    handleLogin()
  }
})

const handleLogin = async () => {
  try {
    // 开发环境直接跳转，不调用API
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('userRole', form.role)
      router.push('/admin/home')
      return
    }
    
    // 生产环境调用真实API
    const res = await axios.post('/api/auth/login', form)
    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.token)
      router.push('/admin/home')
    }
  } catch (error) {
    console.error('登录失败', error)
  }
}
</script>