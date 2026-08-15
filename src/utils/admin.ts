import axios from 'axios'
import { useUserStore } from '@/stores/user'
const student = axios.create({
  baseURL: 'http://localhost:4300/admin',
  timeout: 5000,
})

student.interceptors.request.use(
  function (config) {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
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
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default student
