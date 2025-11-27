<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="员工ID" prop="staffId">
        <el-input v-model="formData.staffId" placeholder="请输入员工ID" />
      </el-form-item>
      <el-form-item label="季度" prop="quarter">
        <el-input v-model="formData.quarter" placeholder="请输入季度" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-input v-model="formData.category" placeholder="请输入分类" />
      </el-form-item>
      <el-form-item label="条目" prop="item">
        <el-input v-model="formData.item" placeholder="请输入条目" />
      </el-form-item>
      <el-form-item label="分值" prop="points">
        <el-input v-model="formData.points" placeholder="请输入分值" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="评审科室" prop="department">
        <el-input v-model="formData.department" placeholder="请输入评审科室" />
      </el-form-item>
      <el-form-item label="图片路径" prop="imagePath">
        <el-input v-model="formData.imagePath" placeholder="请输入图片路径" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { BehaviorRecordsApi, BehaviorRecords } from '@/api/yideyifeng/behaviorrecords'

/** 行为记录 表单 */
defineOptions({ name: 'BehaviorRecordsForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  staffId: undefined,
  quarter: undefined,
  category: undefined,
  item: undefined,
  points: undefined,
  remark: undefined,
  department: undefined,
  imagePath: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await BehaviorRecordsApi.getBehaviorRecords(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as BehaviorRecords
    if (formType.value === 'create') {
      await BehaviorRecordsApi.createBehaviorRecords(data)
      message.success(t('common.createSuccess'))
    } else {
      await BehaviorRecordsApi.updateBehaviorRecords(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    staffId: undefined,
    quarter: undefined,
    category: undefined,
    item: undefined,
    points: undefined,
    remark: undefined,
    department: undefined,
    imagePath: undefined,
  }
  formRef.value?.resetFields()
}
</script>