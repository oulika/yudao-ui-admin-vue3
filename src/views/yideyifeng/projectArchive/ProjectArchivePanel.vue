<template>
  <div v-loading="loading" class="archive-panel">
    <template v-if="archive">
      <div class="archive-summary">
        <div><div class="summary-title">{{archive.contractName}}</div><div class="summary-meta">{{archive.contractNo}} · {{archive.year}}年 · {{projectTypeText}}</div></div>
        <div class="summary-progress"><el-progress type="circle" :width="64" :percentage="archive.completionPercent"/><span>{{archive.completedCount}}/{{archive.totalCount}} 项</span></div>
        <el-button type="primary" :loading="downloading" v-hasPermi="['yideyifeng:project-archive:download']" @click="downloadAll"><Icon icon="ep:download"/>一键打包下载</el-button>
      </div>
      <el-form inline class="archive-base">
        <el-form-item label="归档年度"><el-input-number v-model="archive.year" :min="2000" :max="2100"/></el-form-item>
        <el-form-item label="项目类型"><el-select v-model="archive.projectType" class="!w-120px"><el-option label="建设" :value="1"/><el-option label="服务" :value="2"/><el-option label="其他" :value="3"/></el-select></el-form-item>
        <el-form-item><el-button v-hasPermi="['yideyifeng:project-archive:update']" @click="saveBase">保存基本信息</el-button></el-form-item>
      </el-form>
      <el-collapse v-model="activeItems">
        <el-collapse-item v-for="item in archive.items" :key="item.id" :name="item.id">
          <template #title><div class="item-title"><span class="item-number">{{String(item.itemNo).padStart(2,'0')}}</span><span>{{item.itemName}}</span><el-tag :type="statusTag(item.status)" size="small">{{statusText(item.status)}}</el-tag><span class="item-file-count">{{fileCount(item)}} 个补充附件</span></div></template>
          <el-form label-width="90px" class="item-form">
            <el-form-item label="归档状态"><el-radio-group v-model="item.status" @change="saveItem(item, false)"><el-radio-button :value="0">未维护</el-radio-button><el-radio-button :value="1">部分完成</el-radio-button><el-radio-button :value="2">已完成</el-radio-button><el-radio-button :value="3">不适用</el-radio-button></el-radio-group></el-form-item>
            <el-form-item v-if="optionLabels[item.itemNo]" label="分类选项"><el-select v-model="item.optionValue" clearable multiple collapse-tags class="!w-100%" @change="saveItem(item, false)"><el-option v-for="label in optionLabels[item.itemNo]" :key="label" :label="label" :value="label"/></el-select></el-form-item>
            <el-form-item v-if="item.itemNo===7" label="合同附件"><ContractFileList :model-value="archive.contractFileUrls || ''" class="!w-100%"/></el-form-item>
            <el-form-item v-if="item.itemNo===6" label="OA流程"><el-table :data="archive.oaWorkflows" size="small" class="!w-100%" empty-text="尚未关联 OA 流程"><el-table-column prop="requestId" label="请求编号" width="100"/><el-table-column prop="title" label="流程标题" min-width="180"/><el-table-column prop="status" label="状态" width="90"/><el-table-column prop="currentNode" label="当前节点" width="120"/></el-table></el-form-item>
            <el-form-item label="补充附件"><UploadFile v-model="item.fileUrls" :limit="20" :file-size="50" :file-type="fileTypes" @update:model-value="saveItem(item, false)"/></el-form-item>
            <el-form-item label="备注"><el-input v-model="item.remark" type="textarea" :rows="2" maxlength="1000" show-word-limit @blur="saveItem(item, false)"/></el-form-item>
            <el-form-item><el-button type="primary" v-hasPermi="['yideyifeng:project-archive:update']" @click="saveItem(item)">保存本项</el-button></el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </template>
  </div>
</template>
<script setup lang="ts">
import download from '@/utils/download'
import {ProjectArchiveApi,type ProjectArchive,type ProjectArchiveItem} from '@/api/yideyifeng/projectArchive'
import ContractFileList from '../contract/ContractFileList.vue'
const props=defineProps<{contractId?:number;archiveId?:number}>();const emit=defineEmits<{changed:[]}>();const message=useMessage();const loading=ref(false);const downloading=ref(false);const archive=ref<ProjectArchive>();const activeItems=ref<number[]>([]);const savingItems=new Set<number>();const pendingItems=new Set<number>()
const fileTypes=['jpg','jpeg','png','pdf','doc','docx','xls','xlsx','ppt','pptx','zip','rar','txt']
const optionLabels:Record<number,string[]>={3:['科室需求','政策文件','其他'],5:['直接采购','比价','招投标'],8:['服务','建设','其他'],9:['一次性项目','维保时间','服务周期'],10:['医院转账','其他'],11:['运维记录','运维报告','货物签收','科室签字','其他'],12:['运维记录','验收报告','总结报告','其他'],13:['非固定资产','固定资产','无形资产']}
const projectTypeText=computed(()=>({1:'建设项目',2:'服务项目',3:'其他项目'}[archive.value?.projectType||1]));const statusText=(v:number)=>['未维护','部分完成','已完成','不适用'][v]||'未维护';const statusTag=(v:number)=>v===2?'success':v===1?'warning':v===3?'info':'danger';const fileCount=(v:ProjectArchiveItem)=>Array.isArray(v.fileUrls)?v.fileUrls.length:(v.fileUrls||'').split(',').filter(Boolean).length
const load=async()=>{loading.value=true;try{const data=props.archiveId?await ProjectArchiveApi.get(props.archiveId):await ProjectArchiveApi.getByContract(props.contractId!);data.items.forEach((item)=>{item.fileUrls=item.fileUrls||'';if(optionLabels[item.itemNo]&&!Array.isArray(item.optionValue))item.optionValue=(item.optionValue||'').split(',').filter(Boolean)});archive.value=data}finally{loading.value=false}};const saveBase=async()=>{if(!archive.value)return;await ProjectArchiveApi.update({id:archive.value.id,year:archive.value.year,projectType:archive.value.projectType});message.success('归档基本信息已保存');emit('changed')};const saveItem=async(item:ProjectArchiveItem,notify=true)=>{if(savingItems.has(item.id)){pendingItems.add(item.id);return}savingItems.add(item.id);try{await ProjectArchiveApi.updateItem(item);if(notify)message.success(`${item.itemName}已保存`);emit('changed')}finally{savingItems.delete(item.id);if(pendingItems.delete(item.id))void saveItem(item,false)}};const downloadAll=async()=>{if(!archive.value)return;downloading.value=true;try{const data=await ProjectArchiveApi.download(archive.value.id);download.zip(data,`${archive.value.contractName}-项目归档.zip`)}finally{downloading.value=false}}
watch(()=>[props.contractId,props.archiveId],load,{immediate:true})
</script>
<style scoped>
.archive-summary{display:flex;align-items:center;gap:20px;padding:14px 16px;margin-bottom:12px;background:var(--el-fill-color-light);border:1px solid var(--el-border-color-lighter);border-radius:6px}.summary-title{font-size:16px;font-weight:600}.summary-meta{margin-top:6px;color:var(--el-text-color-secondary)}.summary-progress{display:flex;align-items:center;gap:8px;margin-left:auto;color:var(--el-text-color-secondary)}.archive-base{padding:8px 4px}.item-title{display:flex;align-items:center;gap:10px;width:100%;padding-right:12px}.item-number{width:28px;color:var(--el-color-primary);font-weight:600}.item-file-count{margin-left:auto;color:var(--el-text-color-secondary);font-size:12px}.item-form{padding:12px 16px 2px;background:var(--el-fill-color-extra-light)}
</style>
