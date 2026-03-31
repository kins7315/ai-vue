<template>
    <div class="feedback-page">
        <div class="decoration decoration-leaf"></div>
        <div class="decoration decoration-cloud"></div>
        <div class="feedback-card">
            <div class="card-header">
                <h1>💬 意见与反馈</h1>
            </div>
            <p class="card-description">您的意见对我们非常重要，请告诉我们您的想法</p>
            <div class="feedback-form">
                <div class="form-group">
                    <label for="feedback-type">反馈类型</label>
                    <select id="feedback-type" v-model="feedback.type" class="form-select">
                        <option value="suggestion">功能建议</option>
                        <option value="bug">bug 反馈</option>
                        <option value="experience">用户体验</option>
                        <option value="other">其他</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="feedback-content">反馈内容</label>
                    <textarea id="feedback-content" v-model="feedback.content" class="form-textarea" placeholder="请详细描述您的问题或建议..." rows="5"></textarea>
                </div>
                <div class="form-group">
                    <label for="feedback-contact">联系方式 (选填)</label>
                    <input type="text" id="feedback-contact" v-model="feedback.contact" class="form-input" placeholder="请留下您的邮箱或电话，方便我们回复您" />
                </div>
                <button class="submit-btn" @click="submitFeedback" :disabled="!feedback.content.trim()">
                    提交反馈
                </button>
            </div>
            <div class="card-illustration">
                <img src="https://img.shetu66.com/2023/11/09/1699533514812064.png?x-oss-process=image/resize,h_900/format,webp" alt="意见反馈" />
            </div>
        </div>
    </div>
    <div class="copyright">
        <p>© 2026 AI心理健康助手. 保留所有权利.</p>
    </div>
    <div v-if="showToast" class="toast">
        <div class="toast-content">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
            <span>{{ toastMessage }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const showToast = ref(false);
const toastMessage = ref('');

const feedback = ref({
    type: 'suggestion',
    content: '',
    contact: ''
});

const submitFeedback = () => {
    if (!feedback.value.content.trim()) {
        showToastMessage('请输入反馈内容');
        return;
    }
    
    console.log('提交反馈:', feedback.value);
    
    showToastMessage('反馈提交成功，感谢您的意见！');
    
    // 重置表单
    feedback.value = {
        type: 'suggestion',
        content: '',
        contact: ''
    };
};

const showToastMessage = (message) => {
    toastMessage.value = message;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 2000);
};


</script>

<style scoped>
.feedback-page {
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4f1fe 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.feedback-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    padding: 24px;
    width: 100%;
    max-width: 500px;
    margin-bottom: 32px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeInUp 0.8s ease-out;
}

.feedback-card::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
}

.feedback-card::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -30%;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(100, 149, 237, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
}

.feedback-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;
}

.card-header h1 {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 0;
}

.card-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
    position: relative;
    z-index: 1;
}

.feedback-form {
    width: 100%;
    position: relative;
    z-index: 1;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
}

.form-select,
.form-input,
.form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    background: #f9f9f9;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #1976D2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    background: white;
}

.form-textarea {
    resize: vertical;
    min-height: 120px;
}

.submit-btn {
    width: 100%;
    padding: 14px;
    background: #1976D2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 12px;
}

.submit-btn:hover:not(:disabled) {
    background: #1565C0;
    transform: translateY(-1px);
}

.submit-btn:disabled {
    background: #BDBDBD;
    cursor: not-allowed;
}

.card-illustration {
    width: 150px;
    margin-top: 24px;
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.8s ease-out 0.2s both;
}

.card-illustration img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.decoration {
    position: fixed;
    z-index: 0;
    opacity: 0.1;
}

.decoration-leaf {
    top: 10%;
    left: 5%;
    width: 60px;
    height: 60px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234CAF50"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>') no-repeat center;
    background-size: contain;
    animation: sway 4s ease-in-out infinite;
}

.decoration-cloud {
    bottom: 10%;
    right: 5%;
    width: 100px;
    height: 60px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236495ED"><path d="M19,18H6C3.24,18 1,15.76 1,13C1,10.95 2.42,9.24 4.46,8.63C4.04,7.8 4,6.9 4,6A4,4 0 0,1 8,2A4,4 0 0,1 12,6C12,6.9 11.96,7.8 11.54,8.63C13.58,9.24 15,10.95 15,13A3,3 0 0,1 12,16A3,3 0 0,1 9,13C9,12.65 9.09,12.32 9.26,12H19A2,2 0 0,0 21,10A2,2 0 0,0 19,8H17V4H15V8H13V4H11V8H9V4H7V8H6A4,4 0 0,0 2,12A4,4 0 0,0 6,16H19A2,2 0 0,0 21,14A2,2 0 0,0 19,12H16V18Z"/></svg>') no-repeat center;
    background-size: contain;
}

.copyright {
    margin-top: auto;
    padding: 20px 0;
    text-align: center;
    color: #999;
    font-size: 12px;
}

.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.toast-content {
    background: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-content svg {
    margin-right: 8px;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes sway {
    0%, 100% {
        transform: rotate(-5deg);
    }
    50% {
        transform: rotate(5deg);
    }
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .feedback-page {
        padding: 20px 16px;
    }

    .feedback-card {
        padding: 20px;
    }

    .card-header h1 {
        font-size: 20px;
    }
}
</style>