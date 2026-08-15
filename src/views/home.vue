<template>
  <h1 v-if="useTuichu.role === 'admin'">你好,管理员</h1>
  <h1 v-else-if="useTuichu.role !== 'admin'">你好,首页</h1>
  <el-button @click="student()">刷新</el-button>
  <el-button type="primary" @click="onOpnn()">新增学生</el-button>
  <el-button large @click="useTuichu.logout()" type="primary">退出登录</el-button>

  <el-input
    large
    clearable
    style="width: 230px"
    v-model="input3"
    class="responsive-input2"
    placeholder="搜索姓名"
    :prefix-icon="Search"
  />
  <el-button @click="user" type="info" plain>搜索</el-button>
  <div class="app">
    <el-table :data="users">
      <el-table-column label="学生ID" prop="id"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
      <el-table-column label="性别" prop="gender"></el-table-column>
      <el-table-column label="年级班级" prop="classroom"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="onEdif(row)" type="primary" :icon="Edit" circle />
          <el-button @click="onOpnm(row)" type="danger" :icon="Delete" circle />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <br />
  <br />
  <xiugai ref="editRef" @on-update="student" />
  <shanchu ref="edit" @on-upda="student" />
  <xinzeng ref="edon" @on-uupp="student" />
</template>

<script lang="ts" setup>
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'
import { computed, onMounted, ref, watch } from 'vue'
import studentas from '../utils/admin'
import xinzeng from './xinzeng.vue'
import { useUserStore } from '@/stores/user'
import xiugai from './xiugai.vue'

import router from '@/router/index.ts'
import Shanchu from './shanchu.vue'
import { ElMessage } from 'element-plus'
const useTuichu = useUserStore()
const editRef = ref<any>(null)
const edit = ref<any>(null)
const edon = ref<any>(null)
const users = ref<any[]>([])
const code = ref<any>()
const student = async () => {
  try {
    const res = await studentas.get('/student')
    users.value = res.data.data
  } catch {
    ElMessage.error('Oops, this is a error message.')
    router.push('/login')
  }
}
//调用子组件open时传递row参数   调用修改弹窗
const onEdif = (row: any) => {
  editRef.value.open(row)
}
//调用删除弹窗
const onOpnm = (row: any) => {
  edit.value.openm(row)
}

const onOpnn = () => {
  edon.value.oopn()
}

//const input2 = ref('')
//const fliterUser = computed(() => {
//if (!input2.value) return users.value
//return users.value.filter((u: any) => u.name.includes(input2.value))
//})

const input3 = ref('')

// 后端搜索：回车触发
const user = async () => {
  if (!input3.value) {
    ElMessage.error('输入框是空的,你按什么')
    student() // 空关键字 → 重新拉全部
    return
  }
  try {
    const res = await studentas.post('/search', { name: input3.value })
  
    users.value = res.data.data // 搜索结果覆盖到同一个表格
  } catch {
    ElMessage.error('搜索失败')
  }
}

onMounted(() => {
  student()
})
</script>
<style></style>
