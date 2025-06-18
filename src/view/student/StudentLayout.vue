<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <aside class="sider" :class="{ collapsed }">
      <h2 class="logo">实验室预约系统</h2>

      <nav>
        <router-link to="/student/home" class="menu" active-class="active">用户首页</router-link>

        <div class="group-title">预约管理</div>
        <router-link to="/student/lab-apply" class="submenu">实验室预约</router-link>

        <div class="group-title">报修管理</div>
        <router-link to="/student/repair" class="submenu">学生报修</router-link>
      </nav>

      <button class="collapse-btn" @click="collapsed = !collapsed">
        {{ collapsed ? '▶' : '◀' }}
      </button>
    </aside>

    <!-- 主体 -->
    <section class="main">
      <header class="header">
      <span>首页 &gt; 用户首页</span>
      <span>学生</span>
      </header>

      <!-- 子路由渲染 -->
      <router-view class="page-view" />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const collapsed = ref(false)
</script>

<style scoped>
/* 布局 */
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
