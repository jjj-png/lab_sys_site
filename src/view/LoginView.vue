<template>
  <div class="login-page">
    <!-- 左侧小图 -->
    <div class="left-section">
      <img src="@/assets/lab-bg.png" alt="Lab" class="bg-image" />
    </div>

    <!-- 右侧登录框 -->
    <div class="right-section">
      <div class="login-box">
        <h2>欢迎使用</h2>
        <input v-model="form.username" placeholder="用户名" />
        <input v-model="form.password" type="password" placeholder="密码" />
        <select v-model="form.role">
          <option value="1">学生</option>
          <option value="2">系统管理员</option>
          <option value="3">实验室管理员</option>
        </select>
        <button @click="handleLogin">登录</button>
        <p class="message">{{ message }}</p>
        <p class="link">还没有账号？<router-link to="/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  role: '1'
})

const message = ref('')

const handleLogin = async () => {
  try {
    const res = await axios.post('/api/auth/login', {
      username: form.username,
      password: form.password,
      role: form.role
    })
    if (res.data.code === 200) {
      message.value = '登录成功！'

  // ✅ 保存后端返回的 token（字段视后端接口返回格式调整）
  localStorage.setItem('token', res.data.data.token)
  localStorage.setItem('userInfo', res.data.data)

  // 根据角色跳转
  if (form.role === '2') {
    router.push('/admin')
  } else if (form.role === '3') {
    router.push('/lab-admin')
  } else {
    router.push('/student')
  }
}
 else {
      message.value = res.data.msg || '登录失败'
  }
  } catch (error) {
    message.value = '请求出错：' + error.message
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f8f8;
}

.left-section {
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  margin-right: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.right-section {
  width: 350px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-box {
  width: 80%;
  max-width: 300px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: #fff;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-box input,
.login-box select {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.login-box button {
  width: 100%;
  padding: 10px;
  background-color: #2c65f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.login-box button:hover {
  background-color: #1a4fd0;
}

.message {
  text-align: center;
  margin-top: 1rem;
  color: red;
}

.link {
  text-align: center;
  margin-top: 1rem;
  font-size: 14px;
}

.link a {
  color: #2c65f6;
  text-decoration: none;
}

.link a:hover {
  text-decoration: underline;
}
</style>