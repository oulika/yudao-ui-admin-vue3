<template>
  <Dialog v-model="dialogVisible" title="员工信息导入" width="480">
    <el-upload
      ref="uploadRef" v-model:file-list="fileList"
      :action="importUrl + '?updateSupport=' + updateSupport" :auto-upload="false"
      :disabled="loading" :headers="headers" :limit="1" :on-success="onSuccess"
      :on-error="onError" :on-exceed="onExceed" accept=".xls,.xlsx" drag>
      <Icon icon="ep:upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <div><el-checkbox v-model="updateSupport" /> 覆盖相同工号的员工信息</div>
          <span>仅支持 xls、xlsx 文件。</span>
          <el-link type="primary" :underline="false" @click="downloadTemplate">下载模板</el-link>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button type="primary" :loading="loading" @click="submit">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ScoreStaffApi } from '@/api/yideyifeng/scorestaff'
import { getAccessToken, getTenantId } from '@/utils/auth'
import download from '@/utils/download'

const message = useMessage()
const dialogVisible = ref(false)
const loading = ref(false)
const uploadRef = ref()
const fileList = ref([])
const updateSupport = ref(false)
const headers = ref()
const importUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/yideyifeng/score-staff/import'
const emit = defineEmits(['success'])

const open = () => {
  dialogVisible.value = true
  fileList.value = []
  updateSupport.value = false
  nextTick(() => uploadRef.value?.clearFiles())
}
defineExpose({ open })

const submit = () => {
  if (!fileList.value.length) return message.error('请先选择导入文件')
  headers.value = { Authorization: 'Bearer ' + getAccessToken(), 'tenant-id': getTenantId() }
  loading.value = true
  uploadRef.value.submit()
}
const onSuccess = (response: any) => {
  loading.value = false
  if (response.code !== 0) return message.error(response.msg)
  const result = response.data
  const errors = (result.failureMessages || []).join('<br/>')
  message.alert(`成功 ${result.successCount} 条，失败 ${result.failureCount} 条${errors ? '<br/>' + errors : ''}`)
  dialogVisible.value = false
  emit('success')
}
const onError = () => { loading.value = false; message.error('导入失败，请重新上传') }
const onExceed = () => message.error('最多只能上传一个文件')
const downloadTemplate = async () => download.excel(await ScoreStaffApi.getImportTemplate(), '员工信息导入模板.xls')
</script>
