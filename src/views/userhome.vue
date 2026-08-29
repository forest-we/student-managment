<template>
  <div>
    <div>
      <h1>父组件</h1>
      <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" @click="userAdd"
        >新增用户</el-button
      >
    </div>
    <div>
      <el-table v-loading.fullscreen.lock="fullscreenLoading" :data="users">
        <el-table-column label="用户ID" prop="id"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="权限" prop="role"></el-table-column>
        <el-table-column label="头像路径" prop="avatar"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="userPut(row)" type="primary" :icon="Edit" circle />
            <el-popconfirm
              confirm-button-text="对"
              cancel-button-text="按错了"
              width="220"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="你确定要删除改用户?"
              @confirm="confirmEvent(row)"
              @cancel="cancelEvent"
              v-loading.fullscreen.lock="fullscreenLoading"
            >
              <template #reference>
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  v-loading.fullscreen.lock="fullscreenLoading"
                />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <pagination :page="page" :limit="limit" :total="total" @pageChange="handlePageChange" />
    </div>
  </div>
  <add ref="aDD" @submit="handleSubmit" />
  <put ref="Put" @efff="PUT" />
</template>

<script setup lang="ts">
import pagination from '@/views/compnents/pagination.vue'
import { onMounted, ref } from 'vue'
import user from '@/utils/admin'
import add from './compnents/add.vue'
import put from './compnents/put.vue'
import { Delete, Edit, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const handlePageChange = (newPage: number) => {
  page.value = newPage
  userData()
}
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const users = ref([])
const aDD = ref<any>(null)
const Put = ref<any>(null)
const fullscreenLoading = ref(false)
const userAdd = () => {
  aDD.value.addDialog()
}
const userPut = (row: any) => {
  Put.value.wee(row)
}
// 子组件 add.vue 提交表单 → 父组件这里把数据发给后端
const handleSubmit = async (form: { username: string; password: string }) => {
  fullscreenLoading.value = true
  try {
    const res = await user.post('admin/user', form)
  
    if (res.data.code === 200) {
      ElMessage({ message: '新增用户成功', type: 'success' })
      aDD.value.closeDialog() // 关弹窗 调用子组件暴露的可调用函数 + 重置表单
      userData() // 刷新表格
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '新增用户时出现错误')
  } finally {
    fullscreenLoading.value = false
  }
}

const PUT = async (userdata: { username: string; password: string; role: string; id: string }) => {
  fullscreenLoading.value = true
  try {
    const res = await user.put(`admin/user/${userdata.id}`, userdata)
    if (res.data.code === 200) {
      ElMessage({
        message: '修改成功',
        type: 'success',
      })
      Put.value.close()
      userData()
    }
  } catch (err: any) {
    console.log(err.message)

    ElMessage.error('额,出了点问题')
  } finally {
    fullscreenLoading.value = false
  }
}

onMounted(async () => {
  userData()
})

const cancelEvent = () => {
  ElMessage.error('取消执行')
}
const userData = async () => {
  fullscreenLoading.value = true
  try {
    const res = await user.get('admin/user', {
      params: {
        page: page.value,
        limin: limit.value,
      },
    })

    users.value = res.data.data
  } catch (err: any) {
    console.log(err.message)
    ElMessage.error('出了点问题')
  } finally {
    fullscreenLoading.value = false
  }
}

const confirmEvent = async (row: any) => {
  fullscreenLoading.value = true
  try {
    const res = await user.delete(`admin/user/${row.id}`)

    if (res.data.code === 200) {
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      userData()
    }
  } catch (err: any) {
    ElMessage.error('删除时出现错误')
  } finally {
    fullscreenLoading.value = false
  }
}
setTimeout(() => {
  fullscreenLoading.value = false
}, 2000)
</script>
