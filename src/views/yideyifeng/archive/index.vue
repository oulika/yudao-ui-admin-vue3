<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="年度" prop="year">
        <el-input v-model="queryParams.year" placeholder="请输入年度" clearable @keyup.enter="handleQuery" class="!w-240px" />
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
      <el-table-column label="归档年度" align="center" prop="year" width="100" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" type="info">未归档</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="warning">归档中</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger">已归档</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="归档操作人" align="center" prop="archiveBy" />
      <el-table-column label="归档时间" align="center" prop="archiveTime" width="180" />
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" align="center" min-width="150px">
        <template #default="scope">
          <el-button v-if="scope.row.status !== 2" link type="primary" @click="handleArchive(scope.row)" v-hasPermi="['yideyifeng:archive:operate']">归档</el-button>
          <el-button v-if="scope.row.status === 2" link type="warning" @click="handleUnlock(scope.row.year)" v-hasPermi="['yideyifeng:archive:operate']">解锁</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { ArchiveRecordApi, ArchiveRecord } from '@/api/yideyifeng/archive'

/** 归档管理 列表 */
defineOptions({ name: 'ArchiveRecord' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<ArchiveRecord[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  year: undefined,
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await ArchiveRecordApi.getPage(queryParams)
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

const handleArchive = async (row: ArchiveRecord) => {
  try {
    await message.confirm(`确认归档 ${row.year} 年度数据？归档后将锁定相关数据。`, '归档确认')
    await ArchiveRecordApi.archive({ year: row.year })
    message.success(t('common.createSuccess'))
    await getList()
  } catch {}
}

const handleUnlock = async (year: number) => {
  try {
    await message.confirm(`确认解锁 ${year} 年度数据？解锁后将可以修改归档数据。`, '解锁确认')
    await ArchiveRecordApi.unlock(year)
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
