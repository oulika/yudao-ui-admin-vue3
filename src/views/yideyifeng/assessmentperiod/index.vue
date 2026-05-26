<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="年度" prop="year">
        <el-input v-model="queryParams.year" placeholder="请输入年度" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="季度" prop="quarter">
        <el-select v-model="queryParams.quarter" placeholder="请选择季度" clearable class="!w-240px">
          <el-option label="全年" :value="0" />
          <el-option label="第一季度" :value="1" />
          <el-option label="第二季度" :value="2" />
          <el-option label="第三季度" :value="3" />
          <el-option label="第四季度" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option label="草稿" :value="0" />
          <el-option label="开放" :value="1" />
          <el-option label="审核中" :value="2" />
          <el-option label="已归档" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['yideyifeng:assessment-period:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table row-key="id" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="年度" align="center" prop="year" />
      <el-table-column label="季度" align="center" prop="quarter">
        <template v-slot="scope">
          <span v-if="scope.row.quarter === 0">全年</span>
          <span v-else>{{ scope.row.quarter }}季度</span>
        </template>
      </el-table-column>
      <el-table-column label="周期名称" align="center" prop="periodName" />
      <el-table-column label="开始日期" align="center" prop="startDate" width="120px" />
      <el-table-column label="结束日期" align="center" prop="endDate" width="120px" />
      <el-table-column label="状态" align="center" prop="status">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" type="info">草稿</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">开放</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="warning">审核中</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="danger">已归档</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" min-width="200px">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['yideyifeng:assessment-period:update']">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['yideyifeng:assessment-period:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <AssessmentPeriodForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { AssessmentPeriodApi, AssessmentPeriod } from '@/api/yideyifeng/assessmentperiod'
import AssessmentPeriodForm from './AssessmentPeriodForm.vue'

/** 考评周期 列表 */
defineOptions({ name: 'AssessmentPeriod' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<AssessmentPeriod[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  year: undefined,
  quarter: undefined,
  status: undefined,
})
const queryFormRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AssessmentPeriodApi.getPage(queryParams)
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

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await AssessmentPeriodApi.delete(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
