<template>
  <Dialog :title="'处理舆情'" v-model="dialogVisible" width="700">
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
      <el-form-item label="处理结果" prop="handleResult">
        <el-input v-model="formData.handleResult" type="textarea" :rows="5" placeholder="请输入处理结果" />
      </el-form-item>
      <el-form-item label="处理人姓名" prop="handlerName">
        <el-input v-model="formData.handlerName" placeholder="请输入处理人姓名" />
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

/** 舆情处理表单 */
defineOptions({ name: 'PublicOpinionHandle' })

const message = useMessage()

const dialogVisible = ref(false)
const formLoading = ref(false)
const formData = ref({
  id: undefined,
  opinionNo: '',
  handleResult: '',
  handlerName: '',
})

const formRules = reactive({
  handleResult: [{ required: true, message: '请输入处理结果', trigger: 'blur' }],
  handlerName: [{ required: true, message: '请输入处理人姓名', trigger: 'blur' }],
})
const formRef = ref()

const open = async (id: number) => {
  dialogVisible.value = true
  formData.value.id = id
  const detail = await PublicOpinionApi.getPublicOpinion(id)
  formData.value.opinionNo = detail.opinionNo
  formData.value.handleResult = ''
  formData.value.handlerName = ''
}
defineExpose({ open })

const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    await PublicOpinionApi.handlePublicOpinion({
      id: formData.value.id,
      handleResult: formData.value.handleResult,
      handlerName: formData.value.handlerName,
    })
    message.success('处理成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
