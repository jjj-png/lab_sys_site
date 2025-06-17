<template>
  <div class="student-home-container">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card" shadow="hover">
      <div class="welcome-header">
        <div class="welcome-title">欢迎回来，{{ studentName }}</div>
        <div class="welcome-desc">今天是 {{ currentDate }}，你有 {{ pendingBookings }} 个待处理预约</div>
      </div>
      <div class="welcome-actions">
        <el-button type="primary" size="medium" @click="goToBookLab">
          <i class="el-icon-plus"></i> 立即预约实验室
        </el-button>
        <el-button type="info" size="medium" @click="goToRecord">
          <i class="el-icon-document"></i> 查看预约记录
        </el-button>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <div class="stats-container">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon">
          <i class="el-icon-s-claim"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalBookings }}</div>
          <div class="stat-label">总预约次数</div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon">
          <i class="el-icon-time"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ upcomingBookings }}</div>
          <div class="stat-label">即将进行</div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon">
          <i class="el-icon-circle-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ approvedBookings }}</div>
          <div class="stat-label">已通过</div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon">
          <i class="el-icon-circle-close"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ rejectedBookings }}</div>
          <div class="stat-label">已拒绝</div>
        </div>
      </el-card>
    </div>

    <!-- 最近预约记录 -->
    <el-card class="recent-records" shadow="hover">
      <div class="card-header">
        <div class="header-title">最近预约记录</div>
        <el-button type="text" size="small" @click="goToRecord">查看全部</el-button>
      </div>
      <el-table :data="recentBookingList" stripe style="width: 100%">
        <el-table-column prop="labName" label="实验室名称"></el-table-column>
        <el-table-column prop="bookingDate" label="预约日期"></el-table-column>
        <el-table-column prop="timeSlot" label="时间段"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟学生数据
const studentName = ref('张三')
const currentDate = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

// 统计数据
const pendingBookings = ref(2)
const totalBookings = ref(15)
const upcomingBookings = ref(3)
const approvedBookings = ref(12)
const rejectedBookings = ref(1)

// 最近预约记录
const recentBookingList = ref([
  {
    id: 1,
    labName: '计算机实验室A',
    bookingDate: '2025-06-18',
    timeSlot: '09:00-11:30',
    status: '待审核'
  },
  {
    id: 2,
    labName: '物理实验室B',
    bookingDate: '2025-06-20',
    timeSlot: '13:30-16:00',
    status: '已通过'
  },
  {
    id: 3,
    labName: '化学实验室C',
    bookingDate: '2025-06-15',
    timeSlot: '10:00-12:00',
    status: '已完成'
  }
])

// 根据状态返回标签类型
const getStatusType = (status) => {
  switch (status) {
    case '待审核':
      return 'warning'
    case '已通过':
      return 'success'
    case '已拒绝':
      return 'danger'
    case '已完成':
      return 'info'
    default:
      return 'default'
  }
}

// 导航函数
const goToBookLab = () => {
  router.push('/student/book-lab')
}

const goToRecord = () => {
  router.push('/student/booking-record')
}

// 模拟加载数据
onMounted(() => {
  // 这里可以添加实际的数据加载逻辑
})
</script>

<style scoped>
.student-home-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-card {
  padding: 20px;
  background-color: #f0f9eb;
  border-left: 5px solid #67c23a;
}

.welcome-header {
  margin-bottom: 20px;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.welcome-desc {
  font-size: 16px;
  color: #606266;
}

.welcome-actions {
  display: flex;
  gap: 20px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 36px;
  margin-right: 15px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.recent-records {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}
</style>