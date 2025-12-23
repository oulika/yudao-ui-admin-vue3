import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 文件记录信息 */
export interface ScoreFile {
          id: number; // 编号
          quarter: number; // 季度
          remark: string; // 备注
          department: string; // 评审科室
          filePath: string; // 文件路径
          year: number; // 年度
  }

// 文件记录 API
export const ScoreFileApi = {
  // 查询文件记录分页
  getScoreFilePage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/score-file/page`, params })
  },

  // 查询文件记录详情
  getScoreFile: async (id: number) => {
    return await request.get({ url: `/yideyifeng/score-file/get?id=` + id })
  },

  // 新增文件记录
  createScoreFile: async (data: ScoreFile) => {
    return await request.post({ url: `/yideyifeng/score-file/create`, data })
  },

  // 修改文件记录
  updateScoreFile: async (data: ScoreFile) => {
    return await request.put({ url: `/yideyifeng/score-file/update`, data })
  },

  // 删除文件记录
  deleteScoreFile: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/score-file/delete?id=` + id })
  },

  /** 批量删除文件记录 */
  deleteScoreFileList: async (ids: number[]) => {
    return await request.delete({ url: `/yideyifeng/score-file/delete-list?ids=${ids.join(',')}` })
  },

  // 导出文件记录 Excel
  exportScoreFile: async (params) => {
    return await request.download({ url: `/yideyifeng/score-file/export-excel`, params })
  },
}