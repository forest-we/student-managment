<template>
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
    <el-button @click="userr">登录</el-button>
  </div>
  <div>
    <el-button @click="register" type="primary" plain>成为教师</el-button>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, computed, watch, onMounted, provide } from 'vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
import router from '@/router'
import { ElMessage } from 'element-plus'

const form = ref({
  username: '',
  password: '',
})
const erro = ref('')
const userr = async () => {
  try {
    if (!form.value.username || !form.value.password) {
      erro.value = '账号密码都是空的,你乱按什么?'
    }
    await userStore.login(form.value)
    if (userStore.userCode === 401) {
      erro.value = '账号密码有问题,让你乱输入'
    }
    if (userStore.userCode === 200) {
      alert('欢迎你,' + userStore.userInfo.username)
      router.push('/')
    }
  } catch (err) {
    ElMessage.error('哇哦,兄弟好像出了点问题')
    console.log(err)
  }
}

const register = () => {
  router.push('/register')
}
</script>
<style></style>
