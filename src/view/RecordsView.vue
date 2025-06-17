<template>
  <div class="record-page">
    <h2>实验室预约记录</h2>

    <table class="record-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>预约人</th>
          <th>实验室</th>
          <th>操作时间</th>
          <th>状态</th>
          <th>设备状态</th>
          <th>创建时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rec in paginated" :key="rec.reservationId">
          <td>{{ rec.reservationId }}</td>
          <td>{{ rec.userName }}</td>
          <td>{{ rec.labName }}</td>
          <td>{{ rec.operationTime || '-' }}</td>
          <td>
            <span :class="'tag status-' + rec.status">
              {{ statusText(rec.status) }}
            </span>
          </td>
          <td>{{ rec.equipmentStatus || '-' }}</td>
          <td>{{ rec.createdAt }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 简易分页 -->
    <div class="pagination">
      <button :disabled="page===1" @click="page--">上一页</button>
      <button v-for="i in totalPages" :key="i"
              :class="{active: page===i}"
              @click="page=i">{{ i }}</button>
      <button :disabled="page===totalPages" @click="page++">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const records = ref([])
const page = ref(1)
const pageSize = 8

const loadRecords = async () => {
  const { data } = await axios.get('/api/reservations')
  records.value = data
}
onMounted(loadRecords)

const totalPages = computed(() => Math.ceil(records.value.length / pageSize))
const paginated = computed(() => {
  const start = (page.value - 1) * pageSize
  return records.value.slice(start, start + pageSize)
})

const statusText = s =>
  ({ 1: '待处理', 2: '已批准', 3: '已拒绝' }[s] || '未知')
</script>

<style scoped>
.record-page { padding: 20px 10px; }
.record-table{ width:100%; border-collapse:collapse; margin-top:10px }
.record-table th, .record-table td{
  border:1px solid #eee; padding:8px; text-align:center; white-space:nowrap
}
.record-table th{ background:#f6f8fa; font-weight:600 }
.tag{ padding:2px 8px; border-radius:4px; color:#fff; font-size:12px }
.status-1{ background:#f59e0b }   /* 待处理-橙色 */
.status-2{ background:#10b981 }   /* 已批准-绿色 */
.status-3{ background:#ef4444 }   /* 已拒绝-红色   */
.pagination{ margin:15px 0; text-align:center }
.pagination button{ margin:0 3px; padding:4px 10px }
.pagination .active{ background:#3b82f6; color:#fff }
</style>
