<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="年度" prop="year">
        <el-input v-model="queryParams.year" placeholder="请输入年度" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable class="!w-240px">
          <el-option label="培训" value="培训" />
          <el-option label="考试" value="考试" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option label="未开始" :value="0" />
          <el-option label="进行中" :value="1" />
          <el-option label="已结束" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['yideyifeng:education-task:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table row-key="id" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="60" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="类型" align="center" prop="type" width="80" />
      <el-table-column label="年度" align="center" prop="year" width="70" />
      <el-table-column label="季度" align="center" prop="quarter" width="60" />
      <el-table-column label="目标科室" align="center" prop="targetDept" />
      <el-table-column label="开始日期" align="center" prop="startDate" width="120px" />
      <el-table-column label="结束日期" align="center" prop="endDate" width="120px" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" type="info">未开始</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">进行中</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['yideyifeng:education-task:update']">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['yideyifeng:education-task:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <EducationTaskForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { EducationTaskApi, EducationTask } from '@/api/yideyifeng/education/task'
import EducationTaskForm from './EducationTaskForm.vue'

/** 学习任务 列表 */
defineOptions({ name: 'EducationTask' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<EducationTask[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  year: undefined,
  type: undefined,
  status: undefined,
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await EducationTaskApi.getPage(queryParams)
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
    await EducationTaskApi.delete(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
