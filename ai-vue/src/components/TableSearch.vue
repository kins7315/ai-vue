<template>
    <el-form ref="formRef" v-model="formData">
        <el-row :gutter="24">
            <template v-for="item in formItemAttrs" :key="item.prop">
                <el-col v-bind="item.col">
                    <el-form-item :label="item.label" :prop="item.prop">
                        <el-input v-if="item.comp === 'input'" v-model="formData[item.prop]" :placeholder="item.placeholder" />
                        <el-select v-else-if="item.comp === 'select'" v-model="formData[item.prop]" :placeholder="item.placeholder">
                            <el-option label="全部" value="" />
                            <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </template>
        </el-row>
        <el-row>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'



const props = defineProps({
    formItem: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['search'])
const formItemAttrs = computed(() => {
    if (!props.formItem) return []
    const formItem = JSON.parse(JSON.stringify(props.formItem))
    formItem.forEach(item => {
        item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
    })
    return formItem
})
// 定义表单数据
const formData = reactive({})
const formRef = ref()
const isComp = (comp) => {
    return {
        input: 'el-input',
        select: 'el-select'
    }[comp]
}
const handleSearch = () => {
    // 触发搜索事件，传递表单数据
    emit('search', formData);
}
const handleReset = () => {
    // 重置表单数据,再触发查询
    if (formRef.value) {
        formRef.value.resetFields()
    }
    for (const key in formData) {
        delete formData[key]
    }
    handleSearch()
}
</script>

<style lang="scss" scoped></style>
