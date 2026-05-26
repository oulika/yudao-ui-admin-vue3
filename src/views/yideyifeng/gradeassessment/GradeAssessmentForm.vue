<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="员工姓名" prop="staffName">
        <el-input v-model="formData.staffName" placeholder="请输入员工姓名" />
      </el-form-item>
      <el-form-item label="科室" prop="department">
        <el-input v-model="formData.department" placeholder="请输入科室" />
      </el-form-item>
      <el-form-item label="年度" prop="year">
        <el-input-number v-model="formData.year" :min="2000" :max="2100" />
      </el-form-item>
      <el-form-item label="年度总分" prop="totalScore">
        <el-input-number v-model="formData.totalScore" :precision="2" :step="1" />
      </el-form-item>
      <el-form-item label="等级" prop="grade">
        <el-select v-model="formData.grade" placeholder="请选择等级">
          <el-option label="优秀" value="优秀" />
          <el-option label="良好" value="良好" />
          <el-option label="一般" value="一般" />
          <el-option label="较差" value="较差" />
        </el-select>
      </el-form-item>
      <el-form-item label="一票否决" prop="unqualified">
        <el-switch v-model="formData.unqualified" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { GradeAssessmentApi, GradeAssessment } from '@/api/yideyifeng/gradeassessment'

/** 等级评定 表单 */
defineOptions({ name: 'GradeAssessmentForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  staffName: undefined,
  department: undefined,
  year: new Date().getFullYear(),
  totalScore: undefined,
  grade: undefined,
  unqualified: 0,
  isLocked: 0,
  remark: undefined,
})
const formRules = reactive({})
const formRef = ref()

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      formData.value = await GradeAssessmentApi.get(id)
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
    const data = formData.value as unknown as GradeAssessment
    if (formType.value === 'create') {
      // generate not used for individual create, use update path
      await GradeAssessmentApi.update(data)
      message.success(t('common.createSuccess'))
    } else {
      await GradeAssessmentApi.update(data)
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
    staffName: undefined,
    department: undefined,
    year: new Date().getFullYear(),
    totalScore: undefined,
    grade: undefined,
    unqualified: 0,
    isLocked: 0,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
