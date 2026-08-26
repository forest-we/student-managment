<template>
  <el-dialog v-model="onkil" title="添加学生">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="学生名" prop="name">
        <el-input maxlength="10" v-model="ruleForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-input v-model="ruleForm.gender" autocomplete="off" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="ruleForm.age" />
      </el-form-item>
      <el-form-item label="年级班级" prop="class">
        <el-input v-model="ruleForm.classroom" />
      </el-form-item>
      <el-form-item label="学号" prop="student_no">
        <el-input v-model="ruleForm.student_no" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onkil = false">取消</el-button>
      <el-button
        v-loading.fullscreen.lock="appLoading"
        type="primary"
        @click="submitForm(ruleFormRef)"
        >确认</el-button
      >
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
const onkil = ref(false)
import { ElLoading } from 'element-plus'
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import student from '@/utils/admin'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const emli = defineEmits(['on-uupp'])
const ruleFormRef = ref<FormInstance>()
const oopn = () => {
  onkil.value = true
}

const ruleForm = ref({
  id: '',
  name: '',
  age: '',
  gender: '',
  classroom: '',
  student_no: '',
  password: '',
})
if (userStore.role === 'admin') {
  ruleForm.value.classroom = '管理员测试数据'
}

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [{ required: true, message: '不好好写学生名是这样的', trigger: 'blur' }],
  gender: [{ required: true, message: '性别有问题', trigger: 'blur' }],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '年龄必须是数字', trigger: 'blur' },
  ],
  classroom: [{ required: true, message: '班级没写', trigger: 'blur' }],
  student_no: [{ required: true, message: '学号为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码为空', trigger: 'blur' }],
})

const appLoading = ref(false)
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    appLoading.value = true
    try {
      if (userStore.role !== 'admin' && userStore.role !== 'normal') {
        ElMessage.error({
          message: '你没权限调用此接口',
        })
        onkil.value = false
      }
      if (valid) {
        console.log('submit!')
        const res = await student.post('admin/student', ruleForm.value)
        if (res.data.code === 200) {
          onkil.value = false
          emli('on-uupp')
          ElMessage({
            message: '新增成功',
            type: 'success',
          })
        }
      } else {
        console.log('error submit!')
      }
    } catch {
      ElMessage.error('新增学生时出现错误')
    } finally {
      appLoading.value = false
    }
  })
}

setTimeout(() => {
  appLoading.value = false
}, 2000)
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

defineExpose({ oopn })
</script>
