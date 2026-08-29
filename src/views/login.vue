<template>
  <div class="qq">
    <div>
      <h1>教师登录</h1>
    </div>
    <div>
      <p>账号</p>
      <input type="text" placeholder="账号" v-model="form.username" />
      <div>
        <p style="color: brown">{{ erro }}</p>
      </div>
    </div>
    <div>
      <p>密码</p>
      <input type="password" placeholder="密码" v-model="form.password" />
    </div>
    <div>
      <el-button v-loading.fullscreen.lock="" @click="userr">登录</el-button>
    </div>
    <div>
      <el-button @click="register" type="primary" plain>成为教师</el-button>
    </div>
    <div>
      <el-button @click="studentL" type="primary" plain>学生登录</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, computed, watch, onMounted, provide } from 'vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
import router from '@/router'
import { ElMessage } from 'element-plus'
import { ElLoading } from 'element-plus'
const form = ref({
  username: '',
  password: '',
})
const erro = ref('')

const userr = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'ローディング',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    if (!form.value.username || !form.value.password) {
      ElMessage.error('输入框为空')
      return (erro.value = '账号密码都是空的,你乱按什么?')
    }
    await userStore.login(form.value)
    if (userStore.userCode === 401) {
      return ElMessage.error('账号或密码错误')
    }
    if (userStore.userCode === 400) {
      return (erro.value = '账号密码有问题,让你乱输入')
    }
    if (userStore.userCode === 200 && userStore.role === 'admin') {
      ElMessage({
        message: '欢迎你,' + userStore.userInfo.username + '管理员',
        type: 'success',
      })
      router.push('/shujutongji')
    } else {
      ElMessage({
        message: '欢迎您,' + userStore.userInfo.username,
        type: 'success',
      })
      router.push('/')
    }
  } catch (err: any) {
    console.log(err.message)
  } finally {
    loading.close()
  }
  setTimeout(() => {
    loading.close()
  }, 2000)
}

const register = () => {
  router.push('/register')
}
const studentL = () => {
  router.push('/studentLogin')
}
</script>
<style>
.qq {
  text-align: center;
}
</style>
