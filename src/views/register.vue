<template>
  <div class="ee">
    <h1>用户注册</h1>
    <el-form-item label="账号">
      <el-input v-model="from.username" style="width: 240px" placeholder="输入你的账号" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input
        v-model="from.password"
        style="width: 240px"
        placeholder="输入你的密码"
        show-password
      />
    </el-form-item>
    <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="regier()" type="primary"
      >注册</el-button
    >
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import student from '@/utils/admin'
import { ElMessage } from 'element-plus'
import router from '@/router'

const from = ref({
  username: '',
  password: '',
})
const fullscreenLoading = ref(false)
const regier = async () => {
  fullscreenLoading.value = true
  try {
    const res = await student.post('api/register', from.value)
    if (res.data.code === 200) {
      ElMessage({
        message: '注册成功',
        type: 'success',
      })
      router.push('/login')
    }
  } catch (err) {
    ElMessage.error('网络出了点问题')
  } finally {
    fullscreenLoading.value = false
  }
}
setTimeout(() => {
  fullscreenLoading.value = false
}, 2000)
</script>

<style>
.ee {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30vh;
}
</style>
