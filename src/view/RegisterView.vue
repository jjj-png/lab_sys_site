<template>
  <div class="login-page">
    <div class="left-section">
      <img src="@/assets/lab-bg.png" alt="Lab" class="bg-image" />
    </div>

    <div class="right-section">
      <div class="login-box">
        <h2>用户注册</h2>
        <input v-model="form.username" placeholder="用户名:" />
        <input v-model="form.password" type="password" placeholder="密码:" />
        <input v-model="form.name" type="text" placeholder="姓名:" />

        <select v-model="form.role">
          <option value="1">学生</option>
          <option value="2">系统管理员</option>
          <option value="3">实验室管理员</option>
        </select>
        <button @click="handleRegister">注册</button>
        <p class="message" :style="{ color: messageColor }">{{ message }}</p>
        <p class="link">已有账号？<router-link to="/login">去登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const form = reactive({
  username: '',
  password: '',
  role: '1',
  name: ''
})

const message = ref('')
const messageColor = ref('red')
const router = useRouter()

const handleRegister = async () => {
  try {
    const res = await axios.post('/api/auth/register', form)
    if (res.data.success) {
      message.value = '注册成功！即将跳转登录...'
      messageColor.value = 'green'
      setTimeout(() => router.push('/login'), 1500)
    } else {
      message.value = res.data.message || '注册失败'
    }
  } catch (err) {
    message.value = '注册异常'
  }
}
</script>

<style scoped>
/* 复用登录界面的样式 */
.login-page {
   display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f8f8;
}

.left-section {
  width: 400px; /* 宽度与登录框相近 */
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


</style>
