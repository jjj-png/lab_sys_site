<template>
  <div class="profile-page">
    <div class="page-header">
      <h1>个人信息</h1>
      <button class="btn btn-primary" @click="editMode = true">编辑资料</button>
    </div>
    
    <div class="profile-card">
      <div class="avatar-section">
        <div class="avatar-container">
          <img :src="user.avatar || defaultAvatar" alt="用户头像" class="avatar">
          <button v-if="editMode" class="change-avatar-btn" @click="changeAvatar">
            <i class="fas fa-camera"></i> 更换头像
          </button>
        </div>
      </div>
      
      <div class="info-section">
        <div class="info-item">
          <label>用户名：</label>
          <span>{{ user.username }}</span>
        </div>
        <div class="info-item">
          <label>姓名：</label>
          <span v-if="!editMode">{{ user.name }}</span>
          <input v-if="editMode" v-model="form.name" type="text" class="form-input">
        </div>
        <div class="info-item">
          <label>学号：</label>
          <span v-if="!editMode">{{ user.studentId || '未填写' }}</span>
          <input v-if="editMode" v-model="form.studentId" type="text" class="form-input">
        </div>
        <div class="info-item">
          <label>电话：</label>
          <span v-if="!editMode">{{ user.phone || '未填写' }}</span>
          <input v-if="editMode" v-model="form.phone" type="text" class="form-input">
        </div>
        <div class="info-item">
          <label>邮箱：</label>
          <span v-if="!editMode">{{ user.email || '未填写' }}</span>
          <input v-if="editMode" v-model="form.email" type="text" class="form-input">
        </div>
        <div class="info-item">
          <label>院系：</label>
          <span v-if="!editMode">{{ user.department || '未填写' }}</span>
          <input v-if="editMode" v-model="form.department" type="text" class="form-input">
        </div>
        <div class="info-item">
          <label>专业：</label>
          <span v-if="!editMode">{{ user.major || '未填写' }}</span>
          <input v-if="editMode" v-model="form.major" type="text" class="form-input">
        </div>
        <div class="info-item">
          <label>年级：</label>
          <span v-if="!editMode">{{ user.grade || '未填写' }}</span>
          <input v-if="editMode" v-model="form.grade" type="text" class="form-input">
        </div>
      </div>
    </div>
    
    <div class="points-section">
      <h2>我的积分</h2>
      <div class="points-card">
        <div class="points-value">{{ user.points }}</div>
        <div class="points-desc">当前积分可用于优先预约实验室</div>
      </div>
    </div>
    
    <div class="security-section">
      <h2>账户安全</h2>
      <button class="btn btn-secondary" @click="openChangePasswordModal">修改密码</button>
    </div>
    
    <!-- 修改密码模态框 -->
    <div v-if="showPasswordModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>修改密码</h3>
          <button class="close-btn" @click="showPasswordModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="oldPassword">当前密码：</label>
            <input id="oldPassword" v-model="passwordForm.oldPassword" type="password" class="form-input">
          </div>
          <div class="form-group">
            <label for="newPassword">新密码：</label>
            <input id="newPassword" v-model="passwordForm.newPassword" type="password" class="form-input">
          </div>
          <div class="form-group">
            <label for="confirmPassword">确认新密码：</label>
            <input id="confirmPassword" v-model="passwordForm.confirmPassword" type="password" class="form-input">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showPasswordModal = false">取消</button>
          <button class="btn btn-primary" @click="changePassword">保存修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const user = ref({
      username: localStorage.getItem('username') || 'student',
      name: '学生',
      studentId: '2023001',
      phone: '',
      email: '',
      department: '',
      major: '',
      grade: '',
      points: 100,
      avatar: 'https://picsum.photos/200/200?random=1'
    })
    const defaultAvatar = 'https://picsum.photos/200/200?random=1'
    const editMode = ref(false)
    const showPasswordModal = ref(false)
    
    // 编辑表单数据
    const form = reactive({
      name: '',
      studentId: '',
      phone: '',
      email: '',
      department: '',
      major: '',
      grade: ''
    })
    
    // 密码修改表单
    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    // 加载用户资料
    const loadUserProfile = () => {
      form.name = user.value.name || ''
      form.studentId = user.value.studentId || ''
      form.phone = user.value.phone || ''
      form.email = user.value.email || ''
      form.department = user.value.department || ''
      form.major = user.value.major || ''
      form.grade = user.value.grade || ''
    }
    
    // 保存用户资料
    const saveProfile = async () => {
      try {
        const updatedUser = {
          name: form.name,
          studentId: form.studentId,
          phone: form.phone,
          email: form.email,
          department: form.department,
          major: form.major,
          grade: form.grade
        }
        
        // 模拟API调用，实际项目中应替换为真实API
        await axios.put('/api/user/profile', updatedUser)
        
        // 更新本地用户信息
        user.value = { ...user.value, ...updatedUser }
        
        editMode.value = false
        alert('资料更新成功')
      } catch (error) {
        alert('更新失败，请重试')
        console.error('更新用户资料失败', error)
      }
    }
    
    // 更换头像（模拟）
    const changeAvatar = () => {
      alert('更换头像功能开发中...')
    }
    
    // 打开修改密码模态框
    const openChangePasswordModal = () => {
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      showPasswordModal.value = true
    }
    
    // 修改密码
    const changePassword = async () => {
      // 验证表单
      if (!passwordForm.oldPassword) {
        alert('请输入当前密码')
        return
      }
      
      if (!passwordForm.newPassword) {
        alert('请输入新密码')
        return
      }
      
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      
      if (passwordForm.newPassword.length < 6) {
        alert('新密码长度不能少于6位')
        return
      }
      
      try {
        // 模拟API调用，实际项目中应替换为真实API
        await axios.put('/api/user/password', {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
        
        showPasswordModal.value = false
        alert('密码修改成功，请重新登录')
        
        // 退出登录
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        window.location.href = '/login'
      } catch (error) {
        alert(error.response?.data?.message || '修改失败，请重试')
        console.error('修改密码失败', error)
      }
    }
    
    onMounted(() => {
      loadUserProfile()
    })
    
    return {
      user,
      defaultAvatar,
      editMode,
      form,
      saveProfile,
      changeAvatar,
      showPasswordModal,
      passwordForm,
      openChangePasswordModal,
      changePassword
    }
  }
}
</script>

<style scoped>
/* 样式保持不变 */
</style>