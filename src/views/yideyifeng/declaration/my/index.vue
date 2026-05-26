<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="年度" prop="year">
        <el-input v-model="queryParams.year" placeholder="请输入年度" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="季度" prop="quarter">
        <el-select v-model="queryParams.quarter" placeholder="请选择季度" clearable class="!w-240px">
          <el-option label="第一季度" :value="1" />
          <el-option label="第二季度" :value="2" />
          <el-option label="第三季度" :value="3" />
          <el-option label="第四季度" :value="4" />
        </el-select>
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
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['yideyifeng:declaration:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增申报
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
      <el-table-column label="季度" align="center" prop="quarter" width="60" />
      <el-table-column label="分类" align="center" prop="category" />
      <el-table-column label="条目" align="center" prop="item" />
      <el-table-column label="分值" align="center" prop="points" />
      <el-table-column label="状态" align="center" prop="status" width="90">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">科室审核通过</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="primary">终审通过</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="danger">驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" align="center" prop="auditRemark" show-overflow-tooltip />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['yideyifeng:declaration:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <DeclarationForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DeclarationApi, Declaration } from '@/api/yideyifeng/declaration'
import DeclarationForm from '../DeclarationForm.vue'

/** 我的申报 列表 */
defineOptions({ name: 'Declaration' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<Declaration[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  year: undefined,
  quarter: undefined,
  status: undefined,
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await DeclarationApi.getMyPage(queryParams)
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
    await DeclarationApi.delete(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
