import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** AI舆情信息 */
export interface PublicOpinion {
  id: number
  opinionNo: string
  source: string
  title: string
  content: string
  sentiment: string
  aiAnalysis: string
  riskLevel: string
  priority: string
  status: number
  relatedStaffId: number
  relatedStaffName: string
  relatedDepartment: string
  handlerId: number
  handlerName: string
  handleResult: string
  handleTime: string
  publishTime: string
  year: number
  createTime: string
}

/** AI舆情跟踪记录 */
export interface PublicOpinionFollowUp {
  id: number
  opinionId: number
  followUpContent: string
  followUpStatus: string
  followUpTime: string
  handlerId: number
  handlerName: string
  createTime: string
}

// AI舆情 API
export const PublicOpinionApi = {
  // 查询舆情分页
  getPublicOpinionPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/public-opinion/page`, params })
  },

  // 查询舆情详情
  getPublicOpinion: async (id: number) => {
    return await request.get({ url: `/yideyifeng/public-opinion/get?id=` + id })
  },

  // 新增舆情
  createPublicOpinion: async (data: PublicOpinion) => {
    return await request.post({ url: `/yideyifeng/public-opinion/create`, data })
  },

  // 修改舆情
  updatePublicOpinion: async (data: PublicOpinion) => {
    return await request.put({ url: `/yideyifeng/public-opinion/update`, data })
  },

  // 删除舆情
  deletePublicOpinion: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/public-opinion/delete?id=` + id })
  },

  // 批量删除舆情
  deletePublicOpinionList: async (ids: number[]) => {
    return await request.delete({ url: `/yideyifeng/public-opinion/delete-list?ids=${ids.join(',')}` })
  },

  // 导出舆情 Excel
  exportPublicOpinion: async (params) => {
    return await request.download({ url: `/yideyifeng/public-opinion/export-excel`, params })
  },

  // AI分析（手动录入）
  analyzePublicOpinion: async (data: any) => {
    return await request.post({ url: `/yideyifeng/public-opinion/analyze`, data })
  },

  // 处理舆情
  handlePublicOpinion: async (data: any) => {
    return await request.post({ url: `/yideyifeng/public-opinion/handle`, data })
  },

  // 获取跟踪记录列表
  getFollowUps: async (opinionId: number) => {
    return await request.get({ url: `/yideyifeng/public-opinion/get-follow-ups?opinionId=` + opinionId })
  },

  // 添加跟踪记录
  addFollowUp: async (data: any) => {
    return await request.post({ url: `/yideyifeng/public-opinion/follow-up`, data })
  },
}
