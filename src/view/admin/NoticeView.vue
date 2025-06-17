<template>
  <div class="notice-page">
    <!-- 顶部操作 -->
    <div class="toolbar">
      <input v-model="keyword" type="text" placeholder="搜索标题" class="input" />
      <button class="btn primary" @click="openAdd">发布公告</button>
    </div>

    <!-- 公告表格 -->
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>标题</th>
          <th>内容</th>
          <th>创建时间</th>
          <th>创建人</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in pagedList" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td class="content-cell">{{ item.content }}</td>
          <td>{{ item.createdTime }}</td>
          <td>{{ item.creator }}</td>
          <td>
            <button class="btn small" @click="openEdit(item)">编辑</button>
            <button class="btn small danger" @click="remove(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 分页 -->
    <div v-if="pageTotal > 1" class="pagination">
      <button @click="pageIndex--" :disabled="pageIndex === 1">上一页</button>
      <span v-for="i in pageTotal" :key="i" :class="{ current: i === pageIndex }" @click="pageIndex = i">{{ i }}</span>
      <button @click="pageIndex++" :disabled="pageIndex === pageTotal">下一页</button>
    </div>

    <!-- 自定义弹窗 -->
    <div class="modal" v-if="dialogVisible">
      <div class="modal-content">
        <h3>{{ dialogTitle }}</h3>
        <label>标题</label>
        <input v-model="form.title" type="text" class="input" />
        <label>内容</label>
        <textarea v-model="form.content" rows="5" class="input" />

        <div class="modal-footer">
          <button class="btn" @click="dialogVisible = false">取消</button>
          <button class="btn primary" @click="save">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const notices = ref([])
const keyword = ref('')
const pageIndex = ref(1)
const pageSize = ref(5)

const dialogVisible = ref(false)
const editMode = ref(false)
const form = reactive({
  id: null,
  title: '',
  content: '',
  createdTime: '',
  creator: 'admin'
})

const dialogTitle = computed(() => editMode.value ? '编辑公告' : '发布公告')

const load = async () => {
  const res = await axios.get('/api/notice')
  notices.value = res.data
}

const filtered = computed(() => {
  if (!keyword.value) return notices.value
  return notices.value.filter(n => n.title.includes(keyword.value))
})

const pageTotal = computed(() => Math.ceil(filtered.value.length / pageSize.value))
const pagedList = computed(() => {
  const start = (pageIndex.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

const openAdd = () => {
  editMode.value = false
  Object.assign(form, {
    id: null, title: '', content: '', createdTime: '', creator: 'admin'
  })
  dialogVisible.value = true
}

const openEdit = (row) => {
  editMode.value = true
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

const save = async () => {
  if (!form.title || !form.content) return alert('请填写完整内容')
  if (editMode.value) {
    await axios.put(`/api/notice/${form.id}`, form)
    ElMessage.success('公告修改成功')
  } else {
    form.createdTime = new Date().toISOString().split('T')[0]
    await axios.post('/api/notice', form)
    ElMessage.success('公告发布成功')
  }
  dialogVisible.value = false
  await load()
}


const remove = async (id) => {
  if (confirm('确认删除该公告？')) {
    await axios.delete(`/api/notice/${id}`)
    ElMessage.success('公告删除成功')
    await load()
  }
}

watch(pageSize, () => pageIndex.value = 1)

onMounted(load)
</script>

<style scoped>
.notice-page {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* ✅ 左对齐 */
  margin-top: 0px; 
}


.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 240px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn.primary {
  background-color: #007bff;
  color: white;
}

.btn.danger {
  background-color: #dc3545;
  color: white;
}

.btn.small {
  padding: 4px 8px;
  font-size: 13px;
  margin-right: 5px;
}

.table {
  width: auto;
  border-collapse: collapse;
  margin-top: 10px;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  background-color: #f5f5f5;
}

.content-cell {
  max-width: none;           /* ✅ 不限制最大宽度 */
  white-space: normal;       /* ✅ 正常换行 */
  overflow: visible;
  text-overflow: initial;
  word-break: break-word;    /* ✅ 内容多时自动断词 */
}


.pagination {
  text-align: right;
  margin-top: 16px;
}

.pagination span {
  margin: 0 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.pagination .current {
  font-weight: bold;
  background: #007bff;
  color: white;
  border-radius: 4px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
}

.modal-footer {
  text-align: right;
  margin-top: 10px;
}
</style>