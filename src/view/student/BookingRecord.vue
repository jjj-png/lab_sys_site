<template>
  <div class="container py-5">
    <h1 class="mb-4">预约记录</h1>
    
    <div class="mb-4">
      <div class="btn-group">
        <button 
          class="btn btn-primary" 
          :class="{ 'active': currentStatus === 'all' }"
          @click="filterByStatus('all')"
        >
          全部
        </button>
        <button 
          class="btn btn-primary" 
          :class="{ 'active': currentStatus === 'pending' }"
          @click="filterByStatus('pending')"
        >
          待审核
        </button>
        <button 
          class="btn btn-primary" 
          :class="{ 'active': currentStatus === 'approved' }"
          @click="filterByStatus('approved')"
        >
          已通过
        </button>
        <button 
          class="btn btn-primary" 
          :class="{ 'active': currentStatus === 'rejected' }"
          @click="filterByStatus('rejected')"
        >
          已拒绝
        </button>
        <button 
          class="btn btn-primary" 
          :class="{ 'active': currentStatus === 'completed' }"
          @click="filterByStatus('completed')"
        >
          已完成
        </button>
      </div>
    </div>
    
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>预约ID</th>
            <th>实验室</th>
            <th>预约日期</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in filteredBookings" :key="booking.id">
            <td>{{ booking.id }}</td>
            <td>{{ booking.labName }}</td>
            <td>{{ formatDate(booking.date) }}</td>
            <td>{{ booking.startTime }}</td>
            <td>{{ booking.endTime }}</td>
            <td>
              <span class="badge" :class="getStatusBadgeClass(booking.status)">
                {{ getStatusText(booking.status) }}
              </span>
            </td>
            <td>
              <button 
                class="btn btn-sm btn-danger" 
                :disabled="!canCancel(booking.status)"
                @click="cancelBooking(booking.id)"
              >
                取消
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="!filteredBookings.length && !loading" class="text-center py-5">
      <p class="text-muted">暂无预约记录</p>
    </div>
    
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const bookings = ref([])
    const currentStatus = ref('all')
    const loading = ref(false)
    const error = ref(null)
    const userId = localStorage.getItem('userId') || 1 // 模拟用户ID
    
    // 获取用户预约记录
    const fetchBookings = async () => {
      loading.value = true
      error.value = null
      
      try {
        // 模拟API调用，实际项目中应替换为真实API
        const response = await axios.get('/api/booking/student', {
          params: { userId }
        })
        bookings.value = response.data.data || []
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    
    // 按状态筛选
    const filterByStatus = (status) => {
      currentStatus.value = status
    }
    
    // 获取筛选后的预约记录
    const filteredBookings = computed(() => {
      if (currentStatus.value === 'all') {
        return bookings.value
      }
      
      return bookings.value.filter(booking => booking.status === currentStatus.value)
    })
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'pending': '待审核',
        'approved': '已通过',
        'rejected': '已拒绝',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    }
    
    // 获取状态徽章样式
    const getStatusBadgeClass = (status) => {
      const statusClassMap = {
        'pending': 'bg-warning',
        'approved': 'bg-success',
        'rejected': 'bg-danger',
        'completed': 'bg-info',
        'cancelled': 'bg-secondary'
      }
      return statusClassMap[status] || 'bg-secondary'
    }
    
    // 判断是否可以取消预约
    const canCancel = (status) => {
      return status === 'pending' || status === 'approved'
    }
    
    // 取消预约
    const cancelBooking = async (bookingId) => {
      if (confirm('确定要取消这个预约吗？')) {
        try {
          await axios.put(`/api/booking/cancel/${bookingId}`)
          fetchBookings()
          alert('预约已取消')
        } catch (err) {
          alert(err.message || '取消失败，请重试')
        }
      }
    }
    
    onMounted(() => {
      fetchBookings()
    })
    
    return {
      bookings,
      currentStatus,
      loading,
      error,
      filteredBookings,
      formatDate,
      getStatusText,
      getStatusBadgeClass,
      canCancel,
      filterByStatus,
      cancelBooking
    }
  }
}
</script>

<style scoped>
/* 样式保持不变 */
</style>