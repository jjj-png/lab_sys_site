<template>
  <div class="page">
    <h2>用户积分管理</h2>

    <!-- 用户积分表格 -->
    <table class="table">
      <thead>
        <tr>
          <th>ID</th><th>用户名</th><th>姓名</th><th>积分</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="users.length === 0">
          <td colspan="5">暂无数据</td>
        </tr>
        <tr v-for="user in users" :key="user.userId">
          <td>{{ user.userId }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.name }}</td>
          <td>
            <input v-model.number="user.points" type="number" class="point-input" />
          </td>
          <td>
            <button @click="updatePoints(user)">保存</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h2 style="margin-top: 40px;">可兑换物品</h2>
    <div class="items">
      <div v-for="item in items" :key="item.id" class="item">
        <img :src="item.image" :alt="item.name" class="item-image" />
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
        <p class="cost">兑换所需积分：{{ item.points }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/Util/request'
import mousepadImg from '@/assets/mousepad.jpg'
import usbImg from '@/assets/usb.jpg'
import cupImg from '@/assets/cup.jpg'
import earphoneImg from '@/assets/earphone.jpg' 
const users = ref([])

const items = ref([
  { id: 1, name: '鼠标垫', description: '实验室定制鼠标垫一个', points: 100, image: mousepadImg },
  { id: 2, name: 'U盘 32GB', description: '高速 USB3.0 接口', points: 300, image: usbImg },
  { id: 3, name: '定制水杯', description: '实验室 logo 保温杯', points: 200, image: cupImg },
  { id: 4, name: '耳机', description: '有线入耳式耳机', points: 500, image: earphoneImg }
])

const loadUsers = async () => {
  const res = await request.get('/user') // 获取所有用户数据
  const allUsers = Array.isArray(res.data.data) ? res.data.data : res.data
  users.value = allUsers.filter(u => u.role === 1) // 仅保留学生
}
const updatePoints = async (user) => {
  try {
    await request.put(`/user/${user.userId}`, {
      ...user, // 如果后端要求密码，前端可置空避免修改
    })
    alert('积分更新成功')
  } catch (e) {
    alert('更新失败')
  }
}





onMounted(loadUsers)
</script>

<style scoped>
.page {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}
.table th, .table td {
  border: 1px solid #e5e5e5;
  padding: 8px;
  text-align: center;
  font-size: 14px;
}
.point-input {
  width: 80px;
  padding: 4px;
  text-align: center;
}

.items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}
.item {
  flex: 1 1 200px;
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
}
.cost {
  font-weight: bold;
  color: #e67300;
}
.item-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.item-card {
  width: 200px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  background: #fff;
}

.item-image {
  width: 100%;
  height: 120px;
  object-fit: contain;
  margin-bottom: 12px;
}

</style>
