<template><Dialog v-model="visible" title="导入满意度结果" width="480px">
  <el-upload ref="uploadRef" v-model:file-list="files" :action="url" :headers="headers" :auto-upload="false" :limit="1" accept=".xls,.xlsx" drag :on-success="success" :on-error="error"><Icon icon="ep:upload" /><div class="el-upload__text">拖入文件或点击选择</div><template #tip><div>按调查ID、员工姓名和员工科室导入。<el-link type="primary" @click="template">下载模板</el-link></div></template></el-upload>
  <template #footer><el-button type="primary" :loading="loading" @click="submit">确定</el-button><el-button @click="visible=false">取消</el-button></template>
</Dialog></template>
<script setup lang="ts">
import {SatisfactionResultApi} from '@/api/yideyifeng/satisfaction/result';import {getAccessToken,getTenantId} from '@/utils/auth';import download from '@/utils/download'
const message=useMessage(),visible=ref(false),loading=ref(false),uploadRef=ref(),files=ref([]),headers=ref();const url=import.meta.env.VITE_BASE_URL+import.meta.env.VITE_API_URL+'/yideyifeng/satisfaction-result/import'
const open=()=>{visible.value=true;files.value=[]};defineExpose({open});const emit=defineEmits(['success'])
const submit=()=>{if(!files.value.length)return message.error('请选择文件');headers.value={Authorization:'Bearer '+getAccessToken(),'tenant-id':getTenantId()};loading.value=true;nextTick(()=>uploadRef.value.submit())}
const success=(r:any)=>{loading.value=false;if(r.code!==0)return message.error(r.msg);const d=r.data;message.alert(`成功 ${d.successCount} 条，失败 ${d.failureCount} 条<br/>${(d.failureMessages||[]).join('<br/>')}`);visible.value=false;emit('success')};const error=()=>{loading.value=false;message.error('导入失败')};const template=async()=>download.excel(await SatisfactionResultApi.getImportTemplate(),'满意度结果导入模板.xlsx')
</script>
