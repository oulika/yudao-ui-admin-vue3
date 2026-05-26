<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" v-loading="formLoading">
      <el-form-item label="年度" prop="year">
        <el-input-number v-model="formData.year" :min="2000" :max="2100" placeholder="请输入年度" />
      </el-form-item>
      <el-form-item label="季度" prop="quarter">
        <el-select v-model="formData.quarter" placeholder="请选择季度">
          <el-option label="全年" :value="0" />
          <el-option label="第一季度" :value="1" />
          <el-option label="第二季度" :value="2" />
          <el-option label="第三季度" :value="3" />
          <el-option label="第四季度" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="周期名称" prop="periodName">
        <el-input v-model="formData.periodName" placeholder="如：2025年第一季度" />
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker v-model="formData.startDate" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker v-model="formData.endDate" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option label="草稿" :value="0" />
          <el-option label="开放" :value="1" />
          <el-option label="审核中" :value="2" />
          <el-option label="已归档" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { AssessmentPeriodApi, AssessmentPeriod } from '@/api/yideyifeng/assessmentperiod'

/** 考评周期 表单 */
defineOptions({ name: 'AssessmentPeriodForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  year: new Date().getFullYear(),
  quarter: 0,
  periodName: undefined,
  startDate: undefined,
  endDate: undefined,
  status: 0,
  sort: 0,
})

const formRules = reactive({
  year: [{ required: true, message: '请输入年度', trigger: 'blur' }],
  quarter: [{ required: true, message: '请选择季度', trigger: 'change' }],
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
      formData.value = await AssessmentPeriodApi.get(id)
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
    const data = formData.value as unknown as AssessmentPeriod
    if (formType.value === 'create') {
      await AssessmentPeriodApi.create(data)
      message.success(t('common.createSuccess'))
    } else {
      await AssessmentPeriodApi.update(data)
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
    year: new Date().getFullYear(),
    quarter: 0,
    periodName: undefined,
    startDate: undefined,
    endDate: undefined,
    status: 0,
    sort: 0,
  }
  formRef.value?.resetFields()
}
</script>
