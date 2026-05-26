<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="年度" prop="year">
        <el-input v-model="queryParams.year" placeholder="请输入年度" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="员工姓名" prop="staffName">
        <el-input v-model="queryParams.staffName" placeholder="请输入姓名" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="科室" prop="department">
        <el-input v-model="queryParams.department" placeholder="请输入科室" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="handleGenerate" v-hasPermi="['yideyifeng:grade-assessment:generate']">
          <Icon icon="ep:magic-stick" class="mr-5px" /> 批量生成
        </el-button>
        <el-button type="success" plain @click="handleExport" v-hasPermi="['yideyifeng:grade-assessment:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table row-key="id" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="60" />
      <el-table-column label="员工姓名" align="center" prop="staffName" />
      <el-table-column label="科室" align="center" prop="department" />
      <el-table-column label="年度" align="center" prop="year" width="70" />
      <el-table-column label="年度总分" align="center" prop="totalScore" />
      <el-table-column label="等级" align="center" prop="grade" width="90">
        <template v-slot="scope">
          <el-tag v-if="scope.row.grade === '优秀'" type="success">{{ scope.row.grade }}</el-tag>
          <el-tag v-else-if="scope.row.grade === '良好'" type="primary">{{ scope.row.grade }}</el-tag>
          <el-tag v-else-if="scope.row.grade === '一般'" type="warning">{{ scope.row.grade }}</el-tag>
          <el-tag v-else-if="scope.row.grade === '较差'" type="danger">{{ scope.row.grade }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="一票否决" align="center" prop="unqualified" width="90">
        <template v-slot="scope">
          <span>{{ scope.row.unqualified ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已锁定" align="center" prop="isLocked" width="70">
        <template v-slot="scope">
          <el-tag v-if="scope.row.isLocked" type="danger">已锁定</el-tag>
          <el-tag v-else type="info">未锁定</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" align="center" min-width="160px">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)" :disabled="scope.row.isLocked" v-hasPermi="['yideyifeng:grade-assessment:update']">编辑</el-button>
          <el-button v-if="!scope.row.isLocked" link type="warning" @click="handleLock(scope.row.id)" v-hasPermi="['yideyifeng:grade-assessment:lock']">锁定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <GradeAssessmentForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { GradeAssessmentApi, GradeAssessment } from '@/api/yideyifeng/gradeassessment'
import GradeAssessmentForm from './GradeAssessmentForm.vue'
import download from '@/utils/download'

/** 等级评定 列表 */
defineOptions({ name: 'GradeAssessment' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<GradeAssessment[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  year: new Date().getFullYear(),
  staffName: undefined,
  department: undefined,
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await GradeAssessmentApi.getPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleGenerate = async () => {
  try {
    await message.confirm('确认批量生成当前年度等级评定？', '批量生成')
    await GradeAssessmentApi.generate({ year: queryParams.year })
    message.success(t('common.createSuccess'))
    await getList()
  } catch {}
}

const handleLock = async (id: number) => {
  try {
    await message.confirm('锁定后将不可修改，确认锁定？', '锁定确认')
    await GradeAssessmentApi.lock(id)
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

const handleExport = async () => {
  try {
    await message.exportConfirm()
    const data = await GradeAssessmentApi.exportExcel(queryParams)
    download.excel(data, '等级评定.xls')
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
