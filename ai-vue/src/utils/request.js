import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
    baseURL: '/api',// 请求的前缀
    timeout: 5000 // 请求超时时间
})
// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['token'] = token
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)
// 响应拦截器
service.interceptors.response.use(
    (response) => {
        const { data, config } = response
        // console.log(data, 'response data')
        // console.log(config, 'config')
        
        // 确保data存在
        if (!data) {
            ElMessage.error('响应数据为空')
            return Promise.reject('响应数据为空')
        }
        
        // 处理业务状态码
        if (data.code === '200') {
            return data
        } 
    },
    (error) => {
        // 对响应错误做点什么
        console.error('响应错误:', error)
        ElMessage.error('网络请求失败，请检查网络连接')
        return Promise.reject(error)
    }
)

export default service