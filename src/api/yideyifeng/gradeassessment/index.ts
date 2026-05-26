import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 等级评定信息 */
export interface GradeAssessment {
  id: number; // 编号
  staffId: number; // 员工ID
  staffName: string; // 员工姓名
  department: string; // 科室
  year: number; // 年度
  totalScore: number; // 年度总分
  grade: string; // 等级
  unqualified: number; // 是否一票否决
  isLocked: number; // 是否已锁定
  remark: string; // 备注
}

// 等级评定 API
export const GradeAssessmentApi = {
  // 查询等级评定分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/grade-assessment/page`, params })
  },

  // 查询等级评定详情
  get: async (id: number) => {
    return await request.get({ url: `/yideyifeng/grade-assessment/get?id=` + id })
  },

  // 批量生成年度等级
  generate: async (data: { year: number }) => {
    return await request.post({ url: `/yideyifeng/grade-assessment/generate`, data })
  },

  // 修改等级评定
  update: async (data: GradeAssessment) => {
    return await request.put({ url: `/yideyifeng/grade-assessment/update`, data })
  },

  // 锁定等级评定
  lock: async (id: number) => {
    return await request.put({ url: `/yideyifeng/grade-assessment/lock?id=` + id })
  },

  // 锁定年度所有等级
  lockYear: async (year: number) => {
    return await request.put({ url: `/yideyifeng/grade-assessment/lock-year?year=` + year })
  },

  // 导出等级评定 Excel
  exportExcel: async (params: any) => {
    return await request.download({ url: `/yideyifeng/grade-assessment/export-excel`, params })
  },
}
