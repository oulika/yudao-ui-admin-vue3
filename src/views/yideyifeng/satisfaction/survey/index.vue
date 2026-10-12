<template>
  <ContentWrap><el-form ref="queryRef" :model="query" inline>
    <el-form-item label="年度" prop="year"><el-input v-model="query.year" clearable /></el-form-item>
    <el-form-item label="季度" prop="quarter"><el-select v-model="query.quarter" clearable class="!w-140px"><el-option v-for="q in 4" :key="q" :label="`第${q}季度`" :value="q" /></el-select></el-form-item>
    <el-form-item label="状态" prop="status"><el-select v-model="query.status" clearable class="!w-140px"><el-option v-for="s in statuses" :key="s.value" :label="s.label" :value="s.value" /></el-select></el-form-item>
    <el-form-item><el-button @click="load">查询</el-button><el-button @click="reset">重置</el-button><el-button type="primary" @click="formRef.open('create')">新增</el-button></el-form-item>
  </el-form></ContentWrap>
  <ContentWrap><el-table v-loading="loading" :data="list" stripe>
    <el-table-column label="调查标题" prop="title" min-width="180" /><el-table-column label="年度" prop="year" width="80" /><el-table-column label="季度" prop="quarter" width="80" />
    <el-table-column label="外部平台" prop="externalPlatform" width="120" />
    <el-table-column label="问卷链接" min-width="130"><template #default="{row}"><el-link v-if="row.questionnaireUrl" :href="row.questionnaireUrl" target="_blank" type="primary">打开问卷</el-link><span v-else>-</span></template></el-table-column>
    <el-table-column label="状态" width="90"><template #default="{row}"><el-tag>{{ label(row.status) }}</el-tag></template></el-table-column>
    <el-table-column label="操作" min-width="260"><template #default="{row}"><el-button link type="primary" @click="formRef.open('update',row.id)">编辑</el-button><el-button link type="primary" @click="copy(row.id)">复制</el-button><el-button v-if="row.status===0" link type="success" @click="changeStatus(row.id,1)">开始</el-button><el-button v-if="row.status===1" link type="warning" @click="changeStatus(row.id,2)">结束</el-button><el-button v-if="row.status===2" link type="info" @click="changeStatus(row.id,3)">归档</el-button><el-button link type="danger" @click="remove(row.id)">删除</el-button></template></el-table-column>
  </el-table><Pagination :total="total" v-model:page="query.pageNo" v-model:limit="query.pageSize" @pagination="load" /></ContentWrap>
  <SurveyForm ref="formRef" @success="load" />
</template>
<script setup lang="ts">
import {SatisfactionSurveyApi,type SatisfactionSurvey} from '@/api/yideyifeng/satisfaction/survey'; import SurveyForm from './SurveyForm.vue'
const message=useMessage();const statuses=[{value:0,label:'草稿'},{value:1,label:'进行中'},{value:2,label:'已结束'},{value:3,label:'已归档'}];const label=(v:number)=>statuses.find(s=>s.value===v)?.label||'未知'
const loading=ref(false),list=ref<SatisfactionSurvey[]>([]),total=ref(0),queryRef=ref(),formRef=ref();const query=reactive({pageNo:1,pageSize:10,year:undefined,quarter:undefined,status:undefined})
const load=async()=>{loading.value=true;try{const d=await SatisfactionSurveyApi.getPage(query);list.value=d.list;total.value=d.total}finally{loading.value=false}};const reset=()=>{queryRef.value.resetFields();load()};const remove=async(id:number)=>{await message.delConfirm();await SatisfactionSurveyApi.delete(id);load()};const copy=async(id:number)=>{await SatisfactionSurveyApi.copy(id);message.success('复制成功');load()};const changeStatus=async(id:number,status:number)=>{await SatisfactionSurveyApi.updateStatus(id,status);message.success('状态已更新');load()};onMounted(load)
</script>
