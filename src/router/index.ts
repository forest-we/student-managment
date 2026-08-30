import { createRouter, createWebHistory } from 'vue-router'
import login from '@/views/login.vue'
import home from '@/views/home.vue'
import course from '@/views/course.vue'
import register from '@/views/register.vue'
import statistics from '@/views/admin-data-statistics.vue'
import studentLogin from '@/views/student-Login.vue'
import user from '@/views/user.vue'
import userAdd from '@/views/user-Add.vue'
import userhome from '@/views/userhome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: { showNav: false },
    },
    {
      path: '/',
      name: '首页',
      component: home,
    },
    {
      path: '/course',
      name: '课程',
      component: course,
    },
    {
      path: '/register',
      name: '注册',
      component: register,
      meta: { showNav: false },
    },
    {
      path: '/shujutongji',
      name: '数据统计',
      component: statistics,
    },
    {
      path: '/studentLogin',
      name: '学生登录',
      component: studentLogin,
      meta: { showNav: false },
    },
    {
      path: '/user',
      name: '个人主页',
      component: user,
    },
    {
      path: '/userxiugai',
      name: '修改密码',
      component: userAdd,
    },
    {
      path: '/userhome',
      name: '用户管理',
      component: userhome,
    },
  ],
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const studentToken = localStorage.getItem('studentToken')
  const role = localStorage.getItem('role') || ''
  const whiteList = ['/login', '/register', '/studentLogin']

  // 1. 未登录 → 白名单放行，其余踢到登录
  if (!token && !studentToken) {
    return whiteList.includes(to.path) ? next() : next('/login')
  }

  // 2. 已登录但访问登录页 → 跳到首页
  if (to.path === '/login') {
    return next('/')
  }

  // 3. 需要 admin 权限的页面
  if (to.path === '/shujutongji' && role !== 'admin') {
    return next('/')
  }
  if (to.path === '/userhome' && role !== 'admin') {
    return next('/')
  }
  //if ((to.path === '/user' && !token) || !studentToken) {
  //return next('/login')
  //}
  next()
})
export default router
