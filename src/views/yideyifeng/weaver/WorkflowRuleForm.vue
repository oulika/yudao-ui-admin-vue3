<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="640px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px" v-loading="formLoading">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="formData.ruleName" placeholder="请输入规则名称" />
      </el-form-item>
      <el-form-item label="流程ID" prop="workflowId">
        <el-input v-model="formData.workflowId" placeholder="为空表示匹配全部流程" />
      </el-form-item>
      <el-form-item label="流程名称" prop="workflowName">
        <el-input v-model="formData.workflowName" placeholder="请输入流程名称" />
      </el-form-item>
      <el-form-item label="业务类型" prop="businessType">
        <el-select v-model="formData.businessType" placeholder="请选择业务类型" class="w-1/1">
          <el-option label="申报" value="declaration" />
          <el-option label="投诉" value="complaint" />
        </el-select>
      </el-form-item>
      <el-form-item label="OA动作" prop="oaAction">
        <el-input v-model="formData.oaAction" placeholder="approve / reject / complete / archive" />
      </el-form-item>
      <el-form-item label="本地动作" prop="localAction">
        <el-select v-model="formData.localAction" placeholder="请选择本地动作" class="w-1/1">
          <el-option label="通过" value="approve" />
          <el-option label="驳回" value="reject" />
          <el-option label="完成" value="complete" />
        </el-select>
      </el-form-item>
      <el-form-item label="启用" prop="enabled">
        <el-switch v-model="formData.enabled" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" class="w-1/1" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { WeaverOaApi } from '@/api/yideyifeng/weaver'
import type { WeaverWorkflowRule } from '@/api/yideyifeng/weaver'

defineOptions({ name: 'WeaverWorkflowRuleForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref<WeaverWorkflowRule>({
  ruleName: '',
  workflowId: undefined,
  workflowName: undefined,
  businessType: 'declaration',
  oaAction: 'approve',
  localAction: 'approve',
  enabled: true,
  sort: 0,
  remark: undefined
})
const formRules = reactive({
  ruleName: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
  businessType: [{ required: true, message: '业务类型不能为空', trigger: 'change' }],
  oaAction: [{ required: true, message: 'OA动作不能为空', trigger: 'blur' }],
  localAction: [{ required: true, message: '本地动作不能为空', trigger: 'change' }]
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
      formData.value = await WeaverOaApi.getWorkflowRule(id)
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
    if (formType.value === 'create') {
      await WeaverOaApi.createWorkflowRule(formData.value)
      message.success(t('common.createSuccess'))
    } else {
      await WeaverOaApi.updateWorkflowRule(formData.value)
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
    ruleName: '',
    workflowId: undefined,
    workflowName: undefined,
    businessType: 'declaration',
    oaAction: 'approve',
    localAction: 'approve',
    enabled: true,
    sort: 0,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
