import request from '@/config/axios'

export interface EducationRecord {
  id: number
  taskId: number
  staffId: number
  staffName: string
  department: string
  status: number
  score: number
  signTime: string
  completeTime?: string
  importBatchNo?: string
  remark?: string
}

export const EducationRecordApi = {
  getPage: async (params: any) =>
    request.get({ url: '/yideyifeng/education-record/page', params }),
  sign: async (id: number) =>
    request.post({ url: `/yideyifeng/education-record/sign?id=${id}` }),
  update: async (data: EducationRecord) =>
    request.put({ url: '/yideyifeng/education-record/update', data }),
  getImportTemplate: async () =>
    request.download({ url: '/yideyifeng/education-record/get-import-template' }),
  rollbackImport: async (batchNo: string) =>
    request.delete({ url: '/yideyifeng/education-record/rollback-import', params: { batchNo } }),
  getStatistics: async (taskId: number) =>
    request.get({ url: '/yideyifeng/education-record/statistics', params: { taskId } }),
  exportRecords: async (taskId: number) =>
    request.download({ url: '/yideyifeng/education-record/export', params: { taskId } })
}
