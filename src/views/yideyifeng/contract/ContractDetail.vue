<template>
  <el-drawer v-model="visible" title="合同详情与流程时间线" size="720px">
    <el-descriptions v-if="contract" :column="2" border>
      <el-descriptions-item label="合同名称">{{contract.contractName}}</el-descriptions-item><el-descriptions-item label="合同编号">{{contract.contractNo}}</el-descriptions-item>
      <el-descriptions-item label="相对方">{{contract.counterparty || '-'}}</el-descriptions-item><el-descriptions-item label="合同金额">{{contract.amount ?? '-'}}</el-descriptions-item>
      <el-descriptions-item label="合同期限">{{contract.startDate}} 至 {{contract.endDate}}</el-descriptions-item><el-descriptions-item label="OA流程数">{{contract.oaWorkflowCount || 0}}</el-descriptions-item>
      <el-descriptions-item v-if="contract.maintenanceCycle" label="维护周期">{{cycleText(contract.maintenanceCycle)}}</el-descriptions-item><el-descriptions-item v-if="contract.maintenanceCycle" label="下次维护">{{contract.nextMaintenanceDate || '-'}}</el-descriptions-item>
    </el-descriptions>
    <el-divider content-position="left">合同附件</el-divider>
    <ContractFileList :model-value="contract?.fileUrls" />
    <el-divider content-position="left">关联 OA 流程</el-divider>
    <ContractOaWorkflowList v-if="material.contractId" :contract-id="material.contractId" editable @changed="reloadTimeline" />
    <el-divider content-position="left">项目归档</el-divider>
    <ProjectArchivePanel v-if="material.contractId" :contract-id="material.contractId" />
    <div v-if="contract?.maintenanceCycle" v-hasPermi="['yideyifeng:contract:maintenance']">
      <el-divider content-position="left">本周期维护材料</el-divider>
      <el-form label-width="90px"><el-form-item label="材料附件"><UploadFile v-model="material.fileUrls" :limit="10" /></el-form-item><el-form-item label="维护说明"><el-input v-model="material.remark" type="textarea" /></el-form-item><el-form-item><el-button type="primary" v-hasPermi="['yideyifeng:contract:maintenance']" @click="uploadMaterial">提交维护材料</el-button></el-form-item></el-form>
    </div>
    <el-divider content-position="left">流程时间线</el-divider>
    <el-timeline><el-timeline-item v-for="item in timeline" :key="item.id" :timestamp="formatDate(item.eventTime)" placement="top"><el-card shadow="never"><b>{{item.eventTitle}}</b><p>{{item.eventContent}}</p><ContractFileList v-if="item.fileUrls" class="mb-10px" :model-value="item.fileUrls" /><small>{{item.operatorName || '系统'}}</small></el-card></el-timeline-item></el-timeline>
  </el-drawer>
</template>
<script setup lang="ts">
import { ContractApi, type Contract, type ContractTimeline } from '@/api/yideyifeng/contract'; import { formatDate } from '@/utils/formatTime'
import ContractFileList from './ContractFileList.vue'
import ContractOaWorkflowList from './ContractOaWorkflowList.vue'
import ProjectArchivePanel from '../projectArchive/ProjectArchivePanel.vue'
const visible=ref(false); const contract=ref<Contract>(); const timeline=ref<ContractTimeline[]>([]); const material=reactive({contractId:0,fileUrls:'',remark:''}); const message=useMessage()
const cycleText=(v?:number)=>({1:'月度',2:'季度',3:'年度',4:'自定义'}[v || 0] || '-')
const open=async(id:number)=>{visible.value=true; const [detail,events]=await Promise.all([ContractApi.get(id),ContractApi.getTimeline(id)]);contract.value=detail;timeline.value=events;material.contractId=id;material.fileUrls='';material.remark=''}; defineExpose({open})
const uploadMaterial=async()=>{if(!material.fileUrls){message.warning('请先上传本周期维护材料');return}await ContractApi.uploadMaintenanceMaterial(material);message.success('维护材料已提交');timeline.value=await ContractApi.getTimeline(material.contractId);contract.value=await ContractApi.get(material.contractId)}
const reloadTimeline=async()=>{timeline.value=await ContractApi.getTimeline(material.contractId)}
</script>
