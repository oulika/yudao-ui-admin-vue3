import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 员工信息信息 */
export interface ScoreStaff {
          id: number; // 编号
          name: string; // 姓名
          jobNumber: string; // 职务
          department: string; // 部门
          title: string; // 职称
  }

// 员工信息 API
export const ScoreStaffApi = {
  // 查询员工信息分页
  getScoreStaffPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/score-staff/page`, params })
  },

  // 查询员工信息详情
  getScoreStaff: async (id: number) => {
    return await request.get({ url: `/yideyifeng/score-staff/get?id=` + id })
  },

  // 查询所有员工信息
  getAllScoreStaff: async () => {
    return await request.get({ url: `/yideyifeng/score-staff/getAll`})
  },

  // 新增员工信息
  createScoreStaff: async (data: ScoreStaff) => {
    return await request.post({ url: `/yideyifeng/score-staff/create`, data })
  },

  // 修改员工信息
  updateScoreStaff: async (data: ScoreStaff) => {
    return await request.put({ url: `/yideyifeng/score-staff/update`, data })
  },

  // 删除员工信息
  deleteScoreStaff: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/score-staff/delete?id=` + id })
  },

  /** 批量删除员工信息 */
  deleteScoreStaffList: async (ids: number[]) => {
    return await request.delete({ url: `/yideyifeng/score-staff/delete-list?ids=${ids.join(',')}` })
  },

  // 导出员工信息 Excel
  exportScoreStaff: async (params) => {
    return await request.download({ url: `/yideyifeng/score-staff/export-excel`, params })
  },
}
