import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../view/LoginView.vue' 
import RegisterView from '../view/RegisterView.vue'


import AdminLayout from '@/view/admin/AdminLayout.vue'
import SystemHome from '@/view/admin/SystemHome.vue'
import UserManage from '@/view/admin/UsersManage.vue'
import LabAdminManage from '@/view/admin/LabAdminManage.vue'
import AdminStudents from '@/view/admin/AdminStudents.vue' 
import NoticeView   from '@/view/admin/NoticeView.vue' 
import LabCategory      from '@/view/LabCategory.vue' 
import LabListView from '@/view/LabListView.vue'


const routes = [
  {
    path: '/',             // 根路径
    redirect: '/login'     // ✅ 设置默认跳转到 /login
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  { path: '/register', name: 'Register', component: RegisterView },

  
  // 新增：/home → /admin/home
  { path: '/home', redirect: '/admin/home' },

  {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAdmin: true },
      children: [
        { path: '', redirect: 'home' },           // 默认子路由
        { path: 'home', name: 'SystemHome', component: SystemHome },
        { path: 'users', name: 'UserManage', component: UserManage },
        { path: 'lab-admin',name:'LabAdmin', component: LabAdminManage } ,
        { path: '/admin/students', component: AdminStudents },
        { path: 'notice',    name:'NoticeView', component: NoticeView } ,
        { path: 'category',  name: 'LabCategory',  component: LabCategory },
        { path: 'labs', name: 'AdminLabs', component: LabListView },
        {
         path: '/admin/records',
         component: () => import('@/view/RecordsView.vue')
        }
        // 预留：以后新页面直接加
        // { path: 'user', name: 'UserManage', component: () => import('@/view/admin/UserManage.vue') },
      ]
    }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
