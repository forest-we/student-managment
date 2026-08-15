<template>
  <el-menu v-if="$route.meta.showNav !== false" :router="true" mode="horizontal">
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/course">课程</el-menu-item>
    <el-menu-item index="/shujutongji" v-if="userStore.role === 'admin'">数据统计</el-menu-item>
  </el-menu>
  <router-view />
</template>
<script lang="ts" setup>
import { useUserStore } from './stores/user'
const userStore = useUserStore()
</script>
<style scoped></style>
