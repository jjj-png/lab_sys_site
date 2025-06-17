import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../view/LoginView.vue' 
import RegisterView from '../view/RegisterView.vue'
import LabCategory from '../view/LabCategory.vue'

import AdminLayout from '../view/admin/AdminLayout.vue'
import SystemHome from '../view/admin/SystemHome.vue'
import UserManage from '../view/admin/UsersManage.vue'
import LabAdminManage from '../view/admin/LabAdminManage.vue'
import AdminStudents from '../view/admin/AdminStudents.vue' 
import NoticeView from '../view/admin/NoticeView.vue' 

import StudentLayout from '../view/student/StudentLayout.vue'
import BookLab from '../view/student/BookLab.vue'
import BookingRecord from '../view/student/BookingRecord.vue'
import Profile from '../view/student/Profile.vue'
import StudentHome from '../view/student/StudentHome.vue' // 添加学生首页

const routes = [
  {
    path: '/',              // 根路径
    redirect: '/student/home'    
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: RegisterView 
  },
  { 
    path: '/home', 
    redirect: '/admin/home' 
  },

  // 管理员路由
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresRole: 'admin' }, // 需要管理员角色
    children: [
      { path: '', redirect: 'home' },           // 默认子路由
      { path: 'home', name: 'SystemHome', component: SystemHome },
      { path: 'users', name: 'UserManage', component: UserManage },
      { path: 'lab-admin', name: 'LabAdmin', component: LabAdminManage },
      { path: 'students', name: 'AdminStudents', component: AdminStudents },
      { path: 'notice', name: 'NoticeView', component: NoticeView },
      { path: 'category', name: 'LabCategory', component: LabCategory }
    ]
  },

  // 学生路由
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresRole: 'student' }, // 需要学生角色
    children: [
      { path: '', redirect: 'home' },         // 学生默认首页
      { path: 'home', name: 'StudentHome', component: StudentHome },
      { path: 'book-lab', name: 'BookLab', component: BookLab },
      { path: 'booking-record', name: 'BookingRecord', component: BookingRecord },
      { path: 'profile', name: 'StudentProfile', component: Profile }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router