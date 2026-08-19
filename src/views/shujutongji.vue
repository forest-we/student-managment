<template>
  <h1>你好,这里是数据统计</h1>
  <el-card style="max-width: 430px">
    <template #header>
      <div class="card-header">
        <span>目前已知学生总数量</span>
      </div>
    </template>
    <p>{{ studentlength }}</p>
  </el-card>
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
