<!-- components/forms/SearchForm.vue -->
<template>
  <div class="search-form">
    <div class="input-group">
      <input 
        type="text" 
        v-model="query" 
        placeholder="搜索实验室名称、类型" 
        class="form-control"
      >
      <button 
        class="btn btn-primary" 
        @click="handleSearch"
      >
        <i class="fas fa-search"></i> 搜索
      </button>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const query = ref('')
    
    const handleSearch = () => {
      this.$emit('search', query.value)
    }
    
    return {
      query,
      handleSearch
    }
  }
}
</script>

<style scoped>
.search-form {
  display: flex;
  gap: 10px;
}

.form-control {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}
</style>