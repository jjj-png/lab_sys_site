<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <aside class="sider" :class="{ collapsed }">
      <h2 class="logo">实验室预约系统</h2>

      <nav>
        <router-link to="/admin/home" class="menu" active-class="active">系统首页</router-link>

        <div class="group-title">用户管理</div>
        <router-link to="/admin/users" class="submenu">系统管理员</router-link>
        <router-link to="/admin/lab-admin" class="submenu">实验室管理员</router-link>
        <router-link to="/admin/students" class="submenu">学生信息</router-link>

        <div class="group-title">信息管理</div>
        <router-link to="/admin/notice" class="submenu">公告信息</router-link>
        <router-link to="/admin/category" class="submenu">实验室分类</router-link>
        <router-link to="/admin/labs" class="submenu">实验室信息</router-link>
        <router-link to="/admin/records" class="submenu">预约记录</router-link>
        <router-link to="/admin/repairs" class="submenu">报修记录</router-link>
        <router-link to="/admin/points" class="submenu">积分信息</router-link>  
      </nav>

      <button class="collapse-btn" @click="collapsed = !collapsed">
        {{ collapsed ? '▶' : '◀' }}
      </button>
    </aside>
//
    <!-- 主体 -->
    <section class="main">
      <header class="header">
      <span>首页 &gt;  {{ currentTitle }}</span>
      <span>欢迎，{{ username }}</span>
      <button class="logout-btn" @click="logout">退出</button>
</header>

      <!-- 子路由渲染 -->
      <router-view class="page-view" />
    </section>
  </div>
</template>

<script setup>
import { ref ,computed} from 'vue'
import { useRouter,useRoute } from 'vue-router'

const collapsed = ref(false)
const router = useRouter()
const route = useRoute()

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const username = userInfo.username || '未知用户'


const logout = () => {
  localStorage.removeItem('token')
  // 跳转到登录页
  router.push('/login')
}
const titleMap = {
 '/admin/home': '系统首页',
  '/admin/users': '系统管理员',
  '/admin/lab-admin': '实验室管理员',
  '/admin/students': '学生信息',
  '/admin/notice': '公告信息',
  '/admin/category': '实验室分类',
  '/admin/labs': '实验室信息',
  '/admin/records': '预约记录',
  '/admin/repairs': '报修记录',
  '/admin/points': '积分信息',
}
const currentTitle = computed(() => {
  return titleMap[route.path] || '未知页面'
})

</script>

<style scoped>
/* 布局 */
/* 布局 */
.layout {
  display: flex;
  height: 100vh;
  width: 100;
}

/* 侧边栏 */
.sider {
  width: 220px;
  transition: width 0.3s ease;
  background: linear-gradient(180deg, #0080ff, #0073e6);
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.sider.collapsed {
  width: 60px;
}

.logo {
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

nav {
  flex: 1;
  overflow-y: auto;
}

.menu,
.submenu {
  display: block;
  padding: 10px 16px;
  color: #fff;
  text-decoration: none;
  transition: background 0.2s, padding-left 0.3s;
}

.menu:hover,
.submenu:hover {
  background: rgba(255, 255, 255, 0.15);
  padding-left: 22px;
}

.menu.active,
.submenu.active {
  background: rgba(255, 255, 255, 0.25);
  font-weight: bold;
}

.group-title {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: bold;
  margin-top: 12px;
  opacity: 0.85;
}

/* 折叠按钮 */
.collapse-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  padding: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

/* 图标旋转（可选） */
.sider.collapsed .collapse-btn {
  transform: rotate(180deg);
}

/* 主体区域 */
.main {
  flex: 1;
  background: #f6f8fa;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header {
  background: #fff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.page-view {
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: block;
  
  
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  padding: 10px 20px;
  font-size: 14px;
}

.header .right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logout-btn {
  padding: 4px 10px;
  background-color: #f56c6c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #dd4b39;
}
</style>



