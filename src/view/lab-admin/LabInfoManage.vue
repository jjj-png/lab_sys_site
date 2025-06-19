<template>
  <div class="page">
    <h2>实验室信息列表</h2>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th><th>实验室名称</th><th>实验室描述</th><th>房间号</th><th>开始时间</th><th>结束时间</th><th>状态</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="labs.length === 0">
           <td colspan="5">暂无数据</td>
        </tr>
        <tr v-for="l in labs" :key="l.id">
          <td>{{ l.labId }}</td>
            <td>{{ l.labName }}</td>
            <td>{{ l.description || '无描述' }}</td>
            <td>{{ l.roomNumber || '-' }}</td>
            <td>{{ l.startTime || '-' }}</td>
            <td>{{ l.endTime || '-' }}</td>
            <td>{{ l.status === 1 ? '空闲中' : '使用中' }}</td>
          <td>
            <button @click="openReservationDialog(l)">新增预约</button>

          </td>
        </tr>
      </tbody>
    </table>



    <!-- 简易弹窗 -->
    <div v-if="dialog" class="dialog">
      <div class="panel">
        <h3>新增预约记录</h3>
        <input v-model="form.studentId" placeholder="学生ID" required />
          <div class="date-time-selector">
            <input type="date" v-model="form.date" required placeholder="选择日期" />
            <div class="time-selector">
              <select v-model="form.hour" required :disabled="!form.date">
                <option v-for="h in getAvailableHours()" :value="h">{{ h.toString().padStart(2, '0') }}</option>
              </select>
              <span class="time-separator">:</span>
              <select v-model="form.minute" required :disabled="!form.hour">
                <option v-for="m in getAvailableMinutes()" :value="m">{{ m.toString().padStart(2, '0') }}</option>
              </select>
            </div>
          </div>
        <input type="hidden" v-model="form.labId" />
        <input type="hidden" v-model="form.status" value="1" />

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
import request from '@/Util/request'
import { ElMessage } from 'element-plus'

const labs = ref([])
const dialog = ref(false)
const editMode = ref(false)

const labTypeMap = {
  1: '计算机实验室',
  2: '电子电路实验室',
  3: '物理实验室',
  4: '化学实验室',
  8: '数据分析实验室',
  9: '虚拟现实实验室',
  10: '机器人实验室'
}

const form = reactive({
  reservationId: null,
  studentId: '',
  labId: null,
  date: '',
  hour: 0,
  minute: 0,
  status: 1,
  labStartTime: '',
  labEndTime: ''
})

const load = async () => {
  const res = await request.get('/lab-admin/labs')
  labs.value = Array.isArray(res.data.data) ? res.data.data : res.data
}

const openAdd = () => {
  editMode.value = false
  Object.assign(form, { id: null, name: '', type: '', status: '空闲中' })
  dialog.value = true
}

const openReservationDialog = async (l) => {
  // 保存实验室时间信息
  form.labStartTime = l.startTime;
  form.labEndTime = l.endTime;
  
  // 获取最新预约ID
  const res = await request.get('/lab-admin/reservation-records')
  // 调试日志：检查返回数据结构
  console.log('原始返回数据:', res);
  console.log('预约记录数组:', res.data);
  // 确保处理的是数组，兼容可能的后端数据结构
  const records = Array.isArray(res.data) ? res.data : (res.data?.records || []);
  console.log('标准化记录数组:', records);
  console.log('记录数量:', records.length);
  // 检查可能的ID字段名（reservationId或id）
  const idField = records.length > 0 ? (records[0].reservationId !== undefined ? 'reservationId' : 'id') : 'reservationId';
  console.log('使用的ID字段名:', idField);
  // 直接使用末尾行ID加一，不排序
  const lastRecord = records[records.length - 1];
  const lastId = lastRecord ? Number(lastRecord[idField]) || 0 : 0;
  form.reservationId = lastId + 1;
  console.log('最后一条记录:', lastRecord);
  console.log('最后一条记录ID:', lastId, '生成的新预约ID:', form.reservationId);
  
  // 设置当前实验室ID
  form.labId = l.labId
  
  // 默认选择今天
  form.date = new Date().toISOString().split('T')[0];
  
  // 默认选择开始时间的小时
  if (l.startTime) {
    const startHour = parseInt(l.startTime.split(':')[0]);
    form.hour = startHour;
    form.minute = 0;
  }
  
  dialog.value = true
}

const getAvailableHours = () => {
  if (!form.labStartTime || !form.labEndTime) return [];
  
  const startHour = parseInt(form.labStartTime.split(':')[0]);
  const endHour = parseInt(form.labEndTime.split(':')[0]);
  const endMinute = parseInt(form.labEndTime.split(':')[1]);
  const hours = [];
  
  // 当结束时间包含分钟时，包含结束小时
  const upperLimit = endMinute > 0 ? endHour : endHour - 1;
  
  // 生成开始时间到结束时间（含）之间的小时选项
  for (let h = startHour; h <= upperLimit; h++) {
    hours.push(h);
  }
  
  return hours;
}

const getAvailableMinutes = () => {
  if (!form.labStartTime || !form.labEndTime || form.hour === null) return [];
  
  const startHour = parseInt(form.labStartTime.split(':')[0]);
  const startMinute = parseInt(form.labStartTime.split(':')[1]);
  const endHour = parseInt(form.labEndTime.split(':')[0]);
  const endMinute = parseInt(form.labEndTime.split(':')[1]);
  const baseMinutes = [0, 15, 30, 45];
  
  // 如果是开始小时且开始分钟为30，只允许选择30或45
  if (form.hour === startHour && startMinute === 30) {
    return [30, 45];
  }
  
  // 如果是结束小时且结束分钟为30，只允许选择0或15
  if (form.hour === endHour && endMinute === 30) {
    return [0, 15];
  }
  
  // 其他情况显示所有选项
  return baseMinutes;
}

const save = async () => {
  // 表单验证
  if (!form.studentId || !form.date || form.hour === null || form.minute === null) {
    ElMessage.warning('请填写完整的预约信息')
    return
  }

  // 组合日期和时间为ISO格式
  const operationTime = `${form.date}T${form.hour.toString().padStart(2, '0')}:${form.minute.toString().padStart(2, '0')}:00`

  try {
    // 直接使用后端完整URL测试端口和路径
    await request.post('http://localhost:8080/reserve', {
        reservationId: form.reservationId,
        userId: form.studentId,
        status: 1,
        equipmentStatus:'待检查',
      labId: form.labId,
      operationTime: operationTime,
      status: form.status
    })
    dialog.value = false
    ElMessage.success('预约记录保存成功')
    // 刷新实验室列表
    load()
  } catch (error) {
    // 增强错误信息输出
    const errorMsg = error.response ? 
      `状态码: ${error.response.status}, 响应: ${JSON.stringify(error.response.data)}` : 
      error.message;
    ElMessage.error(`保存失败: ${errorMsg}`)
    console.error('预约保存详情:', { url: '/lab-admin/records', error: error.response || error })
  }
}

const remove = async (id) => {
  if (confirm('确认删除？')) {
    await request.delete(`/lab-admin/labs/${id}`)
    await load()
  }
}

onMounted(load)
</script>

<style scoped>
.page {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}

.btn-add {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1.5rem; /* 添加上边距，与表格的上边距保持一致 */
}

.btn-add:hover {
  background-color: #218838;
}

/* 确保按钮和表格左对齐 */
.btn-add {
  display: block;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.table th {
  background-color: #007bff;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 500;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.table tr:hover {
  background-color: #f8f9fa;
}

.dialog {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.panel {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.date-time-selector {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.time-selector {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.panel input,
.panel select {
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.actions button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.actions button:nth-child(1) {
  background-color: #007bff;
  color: white;
}

.actions button:nth-child(1):hover {
  background-color: #0056b3;
}

.actions button:nth-child(2) {
  background-color: #6c757d;
  color: white;
}

.actions button:nth-child(2):hover {
  background-color: #5a6268;
}
</style>