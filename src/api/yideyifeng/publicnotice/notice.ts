import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 公示信息 */
export interface PublicNotice {
  id: number; // 编号
  title: string; // 公示标题
  year: number; // 年度
  department: string; // 科室
  content: string; // 公示内容
  startDate: string; // 公示开始日期
  endDate: string; // 公示结束日期
  status: number; // 状态：0草稿/1公示中/2已结束
  publishBy: number; // 发布人
}

// 公示 API
export const PublicNoticeApi = {
  // 查询公示分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/public-notice/page`, params })
  },

  // 查询公示详情
  get: async (id: number) => {
    return await request.get({ url: `/yideyifeng/public-notice/get?id=` + id })
  },

  // 新增公示
  create: async (data: PublicNotice) => {
    return await request.post({ url: `/yideyifeng/public-notice/create`, data })
  },

  // 修改公示
  update: async (data: PublicNotice) => {
    return await request.put({ url: `/yideyifeng/public-notice/update`, data })
  },

  // 删除公示
  delete: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/public-notice/delete?id=` + id })
  },

  // 发布公示
  publish: async (id: number) => {
    return await request.put({ url: `/yideyifeng/public-notice/publish?id=` + id })
  },
}
