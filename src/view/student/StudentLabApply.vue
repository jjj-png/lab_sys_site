<template>
  <div class="tableContainer">
    <el-table :data="availableLabs" stripe style="width: 100%" max-height="600">
      <el-table-column prop="labName" label="实验室名称" width="120" />
      <el-table-column prop="roomNumber" label="地点" width="100" />
      <el-table-column prop="description" label="实验室描述" width="200" />
      <el-table-column prop="startTime" label="开始时间" width="150" />
      <el-table-column prop="endTime" label="结束时间" width="150" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleReservation(scope.row.labId, scope.row.labAdminId)">预约</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { type loginResponse, type LabInfo, type ReservationInfo } from '../../type'

const availableLabs = ref<LabInfo[]>([])
const userInfo = ref<loginResponse>()

const getAvailableLabs = async () => {
  try {
    const response = await axios.get('/api/labs')
    availableLabs.value = response.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(
  () => {
    const userData = localStorage.getItem('userInfo')
    if (userData) {
      userInfo.value = JSON.parse(userData)
    }
    getAvailableLabs()
  }
)

const getLabById = async (labId: number) => {
  try {
    const response = await axios.get(`/api/labs/${labId}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

const updateLabStatus = async (labId: number, status: number) => {
  try {
    const selectedLab = await getLabById(labId)
    if (!selectedLab) {
      console.error('实验室信息未找到')
      return
    }
    selectedLab.status = status
    const response = await axios.put(`/api/labs/${labId}`, selectedLab)
    console.log(response.data)
    getAvailableLabs()
  } catch (error) {
    console.error(error)
  }
}

const handleReservation = async (labId: number, labAdminId: number) => {
  try {
    if (!userInfo.value) {
      console.error('用户信息未找到')
      return
    }
    const response = await axios.post('/api/reserve', {
      userId: userInfo.value.userId,
      labId,
      labAdminId
    } as ReservationInfo)
      console.log(response.data)

      updateLabStatus(labId, 2)

    } catch (error) {
      console.error(error)
    }
}
</script>
