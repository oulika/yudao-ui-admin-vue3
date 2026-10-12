import request from '@/config/axios'

export interface AttendanceMonthlyRecord {
  id: number
  sourceType?: string
  workflowId?: string
  requestId?: string
  attachmentId?: string
  attachmentName?: string
  fileHash?: string
  department: string
  year: number
  month: number
  sequenceNo?: number
  employeeNo?: string
  employeeName?: string
  dailyStatusJson?: string
  leavePersonal?: number
  leaveSick?: number
  leaveMaternity?: number
  leaveMarriage?: number
  leaveFuneral?: number
  leaveOfficial?: number
  workInjury?: number
  leaveAnnual?: number
  leaveHome?: number
  absenteeism?: number
  otherAbsence?: number
  normalWork?: number
  remainingAnnualLeave?: number
  accumulatedRest?: number
  manualModified?: boolean
  rawRowJson?: string
  expectedWorkDays?: number
  actualWorkDays?: number
  createTime?: string
}

export interface AttendanceImportLog {
  id: number
  sourceType?: string
  workflowId?: string
  requestId?: string
  attachmentId?: string
  attachmentName?: string
  fileHash?: string
  department?: string
  year?: number
  month?: number
  importedRows?: number
  success?: boolean
  message?: string
  oaSendTime?: string
  importTime?: string
}

export interface AttendanceSummary {
  year: number
  month: number
  department: string
  recordCount: number
  employeeCount: number
  expectedWorkDays?: number
  totalExpectedWorkDays?: number
  actualWorkDays?: number
  leavePersonal?: number
  leaveSick?: number
  leaveMaternity?: number
  leaveMarriage?: number
  leaveFuneral?: number
  leaveOfficial?: number
  workInjury?: number
  leaveAnnual?: number
  leaveHome?: number
  absenteeism?: number
  otherAbsence?: number
  normalWork?: number
  remainingAnnualLeave?: number
  accumulatedRest?: number
}

export interface AttendanceStatistic {
  recordId: number
  year: number
  month: number
  department?: string
  employeeNo?: string
  employeeName?: string
  reason?: string
  days?: number
}

export interface AttendanceSubmission {
  year: number
  month: number
  department: string
  submitted: boolean | number | string
  recordCount: number
  latestAttachmentName?: string
  latestRequestId?: string
  latestImportTime?: string | number
}

export interface AttendanceLeaveChange {
  year: number
  employmentType?: string
  employeeNo?: string
  employeeName?: string
  month01?: string
  month02?: string
  month03?: string
  month04?: string
  month05?: string
  month06?: string
  month07?: string
  month08?: string
  month09?: string
  month10?: string
  month11?: string
  month12?: string
  remark?: string
}

export interface AttendancePersonChange {
  id: number
  year: number
  employmentType?: string
  changeType?: string
  employeeName?: string
  changeDate?: string
  jobTitle?: string
  department?: string
  remark?: string
}

export interface AttendanceHoliday {
  id: number
  year: number
  holidayDate: string
  name: string
  dayType: number
  workday: boolean
  sourceType?: string
  sourceUrl?: string
}

export interface AttendanceRawFile {
  id: number
  fileType: string
  sourceType?: string
  sourceUrl?: string
  workflowId?: string
  requestId?: string
  attachmentId?: string
  fileName: string
  contentType?: string
  fileHash?: string
  fileSize?: number
  year?: number
  month?: number
  storagePath?: string
  success?: boolean
  message?: string
  oaSendTime?: string
  fetchTime?: string
}

export const AttendanceApi = {
  getRecordPage: async (params: any) => {
    return await request.get({ url: '/yideyifeng/attendance/record/page', params })
  },
  updateRecord: async (data: any) => {
    return await request.put({ url: '/yideyifeng/attendance/record/update', data })
  },
  getImportLogPage: async (params: any) => {
    return await request.get({ url: '/yideyifeng/attendance/import-log/page', params })
  },
  getSummary: async (params: any) => {
    return await request.get({ url: '/yideyifeng/attendance/summary', params })
  },
  getStatisticList: async (params: any) => {
    return await request.get({ url: '/yideyifeng/attendance/statistic/list', params })
  },
  getSubmissionList: async (params: any) => {
    return await request.get({ url: '/yideyifeng/attendance/submission/list', params })
  },
  exportStatistic: async (params: any) => {
    return await request.download({ url: '/yideyifeng/attendance/statistic/export', params })
  },
  getLeaveChangeList: async (params: any) => {
    return await request.get({ url: '/yideyifeng/attendance/leave-change/list', params })
  },
  getPersonChangeList: async (params: any) => {
    return await request.get({ url: '/yideyifeng/attendance/person-change/list', params })
  },
  exportLeaveChange: async (params: any) => {
    return await request.download({ url: '/yideyifeng/attendance/leave-change/export', params })
  },
  getDepartmentList: async (params: any) => {
    return await request.get({ url: '/yideyifeng/attendance/department/list', params })
  },
  getHolidayList: async (params: any) => {
    return await request.get({ url: '/yideyifeng/attendance/holiday/list', params })
  },
  getRawFilePage: async (params: any) => {
    return await request.get({ url: '/yideyifeng/attendance/raw-file/page', params })
  },
  downloadRawFile: async (id: number) => {
    return await request.download({ url: `/yideyifeng/attendance/raw-file/${id}/download` })
  }
}
