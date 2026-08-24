<template>
  <div class="tty">
    <div>
      <p>用户名</p>
      <span>{{ userStore.userName }}</span>
      <span v-if="userStore.role !== 'admin' && userStore.role !== 'normal'">{{
        userStore.studentName
      }}</span>
    </div>
    <div>
      <span v-if="userStore.role === 'admin'">管理员</span>
      <span v-if="userStore.role === 'normal'">普通用户</span>
      <span v-if="userStore.role !== 'admin' && userStore.role !== 'normal'">学生</span>
    </div>
    <div>
      <img class="wow" :src="asdf" alt="" />
    </div>

    <div>
      <el-upload action="" accept="image/*" :http-request="cuost">
        <el-button>选择并上传你的头像</el-button>
      </el-upload>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import student from '@/utils/admin'
import { onMounted, ref } from 'vue'
const userStore = useUserStore()
console.log(userStore.userName)
console.log(userStore.role)
const asdf = ref('')

const getup = async () => {
  const res = await student.get('/upload')
  asdf.value = res.data.url
}
onMounted(() => {
  getup()
})

import { ElMessage } from 'element-plus'

const cuost = async (options: any) => {
  console.log(options.file)

  const file = options.file
  const formee = new FormData()
  formee.append('avatar', file)
  await student.post('/upload', formee)
}
</script>

<style>
.tty {
  text-align: center;
}
.wow {
  width: 178px;
  height: 178px;
}
</style>
