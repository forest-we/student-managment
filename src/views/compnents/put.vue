<template>
  <el-dialog v-model="rule" title="修改学生">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="userData"
      status-icon
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="用户名" prop="username">
        <el-input maxlength="10" v-model="userData.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userData.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限" prop="role">
        <el-input v-model="userData.role" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="rule = false">取消</el-button>
      <el-button v-loading.fullscreen.lock="loading" type="primary" @click="submitForm(ruleFormRef)"
        >确认</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ref } from 'vue'
const rule = ref(false)
const loading = ref(false)
const ruleFormRef = ref<FormInstance>()
const wee = (row: any) => {
  rule.value = true
  userData.value.username = row.username
  userData.value.role = row.role
  userData.value.id = row.id
}
const userData = ref({
  id: '',
  username: '',
  password: '',
  role: '',
})
const emit = defineEmits(['efff'])

const submitForm = async (formEl: FormInstance | undefined) => {
  try {
    if (!formEl) return
    await formEl.validate()
    emit('efff', { ...userData.value })
  } catch {
    ElMessage.error('校验失败,请检查数据')
  }
}

const close = () => {
  rule.value = false
  resetForm(ruleFormRef.value)
}
const rules = ref<FormRules<typeof userData>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请输入权限', trigger: 'blur' }],
})

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
defineExpose({ wee, close })
</script>
