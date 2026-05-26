import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 公示异议信息 */
export interface NoticeObjection {
  id: number; // 编号
  noticeId: number; // 公示ID
  staffId: number; // 异议人
  staffName: string; // 姓名
  content: string; // 异议内容
  attachmentUrls: string; // 附件
  status: number; // 状态：0待处理/1已处理
  handleRemark: string; // 处理意见
  handleTime: string; // 处理时间
}

// 公示异议 API
export const NoticeObjectionApi = {
  // 查询异议分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/notice-objection/page`, params })
  },

  // 新增异议
  create: async (data: NoticeObjection) => {
    return await request.post({ url: `/yideyifeng/notice-objection/create`, data })
  },

  // 处理异议
  handle: async (id: number, handleRemark: string) => {
    return await request.put({ url: `/yideyifeng/notice-objection/handle?id=` + id + `&handleRemark=` + handleRemark })
  },
}
