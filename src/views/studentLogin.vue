<template>
  <el-form-item label="学号">
    <el-input v-model="from.student_no" style="width: 240px" placeholder="输入你的学号" />
  </el-form-item>
  <el-form-item label="密码">
    <el-input
      v-model="from.password"
      style="width: 240px"
      placeholder="输入你的密码"
      show-password
    />
  </el-form-item>
  <el-button @click="logIn()" type="primary">登录</el-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router/index'

const userStore = useUserStore()
const from = ref({
  student_no: '',
  password: '',
})

const logIn = async () => {
  try {
    if (!from.value.password || !from.value.student_no) {
      return ElMessage.error('学号或密码为空')
    }
    await userStore.studentlogin(from.value)
    if (userStore.studentCode === 200) {
      ElMessage({
        message: '登录成功',
        type: 'success',
      })
      router.push('/')
    }
  } catch (err) {
    ElMessage.error('网络出了点问题')
  }
}
</script>
