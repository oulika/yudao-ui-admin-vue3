<template>
  <Dialog v-model="visible" :title="title" width="720px">
    <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="任务标题" prop="title"><el-input v-model="form.title" /></el-form-item>
      <el-form-item label="类型" prop="type"><el-select v-model="form.type"><el-option label="培训" value="培训" /><el-option label="考试" value="考试" /></el-select></el-form-item>
      <el-form-item label="内容"><el-input v-model="form.content" type="textarea" :rows="4" /></el-form-item>
      <el-form-item label="年度/季度"><el-input-number v-model="form.year" :min="2000" :max="2100" /><el-select v-model="form.quarter" class="ml-12px !w-160px"><el-option v-for="q in 4" :key="q" :label="`第${q}季度`" :value="q" /></el-select></el-form-item>
      <el-form-item label="目标范围"><el-radio-group v-model="form.targetScope"><el-radio label="ALL">全部人员</el-radio><el-radio label="DEPARTMENT">指定科室</el-radio><el-radio label="STAFF">指定人员</el-radio></el-radio-group></el-form-item>
      <el-form-item v-if="form.targetScope === 'DEPARTMENT'" label="目标科室"><el-input v-model="form.targetDept" placeholder="多个科室用英文逗号分隔" /></el-form-item>
      <el-form-item v-if="form.targetScope === 'STAFF'" label="目标员工ID"><el-input v-model="form.targetStaffIds" placeholder="多个员工ID用英文逗号分隔" /></el-form-item>
      <el-form-item label="附件地址"><el-input v-model="form.attachmentUrls" placeholder="多个附件地址用英文逗号分隔" /></el-form-item>
      <el-form-item label="任务日期"><el-date-picker v-model="form.startDate" value-format="YYYY-MM-DD" type="date" /><span class="mx-8px">至</span><el-date-picker v-model="form.endDate" value-format="YYYY-MM-DD" type="date" /></el-form-item>
      <el-form-item label="状态"><el-select v-model="form.status"><el-option label="草稿" :value="0" /><el-option label="进行中" :value="1" /><el-option label="已结束" :value="2" /><el-option label="已归档" :value="3" /></el-select></el-form-item>
      <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="2" /></el-form-item>
    </el-form>
    <template #footer><el-button type="primary" :loading="loading" @click="submit">确定</el-button><el-button @click="visible = false">取消</el-button></template>
  </Dialog>
</template>
<script setup lang="ts">
import { EducationTaskApi, type EducationTask } from '@/api/yideyifeng/education/task'
const message=useMessage(),visible=ref(false),loading=ref(false),title=ref(''),mode=ref(''),formRef=ref()
const empty=()=>({id:undefined,title:'',type:'培训',content:'',year:new Date().getFullYear(),quarter:1,targetScope:'ALL',targetDept:'',targetStaffIds:'',attachmentUrls:'',startDate:'',endDate:'',status:0,remark:''})
const form=ref<any>(empty());const rules={title:[{required:true,message:'请输入任务标题',trigger:'blur'}],type:[{required:true,message:'请选择类型',trigger:'change'}]}
const open=async(type:string,id?:number)=>{visible.value=true;mode.value=type;title.value=type==='create'?'新增任务':'编辑任务';form.value=empty();if(id)form.value=await EducationTaskApi.get(id)}
defineExpose({open});const emit=defineEmits(['success'])
const submit=async()=>{await formRef.value.validate();loading.value=true;try{if(mode.value==='create')await EducationTaskApi.create(form.value as EducationTask);else await EducationTaskApi.update(form.value as EducationTask);message.success('保存成功');visible.value=false;emit('success')}finally{loading.value=false}}
</script>
