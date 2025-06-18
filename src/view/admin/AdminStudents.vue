<template>
  <div class="page">
    <h2>学生列表</h2>
    <input v-model.trim="keyword"
       placeholder="搜索用户名/姓名/电话/邮箱"
       class="search"/>

    <button class="btn-add" @click="openAdd">新增学生</button>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th><th>用户名</th><th>姓名</th><th>电话</th><th>邮箱</th><th>积分</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="students.length === 0">
          <td colspan="7">暂无数据</td>
        </tr>
          <tr v-for="s in pagedList" :key="s.userId">
          <td>{{ s.userId }}</td>
          <td>{{ s.username }}</td>
          <td>{{ s.name }}</td>
          <td>{{ s.phone }}</td>
          <td>{{ s.email }}</td>
          <td>{{ s.points }}</td>
          <td>
            <button @click="openEdit(s)">编辑</button>
            <button @click="remove(s.userId)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 弹窗 -->
    <div v-if="dialog" class="dialog">
      <div class="panel">
        <h3>{{ editMode ? '编辑学生' : '新增学生' }}</h3>
        <input v-model="form.username" placeholder="用户名" />
        <input v-model="form.password" type="password" placeholder="密码" />
        <input v-model="form.name" placeholder="姓名" />
        <input v-model="form.phone" placeholder="电话" />
        <input v-model="form.email" placeholder="邮箱" />
        <input v-model.number="form.points" placeholder="积分" type="number" />
        <div class="actions">
          <button @click="save">保存</button>
          <button @click="dialog = false">取消</button>
        </div>
      </div>
    </div>
  </div>

<div class="pager" v-if="pageTotal > 1 || filtered.length > 0">
  <button :disabled="pageIndex === 1" @click="pageIndex--">« 上一页</button>
  <span>第 {{ pageIndex }} / {{ pageTotal }} 页</span>
  <button :disabled="pageIndex === pageTotal" @click="pageIndex++">下一页 »</button>

  <!-- 每页数量选择 -->
  <select v-model.number="pageSize" class="page-size">
    <option :value="5">每页 5 条</option>
    <option :value="8">每页 8 条</option>
    <option :value="10">每页 10 条</option>
    <option :value="20">每页 20 条</option>
  </select>
</div>

</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import request from '@/Util/request'

const students = ref([])
const dialog = ref(false)
const editMode = ref(false)
const keyword   = ref('')   // 搜索关键字
const pageSize  = ref(8)    // 每页条数
const pageIndex = ref(1)    // 当前页码

const form = reactive({
  userId: null,
  username: '',
  password: '',
  name: '',
  phone: '',
  email: '',
  points: 0,
  role: 1  // 1 表示学生
})

const load = async () => {
  const res = await request.get('/user/students')
  students.value = Array.isArray(res.data.data) ? res.data.data : res.data
  pageIndex.value = 1 
}

const openAdd = () => {
  editMode.value = false
  Object.assign(form, {
    userId: null, username: '', password: '',
    name: '', phone: '', email: '', points: 0, role: 1
  })
  dialog.value = true
}

const openEdit = (s) => {
  editMode.value = true
  Object.assign(form, { ...s, password: '' }) // 清空密码输入框
  dialog.value = true
}

const save = async () => {
  const payload = { ...form }

  if (editMode.value) {
    const old = students.value.find(s => s.userId === payload.userId)
    if (!payload.password || payload.password.trim() === '') {
      payload.password = old.password
    } else {
      if (old && payload.password === old.password) {
        alert('新密码不能与旧密码相同')
        return
      }
    }

    await request.put(`/user/${payload.userId}`, payload)
  } else {
    if (!payload.password || payload.password.trim() === '') {
      alert('密码不能为空')
      return
    }
    await request.post('/user', payload)
  }

  dialog.value = false
  await load()
}

const remove = async (id) => {
  if (confirm('确认删除？')) {
    await request.delete(`/user/${id}`)
    await load()
  }
}

const filtered = computed(() => {
  if (!keyword.value) return students.value
  const kw = keyword.value.toLowerCase()
  return students.value.filter(s =>
    `${s.username}${s.name}${s.phone}${s.email}`.toLowerCase().includes(kw)
  )
})

const pageTotal = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / pageSize.value))
)

const pagedList = computed(() => {
  // 若当前页超出总页数，自动回退
  if (pageIndex.value > pageTotal.value) pageIndex.value = pageTotal.value
  const start = (pageIndex.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})
watch(pageSize, () => {
  pageIndex.value = 1 // 改变页大小后，重置到第1页
})


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
.search{
  padding:6px 10px;margin-bottom:12px;width:260px;border:1px solid #ccc;border-radius:4px;
}
.pager{
  margin-top:12px;display:flex;gap:8px;align-items:center;justify-content:flex-end;
}
.pager button{
  padding:4px 10px;border:1px solid #ccc;background:#fff;cursor:pointer;border-radius:4px;
}
.pager button:disabled{opacity:.4;cursor:not-allowed;}
.page-size {
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  margin-left: 10px;
  font-size: 14px;
}
</style>
