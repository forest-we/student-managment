<template>
  <div>
    <h1>这里是课程安排{{}}</h1>
  </div>
  <div style="text-align: center">
    <img class="wow" :src="asdf" alt="" />
  </div>
  <div class="www" style="text-align: center">
    <el-upload action="" accept="image/*" :http-request="cuost">
      <el-button>选择并上传你的头像</el-button>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
import student from '@/utils/admin'
import { onMounted, ref } from 'vue'

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
<style scoped>
.wow {
  width: 178px;
  height: 178px;
}
</style>
<style></style>
