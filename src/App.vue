<template>
  <el-menu :ellipsis="false" v-if="$route.meta.showNav !== false" :router="true" mode="horizontal">
    <el-menu-item index="/">首页</el-menu-item>
    <el-avatar shape="square" :size="50" :src="asdf">
      <el-icon><User /></el-icon>
    </el-avatar>
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
      <el-menu-item index="/user">个人信息</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <router-view />
</template>

<script lang="ts" setup>
//router-view 是 vue-router 提供的出口组件——路由匹配到的页面组件渲染在哪里的占位符。 //访问 /
//时router/index.ts 匹配到 home就把 home.vue 渲染到 router-view 的位置； 访问 /login 时，就换成
//login.vue 访问 /studentLogin 时，就换成 studentLogin.vue。

import { useUserStore } from './stores/user'
import student from './utils/admin'
import { User } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
const userStore = useUserStore()
const asdf = ref('')
const getup = async () => {
  // 未登录时不请求头像(导航栏本来就隐藏),也避免登录页上 401 死循环
  if (!userStore.token && !userStore.studentToken) return
  try {
    const res = await student.get('/upload')
    asdf.value = res.data.url
  } catch {
    // 头像加载失败就显示默认图标
  }
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
