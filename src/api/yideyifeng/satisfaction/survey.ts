import request from '@/config/axios'

/** 满意度调查信息 */
export interface SatisfactionSurvey {
  externalPlatform?: string
  questionnaireUrl?: string
  remark?: string
  id: number; // 编号
  title: string; // 调查标题
  year: number; // 年度
  quarter: number; // 季度
  startDate: string; // 开始日期
  endDate: string; // 结束日期
  status: number; // 状态
  sort: number; // 排序
}

/** 满意度问题信息 */
export interface SatisfactionQuestion {
  id: number; // 编号
  surveyId: number; // 调查ID
  content: string; // 问题内容
  type: string; // 类型
  sort: number; // 排序
}

/** 满意度结果信息 */
export interface SatisfactionResult {
  id: number; // 编号
  surveyId: number; // 调查ID
  staffId: number; // 被评价员工ID
  staffName: string; // 被评价员工姓名
  department: string; // 科室
  score: number; // 满意度得分
  respondentType: string; //  respondent类型
  submitTime: string; // 提交时间
}

// 满意度调查 API
export const SatisfactionSurveyApi = {
  // 查询满意度调查分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/satisfaction-survey/page`, params })
  },

  // 查询满意度调查详情
  get: async (id: number) => {
    return await request.get({ url: `/yideyifeng/satisfaction-survey/get?id=` + id })
  },

  // 新增满意度调查
  create: async (data: SatisfactionSurvey) => {
    return await request.post({ url: `/yideyifeng/satisfaction-survey/create`, data })
  },

  // 修改满意度调查
  update: async (data: SatisfactionSurvey) => {
    return await request.put({ url: `/yideyifeng/satisfaction-survey/update`, data })
  },

  // 删除满意度调查
  delete: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/satisfaction-survey/delete?id=` + id })
  },

  copy: async (id: number) => {
    return await request.post({ url: `/yideyifeng/satisfaction-survey/copy?id=${id}` })
  },

  updateStatus: async (id: number, status: number) => {
    return await request.put({ url: `/yideyifeng/satisfaction-survey/status?id=${id}&status=${status}` })
  },
}

// 满意度问题 API
export const SatisfactionQuestionApi = {
  // 查询问题分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/satisfaction-question/page`, params })
  },

  // 根据调查ID获取问题列表
  getListBySurveyId: async (surveyId: number) => {
    return await request.get({ url: `/yideyifeng/satisfaction-question/list?surveyId=` + surveyId })
  },

  // 新增问题
  create: async (data: SatisfactionQuestion) => {
    return await request.post({ url: `/yideyifeng/satisfaction-question/create`, data })
  },

  // 修改问题
  update: async (data: SatisfactionQuestion) => {
    return await request.put({ url: `/yideyifeng/satisfaction-question/update`, data })
  },

  // 删除问题
  delete: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/satisfaction-question/delete?id=` + id })
  },
}

// 满意度结果 API
export const SatisfactionResultApi = {
  // 查询满意度结果分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/satisfaction-result/page`, params })
  },

  // 新增满意度结果
  create: async (data: SatisfactionResult) => {
    return await request.post({ url: `/yideyifeng/satisfaction-result/create`, data })
  },
}
