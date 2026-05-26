<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="调查ID" prop="surveyId">
        <el-input v-model="queryParams.surveyId" placeholder="请输入调查ID" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="科室" prop="department">
        <el-input v-model="queryParams.department" placeholder="请输入科室" clearable @keyup.enter="handleQuery" class="!w-240px" />
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
      <el-table-column label="被评价员工" align="center" prop="staffName" />
      <el-table-column label="科室" align="center" prop="department" />
      <el-table-column label="满意度得分" align="center" prop="score" />
      <el-table-column label="评价人类型" align="center" prop="respondentType" />
      <el-table-column label="提交时间" align="center" prop="submitTime" width="160" />
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { SatisfactionResultApi, SatisfactionResultStat } from '@/api/yideyifeng/satisfaction/result'

/** 满意度结果统计 列表 */
defineOptions({ name: 'SatisfactionResult' })

const loading = ref(true)
const list = ref<SatisfactionResultStat[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  surveyId: undefined,
  department: undefined,
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await SatisfactionResultApi.getPage(queryParams)
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

onMounted(() => {
  getList()
})
</script>
