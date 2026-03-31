<template>
    <div class="contact-page">
        <div class="decoration decoration-leaf"></div>
        <div class="decoration decoration-cloud"></div>
        <div class="contact-card">
            <div class="card-header">
                <h1>👤 个人中心</h1>
            </div>
            <p class="card-description">您的个人信息</p>
            <div class="contact-card-content">
                <div class="contact-info">
                    <div class="contact-item" @click="copyUsername">
                        <div class="item-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                                stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                        <div class="item-content">
                            <span class="item-label">用户名</span>
                            <span class="item-value">{{ userInfo.username }}</span>
                        </div>
                        <div class="item-action">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 4H21C21.5523 4 22 4.44772 22 5V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V5C2 4.44772 2.44772 4 3 4H8"
                                    stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M16 4V10L10 16L4 10V4" stroke="#1976D2" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div class="contact-item" @click="copyEmail">
                        <div class="item-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z"
                                    stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M22 6L12 13L2 6" stroke="#1976D2" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="item-content">
                            <span class="item-label">邮箱</span>
                            <span class="item-value">{{ userInfo.email }}</span>
                        </div>
                        <div class="item-action">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 4H21C21.5523 4 22 4.44772 22 5V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V5C2 4.44772 2.44772 4 3 4H8"
                                    stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M16 4V10L10 16L4 10V4" stroke="#1976D2" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div class="contact-item" @click="copyPhone">
                        <div class="item-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22 16.92V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3H16.92C17.2435 3 17.5561 3.10502 17.8127 3.29229C18.0693 3.47956 18.2699 3.74454 18.383 4.056L19.9774 8.278C20.0972 8.60346 20.15 8.95808 20.1337 9.31047C20.1174 9.66286 20.0319 9.99874 19.8842 10.2941C19.7364 10.5895 19.532 10.8349 19.29 11.005L16.65 12.825C16.3793 12.9998 16.0732 13.1153 15.74 13.16C15.4068 13.2047 15.0604 13.1783 14.735 13.081C14.4096 12.9837 14.114 12.8153 13.88 12.59L11.82 10.93C11.5954 10.7113 11.4314 10.4346 11.3418 10.13C11.2522 9.82541 11.2422 9.50347 11.31 9.19C11.3778 8.87653 11.5188 8.58188 11.72 8.33L13.54 5.69C13.7101 5.44804 13.9555 5.24362 14.2509 5.09585C14.5463 4.94808 14.8822 4.86252 15.2346 4.84623C15.587 4.82994 15.9416 4.88278 16.2671 5.00257L20.4891 6.59704C20.8007 6.71009 21.0657 6.91066 21.253 7.16729C21.4402 7.42392 21.5453 7.73648 21.57 8.06L21.89 10.75C22.0648 11.0207 22.1803 11.3268 22.225 11.66C22.2697 11.9932 22.2433 12.3396 22.146 12.665C22.0487 12.9904 21.8803 13.286 21.655 13.52L19.995 15.58C19.7763 15.8046 19.4996 15.9686 19.195 16.0582C18.8904 16.1478 18.5685 16.1578 18.255 16.09C17.9415 16.0222 17.6469 15.8812 17.39 15.68L14.75 13.86C14.508 13.6899 14.3036 13.4445 14.1559 13.1491C14.0081 12.8537 13.9225 12.5178 13.9062 12.1654C13.8899 11.813 13.9428 11.4584 14.0626 11.1329L15.657 6.91095C15.77 6.58549 16.0826 6.27293 16.4392 6.0163C16.7958 5.75967 17.2083 5.65465 17.63 5.68L20.32 6.0H20.32C20.7723 6.0 21.2077 6.19464 21.4969 6.53464C21.7861 6.87464 21.9 7.33727 21.9 7.8V16.92C21.9 16.9519 21.8919 16.9837 21.875 17.0146C21.8581 17.0454 21.8334 17.0741 21.8016 17.0996C21.7698 17.1251 21.7311 17.1471 21.6867 17.1649C21.6423 17.1828 21.5923 17.1957 21.54 17.2C21.4877 17.2043 21.4354 17.2021 21.3844 17.1934C21.3333 17.1848 21.2838 17.1707 21.2371 17.1513C21.1903 17.1319 21.1465 17.1074 21.107 17.078C21.0675 17.0485 21.0329 17.0152 21.0046 16.9788C20.9763 16.9423 20.9546 16.9031 20.9404 16.8622C20.9262 16.8213 20.9193 16.7791 20.92 16.736V16.736Z"
                                    stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="item-content">
                            <span class="item-label">电话</span>
                            <span class="item-value">{{ userInfo.phone }}</span>
                        </div>
                        <div class="item-action">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 4H21C21.5523 4 22 4.44772 22 5V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V5C2 4.44772 2.44772 4 3 4H8"
                                    stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M16 4V10L10 16L4 10V4" stroke="#1976D2" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="item-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                    stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 8V12" stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 16H12.01" stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="item-content">
                            <span class="item-label">用户类型</span>
                            <span class="item-value">{{ userInfo.userTypeDisplayName }}</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <p>感谢您使用AI心理健康助手 💛</p>
                </div>
            </div>
            <div class="card-illustration">
                <img src="https://img.shetu66.com/2023/11/09/1699533514812064.png?x-oss-process=image/resize,h_900/format,webp" alt="个人中心" />
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
import { ref, computed } from 'vue';

const showToast = ref(false);
const toastMessage = ref('');

const userInfo = computed(() => JSON.parse(localStorage.getItem('userInfo')));
console.log(userInfo.value);

const copyUsername = () => {
    navigator.clipboard.writeText(userInfo.value.username).then(() => {
        showToastMessage('用户名已复制到剪贴板');
    });
};

const copyEmail = () => {
    navigator.clipboard.writeText(userInfo.value.email).then(() => {
        showToastMessage('邮箱已复制到剪贴板');
    });
};

const copyPhone = () => {
    navigator.clipboard.writeText(userInfo.value.phone).then(() => {
        showToastMessage('电话已复制到剪贴板');
    });
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
.contact-page {
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4f1fe 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.contact-card {
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

.contact-card::before {
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

.contact-card::after {
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

.contact-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-illustration {
    width: 150px;
    margin-top: 24px;
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.8s ease-out 0.2s both;
}

.decoration-leaf {
    top: 10%;
    left: 5%;
    width: 60px;
    height: 60px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231976D2"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>') no-repeat center;
    background-size: contain;
    animation: sway 4s ease-in-out infinite;
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

.contact-card-content {
    width: 100%;
    position: relative;
    z-index: 1;
}

.card-footer {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    text-align: center;
}

.card-footer p {
    font-size: 14px;
    color: #666;
    margin: 0;
    font-weight: 500;
}

.card-illustration {
    width: 150px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
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
}

.decoration-cloud {
    bottom: 10%;
    right: 5%;
    width: 100px;
    height: 60px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236495ED"><path d="M19,18H6C3.24,18 1,15.76 1,13C1,10.95 2.42,9.24 4.46,8.63C4.04,7.8 4,6.9 4,6A4,4 0 0,1 8,2A4,4 0 0,1 12,6C12,6.9 11.96,7.8 11.54,8.63C13.58,9.24 15,10.95 15,13A3,3 0 0,1 12,16A3,3 0 0,1 9,13C9,12.65 9.09,12.32 9.26,12H19A2,2 0 0,0 21,10A2,2 0 0,0 19,8H17V4H15V8H13V4H11V8H9V4H7V8H6A4,4 0 0,0 2,12A4,4 0 0,0 6,16H19A2,2 0 0,0 21,14A2,2 0 0,0 19,12H16V18Z"/></svg>') no-repeat center;
    background-size: contain;
}

.card-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.header-icon {
    margin-right: 12px;
    color: #4CAF50;
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
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.contact-item {
    display: flex;
    align-items: center;
    padding: 16px;
    background: #f9f9f9;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.contact-item:hover {
    background: #f0f9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
}

.item-icon {
    margin-right: 16px;
    color: #4CAF50;
}

.item-content {
    flex: 1;
}

.item-label {
    display: block;
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
}

.item-value {
    display: block;
    font-size: 16px;
    color: #333;
    font-weight: 500;
}

.item-action {
    color: #4CAF50;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.contact-item:hover .item-action {
    opacity: 1;
}

.emergency-hotline {
    background: #fff9f9;
    border: 1px solid #ffd9d9;
    border-radius: 12px;
    padding: 20px;
    width: 100%;
    max-width: 500px;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
}

.hotline-icon {
    margin-right: 16px;
    color: #FF6B6B;
}

.hotline-content h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px 0;
}

.hotline-content p {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.hotline-content strong {
    color: #FF6B6B;
    font-weight: 700;
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
    .contact-page {
        padding: 20px 16px;
    }

    .contact-card {
        padding: 20px;
    }

    .card-header h1 {
        font-size: 20px;
    }
}
</style>