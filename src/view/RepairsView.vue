<template>
  <div class="repair-page">
    <h2>报修记录</h2>

    <table class="repair-table">
      <thead>
        <tr>
          <th>报修ID</th>
          <th>学生ID</th>
          <th>实验室ID</th>
          <th>报修时间</th>
          <th>状态</th>
          <th>实验室管理员ID</th>
          <th>说明</th>
          <th>创建时间</th>
          <th>更新时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.repairId">
          <td>{{ record.repairId }}</td>
          <td>{{ record.userId }}</td>
          <td>{{ record.labId }}</td>
          <td>{{ record.repairTime }}</td>
          <td>
            {{ formatStatus(record.status) }}
          </td>
          <td>{{ record.adminId || '-' }}</td>
          <td>{{ record.description || '-' }}</td>
          <td>{{ record.createdAt }}</td>
          <td>{{ record.updatedAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import request from '@/Util/request'

const records = ref([])

const loadRepairs = async () => {
  const { data } = await request.get('/repair')
  records.value = data
}

const formatStatus = (status) => {
  switch (status) {
    case 1: return '待处理'
    case 2: return '处理中'
    case 3: return '已完成'
    default: return '未知'
  }
}

onMounted(() => {
  loadRepairs()
})
</script>

<style scoped>
.repair-page {
  padding: 24px;
}

.repair-table {
  width: 100%;
  border-collapse: collapse;
}

.repair-table th,
.repair-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
</style>
