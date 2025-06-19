<template>
  <div class="page">
    <h2>预约记录列表</h2>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th><th>学生姓名</th><th>实验室名称</th><th>房间号</th><th>预约时间</th><th>设备状态</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="records.length === 0">
           <td colspan="6">暂无数据</td>
        </tr>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.reservationId }}</td><td>{{ r.studentName }}</td>
          <td>{{ r.labName }}</td>
          <td>{{ r.roomNumber }}</td>
          <td>{{ r.operationTime }}</td>
          <td>{{ r.equipmentStatus }}</td>
          <td>
            <button @click="cancelReservation(r.reservationId)" :disabled="r.status === '已取消'">取消预约</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/Util/request'

const toggleStatus = async (id) => {
  if (confirm('确认切换状态？')) {
    await axios.put(`/lab-admin/reservation-records/${id}/toggle-status`)
    await load()
  }
}

const records = ref([])

const load = async () => {
    const res = await request.get('/lab-admin/reservation-records')

    records.value = Array.isArray(res.data) ? res.data.map(item => ({
      ...item,
      roomNumber: item.roomNumber || '无',
        studentName: item.studentName || '未知',
        labName: item.labName || '未知'
    })) : res.data
  }

const viewDetails = (r) => {
  // 这里可以实现查看详情的逻辑，例如弹出详情弹窗
  console.log('查看详情:', r)
}

const cancelReservation = async (id) => {
  if (confirm('确认取消预约？')) {
    try {
      await request.delete(`/reserve/${id}`);
      await load();
      alert('预约已成功取消');
    } catch (error) {
      console.error('取消预约失败:', error);
      alert('取消预约失败，请重试');
    }
  }
}

onMounted(load)
</script>

<style scoped>
.page{background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,.06);}
.table{width:100%;border-collapse:collapse;margin-top:12px;}
.table th,.table td{border:1px solid #e5e5e5;padding:8px;text-align:center;font-size:14px;}
</style>