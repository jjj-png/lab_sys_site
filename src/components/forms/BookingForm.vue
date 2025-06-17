<!-- components/forms/BookingForm.vue -->
<template>
  <div class="booking-form">
    <div class="form-group">
      <label for="bookingDate">预约日期</label>
      <input 
        type="date" 
        id="bookingDate" 
        v-model="form.date" 
        class="form-control"
        required
      >
    </div>
    
    <div class="form-group">
      <label for="startTime">开始时间</label>
      <input 
        type="time" 
        id="startTime" 
        v-model="form.startTime" 
        class="form-control"
        required
      >
    </div>
    
    <div class="form-group">
      <label for="endTime">结束时间</label>
      <input 
        type="time" 
        id="endTime" 
        v-model="form.endTime" 
        class="form-control"
        required
      >
    </div>
    
    <div class="form-group">
      <label for="purpose">预约目的</label>
      <textarea 
        id="purpose" 
        v-model="form.purpose" 
        rows="3" 
        class="form-control"
        placeholder="请填写预约实验室的目的"
        required
      ></textarea>
    </div>
    
    <div class="form-group">
      <label for="participantCount">参与人数</label>
      <input 
        type="number" 
        id="participantCount" 
        v-model.number="form.participantCount" 
        class="form-control"
        min="1"
        required
      >
    </div>
    
    <div class="form-actions">
      <button 
        class="btn btn-primary" 
        @click="submitForm"
      >
        提交预约
      </button>
      <button 
        class="btn btn-secondary" 
        @click="cancelForm"
      >
        取消
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lab: {
      type: Object,
      required: true
    }
  },
  
  setup(props) {
    const form = {
      date: '',
      startTime: '09:00',
      endTime: '11:00',
      purpose: '',
      participantCount: 1
    }
    
    const submitForm = () => {
      // 简单验证
      if (!form.date || !form.startTime || !form.endTime) {
        alert('请填写完整的预约信息')
        return
      }
      
      if (form.startTime >= form.endTime) {
        alert('结束时间必须晚于开始时间')
        return
      }
      
      // 传递表单数据给父组件
      this.$emit('submit', {
        ...form,
        labId: props.lab.id,
        labName: props.lab.name
      })
    }
    
    const cancelForm = () => {
      this.$emit('cancel')
    }
    
    return {
      form,
      submitForm,
      cancelForm
    }
  }
}
</script>

<style scoped>
.booking-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-control {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}
</style>