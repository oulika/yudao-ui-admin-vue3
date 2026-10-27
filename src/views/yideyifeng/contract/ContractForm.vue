<template>
  <Dialog :title="dialogTitle" v-model="visible" width="900px" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="12"><el-form-item label="合同名称" prop="contractName"><el-input v-model="form.contractName" /></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="项目编号" prop="contractNo"><el-input v-model="form.contractNo" /></el-form-item></el-col><el-col :span="12"><el-form-item label="合同编号"><el-input v-model="form.actualContractNo" /></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="乙方公司名称"><el-input v-model="form.counterparty" /></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="合同金额"><el-input-number v-model="form.amount" :min="0" :precision="2" class="!w-100%" /></el-form-item></el-col><el-col :span="24"><el-form-item label="项目备注"><el-input v-model="form.remark" type="textarea" :rows="2" maxlength="1000" show-word-limit /></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="开始时间" prop="startDate"><el-date-picker v-model="form.startDate" value-format="YYYY-MM-DD" class="!w-100%" /></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="结束时间" prop="endDate"><el-date-picker v-model="form.endDate" value-format="YYYY-MM-DD" class="!w-100%" /></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="合同状态"><el-select v-model="form.status" class="!w-100%"><el-option label="履行中" :value="0"/><el-option label="已到期" :value="1"/><el-option label="已终止" :value="2"/></el-select></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="到期提醒"><el-input-number v-model="form.expireRemindDays" :min="0"/><span class="ml-8px">天前</span></el-form-item></el-col>
        <el-col :span="24"><el-form-item label="合同附件"><UploadFile v-model="form.fileUrls" :limit="10" :file-size="200" /></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="通知方式"><el-checkbox v-model="form.smsNotify">短信通知</el-checkbox><el-checkbox v-model="form.oaNotify">OA通知</el-checkbox></el-form-item></el-col>
      </el-row>
      <el-divider content-position="left">OA流程关联</el-divider>
      <template v-if="formType === 'update' && form.id"><div class="mb-12px"><el-button type="primary" @click="workflowDialogRef.open(form.id)">检索并关联 OA 流程</el-button></div><ContractOaWorkflowList ref="workflowListRef" :contract-id="form.id" editable /></template>
      <el-empty v-else description="请先创建合同，再关联 OA 流程" :image-size="60" />
      <div v-hasPermi="['yideyifeng:contract:maintenance']">
        <el-divider content-position="left">信息科维护设置</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="维护周期"><el-select v-model="form.maintenanceCycle" clearable class="!w-100%"><el-option label="月度" :value="1"/><el-option label="季度" :value="2"/><el-option label="年度" :value="3"/><el-option label="自定义" :value="4"/></el-select></el-form-item></el-col>
          <el-col v-if="form.maintenanceCycle === 4" :span="12"><el-form-item label="周期天数"><el-input-number v-model="form.customCycleDays" :min="1"/></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="下次维护"><el-date-picker v-model="form.nextMaintenanceDate" value-format="YYYY-MM-DD" class="!w-100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="维护提醒"><el-input-number v-model="form.maintenanceRemindDays" :min="0"/><span class="ml-8px">天前</span></el-form-item></el-col><el-col :span="12"><el-form-item label="OA通知人"><el-select v-model="form.maintenanceNoticePerson" multiple clearable placeholder="请选择信息科负责人" class="!w-100%"><el-option v-for="name in maintenanceNoticePersons" :key="name" :label="name" :value="name"/></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="短信通知手机"><el-input :model-value="notifyMobileText" readonly placeholder="选择 OA 通知人后自动带出"/></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="材料要求"><el-input v-model="form.maintenanceMaterialRequirement" /></el-form-item></el-col>
        </el-row>
      </div>
      
    </el-form>
    <template #footer><el-button type="primary" :disabled="loading" @click="submit">确定</el-button><el-button @click="visible=false">取消</el-button></template>
  </Dialog>
  <ContractOaWorkflowDialog ref="workflowDialogRef" @success="handleWorkflowLinked" />
</template>
<script setup lang="ts">
import { ContractApi, type Contract } from '@/api/yideyifeng/contract'
import ContractOaWorkflowDialog from './ContractOaWorkflowDialog.vue'
import ContractOaWorkflowList from './ContractOaWorkflowList.vue'
const { t } = useI18n(); const message = useMessage(); const visible = ref(false); const loading = ref(false); const formType = ref('create'); const dialogTitle = ref(''); const formRef = ref()
const maintenanceNoticePersons=['王利华','陈新','汤慧','张朝辉','王孝明','袁杰','沈嘉伟']
const maintenanceNoticeMobiles:Record<string,string>={'陈新':'13681980043','王利华':'15001868406','张朝辉':'18930073706','王孝明':'18918398126','沈嘉伟':'13918287416','袁杰':'19121577719','汤慧':'18715140149'}
const initial = (): Contract => ({ contractName:'', contractNo:'', startDate:'', endDate:'', status:0, smsNotify:false, oaNotify:false, expireRemindDays:30, maintenanceRemindDays:7, maintenanceMaterialRequirement:'上传维护报告、巡检记录、验收单等附件' })
const form = ref<Contract>(initial())
const notifyMobileText=computed(()=>form.value.maintenanceNoticePerson ? maintenanceNoticeMobiles[form.value.maintenanceNoticePerson] || '' : '')
watch(()=>form.value.maintenanceNoticePerson,(person)=>{form.value.smsNotifyMobiles=person&&maintenanceNoticeMobiles[person]?[maintenanceNoticeMobiles[person]]:[]})
const workflowDialogRef = ref()
const workflowListRef = ref()
const rules = { contractName:[{required:true,message:'请输入合同名称',trigger:'blur'}], contractNo:[{required:true,message:'请输入项目编号',trigger:'blur'}], startDate:[{required:true,message:'请选择开始时间',trigger:'change'}], endDate:[{required:true,message:'请选择结束时间',trigger:'change'}] }
const normalizeDate = (value: unknown): string => {
  if (!value) return ''
  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  if (typeof value === 'string') return value.slice(0, 10)
  const date = new Date(value as number)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const open = async(type:string,id?:number)=>{ visible.value=true; formType.value=type; dialogTitle.value=t('action.'+type); form.value=initial(); if(id){loading.value=true;try{const data=await ContractApi.get(id);form.value={...data,startDate:normalizeDate(data.startDate),endDate:normalizeDate(data.endDate),nextMaintenanceDate:normalizeDate(data.nextMaintenanceDate),maintenanceNoticePerson:Array.isArray(data.maintenanceNoticePerson)?data.maintenanceNoticePerson:(data.maintenanceNoticePerson||'').split(',').filter(Boolean),smsNotifyMobiles:Array.isArray(data.smsNotifyMobiles)?data.smsNotifyMobiles:(data.smsNotifyMobiles||'').split(',').filter(Boolean)}}finally{loading.value=false}} }
defineExpose({open}); const emit=defineEmits(['success'])
const handleWorkflowLinked = async()=>{workflowListRef.value?.load();message.success('OA流程关联成功')}
const submit=async()=>{await formRef.value.validate(); if(form.value.startDate>form.value.endDate){message.error('开始时间不能晚于结束时间');return} loading.value=true;try{formType.value==='create'?await ContractApi.create(form.value):await ContractApi.update(form.value);message.success(t(`common.${formType.value}Success`));visible.value=false;emit('success')}finally{loading.value=false}}
</script>
