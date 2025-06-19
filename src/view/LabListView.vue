<template>
  <div class="lab-page">
    <!-- 新增按钮 -->
<div style="display: flex; justify-content: flex-end; margin-bottom: 10px; width: 100%;">
  <button class="btn-add" @click="openAddDialog">新增实验室</button>
</div>






    <table class="lab-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>名称</th>
          <th>简介</th>
          <th>房间号</th>
          <th>管理员</th>
          <th>联系方式</th>
          <th>分类</th>
          <th>开放时间</th>
          <th>状态</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lab in paginatedLabs" :key="lab.labId">
          <td :title="lab.labId">{{ lab.labId }}</td>
          <td :title="lab.labName">{{ lab.labName }}</td>
          <td :title="lab.description">{{ lab.description }}</td>
          <td :title="lab.roomNumber">{{ lab.roomNumber }}</td>
          <td :title="lab.admin?.name">{{ lab.admin?.name || '未知' }}</td>
          <td :title="lab.admin?.phone">{{ lab.admin?.phone || '-' }}</td>
          <td :title="lab.labTypeName">{{ lab.labTypeName }}</td>
          <td :title="lab.startTime + ' - ' + lab.endTime">{{ lab.startTime }} - {{ lab.endTime }}</td>
          <td :title="lab.status === 1 ? '可用' : '不可用'">{{ lab.status === 1 ? '可用' : '不可用' }}</td>
          <td :title="lab.createdAt">{{ lab.createdAt }}</td>
          <td>
            <button class="btn-edit" @click="openEdit(lab)">编辑</button>
            <button class="btn-delete" @click="remove(lab.labId)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
  <button
    :disabled="page === 1"
    @click="page--"
    class="page-button"
  >
    上一页
  </button>

  <button
    v-for="i in totalPages"
    :key="i"
    @click="page = i"
    :class="['page-number', { active: page === i }]"
  >
    {{ i }}
  </button>

  <button
    :disabled="page === totalPages"
    @click="page++"
    class="page-button"
  >
    下一页
  </button>
</div>
    <div v-if="showEditDialog" class="dialog-overlay">
  <div class="dialog">
    <h3>编辑实验室</h3>
    <label>
      名称：
      <input v-model="editForm.labName" />
    </label>
    <label>
      简介：
      <input v-model="editForm.description" />
    </label>
    <label>
      房间号：
      <input v-model="editForm.roomNumber" />
    </label>
    <el-form-item label="开放时间">
  <el-time-picker
    v-model="editForm.startTime"
    placeholder="开始时间"
    format="HH:mm:ss"
    value-format="HH:mm:ss"
  />
  -
  <el-time-picker
    v-model="editForm.endTime"
    placeholder="结束时间"
    format="HH:mm:ss"
    value-format="HH:mm:ss"
  />
</el-form-item>

    <label>
      状态：
      <select v-model="editForm.status">
        <option :value="1">可用</option>
        <option :value="0">不可用</option>
      </select>
    </label>
    <div class="dialog-actions">
      <button @click="saveEdit">保存</button>
      <button @click="showEditDialog = false">取消</button>
    </div>
  </div>
</div>
<!-- 新增弹窗 -->
<div v-if="showAddDialog" class="dialog-overlay">
  <div class="dialog">
    <h3>新增实验室</h3>

    <label>实验室ID：
      <input v-model="addForm.labId" type="number" />
    </label>

    <label>名称：
      <input v-model="addForm.labName" />
    </label>

    <label>简介：
      <input v-model="addForm.description" />
    </label>

    <label>房间号：
      <input v-model="addForm.roomNumber" />
    </label>

    <el-form-item label="开放时间">
  <el-time-picker
    v-model="addForm.startTime"
    placeholder="开始时间"
    format="HH:mm:ss"
    value-format="HH:mm:ss"
  />
  -
  <el-time-picker
    v-model="addForm.endTime"
    placeholder="结束时间"
    format="HH:mm:ss"
    value-format="HH:mm:ss"
  />
</el-form-item>


    <label>状态：
      <select v-model="addForm.status">
        <option :value="1">可用</option>
        <option :value="0">不可用</option>
      </select>
    </label>

<label>实验室管理员：
  <select v-model="addForm.labAdminId">
    <option disabled value="">请选择</option>
    <option v-for="admin in admins" :key="admin.labAdminId" :value="admin.labAdminId">
      {{ admin.name }}（{{ admin.phone }}）
    </option>
  </select>
</label>

<label>实验室分类：
  <select v-model="addForm.labTypeId">
    <option disabled value="">请选择</option>
    <option v-for="type in labTypes" :key="type.typeId" :value="type.typeId">
      {{ type.typeName }}
    </option>
  </select>
</label>


    <div class="dialog-actions">
      <button @click="saveAdd">保存</button>
      <button @click="showAddDialog = false">取消</button>
    </div>
  </div>
</div>






  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '@/Util/request'
import { ElTimePicker } from 'element-plus'


/* ================== 实验室管理员 ================== */
const admins = ref([])

const loadAdmins = async () => {
  const { data } = await request.get('/user/lab-admins')
  admins.value = data
}

/* ================== 实验室分类 ================== */
const labTypes = ref([])

const loadLabTypes = async () => {
  const { data } = await request.get('/category')
  labTypes.value = data
    .filter(item => item.typeId !== 0) // ❌ 过滤掉“其他实验室”
    .map(item => ({
      typeId: item.typeId,
      typeName: item.typeName
    }))
}


/* ================== 实验室列表 ================== */
const labs = ref([])
const page = ref(1)
const pageSize = 5

const loadLabs = async () => {
  const { data } = await request.get('/labs')
  labs.value = data
}

const totalPages = computed(() => Math.ceil(labs.value.length / pageSize))
const paginatedLabs = computed(() => {
  const start = (page.value - 1) * pageSize
  return labs.value.slice(start, start + pageSize)
})

/* ================== 生命周期加载 ================== */
onMounted(() => {
  loadLabs()
  loadAdmins()
  loadLabTypes()
})

/* ================== 新增实验室 ================== */
const showAddDialog = ref(false)
const addForm = ref({
  labName: '',
  description: '',
  roomNumber: '',
  startTime: '',
  endTime: '',
  status: 1,
  labAdminId: '',
  labTypeId: ''
})

const openAddDialog = async () => {
  await Promise.all([loadAdmins(), loadLabTypes()])
  showAddDialog.value = true
}

const saveAdd = async () => {
  if (!addForm.value.labAdminId) {
    return alert('请选择实验室管理员')
  }
  await request.post('/labs', addForm.value)
  showAddDialog.value = false
  await loadLabs()
}

/* ================== 编辑实验室 ================== */
const showEditDialog = ref(false)
const editForm = ref({
  labId: null,
  labName: '',
  description: '',
  roomNumber: '',
  startTime: '',
  endTime: '',
  status: 1,
  labAdminId: '',
  labTypeId: ''
})

const openEdit = (lab) => {
  editForm.value = { ...lab }
  showEditDialog.value = true
}

const saveEdit = async () => {
  await request.put(`/labs/${editForm.value.labId}`, editForm.value)
  showEditDialog.value = false
  await loadLabs()
}

/* ================== 删除实验室 ================== */
const remove = async (id) => {
  if (confirm('确认删除该实验室吗？')) {
    await request.delete(`/labs/${id}`)
    await loadLabs()
  }
}
</script>





<style scoped>
.lab-page {
  background: transparent;
  padding: 0px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
  width: 100%;
  margin-top:100px;
}

.lab-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.lab-table th,
.lab-table td {
  border: 1px solid #e5e5e5;
  padding: 8px;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.lab-table th {
  background: #f0f2f5;
  font-weight: bold;
}

.btn-edit,
.btn-delete {
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.btn-edit  { background-color: #3b82f6; }
.btn-delete{ background-color: #ef4444; }
.btn-edit:hover  { opacity: .85; }
.btn-delete:hover{ opacity: .85; }

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.page-button,
.page-number {
  padding: 6px 14px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-number.active {
  background-color: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}


.dialog-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dialog label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.dialog input,
.dialog select {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}


.btn-add {
    display: block;
  margin: 20px auto;
  padding: 6px 12px;
  background-color: #10b981; /* 绿色 */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.btn-add:hover {
  opacity: 0.85;
}

</style>
