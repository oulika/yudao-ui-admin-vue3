<template>
  <div v-loading="loading">
    <!-- 欢迎卡片 + 统计概览 -->
    <el-card shadow="never">
      <el-row :gutter="16" justify="space-between">
        <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <div class="flex items-center">
            <el-avatar :src="avatar" :size="70" class="mr-16px">
              <img src="@/assets/imgs/avatar.gif" alt="" />
            </el-avatar>
            <div>
              <div class="text-20px">
                欢迎回来，{{ username }}！医德医风管理系统
              </div>
              <div class="mt-10px text-14px text-gray-500">
                {{ currentDate }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <div class="h-70px flex items-center justify-end lt-sm:mt-10px">
            <div class="px-8px text-right">
              <div class="mb-16px text-14px text-gray-400">员工总数</div>
              <CountTo class="text-20px" :start-val="0" :end-val="dashboard.staffCount" :duration="2600" />
            </div>
            <el-divider direction="vertical" />
            <div class="px-8px text-right">
              <div class="mb-16px text-14px text-gray-400">行为记录</div>
              <CountTo class="text-20px" :start-val="0" :end-val="dashboard.behaviorRecordCount" :duration="2600" />
            </div>
            <el-divider direction="vertical" border-style="dashed" />
            <div class="px-8px text-right">
              <div class="mb-16px text-14px text-gray-400">待审核</div>
              <CountTo class="text-20px" :start-val="0" :end-val="dashboard.pendingDeclarationCount" :duration="2600" />
            </div>
            <el-divider direction="vertical" border-style="dashed" />
            <div class="px-8px text-right">
              <div class="mb-16px text-14px text-gray-400">待处理投诉</div>
              <CountTo class="text-20px" :start-val="0" :end-val="dashboard.pendingComplaintCount" :duration="2600" />
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 统计卡片行 -->
    <el-row :gutter="16" class="mt-8px">
      <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" v-for="stat in statCards" :key="stat.label">
        <el-card shadow="hover" class="stat-card">
          <div class="flex items-center">
            <div class="stat-icon" :style="{ background: stat.color }">
              <Icon :icon="stat.icon" :size="24" color="#fff" />
            </div>
            <div class="ml-16px">
              <div class="text-14px text-gray-500">{{ stat.label }}</div>
              <CountTo class="text-24px font-bold mt-4px" :start-val="0" :end-val="stat.value" :duration="2000" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表行1：科室评分排行 + 等级分布 -->
    <el-row :gutter="16" class="mt-8px">
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <el-card shadow="never">
          <template #header>
            <span class="card-title">科室评分排行</span>
          </template>
          <Echart :options="deptRankOptions" :height="300" v-if="dashboard.deptScoreRank?.length" />
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <el-card shadow="never">
          <template #header>
            <span class="card-title">等级分布</span>
          </template>
          <Echart :options="gradeDistOptions" :height="300" v-if="dashboard.gradeDistribution?.length" />
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表行2：季度趋势 + 加分扣分统计 -->
    <el-row :gutter="16" class="mt-8px">
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <el-card shadow="never">
          <template #header>
            <span class="card-title">季度评分趋势</span>
          </template>
          <Echart :options="trendOptions" :height="300" v-if="dashboard.quarterScoreTrend.length" />
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <el-card shadow="never">
          <template #header>
            <span class="card-title">加分/扣分统计</span>
          </template>
          <Echart :options="categoryOptions" :height="300" v-if="dashboard.categoryPoints.length" />
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 待办事项 -->
    <el-row :gutter="16" class="mt-8px">
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="card-title">待审核申报</span>
              <el-button link type="primary" @click="router.push('/system/yideyifeng/declaration/audit')">查看全部 →</el-button>
            </div>
          </template>
          <div v-if="pendingDeclarations.length" class="todo-list">
            <div v-for="item in pendingDeclarations" :key="item.id" class="todo-item" @click="router.push('/system/yideyifeng/declaration/audit')">
              <div class="todo-item-content">
                <div class="todo-item-title">{{ item.title }}</div>
                <div class="todo-item-meta">
                  <span>{{ item.department }}</span>
                  <el-tag size="small" type="warning">{{ item.extra }}</el-tag>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无待审核申报" />
        </el-card>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="card-title">待处理投诉</span>
              <el-button link type="primary" @click="router.push('/system/yideyifeng/complaint')">查看全部 →</el-button>
            </div>
          </template>
          <div v-if="pendingComplaints.length" class="todo-list">
            <div v-for="item in pendingComplaints" :key="item.id" class="todo-item" @click="router.push('/system/yideyifeng/complaint')">
              <div class="todo-item-content">
                <div class="todo-item-title">{{ item.title }}</div>
                <div class="todo-item-meta">
                  <span>{{ item.department }}</span>
                  <el-tag size="small" type="danger">{{ item.extra }}</el-tag>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无待处理投诉" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { EChartsOption } from 'echarts'
import { useUserStore } from '@/store/modules/user'
import { DashboardApi, DashboardOverview } from '@/api/yideyifeng/dashboard'

defineOptions({ name: 'Index' })

const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const avatar = userStore.getUser.avatar
const username = userStore.getUser.nickname

const currentDate = computed(() => {
  const now = new Date()
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`
})

const dashboard = ref<DashboardOverview>({
  staffCount: 0,
  behaviorRecordCount: 0,
  pendingDeclarationCount: 0,
  pendingComplaintCount: 0,
  activeNoticeCount: 0,
  activeEducationCount: 0,
  deptScoreRank: [],
  gradeDistribution: [],
  quarterScoreTrend: [],
  categoryPoints: [],
  todoList: [],
})

// 统计卡片
const statCards = computed(() => [
  { label: '员工总数', value: dashboard.value.staffCount, icon: 'ep:user', color: '#409EFF' },
  { label: '行为记录', value: dashboard.value.behaviorRecordCount, icon: 'ep:document', color: '#67C23A' },
  { label: '待审核申报', value: dashboard.value.pendingDeclarationCount, icon: 'ep:edit', color: '#E6A23C' },
  { label: '待处理投诉', value: dashboard.value.pendingComplaintCount, icon: 'ep:warning', color: '#F56C6C' },
  { label: '公示进行中', value: dashboard.value.activeNoticeCount, icon: 'ep:bell', color: '#909399' },
  { label: '教育任务', value: dashboard.value.activeEducationCount, icon: 'ep:reading', color: '#8B5CF6' },
])

// 待办事项筛选
const pendingDeclarations = computed(() =>
  (dashboard.value.todoList || []).filter(item => item.type === 'declaration')
)
const pendingComplaints = computed(() =>
  (dashboard.value.todoList || []).filter(item => item.type === 'complaint')
)

// 科室评分排行 - 横向柱状图
const deptRankOptions = computed<EChartsOption>(() => {
  const data = dashboard.value.deptScoreRank || []
  return {
    grid: { left: 120, right: 30, top: 20, bottom: 20, containLabel: true },
    xAxis: { type: 'value', axisTick: { show: false } },
    yAxis: {
      type: 'category',
      data: data.map(d => d.department).reverse(),
      axisLabel: { interval: 0, fontSize: 12 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: '{b}: {c} 分'
    },
    series: [{
      type: 'bar',
      data: data.map(d => d.avgScore).reverse(),
      itemStyle: { color: '#667eea', borderRadius: [0, 4, 4, 0] },
      barWidth: 20
    }]
  }
})

// 等级分布 - 饼图
const gradeDistOptions = computed<EChartsOption>(() => {
  const data = dashboard.value.gradeDistribution || []
  const gradeColors: Record<string, string> = {
    '优秀': '#67C23A',
    '良好': '#409EFF',
    '一般': '#E6A23C',
    '较差': '#F56C6C'
  }
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      data: data.map(g => ({
        name: g.grade,
        value: g.count,
        itemStyle: { color: gradeColors[g.grade] || '#909399' }
      }))
    }]
  }
})

// 季度趋势 - 折线图
const trendOptions = computed<EChartsOption>(() => {
  const data = dashboard.value.quarterScoreTrend || []
  return {
    grid: { left: 50, right: 20, top: 20, bottom: 30, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => `${d.year}年Q${d.quarter}`),
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '平均分',
      axisTick: { show: false }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0]
        return `${p.name}<br/>平均分: ${p.value} 分`
      }
    },
    series: [{
      name: '平均分',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: data.map(d => d.avgScore),
      lineStyle: { width: 3, color: '#409EFF' },
      itemStyle: { color: '#409EFF' },
      areaStyle: { color: 'rgba(64, 158, 255, 0.15)' }
    }]
  }
})

// 加分/扣分统计 - 柱状图
const categoryOptions = computed<EChartsOption>(() => {
  const data = dashboard.value.categoryPoints || []
  return {
    grid: { left: 50, right: 20, top: 20, bottom: 60, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.category),
      axisLabel: { interval: 0, rotate: 30, fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      name: '总分',
      axisTick: { show: false }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0]
        const sign = p.value >= 0 ? '+' : ''
        return `${p.name}<br/>${sign}${p.value} 分`
      }
    },
    series: [{
      type: 'bar',
      data: data.map(d => ({
        value: d.totalPoints,
        itemStyle: {
          color: d.totalPoints >= 0 ? '#67C23A' : '#F56C6C',
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barMaxWidth: 60
    }]
  }
})

const loadData = async () => {
  loading.value = true
  try {
    const result = await DashboardApi.getOverview()
    console.log('[Dashboard] API response:', result)
    // 兼容处理：axios 拦截器返回完整响应体 { code, msg, data }
    const payload = (result as any).data ?? result
    console.log('[Dashboard] payload:', payload)
    dashboard.value.staffCount = payload.staffCount ?? 0
    dashboard.value.behaviorRecordCount = payload.behaviorRecordCount ?? 0
    dashboard.value.pendingDeclarationCount = payload.pendingDeclarationCount ?? 0
    dashboard.value.pendingComplaintCount = payload.pendingComplaintCount ?? 0
    dashboard.value.activeNoticeCount = payload.activeNoticeCount ?? 0
    dashboard.value.activeEducationCount = payload.activeEducationCount ?? 0
    dashboard.value.deptScoreRank = payload.deptScoreRank ?? []
    dashboard.value.gradeDistribution = payload.gradeDistribution ?? []
    dashboard.value.quarterScoreTrend = payload.quarterScoreTrend ?? []
    dashboard.value.categoryPoints = payload.categoryPoints ?? []
    dashboard.value.todoList = payload.todoList ?? []
  } catch (err) {
    console.error('[Dashboard] Failed to load:', err)
  } finally {
    loading.value = false
  }
}

loadData()
</script>

<style scoped>
.stat-card {
  border-radius: 8px;
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.todo-list {
  min-height: 120px;
}
.todo-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}
.todo-item:hover {
  background: #f5f7fa;
}
.todo-item:last-child {
  border-bottom: none;
}
.todo-item-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}
.todo-item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}
</style>
