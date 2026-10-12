<template>
  <Dialog v-model="visible" :title="title" width="720px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" v-loading="loading">
      <el-form-item label="调查标题" prop="title"><el-input v-model="form.title" /></el-form-item>
      <el-form-item label="年度/季度">
        <el-input-number v-model="form.year" :min="2000" :max="2100" />
        <el-select v-model="form.quarter" class="ml-12px !w-160px"><el-option v-for="q in 4" :key="q" :label="`第${q}季度`" :value="q" /></el-select>
      </el-form-item>
      <el-form-item label="调查日期">
        <el-date-picker v-model="form.startDate" value-format="YYYY-MM-DD" type="date" />
        <span class="mx-8px">至</span><el-date-picker v-model="form.endDate" value-format="YYYY-MM-DD" type="date" />
      </el-form-item>
      <el-form-item label="外部平台"><el-input v-model="form.externalPlatform" placeholder="例如：问卷星、腾讯问卷" /></el-form-item>
      <el-form-item label="问卷链接"><el-input v-model="form.questionnaireUrl" placeholder="https://" /></el-form-item>
      <el-form-item label="状态"><el-select v-model="form.status"><el-option label="草稿" :value="0" /><el-option label="进行中" :value="1" /><el-option label="已结束" :value="2" /><el-option label="已归档" :value="3" /></el-select></el-form-item>
      <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="3" /></el-form-item>
    </el-form>
    <template #footer><el-button type="primary" :loading="loading" @click="submit">确定</el-button><el-button @click="visible=false">取消</el-button></template>
  </Dialog>
</template>
<script setup lang="ts">
import { SatisfactionSurveyApi, type SatisfactionSurvey } from '@/api/yideyifeng/satisfaction/survey'
const message=useMessage(); const visible=ref(false); const loading=ref(false); const title=ref(''); const mode=ref(''); const formRef=ref()
const empty=()=>({id:undefined,title:'',year:new Date().getFullYear(),quarter:1,startDate:'',endDate:'',status:0,sort:0,externalPlatform:'',questionnaireUrl:'',remark:''})
const form=ref<any>(empty()); const rules={title:[{required:true,message:'请输入调查标题',trigger:'blur'}]}
const open=async(type:string,id?:number)=>{visible.value=true;mode.value=type;title.value=type==='create'?'新增调查':'编辑调查';form.value=empty();if(id)form.value=await SatisfactionSurveyApi.get(id)}
defineExpose({open}); const emit=defineEmits(['success'])
const submit=async()=>{await formRef.value.validate();loading.value=true;try{if(mode.value==='create')await SatisfactionSurveyApi.create(form.value as SatisfactionSurvey);else await SatisfactionSurveyApi.update(form.value as SatisfactionSurvey);message.success('保存成功');visible.value=false;emit('success')}finally{loading.value=false}}
</script>
