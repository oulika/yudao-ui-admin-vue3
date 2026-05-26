import request from '@/config/axios'

/** 看板总览数据 */
export interface DashboardOverview {
  staffCount: number
  behaviorRecordCount: number
  pendingDeclarationCount: number
  pendingComplaintCount: number
  activeNoticeCount: number
  activeEducationCount: number
  deptScoreRank: DeptScoreRank[]
  gradeDistribution: GradeDistribution[]
  quarterScoreTrend: QuarterScoreTrend[]
  categoryPoints: CategoryPoints[]
  todoList: TodoItem[]
}

export interface DeptScoreRank {
  department: string
  avgScore: number
}

export interface GradeDistribution {
  grade: string
  count: number
}

export interface QuarterScoreTrend {
  year: number
  quarter: number
  avgScore: number
}

export interface CategoryPoints {
  category: string
  totalPoints: number
}

export interface TodoItem {
  id: number
  type: string
  title: string
  department: string
  extra: string
  createTime: string
}

// 看板 API
export const DashboardApi = {
  // 获取看板总览
  getOverview: async (): Promise<DashboardOverview> => {
    return await request.get({ url: `/yideyifeng/dashboard/get-overview` })
  },
}
