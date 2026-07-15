<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="关键词" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入标题/内容"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-select
          v-model="queryParams.source"
          placeholder="请选择来源"
          clearable
          class="!w-240px"
        >
          <el-option label="微博" value="weibo" />
          <el-option label="知乎" value="zhihu" />
          <el-option label="新闻网站" value="news" />
          <el-option label="论坛" value="forum" />
          <el-option label="抖音" value="douyin" />
          <el-option label="小红书" value="xhs" />
        </el-select>
      </el-form-item>
      <el-form-item label="情感" prop="sentiment">
        <el-select
          v-model="queryParams.sentiment"
          placeholder="请选择情感"
          clearable
          class="!w-240px"
        >
          <el-option label="正面" value="positive" />
          <el-option label="中性" value="neutral" />
          <el-option label="负面" value="negative" />
        </el-select>
      </el-form-item>
      <el-form-item label="风险等级" prop="riskLevel">
        <el-select
          v-model="queryParams.riskLevel"
          placeholder="请选择风险等级"
          clearable
          class="!w-240px"
        >
          <el-option label="低" value="low" />
          <el-option label="中" value="medium" />
          <el-option label="高" value="high" />
          <el-option label="危急" value="critical" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option label="已采集" :value="0" />
          <el-option label="已分析" :value="1" />
          <el-option label="处理中" :value="2" />
          <el-option label="已处理" :value="3" />
          <el-option label="已关闭" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['yideyifeng:public-opinion:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['yideyifeng:public-opinion:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="danger"
          plain
          :disabled="isEmpty(checkedIds)"
          @click="handleDeleteBatch"
          v-hasPermi="['yideyifeng:public-opinion:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 批量删除
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      row-key="id"
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleRowCheckboxChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="舆情编号" align="center" prop="opinionNo" width="160" />
      <el-table-column label="标题" align="center" prop="title" min-width="200" show-overflow-tooltip />
      <el-table-column label="来源" align="center" prop="source" width="90">
        <template #default="scope">
          <el-tag :type="getSourceTagType(scope.row.source)">{{ getSourceLabel(scope.row.source) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="情感" align="center" prop="sentiment" width="80">
        <template #default="scope">
          <el-tag :type="getSentimentTagType(scope.row.sentiment)">{{ getSentimentLabel(scope.row.sentiment) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="风险等级" align="center" prop="riskLevel" width="90">
        <template #default="scope">
          <el-tag :type="getRiskLevelTagType(scope.row.riskLevel)">{{ getRiskLevelLabel(scope.row.riskLevel) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="关联员工" align="center" prop="relatedStaffName" width="90" />
      <el-table-column label="处理人" align="center" prop="handlerName" width="90" />
      <el-table-column label="发布时间" align="center" prop="publishTime" :formatter="dateFormatter" width="160" />
      <el-table-column label="操作" align="center" width="320" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row.id)"
            v-hasPermi="['yideyifeng:public-opinion:query']"
          >
            详情
          </el-button>
          <el-button
            link
            type="warning"
            @click="openAnalyze(scope.row.id)"
            v-hasPermi="['yideyifeng:public-opinion:analyze']"
          >
            AI分析
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['yideyifeng:public-opinion:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="success"
            @click="openHandle(scope.row.id)"
            v-hasPermi="['yideyifeng:public-opinion:handle']"
          >
            处理
          </el-button>
          <el-button
            link
            type="info"
            @click="openFollowUp(scope.row.id)"
            v-hasPermi="['yideyifeng:public-opinion:follow-up']"
          >
            跟踪
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['yideyifeng:public-opinion:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <PublicOpinionForm ref="formRef" @success="getList" />
  <!-- 详情弹窗 -->
  <PublicOpinionDetail ref="detailRef" />
  <!-- AI分析弹窗 -->
  <PublicOpinionAnalyze ref="analyzeRef" @success="getList" />
  <!-- 处理弹窗 -->
  <PublicOpinionHandle ref="handleRef" @success="getList" />
  <!-- 跟踪弹窗 -->
  <PublicOpinionFollowUpForm ref="followUpRef" @success="getList" />
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { PublicOpinionApi, PublicOpinion } from '@/api/yideyifeng/publicopinion'
import PublicOpinionForm from './PublicOpinionForm.vue'
import PublicOpinionDetail from './PublicOpinionDetail.vue'
import PublicOpinionAnalyze from './PublicOpinionAnalyze.vue'
import PublicOpinionHandle from './PublicOpinionHandle.vue'
import PublicOpinionFollowUpForm from './PublicOpinionFollowUpForm.vue'

/** AI舆情管理 列表 */
defineOptions({ name: 'PublicOpinion' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<PublicOpinion[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  keyword: undefined,
  source: undefined,
  sentiment: undefined,
  riskLevel: undefined,
  status: undefined,
  priority: undefined,
  year: undefined,
  createTime: [],
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PublicOpinionApi.getPublicOpinionPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 详情 */
const detailRef = ref()
const openDetail = async (id: number) => {
  detailRef.value.open(id)
}

/** AI分析 */
const analyzeRef = ref()
const openAnalyze = async (id: number) => {
  analyzeRef.value.open(id)
}

/** 处理 */
const handleRef = ref()
const openHandle = async (id: number) => {
  handleRef.value.open(id)
}

/** 跟踪 */
const followUpRef = ref()
const openFollowUp = async (id: number) => {
  followUpRef.value.open(id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await PublicOpinionApi.deletePublicOpinion(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 批量删除 */
const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    await PublicOpinionApi.deletePublicOpinionList(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: PublicOpinion[]) => {
  checkedIds.value = records.map((item) => item.id!)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await PublicOpinionApi.exportPublicOpinion(queryParams)
    download.excel(data, 'AI舆情管理.xls')
  } finally {
    exportLoading.value = false
  }
}

/** 字典映射 */
const sourceMap: Record<string, { label: string; type: string }> = {
  weibo: { label: '微博', type: 'danger' },
  zhihu: { label: '知乎', type: 'warning' },
  news: { label: '新闻', type: 'primary' },
  forum: { label: '论坛', type: 'info' },
  douyin: { label: '抖音', type: 'success' },
  xhs: { label: '小红书', type: 'danger' },
}
const sentimentMap: Record<string, { label: string; type: string }> = {
  positive: { label: '正面', type: 'success' },
  neutral: { label: '中性', type: 'info' },
  negative: { label: '负面', type: 'danger' },
}
const riskLevelMap: Record<string, { label: string; type: string }> = {
  low: { label: '低', type: 'info' },
  medium: { label: '中', type: 'warning' },
  high: { label: '高', type: 'danger' },
  critical: { label: '危急', type: 'danger' },
}
const statusMap: Record<number, string> = {
  0: '已采集',
  1: '已分析',
  2: '处理中',
  3: '已处理',
  4: '已关闭',
}

const getSourceLabel = (source: string) => sourceMap[source]?.label || source
const getSourceTagType = (source: string) => sourceMap[source]?.type || ''
const getSentimentLabel = (sentiment: string) => sentimentMap[sentiment]?.label || sentiment
const getSentimentTagType = (sentiment: string) => sentimentMap[sentiment]?.type || ''
const getRiskLevelLabel = (level: string) => riskLevelMap[level]?.label || level
const getRiskLevelTagType = (level: string) => riskLevelMap[level]?.type || ''
const getStatusLabel = (status: number) => statusMap[status] || String(status)
const getStatusTagType = (status: number) => {
  const types: Record<number, string> = { 0: 'info', 1: 'success', 2: 'warning', 3: '', 4: 'danger' }
  return types[status] || ''
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
