<template>
  <div class="page">
    <h2>实验室管理员列表</h2>

    <button class="btn-add" @click="openAdd">新增管理员</button>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th><th>用户名</th><th>姓名</th><th>电话</th><th>邮箱</th> <th>积分</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="admins.length === 0">
           <td colspan="7">暂无数据</td>
        </tr>
        <tr v-for="a in admins" :key="a.userId">
          <td>{{ a.userId }}</td>
          <td>{{ a.username }}</td>
          <td>{{ a.name }}</td>
          <td>{{ a.phone }}</td>
          <td>{{ a.email }}</td>
          <td>{{ a.points }}</td>
          <td>
            <button @click="openEdit(a)">编辑</button>
            <button @click="remove(a.userId)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 简易弹窗 -->
    <div v-if="dialog" class="dialog">
      <div class="panel">
        <h3>{{ editMode ? '编辑管理员' : '新增管理员' }}</h3>
        <input v-model="form.username" placeholder="用户名" />
        <input v-model="form.password" type="password" placeholder="密码" />
        <input v-model="form.name" placeholder="姓名" />
        <input v-model="form.phone" placeholder="电话" />
        <input v-model="form.email" placeholder="邮箱" />
        <div class="actions">
          <button @click="save">保存</button>
          <button @click="dialog=false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const admins = ref([])
const dialog = ref(false)
const editMode = ref(false)

const form = reactive({
  userId: null,
  username: '',
  password: '',
  name: '',
  phone: '',
  email: '',
  role: 3     // role=3 表示实验室管理员
})

const load = async () => {
  const res = await axios.get('/api/user/lab-admins')   // ✅
  admins.value = Array.isArray(res.data.data) ? res.data.data : res.data
}

const openAdd = () => {
  editMode.value = false
  Object.assign(form, { userId:null, username:'', password:'', name:'', phone:'', email:'', role:3,points: 0 })
  dialog.value = true
}

const openEdit = (a) => {
  editMode.value = true
  Object.assign(form, { ...a, password:'' })
  dialog.value = true
}

/* 保存 */
const save = async () => {
  // 拷贝一份表单数据，避免直接修改 form
  const payload = { ...form }

  if (editMode.value) {
    // 取得数据库中的旧密码
    const old = admins.value.find(a => a.userId === payload.userId)

    if (!payload.password || payload.password.trim() === '') {
      /* ① 密码留空 ——> 不修改密码，带回旧密码 */
      payload.password = old.password
    } else {
      /* ② 用户填了新密码 —> 检查是否与旧密码相同 */
      if (old && payload.password === old.password) {
        alert('新密码不能与旧密码相同')
        return
      }
      /* ③ 否则用新密码，后端再决定是否加密 */
    }

    await axios.put(`/api/user/${payload.userId}`, payload)
  } else {
    /* 新增时必须输入密码 */
    if (!payload.password || payload.password.trim() === '') {
      alert('密码不能为空')
      return
    }
    await axios.post('/api/user', payload)
  }

  dialog.value = false
  await load()
}



const remove = async (id) => {
  if (confirm('确认删除？')) {
    await axios.delete(`/api/user/${id}`)
    await load()
  }
}

onMounted(load)
</script>

<style scoped>
.page{background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,.06);}
.table{width:100%;border-collapse:collapse;margin-top:12px;}
.table th,.table td{border:1px solid #e5e5e5;padding:8px;text-align:center;font-size:14px;}
.btn-add{margin-bottom:10px;padding:6px 12px;}
.dialog{position:fixed;inset:0;background:rgba(0,0,0,.3);display:flex;justify-content:center;align-items:center;}
.panel{background:#fff;padding:20px;border-radius:6px;min-width:260px;display:flex;flex-direction:column;gap:10px;}
.panel input{padding:6px;border:1px solid #ccc;border-radius:4px;}
.actions{display:flex;gap:10px;justify-content:flex-end;}
</style>
