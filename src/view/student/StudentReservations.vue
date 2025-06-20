<template>
  <div class="reservations-container">
    <el-table
      v-loading="isLoading"
      :data="reservations"
      stripe
      style="width: 100%"
      max-height="700"
      empty-text="暂无预约记录"
    >
      <!-- 为了更友好地显示，我们显示实验室名称而不是ID -->
      <el-table-column prop="labId" label="实验室名称" width="180">
        <template #default="scope">
          {{ getLabName(scope.row.labId) }}
        </template>
      </el-table-column>
      
      <el-table-column prop="operationTime" label="预约提交时间" width="200">
         <template #default="scope">
          {{ formatDateTime(scope.row.operationTime) }}
        </template>
      </el-table-column>

      <el-table-column prop="status" label="预约状态" width="120">
        <template #default="scope">
          <el-tag :type="getReservationStatus(scope.row.status).type" disable-transitions>
            {{ getReservationStatus(scope.row.status).text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="equipmentStatus" label="设备状态备注" min-width="200" />
      
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <!-- 只有在特定状态下才允许取消，例如“待审核”或“已通过” -->
          <el-button 
            link 
            type="danger" 
            size="small" 
            @click="handleCancelReservation(scope.row)"
            :disabled="scope.row.status !== 1 && scope.row.status !== 2"
          >
            取消预约
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import request from '@/Util/request'; // 确保路径正确
import { ElMessage, ElMessageBox } from 'element-plus';
import type { ReservationInfo, LabInfo, loginResponse } from '../../type'; // 确保路径和类型定义正确

const isLoading = ref(true);
const reservations = ref<ReservationInfo[]>([]);
const userInfo = ref<loginResponse | null>(null);

// 创建一个Map来存储 labId -> labName 的映射，提高查找效率
const labsMap = ref<Map<number, string>>(new Map());

// 获取并处理所有数据
const fetchData = async () => {
  if (!userInfo.value) {
    ElMessage.error('无法获取用户信息，请重新登录');
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    
    // 使用 Promise.all 并发获取实验室列表和我的预约列表
    const [labResponse, reservationResponse] = await Promise.all([
      request.get<LabInfo[]>('/labs'), // 获取所有实验室用于名称映射
      request.get<ReservationInfo[]>(`/reserve/selectByUserId/${userInfo.value.userId}`)
    ]);

    // 创建 labId -> labName 的映射
    labResponse.data.forEach(lab => {
      labsMap.value.set(lab.labId, lab.labName);
    });

    // 设置预约数据
    reservations.value = reservationResponse.data;

  } catch (error) {
    console.error("获取预约数据失败:", error);
    ElMessage.error("获取预约数据失败，请稍后重试");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const userData = localStorage.getItem('userInfo');
  if (userData) {
    userInfo.value = JSON.parse(userData);
    fetchData(); // 获取到用户信息后再拉取数据
  } else {
    ElMessage.warning('请先登录以查看您的预约');
    isLoading.value = false;
  }
});

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
  } catch (error) {
    ElMessage.error(error)
  }
}

// --- Helper Functions ---

// 根据 labId 从 Map 中获取实验室名称
const getLabName = (labId: number): string => {
  return labsMap.value.get(labId) || `实验室ID: ${labId}`;
};

// 格式化ISO日期时间字符串为本地可读格式
const formatDateTime = (isoString: string): string => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString();
};

// 根据预约状态码返回文本和Element Plus的Tag类型
// 注意：这里的状态码含义是基于通用场景的假设，请根据你的后端定义进行修改
const getReservationStatus = (status: number): { text: string; type: 'success' | 'warning' | 'info' | 'danger' } => {
  switch (status) {
    case 1:
      return { text: '待审核', type: 'warning' };
    case 2:
      return { text: '已通过', type: 'success' };
    case 3:
      return { text: '已拒绝', type: 'danger' };
    case 4:
      return { text: '已完成', type: 'info' };
    case 5:
      return { text: '已取消', type: 'info' };
    default:
      return { text: '未知状态', type: 'danger' };
  }
};


// --- Action Handlers ---

const handleCancelReservation = (reservation: ReservationInfo) => {
  ElMessageBox.confirm(
    `确定要取消对【${getLabName(reservation.labId)}】的预约吗？`,
    '确认取消',
    {
      confirmButtonText: '确定',
      cancelButtonText: '再想想',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await request.delete(`/reserve/${reservation.reservationId}`);
      ElMessage.success('预约已取消');
      updateLabStatus(reservation.labId, 1); // 取消预约后，实验室状态恢复为可用
      // 刷新列表
      fetchData(); 
    } catch (error) {
      console.error("取消预约失败:", error);
      // **提示**：如果后端没有此接口，这里会报错
      ElMessage.error('操作失败，后端可能暂不支持取消功能');
    }
  }).catch(() => {
    // 用户点击了“再想想”
    ElMessage.info('操作已取消');
  });
};

</script>

<style scoped>
.reservations-container {
  padding: 20px;
}
</style>