<template>
    <el-dialog :title="isEdit ? '编辑文章' : '新增文章'" v-model="dialogVisible" width="50%" @close="handleClose">
        <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
            </el-form-item>
            <el-form-item label="所属分类" prop="categoryId">
                <el-select v-model="formData.categoryId" placeholder="请选择文章分类">
                    <el-option v-for="item in props.categories" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="文章摘要" prop="summary">
                <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000"
                    show-word-limit :rows="4" />
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <el-select v-model="formData.tagArray" placeholder="请输入或选择文章标签" multiple filterable width="100%"
                    arrow-create>
                    <el-option v-for="tag in commandTags" :key="tag" :label="tag" :value="tag" />
                </el-select>
            </el-form-item>
            <el-form-item label="封面图片">
                <div class="cover-upload">
                    <el-upload class="avatar-uploader" action="#" :before-upload="beforeUpload"
                        :http-request="handleRequest" :show-file-list="false" accept="image/*">
                        <div v-if="!imageUrl" class="cover-placeholder">
                            <p>点击上传封面</p>
                        </div>
                        <img v-else :src="imageUrl" class="avatar" alt="封面图片" />
                    </el-upload>
                    <div v-if="imageUrl" class="cover-remove">
                        <el-button type="danger" @click="removeImage">移除封面</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="文章内容" prop="content"><!--富文本编辑器-->
                <RichTextEditor v-model="formData.content" placeholder="请输入文章内容支持富文本格式\n\n可以加粗、斜体、列表、标题等格式来丰富文章内容"
                    :maxCharCount="5000" @change="handleContent" @created="handleEditorCreated" min-height="400px" />
            </el-form-item>
        </el-form>
        <div v-if="btnPreview">
            <h3>内容预览</h3>
            <div v-html="formData.content"></div> <!-- v-html 将html字符串渲染为实际的dom元素-->
        </div>
        <template #footer>
            <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览内容' }}</el-button>
            <el-button @click="handleClose">取消</el-button>
            <el-button @click="handleSubmit" :loading="loading" type="primary">{{ isEdit ? '更新文章' : '创建文章'
                }}</el-button>

        </template>
    </el-dialog>
</template>
<script setup>
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile, createArticle, updateArticle } from '@/api/admin'
import RichTextEditor from '../components/RichTextEditor.vue'


// 表单数据
const formData = reactive({
    "title": '',
    "content": '',
    "coverImage": '',
    "categoryId": 1,
    "summary": '',
    "tags": '',
    "id": '',
    "tagArray": []
})

const commandTags = [
    '情绪管理', '抑郁', '压力', '正念', '放松', '焦虑',
    '睡眠', '冥想', '心理健康', '自我成长', '人际关系',
    '工作压力', '学习方法', '生活技巧'
]

const rules = reactive({
    title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    categoryId: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
    content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
})
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        default: () => []
    },
    article: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'success'])
const isEdit = computed(() => !!props.article?.id)
// 监听编辑文章数据变化
watch(() => props.article, (newVal) => {
    if (newVal) {
        nextTick(() => {
            Object.assign(formData, newVal)// 合并新数据到表单数据
            businessId.value = newVal.id
            imageUrl.value = baseURL + newVal.coverImage
        })
    }
})
const dialogVisible = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

const handleClose = () => {
    // 重置表单数据
    formRef.value.resetFields()
    formData.tagArray = []
    businessId.value = null
    removeImage()
    emit('update:modelValue', false)
}
const imageUrl = ref('')
// 上传封面图片前的处理
const beforeUpload = (file) => {
    // 校验上传文件
    const isImage = file.type.startsWith('image/')
    const maxSize = file.size / 1024 / 1024 < 5 // 5MB
    if (!isImage) {
        ElMessage.error('上传封面图片只能是图片!')
        return false
    }
    if (!maxSize) {
        ElMessage.error('上传封面图片大小不能超过 5MB!')
        return false
    }
    return true
}

// 上传封面图片后的处理
const businessId = ref(null)
const handleRequest = async ({ file }) => {
    // UUID的生成
    businessId.value = crypto.randomUUID()
    const fileRes = await uploadFile(file, {
        businessId: businessId.value
    })
    // console.log(businessId.value,'businessId.value')
    console.log(fileRes.data.filePath, 'fileRes.data.filePath')
    // 拼接图片URL
    imageUrl.value = baseURL + fileRes.data.filePath
    formData.coverImage = fileRes.data.filePath
    console.log(imageUrl.value, 'imageUrl.value')
}

// 移除封面图片
const removeImage = () => {
    imageUrl.value = ''
    formData.coverImage = ''
}

// --富文本编辑器--

const handleContent = (data) => {
    // console.log(data,'data')// 富文本编辑器的输入内容
    formData.content = data.html
}
const editorInstance = ref(null)
const handleEditorCreated = (editor) => {
    editorInstance.value = editor
    // 编辑时
    if (formData.content) {
        nextTick(() => {
            editor.value.setHtml(formData.content)
        })
    }
}

const btnPreview = ref(false)

// 提交表单
const formRef = ref()
const loading = ref(false)
const handleSubmit = () => {
    formRef.value.validate((valid, fields) => {
        if (valid) {
            loading.value = true
            // console.log(formData, 'formData')//tags的数据格式与后端要求不一致
            // 解决问题
        }
        const submitData = {
            ...formData,
            tags: formData.tagArray.join(',')
        }
        delete submitData.tagArray

        // 新增文章
        if (!isEdit.value) {
            submitData.id = businessId.value
            createArticle(submitData).then(res => {
                loading.value = false
                emit('success')
            })
        } else {
            updateArticle(props.article.id, submitData).then(res => {
                loading.value = false
                emit('success')
            })
        }

    })
}
</script>

<style lang="scss" scoped>
.cover-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 200px;
    height: 120px;
    background-color: #f6f8fa;
    color: #8b949e;
}

.avatar {
    width: 120px;
    height: 120px;
}
</style>
