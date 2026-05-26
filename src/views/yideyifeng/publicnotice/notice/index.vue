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
          <el-option label="草稿" :value="0" />
          <el-option label="公示中" :value="1" />
          <el-option label="已结束" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['yideyifeng:public-notice:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table row-key="id" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="60" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="年度" align="center" prop="year" width="70" />
      <el-table-column label="科室" align="center" prop="department" />
      <el-table-column label="开始日期" align="center" prop="startDate" width="120px" />
      <el-table-column label="结束日期" align="center" prop="endDate" width="120px" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" type="info">草稿</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">公示中</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200px">
        <template #default="scope">
          <el-button v-if="scope.row.status === 0" link type="success" @click="handlePublish(scope.row.id)" v-hasPermi="['yideyifeng:public-notice:update']">发布</el-button>
          <el-button link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['yideyifeng:public-notice:update']">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['yideyifeng:public-notice:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <NoticeForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { PublicNoticeApi, PublicNotice } from '@/api/yideyifeng/publicnotice/notice'
import NoticeForm from './NoticeForm.vue'

/** 公示管理 列表 */
defineOptions({ name: 'PublicNotice' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<PublicNotice[]>([])
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
    const data = await PublicNoticeApi.getPage(queryParams)
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

const handlePublish = async (id: number) => {
  try {
    await message.confirm('确认发布该公示？', '发布确认')
    await PublicNoticeApi.publish(id)
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await PublicNoticeApi.delete(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
