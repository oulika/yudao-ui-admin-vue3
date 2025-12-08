import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 评分标准信息 */
export interface ScoreTemplate {
          id: number; // 编号
          category: string; // 分类
          item: string; // 项目
          points: number; // 分值
          department: string; // 科室
  }

// 评分标准 API
export const ScoreTemplateApi = {
  // 查询评分标准分页
  getScoreTemplatePage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/score-template/page`, params })
  },

  // 查询评分标准详情
  getScoreTemplate: async (id: number) => {
    return await request.get({ url: `/yideyifeng/score-template/get?id=` + id })
  },

  // 查询评分标准详情
  getAllScoreTemplate: async () => {
    return await request.get({ url: `/yideyifeng/score-template/getAll`})
  },

  // 新增评分标准
  createScoreTemplate: async (data: ScoreTemplate) => {
    return await request.post({ url: `/yideyifeng/score-template/create`, data })
  },

  // 修改评分标准
  updateScoreTemplate: async (data: ScoreTemplate) => {
    return await request.put({ url: `/yideyifeng/score-template/update`, data })
  },

  // 删除评分标准
  deleteScoreTemplate: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/score-template/delete?id=` + id })
  },

  /** 批量删除评分标准 */
  deleteScoreTemplateList: async (ids: number[]) => {
    return await request.delete({ url: `/yideyifeng/score-template/delete-list?ids=${ids.join(',')}` })
  },

  // 导出评分标准 Excel
  exportScoreTemplate: async (params) => {
    return await request.download({ url: `/yideyifeng/score-template/export-excel`, params })
  },
}
