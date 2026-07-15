<template>
  <Dialog :title="'舆情跟踪'" v-model="dialogVisible" width="700">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="舆情编号">
        <el-input v-model="formData.opinionNo" disabled />
      </el-form-item>
      <el-form-item label="跟踪状态" prop="followUpStatus">
        <el-select v-model="formData.followUpStatus" placeholder="请选择跟踪状态" style="width: 100%">
          <el-option label="持续关注" value="持续关注" />
          <el-option label="已缓解" value="已缓解" />
          <el-option label="已消除" value="已消除" />
        </el-select>
      </el-form-item>
      <el-form-item label="跟踪内容" prop="followUpContent">
        <el-input v-model="formData.followUpContent" type="textarea" :rows="5" placeholder="请输入跟踪内容" />
      </el-form-item>
      <el-form-item label="跟踪人姓名" prop="handlerName">
        <el-input v-model="formData.handlerName" placeholder="请输入跟踪人姓名" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { PublicOpinionApi } from '@/api/yideyifeng/publicopinion'

/** 舆情跟踪表单 */
defineOptions({ name: 'PublicOpinionFollowUpForm' })

const message = useMessage()

const dialogVisible = ref(false)
const formLoading = ref(false)
const formData = ref({
  opinionId: undefined,
  opinionNo: '',
  followUpContent: '',
  followUpStatus: '持续关注',
  handlerName: '',
})

const formRules = reactive({
  followUpContent: [{ required: true, message: '请输入跟踪内容', trigger: 'blur' }],
  followUpStatus: [{ required: true, message: '请选择跟踪状态', trigger: 'change' }],
})
const formRef = ref()

const open = async (opinionId: number) => {
  dialogVisible.value = true
  formData.value.opinionId = opinionId
  const detail = await PublicOpinionApi.getPublicOpinion(opinionId)
  formData.value.opinionNo = detail.opinionNo
  formData.value.followUpContent = ''
  formData.value.followUpStatus = '持续关注'
  formData.value.handlerName = ''
}
defineExpose({ open })

const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    await PublicOpinionApi.addFollowUp({
      opinionId: formData.value.opinionId,
      followUpContent: formData.value.followUpContent,
      followUpStatus: formData.value.followUpStatus,
      handlerName: formData.value.handlerName,
    })
    message.success('跟踪成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
