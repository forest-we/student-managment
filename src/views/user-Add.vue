<template>
  <div class="ee">
    <div>
      <h1>修改你的密码</h1>
    </div>
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
    <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="serect()" type="primary"
      >修改把</el-button
    >
  </div>
</template>

<script setup lang="ts">
import student from '@/utils/admin'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const from = ref({
  username: '',
  password: '',
})
const fullscreenLoading = ref(false)
const serect = async () => {
  fullscreenLoading.value = true
  try {
    if (!from.value.username || !from.value.password) {
      return ElMessage.error('账号密码为空')
    }
    const res = await student.post('/', from.value)
    if (res.data.code === 200) {
      return ElMessage({
        message: '修改成功',
        type: 'success',
      })
    }
  } catch (err) {
    ElMessage.error('发生错误')
  } finally {
    fullscreenLoading.value = false
  }
}
setTimeout(() => {
  fullscreenLoading.value = false
}, 2000)
</script>
