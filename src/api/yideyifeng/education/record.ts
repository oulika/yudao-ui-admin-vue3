import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 学习记录信息 */
export interface EducationRecord {
  id: number; // 编号
  taskId: number; // 任务ID
  staffId: number; // 员工ID
  staffName: string; // 员工姓名
  department: string; // 科室
  status: number; // 状态：0未参加/1已参加/2已缺席/3考试不合格/4考试合格
  score: number; // 考试分数
  signTime: string; // 签到时间
}

// 学习记录 API
export const EducationRecordApi = {
  // 查询学习记录分页
  getPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/education-record/page`, params })
  },

  // 签到
  sign: async (id: number) => {
    return await request.post({ url: `/yideyifeng/education-record/sign?id=` + id })
  },

  // 修改学习记录
  update: async (data: EducationRecord) => {
    return await request.put({ url: `/yideyifeng/education-record/update`, data })
  },
}
