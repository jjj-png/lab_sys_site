import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../view/LoginView.vue'
import RegisterView from '../view/RegisterView.vue'
import AdminLayout from '@/view/admin/AdminLayout.vue'
import SystemHome from '@/view/admin/SystemHome.vue'
import UserManage from '@/view/admin/UsersManage.vue'
import LabAdminManage from '@/view/admin/LabAdminManage.vue'
import AdminStudents from '@/view/admin/AdminStudents.vue'
import LabAdminLayout from '@/view/lab-admin/LabAdminLayout.vue' // 确保文件存在且路径正确
import LabAdminHome from '@/view/lab-admin/LabAdminHome.vue'
import LabInfoManage from '@/view/lab-admin/LabInfoManage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/home', redirect: '/admin/home' },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: '', redirect: 'home' },
      { path: 'home', name: 'SystemHome', component: SystemHome },
      { path: 'users', name: 'UserManage', component: UserManage },
      { path: 'lab-admin', name: 'LabAdmin', component: LabAdminManage },
      { path: '/admin/students', component: AdminStudents }
    ]
  },
  {
    path: '/lab-admin',
    component: LabAdminLayout,
    meta:{ requiresLabAdmin: true },
    children: [
      { path: '', redirect: 'home' },
      { path: 'home', name: 'LabAdminHome', component: LabAdminHome },
      { path: 'info-manage', name: 'LabInfoManage', component: LabInfoManage },
      { path: 'labs', name: 'LabInfoLabs', component: LabInfoManage },
    
      { path: 'records', name: 'ReservationRecord', component: () => import('@/view/lab-admin/ReservationRecordManage.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router