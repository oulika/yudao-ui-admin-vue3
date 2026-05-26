<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="公示ID" prop="noticeId">
        <el-input v-model="queryParams.noticeId" placeholder="请输入公示ID" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option label="待处理" :value="0" />
          <el-option label="已处理" :value="1" />
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
      <el-table-column label="公示ID" align="center" prop="noticeId" width="70" />
      <el-table-column label="异议人" align="center" prop="staffName" />
      <el-table-column label="异议内容" align="center" prop="content" show-overflow-tooltip />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">待处理</el-tag>
          <el-tag v-else type="success">已处理</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="处理意见" align="center" prop="handleRemark" show-overflow-tooltip />
      <el-table-column label="处理时间" align="center" prop="handleTime" width="160" />
      <el-table-column label="操作" align="center" min-width="100px">
        <template #default="scope">
          <el-button v-if="scope.row.status === 0" link type="primary" @click="handleHandle(scope.row.id)" v-hasPermi="['yideyifeng:notice-objection:handle']">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { NoticeObjectionApi, NoticeObjection } from '@/api/yideyifeng/publicnotice/objection'

/** 公示异议 列表 */
defineOptions({ name: 'NoticeObjection' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<NoticeObjection[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  noticeId: undefined,
  status: undefined,
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await NoticeObjectionApi.getPage(queryParams)
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

const handleHandle = async (id: number) => {
  try {
    const remark = await message.confirm('请输入处理意见', '处理异议')
    await NoticeObjectionApi.handle(id, remark || '已处理')
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
