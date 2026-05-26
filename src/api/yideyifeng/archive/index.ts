import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 归档记录信息 */
export interface ArchiveRecord {
  id: number; // 编号
  year: number; // 归档年度
  status: number; // 状态：0未归档/1归档中/2已归档
  archiveBy: number; // 归档操作人
  archiveTime: string; // 归档时间
  remark: string; // 备注
}

// 归档记录 API
export const ArchiveRecordApi = {
  // 查询归档分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/archive/page`, params })
  },

  // 执行归档
  archive: async (data: { year: number }) => {
    return await request.post({ url: `/yideyifeng/archive/operate`, data })
  },

  // 解锁归档
  unlock: async (year: number) => {
    return await request.put({ url: `/yideyifeng/archive/unlock?year=` + year })
  },
}
