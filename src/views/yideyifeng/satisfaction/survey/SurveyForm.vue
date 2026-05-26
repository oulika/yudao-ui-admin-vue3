<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="700px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="调查标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入调查标题" />
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
import { SatisfactionSurveyApi, SatisfactionSurvey } from '@/api/yideyifeng/satisfaction/survey'

/** 满意度调查 表单 */
defineOptions({ name: 'SurveyForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  title: undefined,
  year: new Date().getFullYear(),
  quarter: 1,
  startDate: undefined,
  endDate: undefined,
  status: 0,
  sort: 0,
})
const formRules = reactive({
  title: [{ required: true, message: '请输入调查标题', trigger: 'blur' }],
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
      formData.value = await SatisfactionSurveyApi.get(id)
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
    const data = formData.value as unknown as SatisfactionSurvey
    if (formType.value === 'create') {
      await SatisfactionSurveyApi.create(data)
      message.success(t('common.createSuccess'))
    } else {
      await SatisfactionSurveyApi.update(data)
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
    year: new Date().getFullYear(),
    quarter: 1,
    startDate: undefined,
    endDate: undefined,
    status: 0,
    sort: 0,
  }
  formRef.value?.resetFields()
}
</script>
