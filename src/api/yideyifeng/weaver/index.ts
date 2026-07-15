import request from '@/config/axios'

export interface WeaverCallbackLog {
  id: number
  requestId?: string
  workflowId?: string
  workflowName?: string
  action: string
  businessType: string
  businessId: number
  operatorId?: number
  operatorName?: string
  opinion?: string
  processed: boolean
  message?: string
  rawBody?: string
  receivedTime?: string
  processedTime?: string
  createTime?: string
}

export interface WeaverWorkflowRule {
  id?: number
  ruleName: string
  workflowId?: string
  workflowName?: string
  businessType: string
  oaAction: string
  localAction: string
  enabled: boolean
  sort?: number
  remark?: string
}

export const WeaverOaApi = {
  getWorkflowLogPage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/weaver/workflow-log/page`, params })
  },

  getWorkflowRulePage: async (params: any) => {
    return await request.get({ url: `/yideyifeng/weaver/workflow-rule/page`, params })
  },

  getWorkflowRule: async (id: number) => {
    return await request.get({ url: `/yideyifeng/weaver/workflow-rule/get?id=` + id })
  },

  createWorkflowRule: async (data: WeaverWorkflowRule) => {
    return await request.post({ url: `/yideyifeng/weaver/workflow-rule/create`, data })
  },

  updateWorkflowRule: async (data: WeaverWorkflowRule) => {
    return await request.put({ url: `/yideyifeng/weaver/workflow-rule/update`, data })
  },

  deleteWorkflowRule: async (id: number) => {
    return await request.delete({ url: `/yideyifeng/weaver/workflow-rule/delete?id=` + id })
  }
}
