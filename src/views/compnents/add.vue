<template>
  <el-dialog v-model="rule" title="添加用户" width="500px" @closed="resetForm(ruleFormRef)">
    <el-form
      ref="ruleFormRef"
      style="max-width: 100%"
      :model="form"
      status-icon
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          maxlength="10"
          v-model="form.username"
          autocomplete="off"
          placeholder="输入你的用户名"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          autocomplete="off"
          placeholder="输入你的密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="rule = false">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const rule = ref(false)
const ruleFormRef = ref<FormInstance>()

const emit = defineEmits(['submit'])

const form = ref({
  username: '',
  password: '',
})

const rules = ref<FormRules<typeof form>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const addDialog = () => {
  rule.value = true
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate() // 校验不通过会抛异常
    emit('submit', { ...form.value }) // 把表单数据抛给父组件
  } catch {
    ElMessage.error('表单校验未通过,请检查填写内容')
  }
}

// 提交成功后由父组件调用,关弹窗+重置表单
const closeDialog = () => {
  rule.value = false
  resetForm(ruleFormRef.value)
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

defineExpose({ addDialog, closeDialog })
</script>
