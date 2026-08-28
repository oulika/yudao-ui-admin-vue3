<template>
  <el-table v-loading="loading" :data="list" size="small" empty-text="尚未关联 OA 流程">
    <el-table-column label="请求编号" prop="requestId" width="105" />
    <el-table-column label="流程标题" prop="title" min-width="180" show-overflow-tooltip />
    <el-table-column label="状态" prop="status" width="90" />
    <el-table-column label="当前节点" prop="currentNode" width="125" show-overflow-tooltip />
    <el-table-column label="创建人/科室" min-width="140"><template #default="scope">{{ scope.row.creatorName || '-' }} / {{ scope.row.department || '-' }}</template></el-table-column>
    <el-table-column label="OA创建时间" width="170"><template #default="scope">{{ formatTimestamp(scope.row.oaCreateTime) }}</template></el-table-column>
    <el-table-column label="最后同步" width="170"><template #default="scope">{{ formatTimestamp(scope.row.lastSyncTime) }}</template></el-table-column>
    <el-table-column label="解除时间" width="170"><template #default="scope">{{ formatTimestamp(scope.row.unlinkTime) }}</template></el-table-column>
    <el-table-column label="关联状态" width="85"><template #default="scope"><el-tag :type="scope.row.active ? 'success' : 'info'">{{ scope.row.active ? '已关联' : '已解除' }}</el-tag></template></el-table-column>
    <el-table-column v-if="editable" label="操作" width="175" fixed="right"><template #default="scope">
      <el-button v-if="scope.row.active" link type="primary" @click="refresh(scope.row.id)">刷新</el-button>
      <el-button v-if="scope.row.url" link type="primary" @click="openOa(scope.row.url)">打开 OA</el-button>
      <el-button v-if="scope.row.active" link type="danger" @click="unlink(scope.row)">解除</el-button>
    </template></el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { ContractApi, type ContractOaWorkflowRelation } from '@/api/yideyifeng/contract'
import { formatDate } from '@/utils/formatTime'
const props=defineProps<{contractId:number;editable?:boolean}>();const emit=defineEmits(['changed']);const message=useMessage();const loading=ref(false);const list=ref<ContractOaWorkflowRelation[]>([])
const formatTimestamp=(value?:string)=>value?formatDate(value,'YYYY-MM-DD HH:mm:ss'):'-'
const load=async()=>{loading.value=true;try{list.value=await ContractApi.getOaWorkflowList(props.contractId)}finally{loading.value=false}};defineExpose({load})
const refresh=async(id:number)=>{await ContractApi.refreshOaWorkflow(id);message.success('OA流程状态已更新');await load();emit('changed')}
const unlink=async(row:ContractOaWorkflowRelation)=>{await message.confirm(`确认解除流程“${row.title}”的关联吗？历史时间线将保留。`);await ContractApi.unlinkOaWorkflow(row.id);message.success('OA流程已解除关联');await load();emit('changed')}
const openOa=(url:string)=>window.open(url,'_blank','noopener,noreferrer')
watch(()=>props.contractId,load,{immediate:true})
</script>
