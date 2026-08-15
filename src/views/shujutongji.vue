<template>
  <h1>你好,这里是数据统计</h1>
  <el-form-item label="学生数量">
    <h2>{{ studentlength }}</h2>
  </el-form-item>
</template>

<script setup lang="ts">
import student from '../utils/admin'
import { computed, onMounted, ref } from 'vue'
const studentData = ref([])
const user = async () => {
  const res = await student.get('/student')
  studentData.value = res.data.data
}
const studentlength = computed(() => {
  return studentData.value.length
})
onMounted(() => {
  user()
})
</script>
