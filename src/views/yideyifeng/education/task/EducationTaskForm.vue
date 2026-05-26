<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="700px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入任务标题" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择类型">
          <el-option label="培训" value="培训" />
          <el-option label="考试" value="考试" />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="formData.content" type="textarea" :rows="4" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="年度" prop="year">
        <el-input-number v-model="formData.year" :min="2000" :max="2100" />
      </el-form-item>
      <el-form-item label="季度" prop="quarter">
        <el-select v-model="formData.quarter" placeholder="请选择季度">
          <el-option label="第一季度" :value="1" />
          <el-option label="第二季度" :value="2" />
          <el-option label="第三季度" :value="3" />
          <el-option label="第四季度" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="目标科室" prop="targetDept">
        <el-input v-model="formData.targetDept" placeholder="请输入目标科室" />
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker v-model="formData.startDate" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker v-model="formData.endDate" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option label="未开始" :value="0" />
          <el-option label="进行中" :value="1" />
          <el-option label="已结束" :value="2" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { EducationTaskApi, EducationTask } from '@/api/yideyifeng/education/task'

/** 学习任务 表单 */
defineOptions({ name: 'EducationTaskForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  title: undefined,
  type: undefined,
  content: undefined,
  year: new Date().getFullYear(),
  quarter: 1,
  targetDept: undefined,
  startDate: undefined,
  endDate: undefined,
  status: 0,
})
const formRules = reactive({
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
})
const formRef = ref()

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      formData.value = await EducationTaskApi.get(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value as unknown as EducationTask
    if (formType.value === 'create') {
      await EducationTaskApi.create(data)
      message.success(t('common.createSuccess'))
    } else {
      await EducationTaskApi.update(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: undefined,
    title: undefined,
    type: undefined,
    content: undefined,
    year: new Date().getFullYear(),
    quarter: 1,
    targetDept: undefined,
    startDate: undefined,
    endDate: undefined,
    status: 0,
  }
  formRef.value?.resetFields()
}
</script>
