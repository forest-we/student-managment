import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
const student = axios.create({
  baseURL: 'http://localhost:4300/',
  timeout: 5000,
})

student.interceptors.request.use(
  function (config) {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    } else if (userStore.studentToken) {
      config.headers.Authorization = `Bearer ${userStore.studentToken}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

student.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (!error.response) {
      ElMessage.error('网络异常,等待互联网连接')
    }
    if (error.response?.status === 401) {
      // 已经在登录/注册/学生登录页时不再跳转,避免整页刷新死循环
      ElMessage.error(error.response.data.message)
      const publicPages = ['/login', '/register', '/studentLogin']
      if (!publicPages.includes(window.location.pathname)) {
        const userStore = useUserStore()
        userStore.logout()
      }
    }
    if (error.response?.status === 500) {
      ElMessage.error('服务器出了问题')
    }
    if (error.response?.status === 403) {
      ElMessage.error('你没权限进行操作')
    }
    if (error.response?.status === 400) {
      ElMessage.error(error.response.data.message)
    }
    return Promise.reject(error)
  },
)

export default student
