<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
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
      <el-form-item label="分类" prop="category">
        <el-input v-model="formData.category" placeholder="如：志愿服务、好人好事" />
      </el-form-item>
      <el-form-item label="条目" prop="item">
        <el-input v-model="formData.item" placeholder="请输入条目" />
      </el-form-item>
      <el-form-item label="分值" prop="points">
        <el-input-number v-model="formData.points" :precision="1" :step="0.5" />
      </el-form-item>
      <el-form-item label="说明" prop="description">
        <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入说明" />
      </el-form-item>
      <el-form-item label="证明材料" prop="attachmentUrls">
        <el-input v-model="formData.attachmentUrls" placeholder="请上传证明材料" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { DeclarationApi, Declaration } from '@/api/yideyifeng/declaration'

/** 申报 表单 */
defineOptions({ name: 'DeclarationForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  year: new Date().getFullYear(),
  quarter: 1,
  category: undefined,
  item: undefined,
  points: undefined,
  description: undefined,
  attachmentUrls: undefined,
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
      formData.value = await DeclarationApi.get(id)
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
    const data = formData.value as unknown as Declaration
    if (formType.value === 'create') {
      await DeclarationApi.create(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeclarationApi.update(data)
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
    quarter: 1,
    category: undefined,
    item: undefined,
    points: undefined,
    description: undefined,
    attachmentUrls: undefined,
  }
  formRef.value?.resetFields()
}
</script>
