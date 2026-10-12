<template>
  <ContentWrap><el-form ref="queryRef" :model="query" inline><el-form-item label="年度" prop="year"><el-input v-model="query.year" clearable /></el-form-item><el-form-item label="类型" prop="type"><el-select v-model="query.type" clearable class="!w-140px"><el-option label="培训" value="培训" /><el-option label="考试" value="考试" /></el-select></el-form-item><el-form-item label="状态" prop="status"><el-select v-model="query.status" clearable class="!w-140px"><el-option label="草稿" :value="0" /><el-option label="进行中" :value="1" /><el-option label="已结束" :value="2" /><el-option label="已归档" :value="3" /></el-select></el-form-item><el-form-item><el-button @click="load">查询</el-button><el-button @click="reset">重置</el-button><el-button type="primary" @click="formRef.open('create')">新增</el-button></el-form-item></el-form></ContentWrap>
  <ContentWrap><el-table v-loading="loading" :data="list" stripe><el-table-column label="标题" prop="title" min-width="180" /><el-table-column label="类型" prop="type" width="80" /><el-table-column label="年度" prop="year" width="80" /><el-table-column label="季度" prop="quarter" width="80" /><el-table-column label="目标范围" width="100"><template #default="{row}">{{ scopeLabel(row.targetScope) }}</template></el-table-column><el-table-column label="开始日期" prop="startDate" width="110" /><el-table-column label="结束日期" prop="endDate" width="110" /><el-table-column label="状态" width="90"><template #default="{row}"><el-tag>{{ statusLabel(row.status) }}</el-tag></template></el-table-column><el-table-column label="操作" min-width="270"><template #default="{row}"><el-button link type="primary" @click="formRef.open('update',row.id)">编辑</el-button><el-button link type="primary" @click="copy(row.id)">复制</el-button><el-button v-if="row.status===0" link type="success" @click="publishTask(row.id)">发布</el-button><el-button v-if="row.status===1" link type="warning" @click="changeStatus(row.id,2)">结束</el-button><el-button v-if="row.status===2" link type="info" @click="changeStatus(row.id,3)">归档</el-button><el-button link type="danger" @click="remove(row.id)">删除</el-button></template></el-table-column></el-table><Pagination :total="total" v-model:page="query.pageNo" v-model:limit="query.pageSize" @pagination="load" /></ContentWrap>
  <EducationTaskForm ref="formRef" @success="load" />
</template>
<script setup lang="ts">
import { EducationTaskApi, type EducationTask } from '@/api/yideyifeng/education/task'
import EducationTaskForm from './EducationTaskForm.vue'
const message=useMessage(),loading=ref(false),list=ref<EducationTask[]>([]),total=ref(0),queryRef=ref(),formRef=ref()
const query=reactive({pageNo:1,pageSize:10,year:undefined,type:undefined,status:undefined})
const scopeLabel=(v?:string)=>({ALL:'全部人员',DEPARTMENT:'指定科室',STAFF:'指定人员'}[v||'ALL'])
const statusLabel=(v:number)=>['草稿','进行中','已结束','已归档'][v]||'未知'
const load=async()=>{loading.value=true;try{const data=await EducationTaskApi.getPage(query);list.value=data.list;total.value=data.total}finally{loading.value=false}}
const reset=()=>{queryRef.value.resetFields();load()};const remove=async(id:number)=>{await message.delConfirm();await EducationTaskApi.delete(id);load()}
const copy=async(id:number)=>{await EducationTaskApi.copy(id);message.success('复制成功');load()}
const publishTask=async(id:number)=>{const count=await EducationTaskApi.publish(id);message.success(`发布成功，新增 ${count} 条应参加记录`);load()}
const changeStatus=async(id:number,status:number)=>{await EducationTaskApi.updateStatus(id,status);message.success('状态已更新');load()}
onMounted(load)
</script>
