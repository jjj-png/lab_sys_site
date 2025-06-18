<template>
  <div class="student-home">
    <!-- 主卡片 -->
    <el-card class="user-info-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>用户信息</span>
        </div>
      </template>

      <el-row :gutter="20" align="middle">
        <el-col :sm="8" :xs="24" class="avatar-col">
          <el-avatar :size="100" :src="user?.avatar">
            <el-icon :size="50"><User /></el-icon>
          </el-avatar>
        </el-col>

        <el-col :sm="16" :xs="24">
          <el-descriptions
            :title="'欢迎您，' + (user?.name || '同学')"
            :column="1"
            border
          >
            <el-descriptions-item label="邮箱">
              {{ user?.email || '暂无' }}
            </el-descriptions-item>
            <el-descriptions-item label="角色">
              <el-tag>{{ user?.role || '未知' }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  ElCard,
  ElRow,
  ElCol,
  ElAvatar,
  ElDescriptions,
  ElDescriptionsItem,
  ElTag,
  ElIcon
} from 'element-plus';
import { User } from '@element-plus/icons-vue';
import { type loginResponse } from '../../type'; 

const user = ref<loginResponse | null>(null);

onMounted(() => {
  try {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      user.value = JSON.parse(userInfoString);
    }
  } catch (error) {
    console.error('解析用户信息失败:', error);
  }
});
</script>

<style scoped>
.student-home {
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  padding: 2rem;
  min-height: calc(100vh - 100px);
  background-color: #f5f7fa; /* 添加一个浅灰色背景，让卡片更突出 */
}

.user-info-card {
  max-width: 800px;
  width: 100%;
}

.card-header {
  font-size: 1.2rem;
  font-weight: bold;
}

.avatar-col {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem; /* 在小屏幕上堆叠时，为头像下方增加间距 */
}

@media (min-width: 768px) {
  .avatar-col {
    margin-bottom: 0;
  }
}
</style>