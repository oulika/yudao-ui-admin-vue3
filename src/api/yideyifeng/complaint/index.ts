import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 投诉信息 */
export interface Complaint {
  id: number; // 编号
  complaintNo: string; // 投诉编号
  staffId: number; // 被投诉员工ID
  staffName: string; // 员工姓名
  department: string; // 科室
  complaintType: string; // 类型
  source: string; // 来源
  content: string; // 投诉内容
  complainerName: string; // 投诉人姓名
  complainerContact: string; // 联系方式
  status: number; // 状态：0待受理/1处理中/2已处理/3已回访
  handlerId: number; // 处理人
  handleResult: string; // 处理结果
  handleTime: string; // 处理时间
  returnStatus: number; // 回访状态
  returnResult: string; // 回访结果
  year: number; // 年度
}

// 投诉 API
export const ComplaintApi = {
  // 查询投诉分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/complaint/page`, params })
  },

  // 查询投诉详情
  get: async (id: number) => {
    return await request.get({ url: `/yideyifeng/complaint/get?id=` + id })
  },

  // 新增投诉
  create: async (data: Complaint) => {
    return await request.post({ url: `/yideyifeng/complaint/create`, data })
  },

  // 修改投诉
  update: async (data: Complaint) => {
    return await request.put({ url: `/yideyifeng/complaint/update`, data })
  },

  // 删除投诉
  delete: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/complaint/delete?id=` + id })
  },

  // 处理投诉
  handle: async (id: number, handleResult: string) => {
    return await request.put({ url: `/yideyifeng/complaint/handle?id=` + id + `&handleResult=` + handleResult })
  },

  // 投诉回访
  returnVisit: async (id: number, returnStatus: number, returnResult: string) => {
    return await request.put({ url: `/yideyifeng/complaint/return-visit?id=` + id + `&returnStatus=` + returnStatus + `&returnResult=` + returnResult })
  },

  // 导出投诉 Excel
  exportExcel: async (params: any) => {
    return await request.download({ url: `/yideyifeng/complaint/export-excel`, params })
  },
}
