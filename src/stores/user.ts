import request from '../utils/request'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  const userInfo = ref<any>(null)
  const token = ref(localStorage.getItem('token') || '')
  const role = ref(localStorage.getItem('role') || '')
  const userCode = ref({})
  const userID = ref(localStorage.getItem('userID') || '')
  const login = async (form: { username: string; password: string }) => {
    const res = await request.post('/login', form)
    userInfo.value = res.data.data
    userCode.value = res.data.code
    role.value = res.data.data.role
    token.value = res.data.token
    userID.value = res.data.data.id
    localStorage.setItem('token', token.value)
    localStorage.setItem('role', role.value)
    localStorage.setItem('userID', String(userID.value))
  }
  
  const logout = () => {
    userInfo.value = null
    token.value = ''
    role.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userID')
    window.location.href = '/login'
  }

  return {
    userID,
    userInfo,
    userCode,
    token,
    login,
    logout,
    role,
  }
})

