<template>
  <router-view />
</template>

<script setup>
// 暂时不需要引入逻辑
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
}
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 关键：确保撑满整个视口高度 */
}

.page-view {
  flex: 1;
  overflow: auto;
  padding: 24px;
  background-color: #fff; /* 可选 */
}
</style>
