<template>
    <div class="container">
        <div class="title">
            <div class="title-text">
                <h2>创建您的账户</h2>
                <p>请填写注册信息</p>
            </div> 
        </div>
        <div class="form-container">
            <el-form :model="formData" :rules="rules" ref="submitFormRef" label-position="top">
                <el-form-item label="用户名或邮箱" prop="username">
                    <el-input v-model="formData.username" placeholder="请输入用户名" size="large"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" placeholder="请输入邮箱" size="large" />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="formData.nickname" placeholder="请输入昵称(可选)" size="large" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="formData.phone" placeholder="请输入手机号(可选)" size="large" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" placeholder="请输入密码" size="large" type="password" show-password />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="formData.confirmPassword" placeholder="请再次输入密码" size="large" type="password" show-password />
                </el-form-item>
                <el-form-item>
                    <el-button class="btn" type="primary" @click="handleRegister()">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>


</template>
<script setup>
import { ElMessage } from 'element-plus'
import { registerUser } from '../../api/frontend'
import { useRouter } from 'vue-router'
import { ref,reactive } from 'vue'

const router = useRouter()
const formData = reactive({
    "username": "",
    "email": "",
    "nickname": "",
    "phone": "",
    "password": "",
    "confirmPassword": "",
    "gender": 1,
    "userType": 1
})
const rules = reactive({
    "username": [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    "email": [
        { required: true, message: '请输入邮箱', trigger: 'blur' }
    ],
    "password": [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    "confirmPassword": [
        { required: true, message: '请确认密码', trigger: 'blur' }
    ],
})

// 注册用户
const submitFormRef = ref(null)
const handleRegister = async () => {
    if (!submitFormRef.value) return
    submitFormRef.value.validate(async (valid) => {
        if (!valid) return
        console.log('提交的表单数据:', formData)
        registerUser(formData).then((data)=>{
            console.log('注册响应:', data)
            if(data.code === '200' || data.code === 200){
                ElMessage.success('注册成功')
                router.push('/auth/login')
            }else{
                ElMessage.error(data.msg)
            }
            
        }).catch((error)=>{
            console.log('注册失败:', error)
            ElMessage.error('网络请求失败，请稍后重试')
        })
    })
}

</script>
<style lang="scss" scoped>
.container {
    width: 384px;

    .flex-box {
        display: flex;
        align-items: center;
    }

    .title {
        .title-text {
            text-align: center;

            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }

            p {
                font-size: 18px;
                color: #6b7280;
            }
        }
    }

    .form-container {
        margin-top: 30px;

        .btn {
            margin-top: 40px;
            width: 100%;
        }

        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>
