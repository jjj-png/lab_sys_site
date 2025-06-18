<template>
  <div class="table-container">
    <el-table :data="allLabs" stripe style="width: 100%" max-height="600">
      <el-table-column prop="labName" label="实验室名称" width="120" />
      <el-table-column prop="roomNumber" label="地点" width="100" />
      <el-table-column prop="description" label="实验室描述" width="200" />
      <el-table-column prop="startTime" label="开始时间" width="150" />
      <el-table-column prop="endTime" label="结束时间" width="150" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <!-- 点击报修按钮，触发 openRepairDialog 方法 -->
          <el-button link type="primary" size="small" @click="openRepairDialog(scope.row)">
            报修
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 报修描述对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="提交报修申请"
      width="500px"
      :before-close="handleClose"
    >
      <p style="margin-bottom: 1rem;">
        您正在为实验室
        <el-tag type="info">{{ currentLab.labName }}</el-tag>
        提交报修。
      </p>
      <el-input
        v-model="repairDescription"
        type="textarea"
        :rows="4"
        placeholder="请详细描述设备故障或需要维修的情况..."
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitRepair"
            :loading="isSubmitting"
          >
            确认提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus'; // 引入 ElMessage
import { type loginResponse, type LabInfo, type RepairInfo } from '../../type';

const allLabs = ref<LabInfo[]>([]);
const userInfo = ref<loginResponse>();

const dialogVisible = ref(false);
const repairDescription = ref('');
const isSubmitting = ref(false); 
const currentLab = ref<Partial<LabInfo>>({}); 

const getAvailableLabs = async () => {
  try {
    const response = await axios.get('/api/labs/all');
    allLabs.value = response.data;
  } catch (error) {
    console.error(error);
    ElMessage.error('获取实验室列表失败');
  }
};

onMounted(() => {
  const userData = localStorage.getItem('userInfo');
  if (userData) {
    userInfo.value = JSON.parse(userData);
  }
  getAvailableLabs();
});

const getLabById = async (labId: number) => {
  try {
    const response = await axios.get(`/api/labs/${labId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    ElMessage.error('获取实验室详情失败');
  }
};

const updateLabStatus = async (labId: number, status: number) => {
  try {
    const selectedLab = await getLabById(labId);
    if (!selectedLab) {
      ElMessage.error('未找到要更新的实验室信息');
      return;
    }
    selectedLab.status = status;
    await axios.put(`/api/labs/${labId}`, selectedLab);
    getAvailableLabs();
  } catch (error) {
    console.error(error);
    ElMessage.error('更新实验室状态失败');
  }
};

/**
 * 点击“报修”按钮时触发，用于打开对话框
 * @param lab - 表格行数据对象
 */
const openRepairDialog = (lab: LabInfo) => {
  currentLab.value = lab;      
  repairDescription.value = ''; 
  dialogVisible.value = true;  
};

const submitRepair = async () => {
  if (!repairDescription.value.trim()) {
    ElMessage.warning('报修描述不能为空！');
    return;
  }
  if (!userInfo.value || !currentLab.value.labId || !currentLab.value.labAdminId) {
    ElMessage.error('用户信息或实验室信息丢失，无法提交');
    return;
  }

  isSubmitting.value = true; // 开始提交，按钮显示加载状态

  try {
    // 构造报修信息
    const now = new Date().toISOString();
    const repairData: Omit<RepairInfo, 'repairId' | 'createTime'> = {
      userId: userInfo.value.userId,
      labId: currentLab.value.labId,
      status: 1, // 表示“待处理”
      adminId: currentLab.value.labAdminId,
      description: repairDescription.value, // 使用用户输入的描述
      createdAt: now,
      updatedAt: now,
      repairTime: now,
    };

    // 发送POST请求
    await axios.post('/api/repair', repairData);

    await updateLabStatus(currentLab.value.labId, 2);

    ElMessage.success('报修成功！');
    dialogVisible.value = false; 

  } catch (error) {
    console.error(error);
    ElMessage.error('报修提交失败，请稍后重试。');
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * 对话框关闭前的回调
 */
const handleClose = (done: () => void) => {
  if (repairDescription.value.trim()) {
    ElMessageBox.confirm('您有未提交的报修内容，确定要关闭吗？')
      .then(() => {
        done();
      })
      .catch(() => {
      });
  } else {
    done();
  }
};

</script>

<style scoped>
.table-container {
  padding: 20px;
}
</style>