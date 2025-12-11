import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 行为记录信息 */
export interface BehaviorRecords {
          id: number; // 编号
          staffId: number; // 员工ID
          staffName: string; // 员工姓名
          year: number; // 年度
          quarter: number; // 季度
          category: string; // 分类
          item: string; // 条目
          points: number; // 分值
          remark: string; // 备注
          department: string; // 评审科室
          imagePath: string; // 图片路径
  }

// 行为记录 API
export const BehaviorRecordsApi = {
  // 查询行为记录分页
  getBehaviorRecordsPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/behavior-records/page`, params })
  },

  // 查询行为记录详情
  getBehaviorRecords: async (id: number) => {
    return await request.get({ url: `/yideyifeng/behavior-records/get?id=` + id })
  },

  // 查询行为记录详情
  getAllBehaviorRecords: async () => {
    return await request.get({ url: `/yideyifeng/behavior-records/getAll`})
  },

  // 新增行为记录
  createBehaviorRecords: async (data: BehaviorRecords) => {
    return await request.post({ url: `/yideyifeng/behavior-records/create`, data })
  },

  // 修改行为记录
  updateBehaviorRecords: async (data: BehaviorRecords) => {
    return await request.put({ url: `/yideyifeng/behavior-records/update`, data })
  },

  // 删除行为记录
  deleteBehaviorRecords: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/behavior-records/delete?id=` + id })
  },

  /** 批量删除行为记录 */
  deleteBehaviorRecordsList: async (ids: number[]) => {
    return await request.delete({ url: `/yideyifeng/behavior-records/delete-list?ids=${ids.join(',')}` })
  },

  // 导出行为记录 Excel
  exportBehaviorRecords: async (params) => {
    return await request.download({ url: `/yideyifeng/behavior-records/export-excel`, params })
  },
}
