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
          <el-button link type="primary" size="small" @click="openReservationDialog(scope.row)">预约</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      title="提交预约申请"
      width="500px"
    >
      <p style="margin-bottom: 1rem;">
        您正在预约实验室
        <el-tag type="info">{{ currentLab.labName }}</el-tag>
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitReservation"
            :loading="isSubmitting"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import request from '@/Util/request'
import { ElMessage } from 'element-plus';
import { type loginResponse, type LabInfo, type ReservationInfo } from '../../type'

const availableLabs = ref<LabInfo[]>([])
const userInfo = ref<loginResponse>()

const dialogVisible = ref(false);
const isSubmitting = ref(false); 
const currentLab = ref<Partial<LabInfo>>({}); 

const getAvailableLabs = async () => {
  try {
    const response = await request.get('/labs/available')
    availableLabs.value = response.data
  } catch (error) {
    console.error(error)
    ElMessage.error('获取实验室信息失败')
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
    const response = await request.get(`/labs/${labId}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
    ElMessage.error('获取实验室详情失败')
  }
}

const updateLabStatus = async (labId: number, status: number) => {
  try {
    const selectedLab = await getLabById(labId)
    if (!selectedLab) {
      ElMessage.error('实验室信息未找到')
      return
    }
    selectedLab.status = status
    await request.put(`/labs/${labId}`, selectedLab)
    getAvailableLabs()
  } catch (error) {
    ElMessage.error(error)
  }
}

const openReservationDialog = (lab: LabInfo) => {
  currentLab.value = lab;
  dialogVisible.value = true;
}

const submitReservation = async () => {
  if (!userInfo.value || !currentLab.value.labId || !currentLab.value.labAdminId) {
    ElMessage.error('用户信息或实验室信息丢失，无法预约');
    return;
  }

  isSubmitting.value = true;
  try {
    const now = new Date().toISOString();
    const reserveData: Omit<ReservationInfo, 'reservationId' | 'equipmentStatus'> = {
      userId: userInfo.value.userId,
      labId: currentLab.value.labId,
      operationTime: now,
      status: 1,
      labAdminId: currentLab.value.labAdminId,
      createdAt: now,
      updatedAt: now
    };

    await request.post('/reserve', reserveData);
    await updateLabStatus(currentLab.value.labId, 2);

    ElMessage.success('预约成功');
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error('预约失败，请稍后再试');
  } finally {
    isSubmitting.value = false;
  }
}
</script>
