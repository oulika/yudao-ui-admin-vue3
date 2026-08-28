import request from '@/config/axios'

export interface ProjectArchiveItem {
  id: number; archiveId: number; itemNo: number; itemName: string; optionValue?: string | string[]
  status: number; remark?: string; fileUrls?: string | string[]
}
export interface ProjectArchive {
  id: number; contractId: number; contractName: string; contractNo: string; year: number
  projectType: number; startDate: string; endDate: string; contractFileUrls?: string | string[]
  completedCount: number; totalCount: number; completionPercent: number; items: ProjectArchiveItem[]
  oaWorkflows: Array<{ id:number; requestId:string; title:string; status?:string; currentNode?:string; url?:string }>
}
const serializeFiles=(value?:string|string[])=>Array.isArray(value)?value.join(','):value
export const ProjectArchiveApi={
  getPage:(params:any)=>request.get({url:'/yideyifeng/project-archive/page',params}),
  get:(id:number)=>request.get<ProjectArchive>({url:'/yideyifeng/project-archive/get',params:{id}}),
  getByContract:(contractId:number)=>request.get<ProjectArchive>({url:'/yideyifeng/project-archive/get-by-contract',params:{contractId}}),
  update:(data:{id:number;year:number;projectType:number})=>request.put({url:'/yideyifeng/project-archive/update',data}),
  updateItem:(data:ProjectArchiveItem)=>request.put({url:'/yideyifeng/project-archive/item/update',data:{...data,optionValue:Array.isArray(data.optionValue)?data.optionValue.join(','):data.optionValue,fileUrls:serializeFiles(data.fileUrls)}}),
  download:(id:number)=>request.download<Blob>({url:'/yideyifeng/project-archive/download',params:{id}})
}
