<template>
  <Dialog title="检索 OA 流程" v-model="visible" width="1120px">
    <el-form :model="query" inline class="mb-12px">
      <el-form-item label="流程标题"><el-input v-model="query.title" clearable class="!w-190px" @keyup.enter="search" /></el-form-item>
      <el-form-item label="请求编号"><el-input v-model="query.requestId" clearable class="!w-150px" @keyup.enter="search" /></el-form-item>
      <el-form-item label="科室"><el-input v-model="query.department" clearable class="!w-140px" @keyup.enter="search" /></el-form-item>
      <el-form-item label="创建人"><el-input v-model="query.creatorName" clearable class="!w-130px" @keyup.enter="search" /></el-form-item>
      <el-form-item label="创建日期"><el-date-picker v-model="dateRange" type="daterange" value-format="YYYY-MM-DD" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="!w-240px" /></el-form-item>
      <el-form-item><el-button type="primary" @click="search">查询</el-button><el-button @click="reset">重置</el-button></el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="list" highlight-current-row @current-change="selected = $event" height="430">
      <el-table-column width="48"><template #default="scope"><el-radio :model-value="selected?.requestId" :label="scope.row.requestId"><span></span></el-radio></template></el-table-column>
      <el-table-column label="请求编号" prop="requestId" width="120" />
      <el-table-column label="流程标题" prop="title" min-width="230" show-overflow-tooltip />
      <el-table-column label="科室" prop="department" width="140" show-overflow-tooltip />
      <el-table-column label="创建人" prop="creatorName" width="110" />
      <el-table-column label="创建时间" prop="createTime" width="165" />
      <el-table-column label="状态" prop="status" width="100" />
      <el-table-column label="当前节点" prop="currentNode" width="140" show-overflow-tooltip />
    </el-table>
    <Pagination :total="total" v-model:page="query.pageNo" v-model:limit="query.pageSize" @pagination="load" />
    <template #footer><el-button type="primary" :disabled="!selected" :loading="linking" @click="link">关联所选流程</el-button><el-button @click="visible=false">取消</el-button></template>
  </Dialog>
</template>
<script setup lang="ts">
import { ContractApi, type ContractOaWorkflow } from '@/api/yideyifeng/contract'

const visible=ref(false); const loading=ref(false); const linking=ref(false); const contractId=ref<number>();
const list=ref<ContractOaWorkflow[]>([]); const total=ref(0); const selected=ref<ContractOaWorkflow>();
const emit=defineEmits(['success']);
const defaultRange=()=>{const end=new Date();const start=new Date();start.setMonth(start.getMonth()-3);const format=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;return [format(start),format(end)]}
const dateRange=ref<string[]>(defaultRange());
const query=reactive({pageNo:1,pageSize:10,title:'',requestId:'',department:'',creatorName:''});
const load=async()=>{loading.value=true;selected.value=undefined;try{const data=await ContractApi.getOaWorkflowPage({...query,createDateFrom:dateRange.value?.[0],createDateTo:dateRange.value?.[1]});list.value=data.list;total.value=data.total}finally{loading.value=false}}
const search=()=>{query.pageNo=1;load()};
const reset=()=>{Object.assign(query,{pageNo:1,pageSize:10,title:'',requestId:'',department:'',creatorName:''});dateRange.value=defaultRange();load()};
const open=(id:number)=>{contractId.value=id;visible.value=true;reset()}; defineExpose({open});
const link=async()=>{if(!selected.value||!contractId.value)return;linking.value=true;try{await ContractApi.linkOaWorkflow({...selected.value,contractId:contractId.value});visible.value=false;emit('success')}finally{linking.value=false}}
</script>
