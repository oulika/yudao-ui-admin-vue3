<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="任务ID" prop="taskId">
        <el-input v-model="queryParams.taskId" placeholder="请输入任务ID" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="员工姓名" prop="staffName">
        <el-input v-model="queryParams.staffName" placeholder="请输入姓名" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option label="未参加" :value="0" />
          <el-option label="已参加" :value="1" />
          <el-option label="已缺席" :value="2" />
          <el-option label="考试不合格" :value="3" />
          <el-option label="考试合格" :value="4" />
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
      <el-table-column label="任务ID" align="center" prop="taskId" width="70" />
      <el-table-column label="员工姓名" align="center" prop="staffName" />
      <el-table-column label="科室" align="center" prop="department" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" type="info">未参加</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">已参加</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger">已缺席</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="warning">考试不合格</el-tag>
          <el-tag v-else-if="scope.row.status === 4" type="success">考试合格</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="考试分数" align="center" prop="score" />
      <el-table-column label="签到时间" align="center" prop="signTime" width="160" />
      <el-table-column label="操作" align="center" min-width="100px">
        <template #default="scope">
          <el-button v-if="scope.row.status === 0" link type="primary" @click="handleSign(scope.row.id)" v-hasPermi="['yideyifeng:education-record:update']">签到</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { EducationRecordApi, EducationRecord } from '@/api/yideyifeng/education/record'

/** 学习记录 列表 */
defineOptions({ name: 'EducationRecord' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<EducationRecord[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  taskId: undefined,
  staffName: undefined,
  status: undefined,
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await EducationRecordApi.getPage(queryParams)
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

const handleSign = async (id: number) => {
  try {
    await EducationRecordApi.sign(id)
    message.success('签到成功')
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
