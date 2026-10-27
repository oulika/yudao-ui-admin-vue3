<template>
  <el-drawer v-model="visible" title="合同详情与流程时间线" size="900px">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="合同概况" name="basic">
    <el-descriptions v-if="contract" :column="2" border>
      <el-descriptions-item label="合同名称">{{contract.contractName}}</el-descriptions-item><el-descriptions-item label="项目编号">{{contract.contractNo}}</el-descriptions-item><el-descriptions-item label="合同编号">{{contract.actualContractNo || '-'}}</el-descriptions-item>
      <el-descriptions-item label="乙方公司名称">{{contract.counterparty || '-'}}</el-descriptions-item><el-descriptions-item label="合同金额">{{contract.amount ?? '-'}}</el-descriptions-item><el-descriptions-item label="备注" :span="2">{{contract.remark || '-'}}</el-descriptions-item>
      <el-descriptions-item label="合同期限">{{contract.startDate}} 至 {{contract.endDate}}</el-descriptions-item><el-descriptions-item label="OA流程数">{{contract.oaWorkflowCount || 0}}</el-descriptions-item>
      <el-descriptions-item v-if="contract.maintenanceCycle" label="维护周期">{{cycleText(contract.maintenanceCycle)}}</el-descriptions-item><el-descriptions-item v-if="contract.maintenanceCycle" label="下次维护">{{contract.nextMaintenanceDate || '-'}}</el-descriptions-item>
    </el-descriptions>
    <el-divider content-position="left">合同附件</el-divider>
    <ContractFileList :model-value="contract?.fileUrls" />
      </el-tab-pane>
      <el-tab-pane label="OA 流程" name="oa">
    <ContractOaWorkflowList v-if="material.contractId" :contract-id="material.contractId" editable @changed="reloadTimeline" />
      </el-tab-pane>
      <el-tab-pane label="项目归档" name="archive">
    <ProjectArchivePanel v-if="material.contractId" :contract-id="material.contractId" />
      </el-tab-pane>
      <el-tab-pane label="周期维护" name="maintenance" v-if="contract?.maintenanceCycle">
    <div v-hasPermi="['yideyifeng:contract:maintenance']">
      <el-form label-width="90px"><el-form-item label="材料附件"><UploadFile v-model="material.fileUrls" :limit="10" /></el-form-item><el-form-item label="维护说明"><el-input v-model="material.remark" type="textarea" /></el-form-item><el-form-item><el-button type="primary" v-hasPermi="['yideyifeng:contract:maintenance']" @click="uploadMaterial">提交维护材料</el-button></el-form-item></el-form>
    </div>
      </el-tab-pane>
      <el-tab-pane label="流程时间线" name="timeline">
    <el-timeline><el-timeline-item v-for="item in timeline" :key="item.id" :timestamp="formatDate(new Date(item.eventTime))" placement="top"><el-card shadow="never"><b>{{item.eventTitle}}</b><p>{{item.eventContent}}</p><ContractFileList v-if="item.fileUrls" class="mb-10px" :model-value="item.fileUrls" /><small>{{item.operatorName || '系统'}}</small></el-card></el-timeline-item></el-timeline>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script setup lang="ts">
import { ContractApi, type Contract, type ContractTimeline } from '@/api/yideyifeng/contract'; import { formatDate } from '@/utils/formatTime'
import ContractFileList from './ContractFileList.vue'
import ContractOaWorkflowList from './ContractOaWorkflowList.vue'
import ProjectArchivePanel from '../projectArchive/ProjectArchivePanel.vue'
const visible=ref(false); const activeTab=ref('basic'); const contract=ref<Contract>(); const timeline=ref<ContractTimeline[]>([]); const material=reactive({contractId:0,fileUrls:'',remark:''}); const message=useMessage()
const cycleText=(v?:number)=>({1:'月度',2:'季度',3:'年度',4:'自定义'}[v || 0] || '-')
const open=async(id:number)=>{visible.value=true;activeTab.value='basic'; const [detail,events]=await Promise.all([ContractApi.get(id),ContractApi.getTimeline(id)]);contract.value=detail;timeline.value=events;material.contractId=id;material.fileUrls='';material.remark=''}; defineExpose({open})
const uploadMaterial=async()=>{if(!material.fileUrls){message.warning('请先上传本周期维护材料');return}await ContractApi.uploadMaintenanceMaterial(material);message.success('维护材料已提交');timeline.value=await ContractApi.getTimeline(material.contractId);contract.value=await ContractApi.get(material.contractId)}
const reloadTimeline=async()=>{timeline.value=await ContractApi.getTimeline(material.contractId)}
</script>
