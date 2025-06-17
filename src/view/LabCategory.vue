<template>
  <div class="category-page">
    <div class="card-grid">
      <div class="card" v-for="cat in categories" :key="cat.id">
        <img :src="cat.image" :alt="cat.name" />
        <div class="card-body">
          <h3>{{ cat.name }}</h3>
          <p>{{ cat.description }}</p>
          <p class="count">实验室数量：{{ cat.count }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

/* ① 图片映射表 —— typeId 对应图片 */
import imgComputer    from '@/assets/computer.jpg'
import imgElectronics from '@/assets/electronics.jpg'
import imgChemistry   from '@/assets/chemistry.jpg'

/* ② typeId ↔ 图片映射表 */
const imgMap = {
  1: imgComputer,
  2: imgElectronics,
  3: imgChemistry
}
/* ② 分类数据由后端返回 */
const categories = ref([])

const load = async () => {
  const { data } = await axios.get('/api/category')   // <- 对应后端
  categories.value = data.map(cat => ({
    id:   cat.typeId,
    name: cat.typeName,
    description: `共有 ${cat.labs.length} 个实验室`,
    image: imgMap[cat.typeId] || '',   // 没配图时给空
    count: cat.labs.length
  }))
}

onMounted(load)
</script>


<style scoped>
.category-page {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}




.card-grid {
  display: flex;         /* 横向排列 */
  gap: 10px;
  justify-content: center;  /* 居中排列，可选 */
  flex-wrap: nowrap;
  margin-top: 150px; /* 👈 让卡片整体往下移动 */
}


.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
  transition: 0.3s;
   width: 250px;  
}

.card:hover {
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.card-body {
  padding: 1px;
}

.count {
  font-weight: bold;
  color: #007bff;
}
</style>
