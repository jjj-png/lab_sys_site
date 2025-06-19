<template>
  <div class="page">
    <h2>实验室信息表单</h2>

    <div class="form-container">
      <input v-model="form.lab_name" placeholder="实验室名称" />
      <textarea v-model="form.description" placeholder="实验室描述"></textarea>
      <input v-model="form.room_number" placeholder="房间号" />

      <div class="actions">
        <button @click="save">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import request from '@/Util/request'
const form = reactive({
  lab_name: '',
  description: '',
  room_number: ''
})

const save = async () => {
  const payload = { ...form }
  await request.post('/lab-admin/lab-info', payload)
}
</script>

<style scoped>
.page {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.form-container input,
.form-container textarea {
  padding: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-container input:focus,
.form-container textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-container textarea {
  min-height: 150px;
  resize: vertical;
}

.actions button {
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.actions button:hover {
  background-color: #0056b3;
}
</style>