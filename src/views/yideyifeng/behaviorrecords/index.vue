<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="员工ID" prop="staffId">
        <el-input
          v-model="queryParams.staffId"
          placeholder="请输入员工ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="员工姓名" prop="staffName">
        <el-input
          v-model="queryParams.staffName"
          placeholder="请输入员工姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="季度" prop="quarter">
        <el-input
          v-model="queryParams.quarter"
          placeholder="请输入季度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-input
          v-model="queryParams.category"
          placeholder="请输入分类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="条目" prop="item">
        <el-input
          v-model="queryParams.item"
          placeholder="请输入条目"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="分值" prop="points">
        <el-input
          v-model="queryParams.points"
          placeholder="请输入分值"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="评审科室" prop="department">
        <el-input
          v-model="queryParams.department"
          placeholder="请输入评审科室"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['yideyifeng:behavior-records:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="dialogVisible=true"
          :loading="exportLoading"
          v-hasPermi="['yideyifeng:behavior-records:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
            type="danger"
            plain
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
            v-hasPermi="['yideyifeng:behavior-records:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 批量删除
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
        row-key="id"
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        @selection-change="handleRowCheckboxChange"
    >
    <el-table-column type="selection" width="55" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="员工ID" align="center" prop="staffId" />
      <el-table-column label="员工姓名" align="center" prop="staffName" />
      <el-table-column label="年度" align="center" prop="year" />
      <el-table-column label="季度" align="center" prop="quarter" />
      <el-table-column label="分类" align="center" prop="category" />
      <el-table-column label="条目" align="center" prop="item" />
      <el-table-column label="分值" align="center" prop="points" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="评审科室" align="center" prop="department" />
      <el-table-column label="文件路径" align="center" prop="imagePath">

        <template v-slot="scope">
          <a :href="scope.row.imagePath" target="_blank" class="buttonText" style="text-decoration: none;color:#409eff">{{scope.row.imagePath}}</a>
        </template>

      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            @click="openForm('update', scope.row.id)"-->
<!--            v-hasPermi="['yideyifeng:behavior-records:update']"-->
<!--          >-->
<!--            编辑-->
<!--          </el-button>-->
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['yideyifeng:behavior-records:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <el-dialog
    v-model="dialogVisible"
    title="选择具体信息"
    width="500"
    :before-close="handleClose"
  >
    <el-date-picker
      v-model="pickYear"
      type="year"
      placeholder="选择年度"
      @change="changeYear"
    />
    <el-select filterable v-model="exportDept" placeholder="请选择科室">
      <el-option
        v-for="dept in uniqueDept"
        :key="dept"
        :label="dept"
        :value="dept"

      />
    </el-select>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleExport">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 表单弹窗：添加/修改 -->
  <BehaviorRecordsForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { BehaviorRecordsApi, BehaviorRecords } from '@/api/yideyifeng/behaviorrecords'
import { ScoreStaffApi, ScoreStaff } from '@/api/yideyifeng/scorestaff'
import { ScoreTemplateApi, ScoreTemplate } from '@/api/yideyifeng/scoretemplate'
import BehaviorRecordsForm from './BehaviorRecordsForm.vue'
const route = useRoute()
/** 行为记录 列表 */
defineOptions({ name: 'BehaviorRecords' })

const dialogVisible = ref(false)
const exportYear = ref(2025)
const exportDept = ref('')
const pickYear = ref()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<BehaviorRecords[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
let userId=route.query.uid;
const staffs = ref<ScoreStaff[]>([]) // 人员列表的数据

const uniqueDept = computed(() => {
  return Array.from(
    new Set(staffs.value.map(staff => staff.department))
  )
})

const changeYear = ()=>{
  exportYear.value= pickYear.value.getFullYear()
}
//
// const changeDept = ()=>{
//   exportDept.value= pickYear.value.getFullYear()
// }


const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  staffId: userId,
  staffName: undefined,
  quarter: undefined,
  year: undefined,
  category: undefined,
  item: undefined,
  points: undefined,
  remark: undefined,
  department: undefined,
  imagePath: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BehaviorRecordsApi.getBehaviorRecordsPage(queryParams)
    staffs.value = await ScoreStaffApi.getAllScoreStaff()

    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await BehaviorRecordsApi.deleteBehaviorRecords(id)
    message.success(t('common.delSuccess'))
    currentRow.value = {}
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除行为记录 */
const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await BehaviorRecordsApi.deleteBehaviorRecordsList(checkedIds.value);
    checkedIds.value = [];
    message.success(t('common.delSuccess'))
    await getList();
  } catch {}
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: BehaviorRecords[]) => {
  checkedIds.value = records.map((item) => item.id!);
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    dialogVisible.value = false
    // 发起导出
    exportLoading.value = true
    queryParams.year = exportYear.value
    queryParams.department = exportDept.value
    const data = await BehaviorRecordsApi.exportBehaviorRecords(queryParams)
    download.excel(data, exportYear.value + '年度'+ exportDept.value + '医德医风统计数据' + '.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
