<template>
  <el-empty v-if="files.length === 0" description="暂无附件" :image-size="48" />
  <div v-else class="file-list">
    <div v-for="file in files" :key="file.url" class="file-item">
      <div class="file-name">
        <Icon icon="ep:document" />
        <span :title="file.name">{{ file.name }}</span>
      </div>
      <div class="file-actions">
        <el-button link type="primary" @click="viewFile(file.url)">查看</el-button>
        <el-button link type="primary" @click="downloadFile(file)">下载</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue?: string | string[] }>()
const message = useMessage()

interface DetailFile {
  name: string
  url: string
}

const getFileName = (url: string) => {
  const encodedName = url.split('?')[0].substring(url.split('?')[0].lastIndexOf('/') + 1)
  try {
    return decodeURIComponent(encodedName)
  } catch {
    return encodedName
  }
}

const files = computed<DetailFile[]>(() => {
  const values = Array.isArray(props.modelValue)
    ? props.modelValue
    : (props.modelValue || '').split(',')
  return values.map((url) => url.trim()).filter(Boolean).map((url) => ({
    name: getFileName(url),
    url
  }))
})

const viewFile = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')
const downloadFile = async (file: DetailFile) => {
  try {
    const response = await fetch(file.url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const objectUrl = URL.createObjectURL(await response.blob())
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = file.name
    link.click()
    URL.revokeObjectURL(objectUrl)
  } catch {
    message.error(`文件“${file.name}”下载失败`)
  }
}
</script>

<style scoped>
.file-list {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 42px;
  padding: 0 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.file-item:last-child {
  border-bottom: 0;
}
.file-name {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}
.file-name span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-actions {
  flex: none;
}
</style>
