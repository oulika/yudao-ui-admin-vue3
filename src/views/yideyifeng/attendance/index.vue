<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="80px">
      <el-form-item label="年份" prop="year">
        <el-input-number v-model="queryParams.year" :min="2000" :max="2100" class="!w-140px" @change="handleQuery" />
      </el-form-item>
      <el-form-item label="月份" prop="month" v-if="activeTab !== 'holiday'">
        <el-select v-model="queryParams.month" placeholder="全部" clearable class="!w-120px" @change="handleQuery">
          <el-option v-for="item in 12" :key="item" :label="`${item}月`" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="科室" prop="department">
        <el-select
          v-model="queryParams.department"
          placeholder="请选择科室"
          clearable
          filterable
          remote
          reserve-keyword
          :remote-method="remoteDepartmentSearch"
          :loading="departmentLoading"
          class="!w-200px"
          @change="handleQuery"
        >
          <el-option v-for="item in departmentOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="submitted" v-if="activeTab === 'submission'">
        <el-select v-model="submissionQueryParams.submitted" placeholder="全部" clearable class="!w-120px" @change="handleQuery">
          <el-option label="已发" :value="true" />
          <el-option label="未发" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="employeeName" v-if="['record', 'statistic', 'leaveChange'].includes(activeTab)">
        <el-input v-model="recordQueryParams.employeeName" placeholder="请输入姓名" clearable class="!w-160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="事由" prop="reason" v-if="activeTab === 'statistic'">
        <el-select v-model="statisticQueryParams.reason" placeholder="全部" clearable class="!w-140px" @change="handleQuery">
          <el-option v-for="item in statisticReasonOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="人员类型" prop="employmentType" v-if="activeTab === 'leaveChange'">
        <el-select v-model="leaveChangeQueryParams.employmentType" placeholder="全部" clearable class="!w-140px" @change="handleQuery">
          <el-option label="在编" value="IN_STAFF" />
          <el-option label="非在编" value="NON_STAFF" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="employeeNo" v-if="activeTab === 'record'">
        <el-input v-model="recordQueryParams.employeeNo" placeholder="请输入工号" clearable class="!w-160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="请求ID" prop="requestId" v-if="['record', 'log'].includes(activeTab)">
        <el-input v-model="commonQueryParams.requestId" placeholder="OA请求ID" clearable class="!w-160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="文件名" prop="attachmentName" v-if="['record', 'log'].includes(activeTab)">
        <el-input v-model="commonQueryParams.attachmentName" placeholder="附件名/文件名" clearable class="!w-220px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 查询</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button v-if="activeTab === 'statistic'" type="success" :loading="statisticExportLoading" @click="handleStatisticExport">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button v-if="activeTab === 'leaveChange'" type="success" :loading="leaveChangeExportLoading" @click="handleLeaveChangeExport">
          <Icon icon="ep:download" class="mr-5px" /> 下载
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <el-tabs v-model="activeTab" @tab-click="handleTabClick">
    <el-tab-pane label="报送进度" name="submission">
      <ContentWrap>
        <el-alert
          v-if="submissionError"
          :title="submissionError"
          type="error"
          show-icon
          :closable="false"
          class="mb-16px"
        />
        <el-row :gutter="16" class="mb-16px">
          <el-col :span="8">
            <el-statistic title="应报科室" :value="submissionTotal" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="已发科室" :value="submissionSubmittedCount" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="未发科室" :value="submissionMissingCount" />
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mb-16px">
          <el-col :xs="24" :sm="12">
            <div class="submission-card submission-card--submitted">
              <div>
                <div class="submission-card__title">已发占比</div>
                <div class="submission-card__value">{{ submissionSubmittedPercent }}%</div>
              </div>
              <el-progress type="circle" :percentage="submissionSubmittedPercent" :width="92" status="success" />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="submission-card submission-card--missing">
              <div>
                <div class="submission-card__title">未发占比</div>
                <div class="submission-card__value">{{ submissionMissingPercent }}%</div>
              </div>
              <el-progress type="circle" :percentage="submissionMissingPercent" :width="92" status="exception" />
            </div>
          </el-col>
        </el-row>
        <div class="submission-progress mb-16px">
          <div class="submission-progress__header">
            <span>报送完成度</span>
            <span>{{ submissionSubmittedCount }} / {{ submissionTotal }}</span>
          </div>
          <el-progress :percentage="submissionSubmittedPercent" :stroke-width="16" />
        </div>
        <el-row :gutter="16" class="mb-16px">
          <el-col :xs="24" :sm="12">
            <div class="submission-group">
              <div class="submission-group__title">未发科室</div>
              <el-scrollbar max-height="180px">
                <div v-if="submissionMissingList.length === 0" class="submission-group__empty">{{ submissionEmptyText('未发科室') }}</div>
                <el-tag
                  v-for="item in submissionMissingList"
                  :key="item.department"
                  type="danger"
                  effect="plain"
                  class="submission-group__tag"
                >
                  {{ item.department }}
                </el-tag>
              </el-scrollbar>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="submission-group">
              <div class="submission-group__title">已发科室</div>
              <el-scrollbar max-height="180px">
                <div v-if="submissionSubmittedList.length === 0" class="submission-group__empty">{{ submissionEmptyText('已发科室') }}</div>
                <el-tag
                  v-for="item in submissionSubmittedList"
                  :key="item.department"
                  type="success"
                  effect="plain"
                  class="submission-group__tag"
                >
                  {{ item.department }}
                </el-tag>
              </el-scrollbar>
            </div>
          </el-col>
        </el-row>
        <div class="submission-section-title">未发明细</div>
        <el-table
          v-loading="submissionLoading"
          :data="submissionMissingList"
          :stripe="true"
          :show-overflow-tooltip="true"
          class="mb-16px"
        >
          <el-table-column label="年月" align="center" width="110">
            <template #default="scope">{{ scope.row.year }}-{{ padMonth(scope.row.month) }}</template>
          </el-table-column>
          <el-table-column label="科室" align="center" prop="department" min-width="160" />
          <el-table-column label="报送状态" align="center" width="100">
            <template #default>
              <el-tag type="danger">未发</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="submission-section-title">已发明细</div>
        <div v-loading="submissionLoading" class="submission-detail-list mb-16px">
          <el-empty v-if="submissionSubmittedList.length === 0" description="暂无已发明细" :image-size="80" />
          <div v-for="item in submissionSubmittedList" :key="item.department" class="submission-detail-item">
            <div class="submission-detail-item__main">
              <div class="submission-detail-item__title">
                {{ item.department }}
                <el-tag type="success" size="small" class="ml-8px">已发</el-tag>
              </div>
              <div class="submission-detail-item__meta">
                <span>{{ item.year }}-{{ padMonth(item.month) }}</span>
                <span>明细记录数：{{ item.recordCount || 0 }}</span>
                <span>请求ID：{{ item.latestRequestId || '-' }}</span>
                <span>最近导入：{{ formatDateTime(item.latestImportTime) }}</span>
              </div>
            </div>
            <div class="submission-detail-item__file">
              <el-button
                v-if="item.latestAttachmentName"
                link
                type="primary"
                :loading="submissionDownloadKey === getSubmissionDownloadKey(item)"
                @click="downloadSubmissionFile(item)"
              >
                {{ item.latestAttachmentName }}
              </el-button>
              <span v-else>-</span>
            </div>
          </div>
        </div>
        <div class="submission-section-title">全部报送明细</div>
        <el-table v-loading="submissionLoading" :data="submissionDisplayList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="年月" align="center" width="110">
            <template #default="scope">{{ scope.row.year }}-{{ padMonth(scope.row.month) }}</template>
          </el-table-column>
          <el-table-column label="科室" align="center" prop="department" min-width="160" />
          <el-table-column label="报送状态" align="center" width="100">
            <template #default="scope">
              <el-tag :type="isSubmitted(scope.row) ? 'success' : 'danger'">{{ isSubmitted(scope.row) ? '已发' : '未发' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="明细记录数" align="center" prop="recordCount" width="110" />
          <el-table-column label="请求ID" align="center" prop="latestRequestId" width="120" />
          <el-table-column label="最近附件" align="center" prop="latestAttachmentName" min-width="220" />
          <el-table-column label="最近导入时间" align="center" width="180">
            <template #default="scope">{{ formatDateTime(scope.row.latestImportTime) }}</template>
          </el-table-column>
        </el-table>
      </ContentWrap>
    </el-tab-pane>

    <el-tab-pane label="统计信息" name="summary">
      <ContentWrap>
        <el-table v-loading="summaryLoading" :data="summaryList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="年月" align="center" width="110">
            <template #default="scope">{{ scope.row.year }}-{{ padMonth(scope.row.month) }}</template>
          </el-table-column>
          <el-table-column label="科室" align="center" prop="department" min-width="140" />
          <el-table-column label="人数" align="center" prop="employeeCount" width="90" />
          <el-table-column label="记录数" align="center" prop="recordCount" width="90" />
          <el-table-column label="月应到" align="center" prop="expectedWorkDays" width="90" />
          <el-table-column label="总应到" align="center" prop="totalExpectedWorkDays" width="90" />
          <el-table-column label="总实到" align="center" prop="actualWorkDays" width="90" />
          <el-table-column label="事假" align="center" prop="leavePersonal" width="90" :formatter="formatNumberCell" />
          <el-table-column label="病假" align="center" prop="leaveSick" width="90" :formatter="formatNumberCell" />
          <el-table-column label="产假" align="center" prop="leaveMaternity" width="90" :formatter="formatNumberCell" />
          <el-table-column label="婚假" align="center" prop="leaveMarriage" width="90" :formatter="formatNumberCell" />
          <el-table-column label="丧假" align="center" prop="leaveFuneral" width="90" :formatter="formatNumberCell" />
          <el-table-column label="公假" align="center" prop="leaveOfficial" width="90" :formatter="formatNumberCell" />
          <el-table-column label="工伤" align="center" prop="workInjury" width="90" :formatter="formatNumberCell" />
          <el-table-column label="年休假" align="center" prop="leaveAnnual" width="100" :formatter="formatNumberCell" />
          <el-table-column label="旷工" align="center" prop="absenteeism" width="90" :formatter="formatNumberCell" />
          <el-table-column label="正工" align="center" prop="normalWork" width="90" :formatter="formatNumberCell" />
        </el-table>
      </ContentWrap>
    </el-tab-pane>

    <el-tab-pane label="休假统计表" name="statistic">
      <ContentWrap>
        <el-table v-loading="statisticLoading" :data="statisticList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="年月" align="center" width="110">
            <template #default="scope">{{ scope.row.year }}-{{ padMonth(scope.row.month) }}</template>
          </el-table-column>
          <el-table-column label="科室" align="center" prop="department" min-width="140" />
          <el-table-column label="工号" align="center" prop="employeeNo" width="100" />
          <el-table-column label="姓名" align="center" prop="employeeName" width="110" />
          <el-table-column label="事由" align="center" prop="reason" width="100" />
          <el-table-column label="天数" align="center" prop="days" width="90">
            <template #default="scope">{{ formatDays(scope.row.days) }}</template>
          </el-table-column>
        </el-table>
      </ContentWrap>
    </el-tab-pane>

    <el-tab-pane label="病事假人员变动" name="leaveChange">
      <ContentWrap>
        <el-tabs v-model="leaveChangeActiveTab" @tab-change="handleLeaveChangeSubTabChange">
          <el-tab-pane label="病产事假" name="leave">
            <el-table v-loading="leaveChangeLoading" :data="leaveChangeList" :stripe="true" :show-overflow-tooltip="true">
              <el-table-column label="人员类型" align="center" width="90">
                <template #default="scope">{{ formatEmploymentType(scope.row.employmentType) }}</template>
              </el-table-column>
              <el-table-column label="工号" align="center" prop="employeeNo" width="100" />
              <el-table-column label="姓名" align="center" prop="employeeName" width="100" />
              <el-table-column v-for="month in 12" :key="month" :label="`${month}月`" align="center" width="110">
                <template #default="scope">
                  <el-button
                    v-if="getLeaveChangeMonthText(scope.row, month)"
                    link
                    type="primary"
                    @click="openLeaveChangeMonthEdit(scope.row, month)"
                  >
                    {{ getLeaveChangeMonthText(scope.row, month) }}
                  </el-button>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" prop="remark" min-width="120" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="人员变动" name="change">
            <el-table v-loading="personChangeLoading" :data="personChangeList" :stripe="true" :show-overflow-tooltip="true">
              <el-table-column label="人员类型" align="center" width="90">
                <template #default="scope">{{ formatEmploymentType(scope.row.employmentType) }}</template>
              </el-table-column>
              <el-table-column label="变动类型" align="center" prop="changeType" width="100" />
              <el-table-column label="姓名" align="center" prop="employeeName" width="100" />
              <el-table-column label="日期" align="center" prop="changeDate" width="140" />
              <el-table-column label="职称" align="center" prop="jobTitle" width="120" />
              <el-table-column label="科室" align="center" prop="department" min-width="140" />
              <el-table-column label="备注" align="center" prop="remark" min-width="160" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
    </el-tab-pane>

    <el-tab-pane label="考勤详情" name="record">
      <ContentWrap>
        <el-table v-loading="recordLoading" :data="recordList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="年月" align="center" width="110">
            <template #default="scope">{{ scope.row.year }}-{{ padMonth(scope.row.month) }}</template>
          </el-table-column>
          <el-table-column label="科室" align="center" prop="department" min-width="120" />
          <el-table-column label="序号" align="center" prop="sequenceNo" width="70" />
          <el-table-column label="工号" align="center" prop="employeeNo" width="100" />
          <el-table-column label="姓名" align="center" prop="employeeName" width="100" />
          <el-table-column label="应到" align="center" prop="expectedWorkDays" width="80" />
          <el-table-column label="实到" align="center" prop="actualWorkDays" width="80" />
          <el-table-column label="事假" align="center" prop="leavePersonal" width="80" />
          <el-table-column label="病假" align="center" prop="leaveSick" width="80" />
          <el-table-column label="年休假" align="center" prop="leaveAnnual" width="90" />
          <el-table-column label="旷工" align="center" prop="absenteeism" width="80" />
          <el-table-column label="正工" align="center" prop="normalWork" width="80" />
          <el-table-column label="积休" align="center" prop="accumulatedRest" width="80" />
          <el-table-column label="请求ID" align="center" prop="requestId" width="110" />
          <el-table-column label="附件名" align="center" prop="attachmentName" min-width="180" />
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="openDailyDetail(scope.row)">每日</el-button>
              <el-button link type="primary" @click="openRecordEdit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="recordTotal" v-model:page="recordQueryParams.pageNo" v-model:limit="recordQueryParams.pageSize" @pagination="getRecordList" />
      </ContentWrap>
    </el-tab-pane>

    <el-tab-pane label="导入记录" name="log">
      <ContentWrap>
        <el-table v-loading="logLoading" :data="logList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="ID" align="center" prop="id" width="80" />
          <el-table-column label="年月" align="center" width="110">
            <template #default="scope">{{ scope.row.year }}-{{ padMonth(scope.row.month) }}</template>
          </el-table-column>
          <el-table-column label="科室" align="center" prop="department" width="120" />
          <el-table-column label="导入行数" align="center" prop="importedRows" width="100" />
          <el-table-column label="状态" align="center" prop="success" width="90">
            <template #default="scope">
              <el-tag :type="scope.row.success ? 'success' : 'danger'">{{ scope.row.success ? '成功' : '失败' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="请求ID" align="center" prop="requestId" width="120" />
          <el-table-column label="附件名" align="center" prop="attachmentName" min-width="180" />
          <el-table-column label="消息" align="center" prop="message" min-width="160" />
          <el-table-column label="OA发送时间" align="center" width="180">
            <template #default="scope">{{ formatDateTime(scope.row.oaSendTime) }}</template>
          </el-table-column>
          <el-table-column label="导入时间" align="center" width="180">
            <template #default="scope">{{ formatDateTime(scope.row.importTime) }}</template>
          </el-table-column>
        </el-table>
        <Pagination :total="logTotal" v-model:page="logQueryParams.pageNo" v-model:limit="logQueryParams.pageSize" @pagination="getLogList" />
      </ContentWrap>
    </el-tab-pane>

    <el-tab-pane label="节假日" name="holiday">
      <ContentWrap>
        <el-table v-loading="holidayLoading" :data="holidayList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="日期" align="center" prop="holidayDate" width="130" />
          <el-table-column label="名称" align="center" prop="name" min-width="120" />
          <el-table-column label="是否应到" align="center" prop="workday" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.workday ? 'success' : 'info'">{{ scope.row.workday ? '应到' : '休息' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" width="120">
            <template #default="scope">{{ formatDayType(scope.row.dayType) }}</template>
          </el-table-column>
          <el-table-column label="来源" align="center" prop="sourceType" width="120" />
          <el-table-column label="来源地址" align="center" prop="sourceUrl" min-width="220" />
        </el-table>
      </ContentWrap>
    </el-tab-pane>

  </el-tabs>

  <el-dialog v-model="dailyDialogVisible" title="每日考勤" width="720px">
    <el-descriptions :column="3" border>
      <el-descriptions-item label="年月">{{ dailyRecord?.year }}-{{ padMonth(dailyRecord?.month) }}</el-descriptions-item>
      <el-descriptions-item label="科室">{{ dailyRecord?.department }}</el-descriptions-item>
      <el-descriptions-item label="人员">{{ dailyRecord?.employeeName }}</el-descriptions-item>
    </el-descriptions>
    <el-table class="mt-16px" :data="dailyStatusList" :stripe="true" max-height="420">
      <el-table-column label="日期" align="center" prop="day" width="90" />
      <el-table-column label="状态" align="center" prop="status" />
    </el-table>
  </el-dialog>

  <el-dialog v-model="recordEditVisible" title="修改考勤详情" width="720px">
    <el-form :model="recordEditForm" label-width="90px" :inline="true">
      <el-form-item label="年月">
        {{ recordEditForm.year }}-{{ padMonth(recordEditForm.month) }}
      </el-form-item>
      <el-form-item label="姓名">
        {{ recordEditForm.employeeName }}
      </el-form-item>
      <el-form-item label="科室">
        <el-input v-model="recordEditForm.department" class="!w-180px" placeholder="请输入科室" />
      </el-form-item>
      <el-form-item v-for="item in recordEditFields" :key="item.prop" :label="item.label">
        <el-input-number v-model="recordEditForm[item.prop]" :min="0" :precision="1" class="!w-130px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="recordEditVisible = false">取消</el-button>
      <el-button type="primary" :loading="recordEditLoading" @click="saveRecordEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { AttendanceApi } from '@/api/yideyifeng/attendance'
import download from '@/utils/download'
import { ElMessage } from 'element-plus'
import type {
  AttendanceHoliday,
  AttendanceImportLog,
  AttendanceLeaveChange,
  AttendanceMonthlyRecord,
  AttendancePersonChange,
  AttendanceRawFile,
  AttendanceStatistic,
  AttendanceSubmission,
  AttendanceSummary
} from '@/api/yideyifeng/attendance'

defineOptions({ name: 'YideyifengAttendance' })

const current = new Date()
const activeTab = ref('summary')
const queryFormRef = ref()

const queryParams = reactive({
  year: current.getFullYear(),
  month: undefined as number | undefined,
  department: undefined as string | undefined
})
const commonQueryParams = reactive({
  requestId: undefined as string | undefined,
  attachmentName: undefined as string | undefined
})
const recordQueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  employeeName: undefined as string | undefined,
  employeeNo: undefined as string | undefined
})
const logQueryParams = reactive({
  pageNo: 1,
  pageSize: 10
})
const statisticQueryParams = reactive({
  reason: undefined as string | undefined
})
const leaveChangeQueryParams = reactive({
  employmentType: undefined as string | undefined
})
const submissionQueryParams = reactive({
  submitted: undefined as boolean | undefined
})

const submissionLoading = ref(false)
const submissionError = ref('')
const submissionList = ref<AttendanceSubmission[]>([])
const submissionDownloadKey = ref('')
const summaryLoading = ref(false)
const summaryList = ref<AttendanceSummary[]>([])
const statisticLoading = ref(false)
const statisticExportLoading = ref(false)
const statisticList = ref<AttendanceStatistic[]>([])
const leaveChangeActiveTab = ref('leave')
const leaveChangeLoading = ref(false)
const leaveChangeExportLoading = ref(false)
const leaveChangeList = ref<AttendanceLeaveChange[]>([])
const personChangeLoading = ref(false)
const personChangeList = ref<AttendancePersonChange[]>([])
const departmentLoading = ref(false)
const departmentOptions = ref<string[]>([])
const recordLoading = ref(false)
const recordEditLoading = ref(false)
const recordList = ref<AttendanceMonthlyRecord[]>([])
const recordTotal = ref(0)
const logLoading = ref(false)
const logList = ref<AttendanceImportLog[]>([])
const logTotal = ref(0)
const holidayLoading = ref(false)
const holidayList = ref<AttendanceHoliday[]>([])

const dailyDialogVisible = ref(false)
const dailyRecord = ref<AttendanceMonthlyRecord>()
const dailyStatusList = ref<{ day: string; status: string }[]>([])
const statisticReasonOptions = ['事假', '病假', '产假', '婚假', '丧假', '公假', '工伤', '年休假', '探亲假', '旷工', '其他']
const submissionTotal = computed(() => submissionList.value.length)
const submissionSubmittedCount = computed(() => submissionList.value.filter((item) => isSubmitted(item)).length)
const submissionMissingCount = computed(() => submissionList.value.filter((item) => !isSubmitted(item)).length)
const submissionSubmittedPercent = computed(() => calcPercent(submissionSubmittedCount.value, submissionTotal.value))
const submissionMissingPercent = computed(() => calcPercent(submissionMissingCount.value, submissionTotal.value))
const submissionSubmittedList = computed(() => submissionList.value.filter((item) => isSubmitted(item)))
const submissionMissingList = computed(() => submissionList.value.filter((item) => !isSubmitted(item)))
const submissionDisplayList = computed(() => {
  if (submissionQueryParams.submitted === undefined) {
    return submissionList.value
  }
  return submissionList.value.filter((item) => isSubmitted(item) === submissionQueryParams.submitted)
})
const recordEditVisible = ref(false)
const recordEditFields = [
  { label: '事假', prop: 'leavePersonal' },
  { label: '病假', prop: 'leaveSick' },
  { label: '产假', prop: 'leaveMaternity' },
  { label: '婚假', prop: 'leaveMarriage' },
  { label: '丧假', prop: 'leaveFuneral' },
  { label: '公假', prop: 'leaveOfficial' },
  { label: '工伤', prop: 'workInjury' },
  { label: '年休假', prop: 'leaveAnnual' },
  { label: '探亲假', prop: 'leaveHome' },
  { label: '旷工', prop: 'absenteeism' },
  { label: '其他', prop: 'otherAbsence' },
  { label: '正工', prop: 'normalWork' },
  { label: '剩余年休', prop: 'remainingAnnualLeave' },
  { label: '积休', prop: 'accumulatedRest' }
] as const
const recordEditForm = reactive<Record<string, any>>({
  id: undefined as number | undefined,
  year: undefined as number | undefined,
  month: undefined as number | undefined,
  department: '',
  employeeName: '',
  leavePersonal: 0,
  leaveSick: 0,
  leaveMaternity: 0,
  leaveMarriage: 0,
  leaveFuneral: 0,
  leaveOfficial: 0,
  workInjury: 0,
  leaveAnnual: 0,
  leaveHome: 0,
  absenteeism: 0,
  otherAbsence: 0,
  normalWork: 0,
  remainingAnnualLeave: 0,
  accumulatedRest: 0
})

const buildBaseParams = () => ({
  year: queryParams.year,
  month: queryParams.month,
  department: queryParams.department,
  requestId: commonQueryParams.requestId,
  attachmentName: commonQueryParams.attachmentName
})

const getEffectiveMonth = () => queryParams.month || current.getMonth() + 1

const getSummaryList = async () => {
  summaryLoading.value = true
  try {
    summaryList.value = await AttendanceApi.getSummary({
      year: queryParams.year,
      month: queryParams.month,
      department: queryParams.department
    })
  } finally {
    summaryLoading.value = false
  }
}

const getStatisticList = async () => {
  statisticLoading.value = true
  try {
    statisticList.value = await AttendanceApi.getStatisticList({
      year: queryParams.year,
      month: queryParams.month,
      department: queryParams.department,
      employeeName: recordQueryParams.employeeName,
      reason: statisticQueryParams.reason
    })
  } finally {
    statisticLoading.value = false
  }
}

const getSubmissionList = async () => {
  submissionLoading.value = true
  submissionError.value = ''
  try {
    const month = getEffectiveMonth()
    const data = await AttendanceApi.getSubmissionList({
      year: queryParams.year,
      month,
      department: queryParams.department
    })
    submissionList.value = normalizeListResponse<AttendanceSubmission>(data)
    submissionList.value.sort((left, right) => {
      const submittedCompare = Number(isSubmitted(left)) - Number(isSubmitted(right))
      if (submittedCompare !== 0) return submittedCompare
      return (left.department || '').localeCompare(right.department || '', 'zh-Hans-CN')
    })
  } catch (error) {
    submissionList.value = []
    submissionError.value = '报送进度加载失败，请确认后端已重启并查看后台日志'
    console.error(error)
  } finally {
    submissionLoading.value = false
  }
}

const getLeaveChangeList = async () => {
  leaveChangeLoading.value = true
  try {
    leaveChangeList.value = await AttendanceApi.getLeaveChangeList({
      year: queryParams.year,
      employmentType: leaveChangeQueryParams.employmentType,
      employeeName: recordQueryParams.employeeName
    })
  } finally {
    leaveChangeLoading.value = false
  }
}

const getPersonChangeList = async () => {
  personChangeLoading.value = true
  try {
    personChangeList.value = await AttendanceApi.getPersonChangeList({
      year: queryParams.year,
      employmentType: leaveChangeQueryParams.employmentType,
      employeeName: recordQueryParams.employeeName
    })
  } finally {
    personChangeLoading.value = false
  }
}

const remoteDepartmentSearch = async (keyword?: string) => {
  departmentLoading.value = true
  try {
    departmentOptions.value = await AttendanceApi.getDepartmentList({ keyword })
  } finally {
    departmentLoading.value = false
  }
}

const getRecordList = async () => {
  recordLoading.value = true
  try {
    const data = await AttendanceApi.getRecordPage({
      ...buildBaseParams(),
      pageNo: recordQueryParams.pageNo,
      pageSize: recordQueryParams.pageSize,
      employeeName: recordQueryParams.employeeName,
      employeeNo: recordQueryParams.employeeNo
    })
    recordList.value = data.list
    recordTotal.value = data.total
  } finally {
    recordLoading.value = false
  }
}

const getLogList = async () => {
  logLoading.value = true
  try {
    const data = await AttendanceApi.getImportLogPage({
      ...buildBaseParams(),
      pageNo: logQueryParams.pageNo,
      pageSize: logQueryParams.pageSize
    })
    logList.value = data.list
    logTotal.value = data.total
  } finally {
    logLoading.value = false
  }
}

const getHolidayList = async () => {
  holidayLoading.value = true
  try {
    holidayList.value = await AttendanceApi.getHolidayList({
      year: queryParams.year
    })
  } finally {
    holidayLoading.value = false
  }
}

const handleQuery = () => {
  recordQueryParams.pageNo = 1
  logQueryParams.pageNo = 1
  if (activeTab.value === 'submission') getSubmissionList()
  if (activeTab.value === 'summary') getSummaryList()
  if (activeTab.value === 'statistic') getStatisticList()
  if (activeTab.value === 'leaveChange') {
    if (leaveChangeActiveTab.value === 'leave') getLeaveChangeList()
    if (leaveChangeActiveTab.value === 'change') getPersonChangeList()
  }
  if (activeTab.value === 'record') getRecordList()
  if (activeTab.value === 'log') getLogList()
  if (activeTab.value === 'holiday') getHolidayList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  queryParams.year = current.getFullYear()
  queryParams.month = undefined
  queryParams.department = undefined
  commonQueryParams.requestId = undefined
  commonQueryParams.attachmentName = undefined
  recordQueryParams.employeeName = undefined
  recordQueryParams.employeeNo = undefined
  statisticQueryParams.reason = undefined
  leaveChangeQueryParams.employmentType = undefined
  submissionQueryParams.submitted = undefined
  handleQuery()
}

const handleTabClick = (pane: any) => {
  if (pane?.paneName) {
    activeTab.value = pane.paneName
  }
  handleQuery()
}

const handleLeaveChangeSubTabChange = () => {
  handleQuery()
}

const openDailyDetail = (row: AttendanceMonthlyRecord) => {
  dailyRecord.value = row
  dailyStatusList.value = parseDailyStatus(row.dailyStatusJson)
  dailyDialogVisible.value = true
}

const openRecordEdit = (row: AttendanceMonthlyRecord) => {
  recordEditForm.id = row.id
  recordEditForm.year = row.year
  recordEditForm.month = row.month
  recordEditForm.department = row.department || ''
  recordEditForm.employeeName = row.employeeName || ''
  for (const item of recordEditFields) {
    recordEditForm[item.prop] = Number((row as any)[item.prop] || 0)
  }
  recordEditVisible.value = true
}

const openLeaveChangeMonthEdit = async (row: AttendanceLeaveChange, month: number) => {
  const data = await AttendanceApi.getRecordPage({
    year: row.year || queryParams.year,
    month,
    employeeNo: row.employeeNo,
    employeeName: row.employeeName,
    pageNo: 1,
    pageSize: 100
  })
  const list = data?.list || []
  const record =
    list.find((item: AttendanceMonthlyRecord) => item.manualModified && hasLeaveChangeValue(item)) ||
    list.find((item: AttendanceMonthlyRecord) => hasLeaveChangeValue(item)) ||
    list[0]
  if (!record) {
    ElMessage.warning('未找到对应考勤详情')
    return
  }
  openRecordEdit(record)
}

const saveRecordEdit = async () => {
  if (!recordEditForm.id) return
  recordEditLoading.value = true
  try {
    await AttendanceApi.updateRecord(recordEditForm)
    recordEditVisible.value = false
    if (activeTab.value === 'leaveChange' && leaveChangeActiveTab.value === 'leave') {
      await getLeaveChangeList()
    } else if (activeTab.value === 'record') {
      await getRecordList()
    } else {
      handleQuery()
    }
  } finally {
    recordEditLoading.value = false
  }
}

const parseDailyStatus = (value?: string) => {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Object.keys(parsed).map((day) => ({ day, status: parsed[day] || '' }))
  } catch {
    return []
  }
}

const padMonth = (month?: number) => {
  if (!month) return ''
  return month < 10 ? `0${month}` : `${month}`
}

const formatDayType = (dayType?: number) => {
  if (dayType === 0) return '工作日'
  if (dayType === 1) return '周末'
  if (dayType === 2) return '节假日'
  if (dayType === 3) return '调休上班'
  return '-'
}

const formatEmploymentType = (value?: string) => {
  if (value === 'IN_STAFF') return '在编'
  if (value === 'NON_STAFF') return '非在编'
  return '未知'
}

const getLeaveChangeMonthText = (row: AttendanceLeaveChange, month: number) => {
  return (row as any)[`month${padMonth(month)}`] || ''
}

const hasLeaveChangeValue = (record: AttendanceMonthlyRecord) => {
  return Number(record.leaveSick || 0) > 0 ||
    Number(record.leaveMaternity || 0) > 0 ||
    Number(record.leavePersonal || 0) > 0 ||
    Number(record.workInjury || 0) > 0
}

const formatDays = (days?: number) => {
  if (days === undefined || days === null) return ''
  return `${days}天`
}

const calcPercent = (value: number, total: number) => {
  if (!total) return 0
  return Number(((value * 100) / total).toFixed(1))
}

const isSubmitted = (item: AttendanceSubmission) => {
  return (
    item.submitted === true ||
    item.submitted === 1 ||
    item.submitted === '1' ||
    item.submitted === 'true' ||
    Number(item.recordCount || 0) > 0 ||
    Boolean(item.latestRequestId || item.latestAttachmentName || item.latestImportTime)
  )
}

const normalizeListResponse = <T,>(value: any): T[] => {
  if (Array.isArray(value)) {
    return value
  }
  if (Array.isArray(value?.data)) {
    return value.data
  }
  if (Array.isArray(value?.list)) {
    return value.list
  }
  return []
}

const formatDateTime = (value?: string | number | Date) => {
  if (!value) return '-'
  if (typeof value === 'number') {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return formatDateObject(date)
  }
  if (value instanceof Date) {
    return formatDateObject(value)
  }
  const normalized = value.replace('T', ' ')
  const matched = normalized.match(/^(\d{4}-\d{2}-\d{2})[ ](\d{2}:\d{2}:\d{2})/)
  return matched ? `${matched[1]} ${matched[2]}` : normalized
}

const formatDateObject = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')
  const second = `${date.getSeconds()}`.padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

const getSubmissionDownloadKey = (row: AttendanceSubmission) => {
  return `${row.latestRequestId || ''}|${row.latestAttachmentName || ''}`
}

const downloadSubmissionFile = async (row: AttendanceSubmission) => {
  if (!row.latestAttachmentName) return
  const downloadKey = getSubmissionDownloadKey(row)
  submissionDownloadKey.value = downloadKey
  try {
    const file = await findSubmissionRawFile(row)
    if (!file) {
      ElMessage.warning('未找到对应原始文件')
      return
    }
    await downloadRawFile(file)
  } finally {
    submissionDownloadKey.value = ''
  }
}

const findSubmissionRawFile = async (row: AttendanceSubmission) => {
  const queries = [
    {
      requestId: row.latestRequestId,
      fileName: row.latestAttachmentName
    },
    {
      fileName: row.latestAttachmentName
    },
    {
      requestId: row.latestRequestId
    }
  ]
  for (const params of queries) {
    if (!params.requestId && !params.fileName) {
      continue
    }
    const data = await AttendanceApi.getRawFilePage({
      ...params,
      fileType: 'ATTENDANCE_EXCEL',
      year: row.year,
      pageNo: 1,
      pageSize: 20
    })
    const list = data?.list || []
    const exact = list.find((item: AttendanceRawFile) => item.fileName === row.latestAttachmentName && item.requestId === row.latestRequestId)
    const sameName = list.find((item: AttendanceRawFile) => item.fileName === row.latestAttachmentName)
    const sameRequest = list.find((item: AttendanceRawFile) => item.requestId === row.latestRequestId)
    const file = exact || sameName || sameRequest || list[0]
    if (file) {
      return file
    }
  }
  return undefined
}

const submissionEmptyText = (label: string) => {
  if (submissionList.value.length === 0) {
    return '当前筛选条件下暂无报送数据'
  }
  return `暂无${label}`
}

const formatNumberCell = (_row: any, _column: any, value?: number) => {
  if (value === undefined || value === null || value === '') return '0'
  return `${value}`
}

const handleStatisticExport = async () => {
  statisticExportLoading.value = true
  try {
    const data = await AttendanceApi.exportStatistic({
      year: queryParams.year,
      month: queryParams.month,
      department: queryParams.department,
      employeeName: recordQueryParams.employeeName,
      reason: statisticQueryParams.reason
    })
    download.excel(data, `${queryParams.year}年休假统计表.xlsx`)
  } finally {
    statisticExportLoading.value = false
  }
}

const handleLeaveChangeExport = async () => {
  leaveChangeExportLoading.value = true
  try {
    const data = await AttendanceApi.exportLeaveChange({
      year: queryParams.year,
      employmentType: leaveChangeQueryParams.employmentType,
      employeeName: recordQueryParams.employeeName
    })
    download.excel(data, `${queryParams.year}年病事假、人员变动.xlsx`)
  } finally {
    leaveChangeExportLoading.value = false
  }
}

const downloadRawFile = async (row: AttendanceRawFile) => {
  const data = await AttendanceApi.downloadRawFile(row.id)
  const blob = new Blob([data as Blob], { type: row.contentType || 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = row.fileName
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  remoteDepartmentSearch()
  getSummaryList()
})
</script>

<style scoped>
.submission-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 116px;
  padding: 16px 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color);
}

.submission-card--submitted {
  border-left: 4px solid var(--el-color-success);
}

.submission-card--missing {
  border-left: 4px solid var(--el-color-danger);
}

.submission-card__title {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.submission-card__value {
  margin-top: 10px;
  color: var(--el-text-color-primary);
  font-size: 28px;
  font-weight: 600;
}

.submission-progress {
  padding: 14px 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color);
}

.submission-progress__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: var(--el-text-color-regular);
}

.submission-group {
  min-height: 220px;
  padding: 14px 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color);
}

.submission-group__title {
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.submission-group__tag {
  margin: 0 8px 8px 0;
}

.submission-group__empty {
  color: var(--el-text-color-secondary);
  line-height: 32px;
}

.submission-section-title {
  margin: 14px 0 10px;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.submission-detail-list {
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color);
}

.submission-detail-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.submission-detail-item:last-child {
  border-bottom: 0;
}

.submission-detail-item__main {
  min-width: 0;
}

.submission-detail-item__title {
  display: flex;
  align-items: center;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.submission-detail-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.submission-detail-item__file {
  max-width: 360px;
  color: var(--el-text-color-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
