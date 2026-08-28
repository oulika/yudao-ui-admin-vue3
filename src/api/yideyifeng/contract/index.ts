import request from '@/config/axios'

export interface Contract {
  id?: number; contractName: string; contractNo: string; department?: string; counterparty?: string
  amount?: number; startDate: string; endDate: string; status?: number; fileUrls?: string | string[]
  smsNotify?: boolean; oaNotify?: boolean; oaWorkflowNo?: string; oaWorkflowTitle?: string
  oaWorkflowStatus?: string; oaCurrentNode?: string; oaLastSyncTime?: string; oaWorkflowUrl?: string; maintenanceCycle?: number; customCycleDays?: number
  nextMaintenanceDate?: string; maintenanceRemindDays?: number; expireRemindDays?: number
  maintenanceMaterialRequirement?: string; maintenanceFileUrls?: string | string[]; lastMaintenanceTime?: string
  maintenanceStatus?: number; remark?: string; oaWorkflowCount?: number; oaWorkflowSummary?: string
}
export interface ContractTimeline { id: number; eventType: string; eventTitle: string; eventContent?: string; operatorName?: string; eventTime: string; fileUrls?: string }
export interface ContractOaWorkflow {
  requestId: string; workflowId?: string; title: string; requestMark?: string; department?: string
  creatorName?: string; createTime?: string; status?: string; currentNode?: string; url?: string
}
export interface ContractOaWorkflowRelation {
  id: number; contractId: number; requestId: string; workflowId?: string; title: string
  status?: string; currentNode?: string; url?: string; department?: string; creatorName?: string
  oaCreateTime?: string; lastSyncTime?: string; active: boolean; unlinkTime?: string
}

const serializeFileUrls = (value?: string | string[]) => Array.isArray(value) ? value.join(',') : value
const serializeContract = (data: Contract) => ({
  ...data,
  fileUrls: serializeFileUrls(data.fileUrls),
  maintenanceFileUrls: serializeFileUrls(data.maintenanceFileUrls)
})

export const ContractApi = {
  getPage: (params: any) => request.get({ url: '/yideyifeng/contract/page', params }),
  get: (id: number) => request.get({ url: `/yideyifeng/contract/get?id=${id}` }),
  create: (data: Contract) => request.post({ url: '/yideyifeng/contract/create', data: serializeContract(data) }),
  update: (data: Contract) => request.put({ url: '/yideyifeng/contract/update', data: serializeContract(data) }),
  delete: (id: number) => request.delete({ url: `/yideyifeng/contract/delete?id=${id}` }),
  getTimeline: (contractId: number) => request.get({ url: '/yideyifeng/contract/timeline', params: { contractId } }),
  uploadMaintenanceMaterial: (data: { contractId: number; fileUrls: string | string[]; remark?: string }) => request.put({
    url: '/yideyifeng/contract/maintenance-material',
    data: { ...data, fileUrls: serializeFileUrls(data.fileUrls) }
  }),
  sendNotice: (id: number, type: 'SMS' | 'OA') => request.post({ url: '/yideyifeng/contract/notice', params: { id, type } }),
  getOaWorkflowPage: (params: any) => request.get({ url: '/yideyifeng/contract/oa-workflow/page', params }),
  linkOaWorkflow: (data: ContractOaWorkflow & { contractId: number }) => request.put({
    url: '/yideyifeng/contract/oa-workflow/link', data
  }),
  getOaWorkflowList: (contractId: number) => request.get({ url: '/yideyifeng/contract/oa-workflow/list', params: { contractId } }),
  refreshOaWorkflow: (relationId: number) => request.put({
    url: '/yideyifeng/contract/oa-workflow/refresh', params: { relationId }
  }),
  unlinkOaWorkflow: (relationId: number) => request.put({
    url: '/yideyifeng/contract/oa-workflow/unlink', params: { relationId }
  })
}
