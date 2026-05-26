<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="700px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入公示标题" />
      </el-form-item>
      <el-form-item label="年度" prop="year">
        <el-input-number v-model="formData.year" :min="2000" :max="2100" />
      </el-form-item>
      <el-form-item label="科室" prop="department">
        <el-input v-model="formData.department" placeholder="全部或特定科室" />
      </el-form-item>
      <el-form-item label="公示内容" prop="content">
        <el-input v-model="formData.content" type="textarea" :rows="5" placeholder="请输入公示内容" />
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker v-model="formData.startDate" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker v-model="formData.endDate" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { PublicNoticeApi, PublicNotice } from '@/api/yideyifeng/publicnotice/notice'

/** 公示 表单 */
defineOptions({ name: 'NoticeForm' })

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
  department: undefined,
  content: undefined,
  startDate: undefined,
  endDate: undefined,
  status: 0,
})
const formRules = reactive({
  title: [{ required: true, message: '请输入公示标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公示内容', trigger: 'blur' }],
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
      formData.value = await PublicNoticeApi.get(id)
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
    const data = formData.value as unknown as PublicNotice
    if (formType.value === 'create') {
      await PublicNoticeApi.create(data)
      message.success(t('common.createSuccess'))
    } else {
      await PublicNoticeApi.update(data)
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
    department: undefined,
    content: undefined,
    startDate: undefined,
    endDate: undefined,
    status: 0,
  }
  formRef.value?.resetFields()
}
</script>
