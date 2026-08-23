<template>
  <el-menu :ellipsis="false" v-if="$route.meta.showNav !== false" :router="true" mode="horizontal">
    <el-menu-item index="/">首页</el-menu-item>
    <el-avatar shape="square" :size="50" :src="asdf" />
    <el-sub-menu index="0">
      <template #title>课程</template>
      <el-menu-item index="/course" v-if="userStore.role === 'normal' || userStore.role === 'admin'"
        >课程安排</el-menu-item
      >
      <el-menu-item>查看课程</el-menu-item>
    </el-sub-menu>
    <el-sub-menu v-if="userStore.role === 'admin'" index="1">
      <template #title>学生数据</template>
      <el-menu-item index="/shujutongji" v-if="userStore.role === 'admin'">学生统计</el-menu-item>
      <el-menu-item>用户统计</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>账号</template>
      <el-menu-item @click="userStore.logout">退出登录</el-menu-item>
      <el-menu-item>修改密码</el-menu-item>
      <el-menu-item>个人信息</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <router-view />
</template>
<script lang="ts" setup>
import { useUserStore } from './stores/user'
import student from './utils/admin'
import { ref, onMounted } from 'vue'
const userStore = useUserStore()
const asdf = ref('')
const getup = async () => {
  const res = await student.get('/upload')
  asdf.value = res.data.url
}
onMounted(() => {
  getup()
})
</script>
<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
