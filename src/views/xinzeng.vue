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
    </el-form>
    <template #footer>
      <el-button @click="onkil = false">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
const onkil = ref(false)
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import student from '@/utils/admin'
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
})
const rules = reactive<FormRules<typeof ruleForm>>({
  name: [{ required: true, message: '不好好写学生名是这样的', trigger: 'blur' }],
  gender: [{ required: true, message: '性别有问题', trigger: 'blur' }],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '年龄必须是数字', trigger: 'blur' },
  ],
  classroom: [{ required: true, message: '班级没写', trigger: 'blur' }],
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      console.log('submit!')
      await student.post('/student', ruleForm.value)
      onkil.value = false
      emli('on-uupp')
    } else {
      console.log('error submit!')
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

defineExpose({ oopn })
</script>
