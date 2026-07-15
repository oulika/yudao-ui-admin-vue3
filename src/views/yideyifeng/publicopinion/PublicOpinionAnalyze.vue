<template>
  <Dialog :title="'AI分析'" v-model="dialogVisible" width="700">
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
      <el-form-item label="情感倾向" prop="sentiment">
        <el-select v-model="formData.sentiment" placeholder="请选择情感倾向" style="width: 100%">
          <el-option label="正面" value="positive" />
          <el-option label="中性" value="neutral" />
          <el-option label="负面" value="negative" />
        </el-select>
      </el-form-item>
      <el-form-item label="风险等级" prop="riskLevel">
        <el-select v-model="formData.riskLevel" placeholder="请选择风险等级" style="width: 100%">
          <el-option label="低" value="low" />
          <el-option label="中" value="medium" />
          <el-option label="高" value="high" />
          <el-option label="危急" value="critical" />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级">
        <el-select v-model="formData.priority" placeholder="请选择优先级" style="width: 100%">
          <el-option label="低" value="low" />
          <el-option label="中" value="medium" />
          <el-option label="高" value="high" />
        </el-select>
      </el-form-item>
      <el-form-item label="分析摘要" prop="aiAnalysis">
        <el-input v-model="formData.aiAnalysis" type="textarea" :rows="6" placeholder="请输入AI分析摘要" />
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

/** AI分析表单 */
defineOptions({ name: 'PublicOpinionAnalyze' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const formLoading = ref(false)
const formData = ref({
  id: undefined,
  opinionNo: '',
  sentiment: undefined,
  riskLevel: undefined,
  priority: 'medium',
  aiAnalysis: '',
})

const formRules = reactive({
  sentiment: [{ required: true, message: '请选择情感倾向', trigger: 'change' }],
  riskLevel: [{ required: true, message: '请选择风险等级', trigger: 'change' }],
})
const formRef = ref()

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  resetForm()
  formData.value.id = id
  // 获取舆情详情
  const detail = await PublicOpinionApi.getPublicOpinion(id)
  formData.value.opinionNo = detail.opinionNo
  formData.value.sentiment = detail.sentiment
  formData.value.riskLevel = detail.riskLevel
  formData.value.priority = detail.priority || 'medium'
  formData.value.aiAnalysis = detail.aiAnalysis || ''
}
defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    await PublicOpinionApi.analyzePublicOpinion({
      id: formData.value.id,
      sentiment: formData.value.sentiment,
      riskLevel: formData.value.riskLevel,
      priority: formData.value.priority,
      aiAnalysis: formData.value.aiAnalysis,
    })
    message.success('分析结果保存成功')
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
    opinionNo: '',
    sentiment: undefined,
    riskLevel: undefined,
    priority: 'medium',
    aiAnalysis: '',
  }
  formRef.value?.resetFields()
}
</script>
