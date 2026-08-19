<template>
  <el-menu v-if="$route.meta.showNav !== false" :router="true" mode="horizontal">
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/course">课程</el-menu-item>
    <el-sub-menu v-if="userStore.role === 'admin'" index="1">
      <template #title>学生数据</template>
      <el-menu-item index="/shujutongji" v-if="userStore.role === 'admin'">数据统计</el-menu-item>
      <el-menu-item>用户数据</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <router-view />
</template>
<script lang="ts" setup>
import { useUserStore } from './stores/user'
import { ref } from 'vue'
const userStore = useUserStore()
</script>
<style scoped></style>
