<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <aside class="sider" :class="{ collapsed }">
      <h2 class="logo">实验室管理员系统</h2>

      <nav>
        <router-link to="/lab-admin/home" class="menu" active-class="active">系统首页</router-link>
        <router-link to="/lab-admin/labs" class="submenu">实验室信息</router-link>

        <router-link to="/lab-admin/records" class="submenu">预约记录</router-link>
      </nav>

      <button class="collapse-btn" @click="collapsed = !collapsed">
        {{ collapsed ? '▶' : '◀' }}
      </button>
    </aside>

    <!-- 主体 -->
    <section class="main">
      <header class="header">
        
        <div class="user-info">
          <span>实验室管理员</span>
          <button class="logout-btn" @click="logout">退出</button>
        </div>
      </header>

      <!-- 子路由渲染 -->
      <router-view class="page-view" />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const collapsed = ref(false)
const router = useRouter()
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
/* 布局 */
.layout {
  display: flex;
  height: 100vh;
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

/* 用户信息和退出按钮 */
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.logout-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #d9363e;
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

/* 图标旋转 */
.sider.collapsed .collapse-btn {
  transform: rotate(180deg);
}

/* 主体区域 */
.main {
  flex: 1;
  background: #f6f8fa;
  display: flex;
  flex-direction: column;
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
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>