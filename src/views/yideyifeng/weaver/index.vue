<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane label="回调日志" name="log">
      <ContentWrap>
        <el-form class="-mb-15px" :model="logQueryParams" ref="logQueryFormRef" :inline="true" label-width="90px">
          <el-form-item label="请求ID" prop="requestId">
            <el-input v-model="logQueryParams.requestId" placeholder="请输入泛微请求ID" clearable @keyup.enter="handleLogQuery" class="!w-240px" />
          </el-form-item>
          <el-form-item label="业务类型" prop="businessType">
            <el-select v-model="logQueryParams.businessType" placeholder="请选择业务类型" clearable class="!w-180px">
              <el-option label="申报" value="declaration" />
              <el-option label="投诉" value="complaint" />
            </el-select>
          </el-form-item>
          <el-form-item label="业务ID" prop="businessId">
            <el-input v-model="logQueryParams.businessId" placeholder="请输入业务ID" clearable @keyup.enter="handleLogQuery" class="!w-160px" />
          </el-form-item>
          <el-form-item label="动作" prop="action">
            <el-input v-model="logQueryParams.action" placeholder="approve / reject" clearable @keyup.enter="handleLogQuery" class="!w-180px" />
          </el-form-item>
          <el-form-item label="处理结果" prop="processed">
            <el-select v-model="logQueryParams.processed" placeholder="请选择" clearable class="!w-160px">
              <el-option label="已处理" :value="true" />
              <el-option label="未处理" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleLogQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
            <el-button @click="resetLogQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>

      <ContentWrap>
        <el-table row-key="id" v-loading="logLoading" :data="logList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="ID" align="center" prop="id" width="80" />
          <el-table-column label="请求ID" align="center" prop="requestId" min-width="160" />
          <el-table-column label="流程" align="center" prop="workflowName" min-width="160" />
          <el-table-column label="动作" align="center" prop="action" width="110" />
          <el-table-column label="业务类型" align="center" prop="businessType" width="110" />
          <el-table-column label="业务ID" align="center" prop="businessId" width="100" />
          <el-table-column label="处理状态" align="center" prop="processed" width="100">
            <template #default="scope">
              <el-tag v-if="scope.row.processed" type="success">已处理</el-tag>
              <el-tag v-else type="warning">未处理</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="处理信息" align="center" prop="message" min-width="220" show-overflow-tooltip />
          <el-table-column label="操作人" align="center" prop="operatorName" width="120" />
          <el-table-column label="接收时间" align="center" prop="receivedTime" width="180" />
          <el-table-column label="操作" align="center" width="90">
            <template #default="scope">
              <el-button link type="primary" @click="openLogDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="logTotal" v-model:page="logQueryParams.pageNo" v-model:limit="logQueryParams.pageSize" @pagination="getLogList" />
      </ContentWrap>
    </el-tab-pane>

    <el-tab-pane label="流程规则" name="rule">
      <ContentWrap>
        <el-form class="-mb-15px" :model="ruleQueryParams" ref="ruleQueryFormRef" :inline="true" label-width="90px">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="ruleQueryParams.ruleName" placeholder="请输入规则名称" clearable @keyup.enter="handleRuleQuery" class="!w-220px" />
          </el-form-item>
          <el-form-item label="流程ID" prop="workflowId">
            <el-input v-model="ruleQueryParams.workflowId" placeholder="请输入流程ID" clearable @keyup.enter="handleRuleQuery" class="!w-180px" />
          </el-form-item>
          <el-form-item label="业务类型" prop="businessType">
            <el-select v-model="ruleQueryParams.businessType" placeholder="请选择业务类型" clearable class="!w-160px">
              <el-option label="申报" value="declaration" />
              <el-option label="投诉" value="complaint" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用" prop="enabled">
            <el-select v-model="ruleQueryParams.enabled" placeholder="请选择" clearable class="!w-140px">
              <el-option label="启用" :value="true" />
              <el-option label="停用" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleRuleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
            <el-button @click="resetRuleQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
            <el-button type="primary" plain @click="openRuleForm('create')" v-hasPermi="['yideyifeng:weaver:create']">
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>

      <ContentWrap>
        <el-table row-key="id" v-loading="ruleLoading" :data="ruleList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="ID" align="center" prop="id" width="80" />
          <el-table-column label="规则名称" align="center" prop="ruleName" min-width="160" />
          <el-table-column label="流程ID" align="center" prop="workflowId" min-width="140" />
          <el-table-column label="流程名称" align="center" prop="workflowName" min-width="160" />
          <el-table-column label="业务类型" align="center" prop="businessType" width="110" />
          <el-table-column label="OA动作" align="center" prop="oaAction" width="110" />
          <el-table-column label="本地动作" align="center" prop="localAction" width="110" />
          <el-table-column label="启用" align="center" prop="enabled" width="90">
            <template #default="scope">
              <el-tag v-if="scope.row.enabled" type="success">启用</el-tag>
              <el-tag v-else type="info">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="排序" align="center" prop="sort" width="80" />
          <el-table-column label="备注" align="center" prop="remark" min-width="160" />
          <el-table-column label="操作" align="center" width="140">
            <template #default="scope">
              <el-button link type="primary" @click="openRuleForm('update', scope.row.id)" v-hasPermi="['yideyifeng:weaver:update']">编辑</el-button>
              <el-button link type="danger" @click="handleRuleDelete(scope.row.id)" v-hasPermi="['yideyifeng:weaver:delete']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="ruleTotal" v-model:page="ruleQueryParams.pageNo" v-model:limit="ruleQueryParams.pageSize" @pagination="getRuleList" />
      </ContentWrap>
    </el-tab-pane>
  </el-tabs>

  <el-dialog v-model="logDetailVisible" title="泛微OA回调详情" width="760px">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="请求ID">{{ logDetailData?.requestId }}</el-descriptions-item>
      <el-descriptions-item label="流程ID">{{ logDetailData?.workflowId }}</el-descriptions-item>
      <el-descriptions-item label="流程名称">{{ logDetailData?.workflowName }}</el-descriptions-item>
      <el-descriptions-item label="动作">{{ logDetailData?.action }}</el-descriptions-item>
      <el-descriptions-item label="业务类型">{{ logDetailData?.businessType }}</el-descriptions-item>
      <el-descriptions-item label="业务ID">{{ logDetailData?.businessId }}</el-descriptions-item>
      <el-descriptions-item label="操作人">{{ logDetailData?.operatorName }}</el-descriptions-item>
      <el-descriptions-item label="处理时间">{{ logDetailData?.processedTime }}</el-descriptions-item>
      <el-descriptions-item label="处理信息" :span="2">{{ logDetailData?.message }}</el-descriptions-item>
      <el-descriptions-item label="审批意见" :span="2">{{ logDetailData?.opinion }}</el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <el-input :model-value="logDetailData?.rawBody" type="textarea" :rows="10" readonly />
  </el-dialog>

  <WorkflowRuleForm ref="ruleFormRef" @success="getRuleList" />
</template>

<script setup lang="ts">
import { WeaverOaApi } from '@/api/yideyifeng/weaver'
import type { WeaverCallbackLog, WeaverWorkflowRule } from '@/api/yideyifeng/weaver'
import WorkflowRuleForm from './WorkflowRuleForm.vue'

defineOptions({ name: 'WeaverOa' })

const message = useMessage()
const { t } = useI18n()

const activeTab = ref('log')

const logLoading = ref(true)
const logList = ref<WeaverCallbackLog[]>([])
const logTotal = ref(0)
const logQueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  requestId: undefined,
  businessType: undefined,
  businessId: undefined,
  action: undefined,
  processed: undefined
})
const logQueryFormRef = ref()
const logDetailVisible = ref(false)
const logDetailData = ref<WeaverCallbackLog>()

const ruleLoading = ref(true)
const ruleList = ref<WeaverWorkflowRule[]>([])
const ruleTotal = ref(0)
const ruleQueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  ruleName: undefined,
  workflowId: undefined,
  businessType: undefined,
  enabled: undefined
})
const ruleQueryFormRef = ref()
const ruleFormRef = ref()

const getLogList = async () => {
  logLoading.value = true
  try {
    const data = await WeaverOaApi.getWorkflowLogPage(logQueryParams)
    logList.value = data.list
    logTotal.value = data.total
  } finally {
    logLoading.value = false
  }
}

const handleLogQuery = () => {
  logQueryParams.pageNo = 1
  getLogList()
}

const resetLogQuery = () => {
  logQueryFormRef.value.resetFields()
  handleLogQuery()
}

const openLogDetail = (row: WeaverCallbackLog) => {
  logDetailData.value = row
  logDetailVisible.value = true
}

const getRuleList = async () => {
  ruleLoading.value = true
  try {
    const data = await WeaverOaApi.getWorkflowRulePage(ruleQueryParams)
    ruleList.value = data.list
    ruleTotal.value = data.total
  } finally {
    ruleLoading.value = false
  }
}

const handleRuleQuery = () => {
  ruleQueryParams.pageNo = 1
  getRuleList()
}

const resetRuleQuery = () => {
  ruleQueryFormRef.value.resetFields()
  handleRuleQuery()
}

const openRuleForm = (type: string, id?: number) => {
  ruleFormRef.value.open(type, id)
}

const handleRuleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await WeaverOaApi.deleteWorkflowRule(id)
    message.success(t('common.delSuccess'))
    await getRuleList()
  } catch {}
}

onMounted(() => {
  getLogList()
  getRuleList()
})
</script>
