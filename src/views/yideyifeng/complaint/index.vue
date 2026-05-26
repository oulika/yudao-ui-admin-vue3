<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="年度" prop="year">
        <el-input v-model="queryParams.year" placeholder="请输入年度" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="员工姓名" prop="staffName">
        <el-input v-model="queryParams.staffName" placeholder="请输入姓名" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option label="待受理" :value="0" />
          <el-option label="处理中" :value="1" />
          <el-option label="已处理" :value="2" />
          <el-option label="已回访" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['yideyifeng:complaint:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" v-hasPermi="['yideyifeng:complaint:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table row-key="id" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="60" />
      <el-table-column label="投诉编号" align="center" prop="complaintNo" width="150" />
      <el-table-column label="被投诉人" align="center" prop="staffName" />
      <el-table-column label="科室" align="center" prop="department" />
      <el-table-column label="类型" align="center" prop="complaintType" />
      <el-table-column label="来源" align="center" prop="source" />
      <el-table-column label="投诉内容" align="center" prop="content" show-overflow-tooltip />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">待受理</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="primary">处理中</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="success">已处理</el-tag>
          <el-tag v-else-if="scope.row.status === 3">已回访</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200px">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['yideyifeng:complaint:update']">编辑</el-button>
          <el-button v-if="scope.row.status <= 1" link type="success" @click="handleHandle(scope.row.id)" v-hasPermi="['yideyifeng:complaint:handle']">处理</el-button>
          <el-button v-if="scope.row.status === 2" link type="warning" @click="handleReturnVisit(scope.row.id)" v-hasPermi="['yideyifeng:complaint:handle']">回访</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['yideyifeng:complaint:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <ComplaintForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { ComplaintApi, Complaint } from '@/api/yideyifeng/complaint'
import ComplaintForm from './ComplaintForm.vue'
import download from '@/utils/download'

/** 投诉管理 列表 */
defineOptions({ name: 'Complaint' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<Complaint[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  year: undefined,
  staffName: undefined,
  status: undefined,
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await ComplaintApi.getPage(queryParams)
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

const handleHandle = async (id: number) => {
  try {
    const result = await message.confirm('请输入处理结果', '处理投诉')
    await ComplaintApi.handle(id, result || '已处理')
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

const handleReturnVisit = async (id: number) => {
  try {
    const result = await message.confirm('请输入回访结果', '投诉回访')
    await ComplaintApi.returnVisit(id, 1, result || '')
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await ComplaintApi.delete(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleExport = async () => {
  try {
    await message.exportConfirm()
    const data = await ComplaintApi.exportExcel(queryParams)
    download.excel(data, '投诉管理.xls')
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
