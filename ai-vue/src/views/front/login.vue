<template>
    <div class="container">
        <div class="title">
            <div class="back_home" @click="goBackHome">
                <el-icon>
                    <Back />
                </el-icon>
                <span>返回首页</span>
            </div>
            <div class="title_text">
                <h2>登录您的账户</h2>
                <p>请输入您的用户名和密码</p>
            </div>
        </div>
        <div class="form">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
                <el-form-item label="用户名或邮箱" prop="username">
                    <el-input v-model="formData.username" size="large" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password
                        @keyup.enter="submitForm(ruleFormRef)"></el-input>
                </el-form-item>
                <el-button class="btn" @click="submitForm(ruleFormRef)" size="large" type="primary">登录</el-button>
            </el-form>
            <div class="footer">
                <p>还没有账号？<router-link to="/auth/register">去注册</router-link></p>
            </div>
        </div>
    </div>

</template>
<script setup>

import { ref, reactive } from 'vue'
import { login } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'


const router = useRouter()
const ruleFormRef = ref()
const formData = reactive({
    username: '',
    password: ''
})

const goBackHome = () => {
    router.push('/')
}

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

// 提交表单、登录
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            console.log(formData, 'formData')
            login(formData).then((data) => {
                console.log(data, '登录接口返回')
                if (data.code !== 200 && data.code !== '200') {
                    ElMessage.error(data.message || '登录失败')
                    return
                } else if (data.code === 'BUSINESS_ERROR') {
                    ElMessage.error(data.message || '登录失败')
                    return
                } else {
                    // 登录成功后，将数据存储到localStorage中
                    console.log(data, 'data')
                    const userData = data.data
                    localStorage.setItem('token', userData.token)
                    localStorage.setItem('userInfo', JSON.stringify(userData.userInfo))
                    ElMessage.success('登录成功')
                    //根据用户角色跳转到不同的页面
                    if (userData.userInfo.userType === 2) {
                        router.push('/back/dashboard')
                    } else if (userData.userInfo.userType === 1) {
                        router.push('/')
                    }
                }

            })
        }
    })
}
</script>
<style lang="scss" scoped>
.container {
    width: 384px;

    .title {
        .back_home {
            margin-bottom: 60px;
        }

        .title_text {
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

    .form {
        margin-top: 40px;

        .btn {
            margin-top: 40px;
            width: 100%;
        }

        .footer {
            text-align: center;
            padding: 30px;
        }
    }
}
</style>
