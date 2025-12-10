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
        <el-select v-model="formData.staffId" placeholder="请选择员工" @change="handleStaffChange">
          <el-option
            v-for="staff in staffs"
            :key="staff.id"
            :label="staff.name"
            :value="staff.id"

          />
        </el-select>
      </el-form-item>
      <el-form-item label="季度" prop="quarter">
        <el-select v-model="formData.quarter" placeholder="请选择季度">
          <el-option label="第一季度" value="1" />
          <el-option label="第二季度" value="2" />
          <el-option label="第三季度" value="3" />
          <el-option label="第四季度" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="formData.category" placeholder="请选择分类">
          <el-option
            v-for="category in templateOptions"
            :key="category.value"
            :label="category.label"
            :value="category.value"
            @change="handleCategoryChange"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="条目" prop="item">
        <el-select
          v-model="formData.item"
          placeholder="请选择项目"
          clearable
          filterable
          :disabled="!formData.category"
          @change="handleItemChange"
          class="full-width"
        >
          <el-option
            v-for="item in itemOptions"
            :key="item.id"
            :label="item.item"
            :value="item.id"
          />
        </el-select>
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
      <el-form-item label="附件" prop="fileUrl">
        <UploadFile :is-show-tip="false" v-model="formData.imagePath" :limit="3" />
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

import { ScoreStaffApi, ScoreStaff } from '@/api/yideyifeng/scorestaff'
import { ScoreTemplateApi, ScoreTemplate } from '@/api/yideyifeng/scoretemplate'
/** 行为记录 表单 */
defineOptions({ name: 'BehaviorRecordsForm' })


interface CategoryTemplate {
  label: string;       // 模板名称
  value: string;       // 模板值
  items: ScoreTemplate[];  // 对应的项目列表
}

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  staffId: undefined,
  staffName: undefined,
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
const staffs = ref<ScoreStaff[]>([]) // 人员列表的数据
const templates = ref<ScoreTemplate[]>([]) // 人员列表的数据
// const categories = ref<
const rawData = ref<ScoreTemplate[]>([])
// 响应式数据
const selectedTemplate: Ref<string> = ref('')
const selectedItem: Ref<number | null> = ref(null)

const handleCategoryChange = (category: string) => {
  if (category) {
    formData.item = null
    selectedTemplate.value = null
  }
};

const handleStaffChange = (staffId: number) =>{
  const staff = staffs.value.find(t => t.id === formData.value.staffId)
  formData.value.staffName=staff.name

}

// 计算属性：提取所有唯一的模板
const templateOptions = computed(() => {
  const templates = new Map<string, CategoryTemplate>()

  rawData.value.forEach(item => {
    if (!templates.has(item.category)) {
      templates.set(item.category, {
        label: item.category,
        value: item.category,
        items: []
      })
    }
    templates.get(item.category)!.items.push(item)
  })

  return Array.from(templates.values())
})

// 计算属性：当前选中模板对应的项目列表
const itemOptions = computed(() => {
  if (!formData.value.category) return []

  const template = templateOptions.value.find(t => t.value === formData.value.category)
  return template ? template.items : []
})

const handleItemChange = (itemId: number) => {
  if (itemId) {
    const template = itemOptions.value.find(item => item.id === itemId)
    if (template) {
      formData.value.points=template.points
      formData.value.department=template.department
      formData.value.remark=template.remark
      formData.value.category=template.category
    }
  } else {
    selectedTemplate.value = null
  }
};
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  staffs.value = await ScoreStaffApi.getAllScoreStaff()
  templates.value = await ScoreTemplateApi.getAllScoreTemplate()
  rawData.value = templates.value


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
