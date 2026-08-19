<template>
  <el-dialog v-model="dialog" title="修改学生">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="学生名" prop="pass">
        <el-input maxlength="10" v-model="ruleForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="性别" prop="checkPass">
        <el-input v-model="ruleForm.gender" autocomplete="off" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="ruleForm.age" />
      </el-form-item>
      <el-form-item label="年级班级" prop="classroom">
        <el-input v-model="ruleForm.classroom"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialog = false">取消</el-button>
      <el-button v-loading.fullscreen.lock="loading" type="primary" @click="submitForm(ruleFormRef)"
        >确认</el-button
      >
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import student from '@/utils/admin'
import { ElLoading } from 'element-plus'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const dialog = ref(false)
const loading = ref(false)
const emit = defineEmits(['on-update'])
const open = (row: any) => {
  if (String(userStore.userID) !== String(row.user_id) && userStore.role !== 'admin') {
    dialog.value = false
    ElMessage.error('你要干嘛?这学生是你的吗?')
    return
  }
  dialog.value = true
  ruleForm.value.name = row.name
  ruleForm.value.gender = row.gender
  ruleForm.value.age = row.age
  ruleForm.value.id = row.id
  ruleForm.value.classroom = row.classroom
}

defineExpose({ open })

const ruleFormRef = ref<FormInstance>()

const ruleForm = ref({
  name: '',
  gender: '',
  age: '',
  id: '',
  classroom: '',
})

const rules = ref<FormRules<typeof ruleForm>>({
  name: [{ required: true, message: '请输入学生名', trigger: 'blur' }],
  gender: [{ required: true, message: '请输入性别', trigger: 'blur' }],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '你好好写年龄,必须是数字!', trigger: 'blur' },
  ],
  classroom: [{ required: true, message: '请输入班级', trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  loading.value = true
  try {
    await formEl.validate() // 校验不通过会抛异常，通过则继续往下
    await student.put(`/student/${ruleForm.value.id}`, ruleForm.value)
    dialog.value = false
    ElMessage({
      message: '修改完成',
      type: 'success',
    })
    emit('on-update')
  } catch {
    dialog.value = false
    ElMessage.error('修改时出了问题,稍后再试')
  } finally {
    loading.value = false
  }
}
setTimeout(() => {
  loading.value = false
}, 2000)
</script>
