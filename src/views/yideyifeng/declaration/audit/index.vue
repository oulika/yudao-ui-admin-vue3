<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="年度" prop="year">
        <el-input v-model="queryParams.year" placeholder="请输入年度" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="科室" prop="department">
        <el-input v-model="queryParams.department" placeholder="请输入科室" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option label="待审核" :value="0" />
          <el-option label="审核通过" :value="1" />
          <el-option label="终审通过" :value="2" />
          <el-option label="驳回" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table row-key="id" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="60" />
      <el-table-column label="员工姓名" align="center" prop="staffName" />
      <el-table-column label="科室" align="center" prop="department" />
      <el-table-column label="年度" align="center" prop="year" width="70" />
      <el-table-column label="季度" align="center" prop="quarter" width="60" />
      <el-table-column label="分类" align="center" prop="category" />
      <el-table-column label="条目" align="center" prop="item" />
      <el-table-column label="分值" align="center" prop="points" />
      <el-table-column label="说明" align="center" prop="description" show-overflow-tooltip />
      <el-table-column label="状态" align="center" prop="status" width="90">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">科室审核通过</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="primary">终审通过</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="danger">驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="auditorName" />
      <el-table-column label="审核时间" align="center" prop="auditTime" width="160" />
      <el-table-column label="操作" align="center" min-width="150px">
        <template #default="scope">
          <el-button v-if="scope.row.status === 0" link type="success" @click="handleAudit(scope.row, true)" v-hasPermi="['yideyifeng:declaration-audit:operate']">通过</el-button>
          <el-button v-if="scope.row.status === 0" link type="danger" @click="handleAudit(scope.row, false)" v-hasPermi="['yideyifeng:declaration-audit:operate']">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { DeclarationApi, Declaration } from '@/api/yideyifeng/declaration'

/** 审核管理 列表 */
defineOptions({ name: 'DeclarationAudit' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<Declaration[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  year: undefined,
  department: undefined,
  status: undefined,
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await DeclarationApi.getAuditPage(queryParams)
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

const handleAudit = async (row: Declaration, passed: boolean) => {
  try {
    const remark = await message.confirm(passed ? '确认通过该申报？' : '确认驳回该申报？', '审核确认')
    await DeclarationApi.audit(row.id!, passed, remark || '')
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
