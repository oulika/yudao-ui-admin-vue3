import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 申报信息 */
export interface Declaration {
  id: number; // 编号
  staffId: number; // 员工ID
  staffName: string; // 员工姓名
  department: string; // 科室
  year: number; // 年度
  quarter: number; // 季度
  category: string; // 分类
  item: string; // 条目
  points: number; // 分值
  description: string; // 说明
  attachmentUrls: string; // 证明材料
  status: number; // 状态：0待审/1科室审核通过/2终审通过/3驳回
  auditRemark: string; // 审核意见
  auditorId: number; // 审核人ID
  auditorName: string; // 审核人姓名
  auditTime: string; // 审核时间
  periodId: number; // 考评周期ID
}

// 申报 API
export const DeclarationApi = {
  // 查询我的申报分页
  getMyPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/declaration/page`, params })
  },

  // 查询审核列表分页
  getAuditPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/declaration/audit-page`, params })
  },

  // 查询申报详情
  get: async (id: number) => {
    return await request.get({ url: `/yideyifeng/declaration/get?id=` + id })
  },

  // 新增申报
  create: async (data: Declaration) => {
    return await request.post({ url: `/yideyifeng/declaration/create`, data })
  },

  // 修改申报
  update: async (data: Declaration) => {
    return await request.put({ url: `/yideyifeng/declaration/update`, data })
  },

  // 删除申报
  delete: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/declaration/delete?id=` + id })
  },

  // 审核申报
  audit: async (id: number, passed: boolean, remark: string) => {
    return await request.put({ url: `/yideyifeng/declaration/audit`, data: { id, status: passed ? 1 : 3, auditRemark: remark } })
  },
}
