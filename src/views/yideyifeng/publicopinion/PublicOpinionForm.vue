<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="来源" prop="source">
        <el-select v-model="formData.source" placeholder="请选择来源">
          <el-option label="微博" value="weibo" />
          <el-option label="知乎" value="zhihu" />
          <el-option label="新闻网站" value="news" />
          <el-option label="论坛" value="forum" />
          <el-option label="抖音" value="douyin" />
          <el-option label="小红书" value="xhs" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="舆情内容" prop="content">
        <el-input v-model="formData.content" type="textarea" :rows="4" placeholder="请输入舆情内容" />
      </el-form-item>
      <el-form-item label="关联员工" prop="relatedStaffName">
        <el-input v-model="formData.relatedStaffName" placeholder="请输入关联员工姓名" />
      </el-form-item>
      <el-form-item label="关联科室" prop="relatedDepartment">
        <el-input v-model="formData.relatedDepartment" placeholder="请输入关联科室" />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker
          v-model="formData.publishTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime"
          placeholder="选择发布时间"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="年度" prop="year">
        <el-input-number v-model="formData.year" :min="2020" :max="2099" placeholder="请输入年度" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { PublicOpinionApi, PublicOpinion } from '@/api/yideyifeng/publicopinion'

/** 舆情新增/编辑表单 */
defineOptions({ name: 'PublicOpinionForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  source: undefined,
  title: undefined,
  content: undefined,
  relatedStaffId: undefined,
  relatedStaffName: undefined,
  relatedDepartment: undefined,
  publishTime: undefined,
  year: new Date().getFullYear(),
})

const formRules = reactive({
  source: [{ required: true, message: '请选择来源', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入舆情内容', trigger: 'blur' }],
  year: [{ required: true, message: '请输入年度', trigger: 'blur' }],
})
const formRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PublicOpinionApi.getPublicOpinion(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value as unknown as PublicOpinion
    if (formType.value === 'create') {
      await PublicOpinionApi.createPublicOpinion(data)
      message.success(t('common.createSuccess'))
    } else {
      await PublicOpinionApi.updatePublicOpinion(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    source: undefined,
    title: undefined,
    content: undefined,
    relatedStaffId: undefined,
    relatedStaffName: undefined,
    relatedDepartment: undefined,
    publishTime: undefined,
    year: new Date().getFullYear(),
  }
  formRef.value?.resetFields()
}
</script>
