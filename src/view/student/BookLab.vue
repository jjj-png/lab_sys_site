<template>
  <div class="book-lab-container">
    <el-card shadow="hover" class="search-card">
      <div class="search-header">实验室预约</div>
      <div class="search-content">
        <el-form :model="searchForm" ref="searchFormRef" label-width="100px" class="demo-form-inline">
          <el-form-item label="实验室类型">
            <el-select v-model="searchForm.category" placeholder="请选择实验室类型">
              <el-option label="计算机实验室" value="computer"></el-option>
              <el-option label="物理实验室" value="physics"></el-option>
              <el-option label="化学实验室" value="chemistry"></el-option>
              <el-option label="生物实验室" value="biology"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预约日期">
            <el-date-picker
              v-model="searchForm.date"
              type="date"
              placeholder="选择日期"
              :picker-options="dateOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchLabs">查询可用实验室</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card shadow="hover" class="lab-list-card">
      <div class="card-header">
        <div class="header-title">可用实验室列表</div>
        <div class="header-count">共 {{ labList.length }} 个实验室</div>
      </div>
      
      <el-table :data="labList" stripe border style="width: 100%">
        <el-table-column prop="name" label="实验室名称"></el-table-column>
        <el-table-column prop="category" label="实验室类型"></el-table-column>
        <el-table-column prop="capacity" label="容量"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              @click="showBookingDialog(scope.row)"
              :disabled="scope.row.status !== '可用'">
              预约
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination" style="margin-top: 20px; text-align: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 预约对话框 -->
    <el-dialog :visible.sync="bookingDialogVisible" title="实验室预约">
      <template #content>
        <el-form :model="bookingForm" ref="bookingFormRef" label-width="120px">
          <el-form-item label="实验室名称" :label-width="formLabelWidth">
            <el-input v-model="bookingForm.labName" disabled></el-input>
          </el-form-item>
          <el-form-item label="预约日期" :label-width="formLabelWidth">
            <el-input v-model="bookingForm.date" disabled></el-input>
          </el-form-item>
          <el-form-item label="预约时间段" :label-width="formLabelWidth">
            <el-radio-group v-model="bookingForm.timeSlot">
              <el-radio v-for="slot in timeSlots" :label="slot.value" :key="slot.value">{{ slot.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="预约原因" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="bookingForm.reason" :rows="4"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="bookingDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBooking">提交预约</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 搜索表单
const searchForm = reactive({
  category: '',
  date: new Date()
})

// 日期选择器选项
const dateOptions = {
  disabledDate(time) {
    // 禁止选择过去的日期
    return time.getTime() < Date.now() - 8.64e7;
  }
}

// 实验室列表数据
const labList = ref([
  { id: 1, name: '计算机实验室A', category: '计算机实验室', capacity: 50, status: '可用' },
  { id: 2, name: '物理实验室B', category: '物理实验室', capacity: 30, status: '已预约' },
  { id: 3, name: '化学实验室C', category: '化学实验室', capacity: 25, status: '可用' },
  { id: 4, name: '生物实验室D', category: '生物实验室', capacity: 20, status: '维护中' },
  { id: 5, name: '计算机实验室E', category: '计算机实验室', capacity: 45, status: '可用' }
])

// 分页控制
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(20)

// 预约对话框
const bookingDialogVisible = ref(false)
const bookingForm = reactive({
  labId: null,
  labName: '',
  date: '',
  timeSlot: '',
  reason: ''
})

// 时间段选项
const timeSlots = [
  { value: '09:00-11:30', label: '上午 09:00-11:30' },
  { value: '13:30-16:00', label: '下午 13:30-16:00' },
  { value: '18:30-21:00', label: '晚上 18:30-21:00' }
]

const formLabelWidth = ref('120px')

// 根据状态返回标签类型
const getStatusType = (status) => {
  switch (status) {
    case '可用':
      return 'success'
    case '已预约':
      return 'warning'
    case '维护中':
      return 'danger'
    default:
      return 'default'
  }
}

// 搜索实验室
const searchLabs = () => {
  console.log('搜索实验室:', searchForm)
  // 这里添加实际的搜索逻辑
}

// 处理分页变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 显示预约对话框
const showBookingDialog = (lab) => {
  bookingForm.labId = lab.id
  bookingForm.labName = lab.name
  bookingForm.date = formatDate(searchForm.date)
  bookingForm.timeSlot = timeSlots[0].value
  bookingForm.reason = ''
  bookingDialogVisible.value = true
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

// 提交预约
const submitBooking = () => {
  console.log('提交预约:', bookingForm)
  // 这里添加实际的提交逻辑
  
  // 模拟提交成功
  bookingDialogVisible.value = false
  alert('预约提交成功！')
}

// 页面加载时初始化
onMounted(() => {
  // 可以在这里添加页面初始化逻辑
})
</script>

<style scoped>
.book-lab-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-card {
  padding: 20px;
}

.search-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.lab-list-card {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.header-count {
  color: #606266;
}
</style>