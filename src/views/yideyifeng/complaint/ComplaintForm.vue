<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="700px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="被投诉人" prop="staffName">
        <el-input v-model="formData.staffName" placeholder="请输入员工姓名" />
      </el-form-item>
      <el-form-item label="科室" prop="department">
        <el-input v-model="formData.department" placeholder="请输入科室" />
      </el-form-item>
      <el-form-item label="投诉类型" prop="complaintType">
        <el-select v-model="formData.complaintType" placeholder="请选择类型">
          <el-option label="服务" value="服务" />
          <el-option label="态度" value="态度" />
          <el-option label="廉洁" value="廉洁" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-select v-model="formData.source" placeholder="请选择来源">
          <el-option label="信访" value="信访" />
          <el-option label="热线" value="热线" />
          <el-option label="现场" value="现场" />
          <el-option label="网络" value="网络" />
        </el-select>
      </el-form-item>
      <el-form-item label="投诉内容" prop="content">
        <el-input v-model="formData.content" type="textarea" :rows="3" placeholder="请输入投诉内容" />
      </el-form-item>
      <el-form-item label="投诉人姓名" prop="complainerName">
        <el-input v-model="formData.complainerName" placeholder="请输入投诉人姓名" />
      </el-form-item>
      <el-form-item label="联系方式" prop="complainerContact">
        <el-input v-model="formData.complainerContact" placeholder="请输入联系方式" />
      </el-form-item>
      <el-form-item label="年度" prop="year">
        <el-input-number v-model="formData.year" :min="2000" :max="2100" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ComplaintApi, Complaint } from '@/api/yideyifeng/complaint'

/** 投诉 表单 */
defineOptions({ name: 'ComplaintForm' })

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
  complaintType: undefined,
  source: undefined,
  content: undefined,
  complainerName: undefined,
  complainerContact: undefined,
  year: new Date().getFullYear(),
  status: 0,
})
const formRules = reactive({
  staffName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  content: [{ required: true, message: '请输入投诉内容', trigger: 'blur' }],
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
      formData.value = await ComplaintApi.get(id)
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
    const data = formData.value as unknown as Complaint
    if (formType.value === 'create') {
      await ComplaintApi.create(data)
      message.success(t('common.createSuccess'))
    } else {
      await ComplaintApi.update(data)
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
    complaintType: undefined,
    source: undefined,
    content: undefined,
    complainerName: undefined,
    complainerContact: undefined,
    year: new Date().getFullYear(),
    status: 0,
  }
  formRef.value?.resetFields()
}
</script>
