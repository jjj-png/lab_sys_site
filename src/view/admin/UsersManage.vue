<template>
  <div class="users-page">
    <h2>系统管理员列表</h2>

    <!-- 只有超级管理员能看到 -->
    <button class="btn-add" @click="openAdd" v-if="isSuperAdmin">新增管理员</button>

    <!-- 表格 -->
    <table class="table">
      <thead>
        <tr>
          <th>ID</th><th>用户名</th><th>姓名</th><th>电话</th><th>邮箱</th><th>积分</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.userId">
          <td>{{ u.userId }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.name }}</td>
          <td>{{ u.phone }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.points }}</td>
          <td>
            <button @click="openEdit(u)" :disabled="!isSuperAdmin">编辑</button>
            <button @click="del(u.userId)" :disabled="!isSuperAdmin">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 弹窗 -->
    <div v-if="showDialog" class="dialog">
      <div class="panel">
        <h3>{{ editMode ? '编辑管理员' : '新增管理员' }}</h3>
        <input v-model="form.username" placeholder="用户名" />
        <input v-model="form.password" type="password" placeholder="密码" />
        <input v-model="form.name" placeholder="姓名" />
        <input v-model="form.phone" placeholder="电话" maxlength="11" @input="onPhoneInput"/>
        <input v-model="form.email" placeholder="邮箱" />
        <div class="actions">
          <button @click="save">保存</button>
          <button @click="showDialog = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 无权限提示（可选） -->
    <p v-if="!isSuperAdmin" style="color: gray; margin-top: 10px;">
      当前用户无权限新增、编辑或删除管理员。
    </p>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import request from '@/Util/request'

const users = ref([])
const showDialog = ref(false)
const editMode = ref(false)
const originalPassword = ref('')

// 获取当前用户，判断是否为超级管理员
const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}')
const isSuperAdmin = currentUser.username === 'sysadmin001'



// 表单
const form = reactive({
  userId: null,
  username: '',
  password: '',
  name: '',
  phone: '',
  email: '',
  role: 2, // 系统管理员
  points: 0
})

/* 获取系统管理员列表 */
const load = async () => {
  const { data } = await request.get('/user/admins')
  users.value = data
}

/* 打开新增表单 */
const openAdd = () => {
  if (!isSuperAdmin) return
  editMode.value = false
  Object.assign(form, {
    userId: null,
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    role: 2,
    points: 0
  })
  showDialog.value = true
}

// 只允许输入数字
const onPhoneInput = (e) => {
  form.phone = form.phone.replace(/\D/g, '')
}

// 手机号格式校验
const isValidPhone = (phone) => /^1\d{10}$/.test(phone)


/* 打开编辑表单 */
const openEdit = (u) => {
  if (!isSuperAdmin) return
  editMode.value = true
  Object.assign(form, { ...u, password: '' })
  originalPassword.value = u.password || ''
  showDialog.value = true
}

/* 保存（新增 / 编辑） */
const save = async () => {
  if (!isSuperAdmin) return

  if (!isValidPhone(form.phone)) {
  alert('请输入合法的11位手机号（以1开头）')
  return
}
  const payload = { ...form }

  if (editMode.value) {
    if (!payload.password) {
      payload.password = originalPassword.value
    } else if (payload.password === originalPassword.value) {
      alert('新密码不能与旧密码相同')
      return
    }
    await request.put(`/user/${payload.userId}`, payload)
  } else {
    if (!payload.password) {
      alert('密码不能为空')
      return
    }
    await request.post('/user', payload)
  }

  showDialog.value = false
  await load()
}

/* 删除 */
const del = async (id) => {
  if (!isSuperAdmin) return
  if (confirm('确定删除?')) {
    await request.delete(`/user/${id}`)
    await load()
  }
}

onMounted(load)
</script>


<style scoped>
.users-page { background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.06); }
.table{width:100%;border-collapse:collapse;margin-top:12px;}
.table th,.table td{border:1px solid #e5e5e5;padding:8px;text-align:center;font-size:14px;}
.btn-add{margin-bottom:10px;padding:6px 12px;}
.dialog{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.3);display:flex;justify-content:center;align-items:center;}
.panel{background:#fff;padding:20px;border-radius:6px;min-width:260px;display:flex;flex-direction:column;gap:10px;}
.panel input{padding:6px;border:1px solid #ccc;border-radius:4px;}
.actions{display:flex;gap:10px;justify-content:flex-end;}
</style>
