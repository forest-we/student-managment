import student from '@/utils/admin'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  const userInfo = ref<any>(null)
  const token = ref(localStorage.getItem('token') || '')
  const role = ref(localStorage.getItem('role') || '')
  const userCode = ref({})
  const userID = ref(localStorage.getItem('userID') || '')
  const login = async (form: { username: string; password: string }) => {
    const res = await student.post('api/login', form)
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
    studentName.value = ''
    student_No.value = ''
    userInfo.value = null
    token.value = ''
    role.value = ''
    studentToken.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userID')
    localStorage.removeItem('studentToken')
    window.location.href = '/login'
  }
  const studentName = ref('')
  const student_No = ref('')
  const studentCode = ref()
  const studentToken = ref(localStorage.getItem('studentToken') || '')
  const studentlogin = async (from: { student_no: string; password: string }) => {
    const res = await student.post('api/student/login', from)
    studentName.value = res.data.data.name
    student_No.value = res.data.data.student_Nos
    studentToken.value = res.data.token
    studentCode.value = res.data.code
    localStorage.setItem('studentToken', studentToken.value)
  }
  return {
    studentCode,
    studentlogin,
    studentName,
    studentToken,
    student_No,
    userID,
    userInfo,
    userCode,
    token,
    login,
    logout,
    role,
  }
})
