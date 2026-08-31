<template>
  <h1 v-if="useTuichu.role === 'admin'">你好,管理员</h1>
  <h1 v-if="useTuichu.role === 'normal'">你好,首页</h1>
  <h1 v-else-if="useTuichu.role !== 'normal' && useTuichu.role !== 'admin'">
    你好,{{ useTuichu.studentName }}
  </h1>
  <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="getStudentList()"
    >刷新</el-button
  >
  <el-button
    v-if="useTuichu.role === 'admin' || useTuichu.role === 'normal'"
    type="primary"
    @click="onOpnn()"
    >新增学生</el-button
  >

  <el-input
    large
    clearable
    style="width: 230px"
    v-model="input3"
    class="responsive-input2"
    placeholder="搜索姓名"
    :prefix-icon="Search"
  />
  <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="user" type="info" plain
    >搜索</el-button
  >
  <span v-if="useTuichu.role !== 'admin'" style="margin: 50px">你的班级</span>
  <span v-if="useTuichu.role === 'admin'" style="margin: 50px">你有权限操作所有学生</span>
  <div class="app">
    <el-table v-loading="fullscreenLoading" :data="tableData">
      <el-table-column label="学生ID" prop="id"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
      <el-table-column label="性别" prop="gender"></el-table-column>
      <el-table-column label="年级班级" prop="classroom"></el-table-column>
      <el-table-column label="学号" prop="student_no"></el-table-column>
      <el-table-column label="所属用户id" prop="user_id"></el-table-column>
      <el-table-column
        v-if="useTuichu.role === 'admin' || useTuichu.role === 'normal'"
        label="操作"
      >
        <template #default="{ row }">
          <el-button
            v-if="useTuichu.role === 'admin' || useTuichu.role === 'normal'"
            @click="onEdif(row)"
            type="primary"
            :icon="Edit"
            circle
          />
          <el-button
            v-if="useTuichu.role === 'admin' || useTuichu.role === 'normal'"
            @click="onOpnm(row)"
            type="danger"
            :icon="Delete"
            circle
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <br />
  <br />
  <xiugai ref="editRef" @on-update="getStudentList()" />
  <shanchu ref="edit" @on-upda="getStudentList()" />
  <xinzeng ref="edon" @on-uupp="getStudentList()" />

  <pagination :page="page" :limit="limit" :total="total" @pageChange="handlePageChange" />
</template>

<script lang="ts" setup>
import pagination from './components/pagination.vue'
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'
import { computed, onMounted, ref, watch } from 'vue'
import studentas from '../utils/admin'
import xinzeng from './student-add.vue'
import { useUserStore } from '@/stores/user'
import xiugai from './student-put.vue'
import usePagination from '@/composable/usePagination.ts'
import Shanchu from '@/views/student-delete.vue'
import { ElMessage } from 'element-plus'
const { page, limit, total } = usePagination()
const useTuichu = useUserStore()
const editRef = ref<any>(null)
const edit = ref<any>(null)
const edon = ref<any>(null)
const asdf = ref<any>(null)
//Vue 的自定义事件（defineEmits）机制：子组件不直接改父组件的数据，而是"喊一声"，让父组件自己处理。好处是组件解耦——分页组件只负责"报告页码变化"，至于换页后是拉数据还是别的操作，由父组件决定。
//props是子组件接收的数据声明
const handlePageChange = (newPage: any) => {
  page.value = newPage
  getStudentList()
}
//const student = async () => {
//try {
//const res = await studentas.get('/student')
//users.value = res.data.data
//} catch {
//ElMessage.error('服务器出了点问题')
//  router.push('/login')
//}
//}
//调用子组件open时传递row参数 子组件通过defineExpose暴露弹窗调用方式  调用修改弹窗，弹窗组件完成修改再通过defineEmits子传父组件调用父组件刷新完成修改
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
    getStudentList() // 空关键字 → 重新拉全部
    return
  }
  fullscreenLoading.value = true
  try {
    const res = await studentas.post(
      'admin/search',
      { name: input3.value },
      {
        params: {
          page: page.value,
          limin: limit.value,
        },
      },
    )

    tableData.value = res.data.data // 搜索结果覆盖到同一个表格
  } catch {
    ElMessage.error('搜索失败')
  } finally {
    fullscreenLoading.value = false
  }
}

const tableData = ref([])

const fullscreenLoading = ref(false)
const getStudentList = async () => {
  fullscreenLoading.value = true
  try {
    const res = await studentas.get('admin/paging', {
      params: {
        page: page.value,
        limin: limit.value,
      },
    })
    console.log(res.data)

    tableData.value = res.data.data
    total.value = res.data.total
    console.log('total:', total.value)
  } catch {
    ElMessage.error('网络不可用,请稍后再试')
  } finally {
    fullscreenLoading.value = false
  }
}
setTimeout(() => {
  fullscreenLoading.value = false
}, 2000)

onMounted(() => {
  getStudentList()
})
//onMounted(() => {
//student()
//})
</script>
<style></style>
