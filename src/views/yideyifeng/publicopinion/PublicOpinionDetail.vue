<template>
  <Dialog :title="'舆情详情'" v-model="dialogVisible" width="900">
    <el-descriptions v-if="detail" :column="2" border>
      <el-descriptions-item label="舆情编号">{{ detail.opinionNo }}</el-descriptions-item>
      <el-descriptions-item label="来源">
        <el-tag :type="getSourceTagType(detail.source)">{{ getSourceLabel(detail.source) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="标题" :span="2">{{ detail.title }}</el-descriptions-item>
      <el-descriptions-item label="情感倾向">
        <el-tag :type="getSentimentTagType(detail.sentiment)">{{ getSentimentLabel(detail.sentiment || '未分析') }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="风险等级">
        <el-tag :type="getRiskLevelTagType(detail.riskLevel)">{{ getRiskLevelLabel(detail.riskLevel || '未评估') }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="getStatusTagType(detail.status)">{{ getStatusLabel(detail.status) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="优先级">
        {{ detail.priority || '未设置' }}
      </el-descriptions-item>
      <el-descriptions-item label="关联员工">{{ detail.relatedStaffName || '-' }}</el-descriptions-item>
      <el-descriptions-item label="关联科室">{{ detail.relatedDepartment || '-' }}</el-descriptions-item>
      <el-descriptions-item label="舆情内容" :span="2">
        <div style="white-space: pre-wrap">{{ detail.content }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="AI分析摘要" :span="2" v-if="detail.aiAnalysis">
        <div style="white-space: pre-wrap">{{ detail.aiAnalysis }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="处理结果" :span="2" v-if="detail.handleResult">
        <div style="white-space: pre-wrap">{{ detail.handleResult }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="处理人">{{ detail.handlerName || '-' }}</el-descriptions-item>
      <el-descriptions-item label="处理时间">{{ detail.handleTime || '-' }}</el-descriptions-item>
      <el-descriptions-item label="发布时间">{{ detail.publishTime || '-' }}</el-descriptions-item>
      <el-descriptions-item label="年度">{{ detail.year }}</el-descriptions-item>
    </el-descriptions>

    <!-- 跟踪记录 -->
    <el-divider>跟踪记录</el-divider>
    <el-timeline v-if="followUps.length > 0">
      <el-timeline-item
        v-for="item in followUps"
        :key="item.id"
        :timestamp="item.followUpTime"
        placement="top"
      >
        <el-card>
          <p><strong>跟踪状态：</strong><el-tag>{{ item.followUpStatus }}</el-tag></p>
          <p><strong>跟踪人：</strong>{{ item.handlerName }}</p>
          <p><strong>跟踪内容：</strong></p>
          <p style="white-space: pre-wrap">{{ item.followUpContent }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无跟踪记录" />
  </Dialog>
</template>

<script setup lang="ts">
import { PublicOpinionApi } from '@/api/yideyifeng/publicopinion'

/** 舆情详情 */
defineOptions({ name: 'PublicOpinionDetail' })

const dialogVisible = ref(false)
const detail = ref<any>(null)
const followUps = ref<any[]>([])

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  detail.value = await PublicOpinionApi.getPublicOpinion(id)
  followUps.value = await PublicOpinionApi.getFollowUps(id)
}
defineExpose({ open })

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

const getSourceLabel = (s: string) => sourceMap[s]?.label || s
const getSourceTagType = (s: string) => sourceMap[s]?.type || ''
const getSentimentLabel = (s: string) => sentimentMap[s]?.label || s
const getSentimentTagType = (s: string) => sentimentMap[s]?.type || ''
const getRiskLevelLabel = (s: string) => riskLevelMap[s]?.label || s
const getRiskLevelTagType = (s: string) => riskLevelMap[s]?.type || ''
const getStatusLabel = (s: number) => statusMap[s] || String(s)
const getStatusTagType = (s: number) => ({ 0: 'info', 1: 'success', 2: 'warning', 3: '', 4: 'danger' })[s] || ''
</script>
