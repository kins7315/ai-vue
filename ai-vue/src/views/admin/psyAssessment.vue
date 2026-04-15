<template>
  <div>
    <PageHead title="心理评估管理" />
    
    <!-- 搜索区域 -->
    <TableSearch :form-item="formItem" @search="handleSearch" />

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="userId" label="用户ID" width="100" />
      
      <!-- 总分与状态 -->
      <el-table-column prop="totalScore" label="总分/状态" width="130">
        <template #default="scope">
          <span>{{ scope.row.totalScore }}</span>
          <el-tag 
            :type="getScoreLevelTag(scope.row.totalScore)" 
            style="margin-left: 8px;"
          >
            {{ getScoreLevelText(scope.row.totalScore) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 核心维度展示 -->
      <el-table-column prop="pressure" label="压力指数" width="110">
        <template #default="scope">
          <el-progress 
            :percentage="scope.row.pressure" 
            :color="getDimensionColor(scope.row.pressure)"
            :show-text="false"
          />
          <span style="font-size: 12px; color: #999;">{{ scope.row.pressure }}</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="anxiety" label="焦虑倾向" width="110">
        <template #default="scope">
          <el-progress 
            :percentage="scope.row.anxiety" 
            :color="getDimensionColor(scope.row.anxiety, 'anxiety')"
            :show-text="false"
          />
          <span style="font-size: 12px; color: #999;">{{ scope.row.anxiety }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="joy" label="愉悦活力" width="110">
        <template #default="scope">
          <el-progress 
            :percentage="scope.row.joy" 
            :color="getDimensionColor(scope.row.joy, 'joy')"
            :show-text="false"
          />
          <span style="font-size: 12px; color: #999;">{{ scope.row.joy }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="评估时间" width="160" />
      
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleDetail(scope.row)">详情</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 25px;"
      layout="prev, pager, next"
      :total="pagination.total"
      :page-sizes="[10]"
      @current-change="handleCurrentChange"
    />

    <!-- 详情弹窗 -->
    <el-dialog
      title="心理评估详情"
      v-model="detailDialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="currentDetail" class="detail-content">
        
        <!-- 基础信息 -->
        <div class="detail-section">
          <h4>📊 评估概览</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户ID">{{ currentDetail.userId }}</el-descriptions-item>
            <el-descriptions-item label="总分">{{ currentDetail.totalScore }}</el-descriptions-item>
            <el-descriptions-item label="压力指数">{{ currentDetail.pressure }}</el-descriptions-item>
            <el-descriptions-item label="焦虑倾向">{{ currentDetail.anxiety }}</el-descriptions-item>
            <el-descriptions-item label="愉悦活力">{{ currentDetail.joy }}</el-descriptions-item>
            <el-descriptions-item label="评估时间">{{ currentDetail.createTime }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- AI建议 -->
        <div class="detail-section">
          <h4>💡 AI 专业建议</h4>
          <div class="ai-suggestion-section">
            <div class="suggestion-content" v-html="currentDetail.suggestion"></div>
          </div>
        </div>

      </div>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import TableSearch from '@/components/TableSearch.vue'
import PageHead from '@/components/PageHead.vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'


// 心理评估管理
const formData = reactive({
  userId: '',
  minScore: 0,
  maxScore: 100
})

// 硬编码的心理评估数据
const mockPsyAssessmentData = [
  {
    id: '1',
    userId: 'user1001',
    totalScore: 15,
    pressure: 10,
    anxiety: 8,
    joy: 85,
    createTime: '2026-04-10 14:30:00',
    suggestion: '<p>您的心理状态良好，建议保持积极的生活态度，继续保持规律的作息和适当的运动。</p>'
  },
  {
    id: '2',
    userId: 'user1002',
    totalScore: 35,
    pressure: 40,
    anxiety: 35,
    joy: 50,
    createTime: '2026-04-09 09:15:00',
    suggestion: '<p>您存在轻度的心理压力，建议适当放松，增加休闲活动时间，保持良好的睡眠质量。</p>'
  },
  {
    id: '3',
    userId: 'user1003',
    totalScore: 65,
    pressure: 70,
    anxiety: 65,
    joy: 30,
    createTime: '2026-04-08 16:45:00',
    suggestion: '<p>您存在中度的心理压力和焦虑，建议寻求专业心理咨询，学习压力管理技巧，保持规律的运动。</p>'
  },
  {
    id: '4',
    userId: 'user1004',
    totalScore: 85,
    pressure: 90,
    anxiety: 85,
    joy: 15,
    createTime: '2026-04-07 11:20:00',
    suggestion: '<p>您存在重度的心理压力和焦虑，建议立即寻求专业心理治疗，避免独处，保持与亲友的联系。</p>'
  },
  {
    id: '5',
    userId: 'user1005',
    totalScore: 25,
    pressure: 20,
    anxiety: 15,
    joy: 75,
    createTime: '2026-04-06 10:00:00',
    suggestion: '<p>您的心理状态基本正常，建议保持积极的社交活动，继续培养兴趣爱好。</p>'
  }
]

const handleSearch = (searchData) => {
  // 过滤数据（根据用户ID搜索）
  let filteredData = [...mockPsyAssessmentData]
  
  if (searchData && searchData.userId) {
    filteredData = filteredData.filter(item => item.userId.includes(searchData.userId))
  }
  
  // 模拟分页
  tableData.value = filteredData
  pagination.total = filteredData.length
}

// --- 标签与颜色映射逻辑 ---
// 1. 根据总分判断等级 (假设满分为100，根据示例数据推断)
const getScoreLevelTag = (score) => {
  if (score < 20) return 'success' // 正常/健康
  else if (score < 50) return 'info' // 轻度
  else if (score < 80) return 'warning' // 中度
  else return 'danger' // 重度
}

const getScoreLevelText = (score) => {
  if (score < 20) return '正常'
  else if (score < 50) return '轻度'
  else if (score < 80) return '中度'
  else return '重度'
}

// 2. 维度颜色 (压力/焦虑越高越红，愉悦越高越绿)
const getDimensionColor = (value, type) => {
  if (type === 'joy') {
    // 愉悦：低分灰色，高分绿色
    return value > 50 ? '#67C23A' : '#909399'
  } else {
    // 压力/焦虑：低分绿色，高分红色
    return value > 50 ? '#F56C6C' : '#E6A23C'
  }
}

// 3. 作答标签颜色
const getAnswerTagType = (answer) => {
  if (['总是', '严重'].includes(answer)) return 'danger'
  if (['经常', '中度'].includes(answer)) return 'warning'
  if (['偶尔', '轻度'].includes(answer)) return 'info'
  return 'success' // 从不/正常
}

// --- 表格与分页数据 ---
const tableData = ref([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// --- 搜索表单配置 ---
const formItem = ref([
  {
    comp: 'input',
    prop: 'userId',
    label: '用户ID',
    placeholder: '请输入用户ID'
  }
])

// --- 详情弹窗与数据处理 ---
const detailDialogVisible = ref(false)
const currentDetail = ref(null)
const answerList = ref([]) // 用于存储解析后的答案

const handleDetail = (row) => {
  currentDetail.value = { ...row }
  detailDialogVisible.value = true
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  handleSearch({})
}

onMounted(() => {
  handleSearch({})
})
</script>

<style lang="scss" scoped>
.detail-content {
  .detail-section {
    margin-bottom: 24px;
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.ai-suggestion-section {
  margin-top: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  h5 {
    margin: 0 0 8px 0;
    color: #606266;
    font-size: 14px;
    font-weight: 600;
  }
}
.suggestion-content {
  line-height: 1.6;
  color: #606266;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  white-space: pre-line; 
}
</style>