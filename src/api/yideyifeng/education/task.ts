import request from '@/config/axios'

export interface EducationTask {
  id: number
  title: string
  type: string
  content: string
  year: number
  quarter: number
  targetDept: string
  targetScope?: string
  targetStaffIds?: string
  attachmentUrls?: string
  startDate: string
  endDate: string
  status: number
  remark?: string
}

export const EducationTaskApi = {
  getPage: async (params: any) =>
    request.get({ url: '/yideyifeng/education-task/page', params }),
  get: async (id: number) =>
    request.get({ url: `/yideyifeng/education-task/get?id=${id}` }),
  create: async (data: EducationTask) =>
    request.post({ url: '/yideyifeng/education-task/create', data }),
  update: async (data: EducationTask) =>
    request.put({ url: '/yideyifeng/education-task/update', data }),
  delete: async (id: number) =>
    request.delete({ url: `/yideyifeng/education-task/delete?id=${id}` }),
  copy: async (id: number) =>
    request.post({ url: `/yideyifeng/education-task/copy?id=${id}` }),
  publish: async (id: number) =>
    request.post({ url: `/yideyifeng/education-task/publish?id=${id}` }),
  updateStatus: async (id: number, status: number) =>
    request.put({ url: `/yideyifeng/education-task/status?id=${id}&status=${status}` })
}
