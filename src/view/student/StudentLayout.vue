<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">实验室预约系统</div>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-user"></i> 学生中心 <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人信息</el-dropdown-item>
              <el-dropdown-item command="settings">账户设置</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 侧边栏导航 -->
    <div class="sidebar">
      <el-menu 
        :default-active="activeMenu" 
        class="el-menu-vertical-demo"
        background-color="#1e2538"
        text-color="#fff"
        active-text-color="#409EFF">
        <el-menu-item index="/student/home">
          <i class="el-icon-s-home"></i>
          <span slot="title">系统首页</span>
        </el-menu-item>
        <el-menu-item index="/student/book-lab">
          <i class="el-icon-s-order"></i>
          <span slot="title">预约实验室</span>
        </el-menu-item>
        <el-menu-item index="/student/booking-record">
          <i class="el-icon-document"></i>
          <span slot="title">预约记录</span>
        </el-menu-item>
        <el-menu-item index="/student/profile">
          <i class="el-icon-user"></i>
          <span slot="title">个人信息</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/student/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ breadcrumbLabel }}</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 内容区域 -->
      <div class="content-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 动态计算面包屑标签
const breadcrumbLabel = computed(() => {
  const labelMap = {
    'StudentHome': '系统首页',
    'BookLab': '预约实验室',
    'BookingRecord': '预约记录',
    'StudentProfile': '个人信息'
  }
  return labelMap[route.name] || route.name
})

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    // 处理退出登录逻辑
    router.push('/login')
  } else {
    router.push(`/student/${command}`)
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  height: 60px;
  background-color: #1e2538;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left .logo {
  font-size: 20px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  color: white;
  cursor: pointer;
}

.sidebar {
  width: 200px;
  background-color: #1e2538;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
}

.breadcrumb {
  margin-bottom: 20px;
}

.content-container {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>