<template></template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import student from '@/utils/admin'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const faLse = ref(false)
const eali = defineEmits(['on-upda'])
import { ElLoading } from 'element-plus'
const load = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'ローディング',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
  }, 2000)
}

const openm = (row: any) => {
  try {
    // 身份校验：这条学生记录关联的 user.id 是否属于该用户
    if (String(userStore.userID) !== String(row.user_id) && userStore.role !== 'admin') {
      faLse.value = false
      ElMessage.error('你要干嘛?这学生是你的吗?')
      return
    }
    faLse.value = true
    ElMessageBox.confirm('你确定要删除该学生吗?回答我', {
      confirmButtonText: '我是认真的',
      cancelButtonText: '按错了',
      type: 'warning',
    })
      .then(async () => {
        ElMessage({
          type: 'success',
          message: '执行成功',
        })
        load()
        await student.delete(`admin/student/${row.id}`)
        eali('on-upda')
        faLse.value = false
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消执行',
        })
        faLse.value = false
      })
  } catch (err) {
    alert('出了点问题' + err)
  }
}

defineExpose({ openm })
</script>
