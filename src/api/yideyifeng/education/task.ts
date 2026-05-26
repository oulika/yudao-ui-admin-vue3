import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 学习任务信息 */
export interface EducationTask {
  id: number; // 编号
  title: string; // 任务标题
  type: string; // 类型：培训/考试
  content: string; // 内容
  year: number; // 年度
  quarter: number; // 季度
  targetDept: string; // 目标科室
  startDate: string; // 开始日期
  endDate: string; // 结束日期
  status: number; // 状态
}

// 学习任务 API
export const EducationTaskApi = {
  // 查询学习任务分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/education-task/page`, params })
  },

  // 查询学习任务详情
  get: async (id: number) => {
    return await request.get({ url: `/yideyifeng/education-task/get?id=` + id })
  },

  // 新增学习任务
  create: async (data: EducationTask) => {
    return await request.post({ url: `/yideyifeng/education-task/create`, data })
  },

  // 修改学习任务
  update: async (data: EducationTask) => {
    return await request.put({ url: `/yideyifeng/education-task/update`, data })
  },

  // 删除学习任务
  delete: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/education-task/delete?id=` + id })
  },
}
