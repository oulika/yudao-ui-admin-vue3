import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 考评周期信息 */
export interface AssessmentPeriod {
  id: number; // 编号
  year: number; // 年度
  quarter: number; // 季度
  periodName: string; // 周期名称
  startDate: string; // 开始日期
  endDate: string; // 结束日期
  status: number; // 状态
  openFillStart: string; // 开放填报开始时间
  openFillEnd: string; // 开放填报结束时间
  sort: number; // 排序
}

// 考评周期 API
export const AssessmentPeriodApi = {
  // 查询考评周期分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/assessment-period/page`, params })
  },

  // 查询考评周期详情
  get: async (id: number) => {
    return await request.get({ url: `/yideyifeng/assessment-period/get?id=` + id })
  },

  // 获取当前活跃周期
  getActive: async () => {
    return await request.get({ url: `/yideyifeng/assessment-period/active` })
  },

  // 新增考评周期
  create: async (data: AssessmentPeriod) => {
    return await request.post({ url: `/yideyifeng/assessment-period/create`, data })
  },

  // 修改考评周期
  update: async (data: AssessmentPeriod) => {
    return await request.put({ url: `/yideyifeng/assessment-period/update`, data })
  },

  // 删除考评周期
  delete: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/assessment-period/delete?id=` + id })
  },

  // 更新周期状态
  updateStatus: async (id: number, status: number) => {
    return await request.put({ url: `/yideyifeng/assessment-period/update-status?id=` + id + `&status=` + status })
  },
}
