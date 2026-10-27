import request from '@/config/axios'

export interface ProjectArchiveItem {
  id: number; archiveId: number; itemNo: number; itemName: string; optionValue?: string | string[]
  status: number; remark?: string; fileUrls: string | string[]
}
export interface PhysicalArchiveFile { id:number; archiveId:number; archiveItemId?:number; fileCode:string; fileName:string; copyType:number; pageCount?:number; copyCount:number; storageLocation?:string; status:number; remark?:string }
export interface PhysicalArchiveLending { id:number; fileId:number; borrowerName:string; borrowerDept?:string; purpose:string; lendTime:string; dueDate:string; returnTime?:string; status:number; lendRemark?:string; returnRemark?:string }
export interface ProjectArchive {
  id: number; contractId: number; contractName: string; contractNo: string; year: number
  projectType: number; projectCode?:string; physicalArchiveStatus?:number; startDate: string; endDate: string; contractFileUrls?: string | string[]
  completedCount: number; totalCount: number; completionPercent: number; items: ProjectArchiveItem[]
  oaWorkflows: Array<{ id:number; requestId:string; title:string; status?:string; currentNode?:string; url?:string }>
  physicalFiles: PhysicalArchiveFile[]
}
const serializeFiles=(value?:string|string[])=>Array.isArray(value)?value.join(','):value
export const ProjectArchiveApi={
  getPage:(params:any)=>request.get({url:'/yideyifeng/project-archive/page',params}),
  get:(id:number)=>request.get<ProjectArchive>({url:'/yideyifeng/project-archive/get',params:{id}}),
  getByContract:(contractId:number)=>request.get<ProjectArchive>({url:'/yideyifeng/project-archive/get-by-contract',params:{contractId}}),
  update:(data:{id:number;year:number;projectType:number;projectCode?:string})=>request.put({url:'/yideyifeng/project-archive/update',data}),
  updateItem:(data:ProjectArchiveItem)=>request.put({url:'/yideyifeng/project-archive/item/update',data:{...data,optionValue:Array.isArray(data.optionValue)?data.optionValue.join(','):data.optionValue,fileUrls:serializeFiles(data.fileUrls)}}),
  createPhysicalFile:(data:any)=>request.post({url:'/yideyifeng/project-archive/physical-file/create',data}),
  updatePhysicalFile:(data:any)=>request.put({url:'/yideyifeng/project-archive/physical-file/update',data}),
  deletePhysicalFile:(id:number)=>request.delete({url:'/yideyifeng/project-archive/physical-file/delete',params:{id}}),
  lendPhysicalFile:(data:any)=>request.post({url:'/yideyifeng/project-archive/physical-file/lend',data}),
  returnPhysicalFile:(data:any)=>request.put({url:'/yideyifeng/project-archive/physical-file/return',data}),
  getPhysicalLendings:(fileId:number)=>request.get<PhysicalArchiveLending[]>({url:'/yideyifeng/project-archive/physical-file/lending-list',params:{fileId}}),
  download:(id:number)=>request.download<Blob>({url:'/yideyifeng/project-archive/download',params:{id}})
}
