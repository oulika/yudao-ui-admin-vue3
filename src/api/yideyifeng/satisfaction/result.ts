import request from '@/config/axios'

/** 满意度结果统计信息 */
export interface SatisfactionResultStat {
  externalRecordNo?: string
  importBatchNo?: string
  remark?: string
  id: number;
  surveyId: number;
  staffId: number;
  staffName: string;
  department: string;
  score: number;
  respondentType: string;
  submitTime: string;
}

// 满意度结果统计 API
export const SatisfactionResultApi = {
  getImportTemplate: async () => {
    return await request.download({ url: '/yideyifeng/satisfaction-result/get-import-template' })
  },
  rollbackImport: async (batchNo: string) => {
    return await request.delete({ url: '/yideyifeng/satisfaction-result/rollback-import', params: { batchNo } })
  },
  getStatistics: async (params: { surveyId?: number; lowScoreThreshold?: number }) => {
    return await request.get({ url: '/yideyifeng/satisfaction-result/statistics', params })
  },
  exportResults: async (surveyId?: number) => {
    return await request.download({ url: '/yideyifeng/satisfaction-result/export', params: { surveyId } })
  },
  // 查询满意度结果分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/satisfaction-result/page`, params })
  },

  // 查询结果详情
  get: async (id: number) => {
    return await request.get({ url: `/yideyifeng/satisfaction-result/get?id=` + id })
  },

  // 新增满意度结果
  create: async (data: SatisfactionResultStat) => {
    return await request.post({ url: `/yideyifeng/satisfaction-result/create`, data })
  },
}
