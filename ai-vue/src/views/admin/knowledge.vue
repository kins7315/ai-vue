<template>
  <div class="content-container">
    <PageHead title="知识文章">
      <template #btns>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :form-item="formItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top: 25px;">
      <el-table-column label="文章标题" width="400" fixed="left">
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-icon>
              <timer />
            </el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="250">
        <template #default="scope">
          <el-icon>
            <timer />
          </el-icon>
          <span>{{ categoryMap[scope.row.categoryId] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="250" />
      <el-table-column prop="readCount" label="阅读量" width="200" />
      <el-table-column prop="updatedAt" label="发布时间" width="300" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2" text
            type="success">发布</el-button>
          <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status === 1" text
            type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 25px;" layout="prev, pager, next" :total="pagination.total"
      :page-sizes="pagination.size" @current-change="handleCurrentChange" />
    <ArticleDialog v-model:modelValue="dialogVisible" :article="currentArticle" :categories="categories"
      @success="handleSuccess" />
  </div>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { getCategoryTree, knowledgePage, getArticleDetail, articleStatus, deleteArticle } from '@/api/admin'
import { onMounted, reactive, ref } from 'vue'
import ArticleDialog from '../../components/ArticleDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const categoryMap = reactive({})
const categories = ref([])
const tableData = ref([])
const dialogVisible = ref(false)

onMounted(async () => {
  const data = await getCategoryTree()
  console.log(data, 'data');
  const categorList = data.data
  categories.value = categorList.map(item => {
    categoryMap[item.id] = item.categoryName
    return {
      label: item.categoryName,
      value: item.id
    }

  })
  // console.log(categories.value,'categories.value');
  formItem.value[1].options = categories.value
  // 获取列表
  handleSearch()
})
const formItem = ref([
  { comp: 'input', prop: 'title', label: '文章标题', placeholder: '请输入文章标题' },
  { comp: 'select', prop: 'categoryId', label: '分类', placeholder: '请选择分类' },
  {
    comp: 'select', prop: 'status', label: '状态', placeholder: '请选择状态', options: [{
      label: '草稿',
      value: '0'
    },
    {
      label: '已发布',
      value: '1'
    },
    {
      label: '已下线',
      value: '2'
    }
    ]
  },
])

//分页参数
const pagination = reactive({
  currentPage: 1,
  size: [8],
  total: 0
})
const handleSearch = async (formData) => {
  const params = {
    ...pagination,
    ...formData
  }
  const data = await knowledgePage(params)
  const PageData = data.data
  const { records, total } = PageData
  tableData.value = records
  console.log(tableData.value, 'tableData');
  pagination.total = total
  console.log(total, 'total');

}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  handleSearch()
}

const handleSuccess = () => {
  dialogVisible.value = false
  handleSearch()
}
const currentArticle = ref(null)
// 编辑文章
const handleEdit = (row) => {
  if (!row.id) {
    // 新增文章
    dialogVisible.value = true
    currentArticle.value = {}

  } else {
    // 编辑文章
    getArticleDetail(row.id).then(res => {
      console.log(res, 'res');
      currentArticle.value = res.data
      dialogVisible.value = true
    })
  }
}

// 发布文章
const handlePublish = (row) => {
  ElMessageBox.confirm(
    `确认发布文章${row.title}吗？`,
    '确认',
    {
      comfirmButtonText: '确认发布',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    articleStatus(row.id, { status: 1 }).then(res => {
      ElMessage.success('发布成功')
      handleSearch()
    })
  })

}
// 下线文章
const handleUnpublish = (row) => {
  ElMessageBox.confirm(
    `确认下线文章${row.title}吗？`,
    '确认',
    {
      comfirmButtonText: '确认下线',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    articleStatus(row.id, { status: 2 }).then(res => {
      ElMessage.success('下线成功')
      handleSearch()
    })
  })
}

// 删除文章
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除文章${row.title}吗？`,
    '确认',
    {
      comfirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(() => {
    deleteArticle(row.id).then(res => {
      ElMessage.success('删除成功')
      handleSearch()
    })
  })
}
</script>

<style lang="scss" scoped>
.content-container {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100% - 74px);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px;
}
</style>
