<template>
    <!-- 左侧侧边栏 -->
    <div class="sidebar" :class="{ 'sidebar--collapsed': isSidebarCollapsed }">
        <!-- 品牌区 -->
        <div class="brand-section">
            <div class="brand-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <div class="brand-name" v-if="!isSidebarCollapsed">小KAI助手</div>
            <div class="brand-desc" v-if="!isSidebarCollapsed">您贴心的AI心理健康助手</div>
            <div class="online-status" v-if="!isSidebarCollapsed">
                <span class="status-dot"></span>
                在线答疑中
            </div>
        </div>

        <!-- 情绪花园 -->
        <div class="mood-section" v-if="!isSidebarCollapsed">
            <div class="section-title">情绪花园</div>
            <div class="mood-circle-wrapper">
                <div class="mood-circle">
                    <div class="mood-value">
                        <span class="mood-label">中性</span>
                        <span class="mood-number">{{ currentEmotion?.emotionScore || 50 }}</span>
                    </div>
                </div>
                <div class="mood-desc">今天感觉 <strong>{{ currentEmotion.isNegative ? '需要关注' : '很不错' }}</strong></div>
                <div class="mood-status">
                    <span v-for="dot in 3" :key="dot" class="status-dot-pink"
                        :class="{ 'active': getDotClass(currentEmotion?.emotionScore || 50) >= dot }"></span>
                    {{ getRiskText(currentEmotion?.riskLevel || 0) }}
                </div>
            </div>
            <div class="mood-tip" v-if="currentEmotion?.suggestion">
                <div class="tip-title">
                    <span>❤️</span>
                    给你的一个小建议
                </div>
                <div class="tip-content">{{ currentEmotion.suggestion }}</div>
            </div>
            <div class="action-btn" v-if="currentEmotion.keywords">治愈小行动</div>
            <!-- 风险提示 -->
            <div class="risk-notice" v-if="currentEmotion?.isNegative && currentEmotion?.riskLevel > 1">
                <div class="notice-icon">⚠️</div>
                <div class="notice-text">
                    <div class="notice-title">温馨提示</div>
                    <div class="notice-text">{{ currentEmotion?.riskDescription || '' }}</div>
                </div>
            </div>
        </div>

        <!-- 会话列表 -->
        <div class="session-section" v-if="!isSidebarCollapsed">
            <div class="section-title">会话列表</div>
            <div class="session-list">
                <div v-for="item in sessionList" :key="item.id" @click="handleSessionClick(item)" class="session-item">
                    <div class="session-title">{{ item.sessionTitle }}</div>
                    <div class="session-time">{{ item.startedAt }}</div>
                    <div class="session-desc">{{ item.lastMessageContent }}</div>
                    <div class="session-meta">
                        <span>💬 {{ item.messageCount || 0 }}</span>
                        <span>⏱ {{ item.durationMinutes || 0 }}</span>
                    </div>
                    <div class="session-actions">
                        <el-button text type="danger" @click="handleDelete(item.id)" size="small">
                            <el-icon>
                                <DeleteFilled />
                            </el-icon>
                        </el-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 侧边栏折叠按钮 -->
        <div class="sidebar-toggle" @click="toggleSidebar" :class="{ 'sidebar-toggle--collapsed': isSidebarCollapsed }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
    </div>

    <!-- 主对话区 -->
    <div class="main-container" :class="{ 'main-container--expanded': isSidebarCollapsed }">
        <div class="chat-header">
            <div class="chat-info">
                <div class="chat-name">小KAI助手</div>
                <div class="chat-desc">您贴心的AI心理健康助手</div>
            </div>
            <div class="header-actions">
                <button class="sidebar-toggle-btn" @click="toggleSidebar" v-if="isMobile">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
                <button class="add-btn" @click="createChat">+</button>
            </div>
        </div>

        <div class="chat-container">
            <!-- 欢迎用语 -->
            <div class="message-wrapper" v-if="messages.length === 0">
                <div class="message-bubble ai-message">
                    <p>您好，我是小暖，您的AI心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么需要分享的吗？</p>
                </div>
                <div class="message-time">刚刚</div>
            </div>
            <!-- 消息列表 -->
            <div v-for="msg in messages" :key="msg.id" class="message-wrapper">
                <div class="message-bubble" :class="msg.senderType === 1 ? 'user-message' : 'ai-message'">
                    <!-- AI正在思考中 -->
                    <div v-if="msg.senderType === 2 && isAiTyping && !msg.content" class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                    <!-- AI错误提示 -->
                    <div v-else-if="msg.isError" class="error-message">
                        <p>{{ msg.content }}</p>
                    </div>
                    <!-- 正常返回消息 -->
                    <MarkdownRenderer v-else-if="msg.senderType === 2 && !msg.isError" :content="msg.content"
                        :is-ai-message="true" />
                    <p v-else-if="msg.content" v-html="formatMessageContent(msg.content)"></p>
                </div>
                <div class="message-time">{{ msg.senderType === 2 && isAiTyping ? '正在输入中' : msg.createdAt }}</div>
            </div>
        </div>
    </div>

    <!-- 输入框 -->
    <div class="input-container" :class="{ 'input-container--expanded': isSidebarCollapsed }">
        <div class="input-wrapper">
            <el-input v-model="userMessage" placeholder="请输入您想分享的内容..." type="textarea"
                :autosize="{ minRows: 3, maxRows: 5 }" :disabled="isAiTyping" @keydown="handleKeyDown"
                class="message-input" clearable />
            <button :disabled="!userMessage.trim() || userMessage.length > 200" class="send-btn" @click="sendMessage">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>
        </div>
        <div class="input-footer">
            <span>按enter发送，按shift+enter换行</span>
            <span>{{ userMessage.length }}/200</span>
        </div>
    </div>

    <!-- 风险提示弹窗 -->
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="showRiskModal" class="risk-modal-overlay" @click.self="closeRiskModal">
                <div class="risk-modal-container">
                    <div class="modal-header">
                        <div class="modal-icon">💝</div>
                        <h3 class="modal-title">温馨提示</h3>
                    </div>
                    <div class="modal-body">
                        <p class="modal-description">{{ currentEmotion?.riskDescription ||
                            '我们注意到您最近可能经历了一些情绪波动，这是很正常的。请记住，您并不孤单，我们随时在这里支持您。' }}</p>
                        <div class="hotline-section">
                            <div class="hotline-title">📞 心理援助热线</div>
                            <div class="hotline-list">
                                <div class="hotline-item">
                                    <span class="hotline-name">全国24小时心理援助热线</span>
                                    <span class="hotline-number">400-161-9995</span>
                                </div>
                                <div class="hotline-item">
                                    <span class="hotline-name">北京心理危机干预中心</span>
                                    <span class="hotline-number">010-82951332</span>
                                </div>
                                <div class="hotline-item">
                                    <span class="hotline-name">生命热线</span>
                                    <span class="hotline-number">400-821-1215</span>
                                </div>
                            </div>
                        </div>
                        <p class="modal-footer-text">如果您感到情绪困扰，请及时寻求专业帮助。专业的心理咨询师会为您提供温暖的支持。</p>
                    </div>
                    <button class="modal-close-btn" @click="closeRiskModal">抱抱你，我会一直支持你！</button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { startSession, getSessionList, deleteSession, getSessionMessages, getSessionEmotion } from '@/api/frontend'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { ElMessage } from 'element-plus'

// 定义当前会话对象
const currentSession = ref(null)
const sessionList = ref([])
// 定义对话消息
const messages = ref([])
// 定义用户输入的消息
const userMessage = ref('')
// 定义AI助手是否正在输入中
const isAiTyping = ref(false)
// 定义是否正在发送消息
const isSending = ref(false)
// 侧边栏状态
const isSidebarCollapsed = ref(false)
// 是否为移动设备
const isMobile = ref(false)
// 风险提示弹窗显示状态
const showRiskModal = ref(false)

// 新建对话
const createChat = () => {
    const newSession = {
        sessionId: `temp_${Date.now()}`,
        status: 'TEMP',
        sessionTitle: '新对话',
    }
    currentSession.value = newSession
    // 清空消息列表
    messages.value = []
    // 重置情绪数据
    resetEmotion()
    console.log('创建新对话成功', currentEmotion.value)
}

// 定义情绪花园
const currentEmotion = ref({
    primaryEmotion: '中性',
    emotionScore: 50,
    isNegative: false,
    riskLevel: 0,
    suggestion: '情绪状态平稳',
    keywords: [],
})

const loadSessionEmotion = (sessionId) => {
    if (!sessionId) return
    // 确保sessionId格式正确
    const id = sessionId.toString().startsWith('session_') ? sessionId : `session_${sessionId}`
    getSessionEmotion(id).then(res => {
        console.log(res, 'res')
        // 确保 res.data 存在，否则使用默认值
        if (res.data) {
            currentEmotion.value = {
                // 保留默认值，防止接口返回的数据不完整
                primaryEmotion: '中性',
                emotionScore: 50,
                isNegative: false,
                riskLevel: 0,
                suggestion: '情绪状态平稳',
                keywords: [],
                riskDescription: '',
                ...res.data // 用接口返回的数据覆盖默认值
            }
        } else {
            // 接口返回空数据时，重置为默认值
            resetEmotion()
        }
    }).catch(() => {
        // 接口报错时，也重置为默认值
        resetEmotion()
    })
}

// 新增：重置情绪数据的函数
const resetEmotion = () => {
    currentEmotion.value = {
        primaryEmotion: '中性',
        emotionScore: 50,
        isNegative: false,
        riskLevel: 0,
        suggestion: '情绪状态平稳',
        keywords: [],
        riskDescription: '',
    }
}

watch(() => currentEmotion.value, (newVal) => {
    if (newVal?.isNegative && newVal?.riskLevel > 1) {
        showRiskModal.value = true
    }
}, { deep: true })

const closeRiskModal = () => {
    showRiskModal.value = false
}

const getDotClass = (score) => {
    const validScore = Math.min(100, Math.max(0, score))
    if (validScore >= 61) {
        return 3
    } else if (validScore >= 31) {
        return 2
    } else {
        return 1
    }
}
const getRiskText = (level) => {
    switch (level) {
        case 0:
            return '正常'
        case 1:
            return '需要关注'
        case 2:
            return '预警'
        case 3:
            return '危机'
        default:
            return '正常'
    }
}

// 处理键盘事件
const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
    }
}

// 发送消息
const sendMessage = async () => {
    const message = userMessage.value.trim()
    if (!message) return // trim 去除首尾空格
    if (message.length > 200) {
        ElMessage.warning('消息内容不能超过200字')
        return
    }
    if (isAiTyping.value) {
        ElMessage.warning('AI助手正在输入中，请稍后')
        return
    }

    userMessage.value = ''
    // 如果没有对话，创建新对话
    if (!currentSession.value || currentSession.value.status === 'TEMP') {
        startNewSession(message)
    } else {
        // 继续现有对话
        messages.value.push({
            id: Date.now(),
            senderType: 1, // 1表示用户
            content: message,
            createAt: new Date().toISOString(),
        })
        startAIResponse(currentSession.value.sessionId, message)
    }

}
const startNewSession = (message) => {
    const sessionParams = {
        initialMessage: message
    }
    if (currentSession.value.sessionTitle === '新对话') {
        sessionParams.sessionTitle = `小KAI助手 - ${new Date().toLocaleString()}`
    } else {
        // 非新对话，保留原标题
        sessionParams.sessionTitle = currentSession.value.sessionTitle
    }
    // 调用后端接口创建新会话
    startSession(sessionParams).then(res => {
        // console.log(res.data,'res')
        const resData = res.data
        //将后端返回的数据作为前端会话格式
        const sessionData = {
            sessionId: resData.sessionId,
            status: resData.status,
            sessionTitle: sessionParams.sessionTitle,
        }
        // 如果当前是临时会话，更新数据
        if (currentSession.value && currentSession.value.status === 'TEMP') {
            // 更新为正式会话
            Object.assign(currentSession.value, sessionData)
        } else {
            currentSession.value = sessionData
        }
        // 更新会话列表
        fetchSessionList()

        // 添加初始用户消息
        messages.value.push({
            id: Date.now(),
            senderType: 1, // 1表示用户
            content: message,
            createAt: new Date().toISOString(),
        })

        // 开始流式对话
        startAIResponse(currentSession.value.sessionId, message)
    })
}
const startAIResponse = (sessionId, userMessage) => {
    //防止重复发送
    if (isAiTyping.value) {
        ElMessage.warning('AI助手正在输入中，请稍后')
        return
    }

    isAiTyping.value = true

    const aiMessage = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substring(2)}`,// 借助Math，生成唯一标识符
        senderType: 2, // 2表示AI
        content: '',
        createAt: new Date().toISOString(),
    }
    messages.value.push(aiMessage)

    // 调用流式对话接口
    const controller = new AbortController()// 用于取消fetch请求
    fetchEventSource('/api/psychological-chat/stream', {//接受两个参数，url、配置项：请求类型、请求头、请求体、中止控制器
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Token': localStorage.getItem('token'),
            'Accept': 'text/event-stream',// 接受事件流格式
        },
        body: JSON.stringify({// 传递的数据
            sessionId,
            userMessage,
        }),
        signal: controller.signal,// 中止控制器
        onopen: (response) => {
            // console.log(response, 'response')
            if (response.headers.get('content-type') !== 'text/event-stream') {
                ElMessage.error('服务器返回非事件流格式')
            }
        },
        onmessage: (event) => {
            // console.log(event, 'event')
            const raw = event.data.trim()
            if (!raw) return
            const eventName = event.event
            // 获取当前的AI消息
            const aiMessage = messages.value[messages.value.length - 1]

            if (eventName === 'done') {
                isAiTyping.value = false
                controller.abort()
                // 开始情绪分析
                loadSessionEmotion(sessionId)
                return
            }
            const payload = JSON.parse(raw)
            const isSuccess = String(payload.code) === '200'
            if (isSuccess && payload.data && payload.data.content) {
                aiMessage.content += payload.data.content
            } else if (!isSuccess) {
                handleError(payload.message || '请求失败')
            }
        },
        onerror: (err) => {
            handleError(err || '请求失败')
            throw err
        },
        onclose: () => {
            // 开始情绪分析
        }
    })

}

// 错误处理函数
const handleError = (error) => {
    // 获取当前的AI消息
    const aiMessage = messages.value[messages.value.length - 1]
    if (aiMessage) {
        aiMessage.content = 'AI回复失败，请重试'
    }
    isAiTyping.value = false
    ElMessage.error('AI回复失败，请重试')
}

// 获取会话列表
const fetchSessionList = async () => {
    const res = await getSessionList({
        pageNum: 1,
        pageSize: 10,
    })
    console.log(res, '会话列表')
    sessionList.value = res.data.records
    console.log(sessionList.value, 'sessionList.value')
    return sessionList.value
}

// 获取会话数据
const handleSessionClick = (session) => {
    // console.log(session, 'session')
    // 点击会话时，获取会话消息
    getSessionMessages(session.id).then(res => {
        console.log(res.data, 'res.data')
        // 确保 messages 始终是数组
        messages.value = Array.isArray(res.data) ? res.data : []
    })
    // 加载会话情绪
    loadSessionEmotion(session.id)
    // 更新当前会话ID
    const sessionData = {
        sessionId: "session_" + session.id,
        status: 'ACTIVE',
        sessionTitle: session.sessionTitle,
    }
    currentSession.value = sessionData
}

// 删除会话
const handleDelete = (sessionId) => {
    if (!sessionId) return
    deleteSession(sessionId).then(() => {
        fetchSessionList().then((list) => {
            if (!list || list.length === 0) {
                createChat()
            } else {
                // 确保 list[0] 存在
                if (list[0]) {
                    handleSessionClick(list[0])
                } else {
                    createChat()
                }
            }
            ElMessage.success('删除成功')
        }).catch(() => {
            createChat()
        })
    }).catch(() => {
        ElMessage.error('删除失败')
    })
}

// 简单换行逻辑
const formatMessageContent = (content) => {
    return content.replace(/\n/g, '<br>')
}

// 切换侧边栏
const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 检测设备类型
const checkDeviceType = () => {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value) {
        isSidebarCollapsed.value = true
    }
}

onMounted(() => {
    createChat()
    fetchSessionList().catch(() => {
        createChat()
    })
    console.log(messages.value, 'messages.value')

    // 检测设备类型
    checkDeviceType()
    window.addEventListener('resize', checkDeviceType)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkDeviceType)
})
</script>

<style scoped lang="scss">
// ========== 全局变量 ==========
$theme: (
    primary: #8A9FD1,
    secondary: #A8D8B9,
    accent: #F2B5D4,
    text-primary: #2A3342,
    text-secondary: #4A5568,
    text-tertiary: #94A3B8,
    glass-bg: rgba(255, 255, 255, 0.55),
    glass-border: rgba(255, 255, 255, 0.8),
    success: #10B981,
    danger: #F87171,
    error-bg: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%),
    error-border: #F87171,
    error-text: #991B1B,
    shadow-sm: 0 4px 16px rgba(138, 159, 209, 0.15),
    shadow-md: 0 8px 32px rgba(138, 159, 209, 0.1),
    shadow-lg: 0 8px 32px rgba(242, 181, 212, 0.15),
);

// 变量快捷访问
@function theme($key) {
    @return map-get($theme, $key);
}

// ========== 基础样式 ==========
:deep(body) {
    min-height: 100vh;
    overflow: hidden;
    background: linear-gradient(135deg, #FAFAFF 0%, #F5F7FF 100%);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E"),
        linear-gradient(135deg, #FAFAFF 0%, #F5F7FF 100%);
    color: theme(text-primary);
}

// 滚动条美化
:deep(::webkit-scrollbar) {
    width: 4px;
    height: 4px;
}

:deep(::webkit-scrollbar-track) {
    background: transparent;
}

:deep(::webkit-scrollbar-thumb) {
    background: rgba(138, 159, 209, 0.3);
    border-radius: 2px;

    &:hover {
        background: rgba(138, 159, 209, 0.5);
    }
}

// 通用动画
@keyframes messageSlide {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes typing {

    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-4px);
    }
}

// ========== 侧边栏样式 ==========
.sidebar {
    width: 280px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: theme(glass-bg);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-right: 1px solid theme(glass-border);
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    z-index: 10;
    transition: all 0.3s ease;

    // 侧边栏折叠状态
    &--collapsed {
        width: 70px;
        padding: 24px 12px;

        .brand-name,
        .brand-desc,
        .online-status,
        .mood-section,
        .session-section {
            display: none;
        }

        .brand-logo {
            width: 40px;
            height: 40px;
        }
    }

    // 品牌区
    .brand-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .brand-logo {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, theme(primary) 0%, theme(secondary) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            margin-bottom: 8px;
            transition: all 0.3s ease;
        }

        .brand-name {
            font-size: 16px;
            font-weight: 600;
            color: theme(text-primary);
        }

        .brand-desc {
            font-size: 12px;
            color: theme(text-tertiary);
            text-align: center;
        }

        .online-status {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: theme(text-tertiary);
            margin-top: 4px;

            .status-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: theme(success);
            }
        }
    }

    // 情绪花园
    .mood-section {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .section-title {
            font-size: 16px;
            font-weight: 500;
            color: theme(text-primary);
        }

        .mood-circle-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;

            .mood-circle {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: conic-gradient(from 0deg, theme(accent) 50%, rgba(242, 181, 212, 0.1) 0);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: theme(shadow-lg);

                &::after {
                    content: '';
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: #fff;
                    position: absolute;
                }

                .mood-value {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .mood-label {
                        font-size: 14px;
                        color: theme(text-secondary);
                    }

                    .mood-number {
                        font-size: 18px;
                        font-weight: 600;
                        color: theme(accent);
                    }
                }
            }

            .mood-desc {
                font-size: 14px;
                color: theme(text-secondary);
                text-align: center;

                strong {
                    color: theme(text-primary);
                    font-weight: 600;
                }
            }

            .mood-status {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 12px;
                color: theme(text-tertiary);

                .status-dot-pink {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: theme(accent);
                    opacity: 0.3;
                    transition: opacity 0.3s ease;

                    &.active {
                        opacity: 1;
                    }
                }
            }
        }

        .mood-tip {
            background: rgba(255, 255, 255, 0.7);
            border-radius: 16px;
            padding: 12px 16px;
            margin-top: 8px;

            .tip-title {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 4px;
            }

            .tip-content {
                font-size: 13px;
                color: theme(text-secondary);
            }
        }

        .action-btn {
            font-size: 14px;
            color: theme(primary);
            text-align: center;
            margin-top: 8px;
            cursor: pointer;
            transition: opacity 0.3s ease;

            &:hover {
                opacity: 0.7;
            }
        }

        .risk-notice {
            background: linear-gradient(135deg, #fff9e6, #ffeaa7);
            border-radius: 16px;
            padding: 16px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            border: 1px solid rgba(255, 234, 167, 0.6);
            box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);

            .notice-icon {
                font-size: 20px;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .notice-content {
                flex: 1;

                .notice-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #d4840f;
                    margin-bottom: 6px;
                }

                .notice-text {
                    font-size: 13px;
                    color: #b8740c;
                    line-height: 1.5;
                }
            }
        }
    }

    // 会话列表
    .session-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: hidden;

        .section-title {
            font-size: 16px;
            font-weight: 500;
            color: theme(text-primary);
        }

        .session-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            overflow-y: auto;
            padding-right: 4px;

            .session-item {
                padding: 12px;
                border-radius: 16px;
                background: rgba(255, 255, 255, 0.4);
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;

                &:hover {
                    background: rgba(255, 255, 255, 0.7);
                    transform: translateX(4px);
                }

                .session-title {
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .session-time {
                    font-size: 12px;
                    color: theme(text-tertiary);
                    margin-bottom: 6px;
                }

                .session-desc {
                    font-size: 13px;
                    color: theme(text-secondary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .session-meta {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 12px;
                    color: theme(text-tertiary);
                    margin-top: 6px;
                }

                .session-actions {
                    position: absolute;
                    top: 10px;
                    right: 12px;
                }
            }
        }
    }

    // 侧边栏折叠按钮
    .sidebar-toggle {
        position: absolute;
        right: -10px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 40px;
        background: theme(glass-bg);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid theme(glass-border);
        border-radius: 0 10px 10px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: theme(text-secondary);
        transition: all 0.3s ease;

        &:hover {
            background: rgba(255, 255, 255, 0.8);
            color: theme(primary);
        }

        // 折叠状态下的样式
        &--collapsed {
            right: auto;
            left: -10px;
            border-radius: 10px 0 0 10px;

            svg {
                transform: rotate(180deg);
                transition: transform 0.3s ease;
            }
        }

        svg {
            transition: transform 0.3s ease;
        }
    }
}

// ========== 主对话区样式 ==========
.main-container {
    margin-left: 280px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 24px 40px 100px;
    position: relative;
    transition: all 0.3s ease;

    // 侧边栏折叠时的样式
    &--expanded {
        margin-left: 70px;
    }

    // 聊天头部
    .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(138, 159, 209, 0.1);
        margin-bottom: 20px;

        .chat-info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .chat-name {
                font-size: 20px;
                font-weight: 600;
            }

            .chat-desc {
                font-size: 13px;
                color: theme(text-tertiary);
            }
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sidebar-toggle-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(138, 159, 209, 0.1);
            border: none;
            color: theme(primary);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background: theme(primary);
                color: #fff;
                transform: scale(1.05);
            }
        }

        .add-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(138, 159, 209, 0.1);
            border: none;
            color: theme(primary);
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background: theme(primary);
                color: #fff;
                transform: scale(1.05);
            }
        }
    }

    // 聊天内容区
    .chat-container {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .message-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;

            .message-bubble {
                max-width: 60%;
                padding: 16px 20px;
                border-radius: 20px;
                line-height: 1.6;
                font-size: 15px;
                margin-bottom: 20px;
                animation: messageSlide 0.3s ease-out forwards;

                // 输入中动画
                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 8px 0;

                    .typing-dot {
                        width: 8px;
                        height: 8px;
                        background: #ccc;
                        border-radius: 50%;
                        animation: typing 1.5s ease-in-out infinite;

                        &:nth-child(2) {
                            animation-delay: 0.2s;
                        }

                        &:nth-child(3) {
                            animation-delay: 0.4s;
                        }
                    }
                }

                // 错误消息
                .error-message {
                    background: theme(error-bg);
                    border: 1px solid theme(error-border);
                    border-radius: 12px;
                    padding: 16px 20px;
                    color: theme(error-text);
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    line-height: 1.6;
                }
            }

            // AI消息气泡
            .ai-message {
                background: linear-gradient(90deg, rgba(168, 216, 185, 0.18) 0%, rgba(168, 216, 185, 0.25) 100%);
                border-bottom-left-radius: 4px;
                align-self: flex-start;
                color: theme(text-primary);
            }

            // 用户消息气泡
            .user-message {
                background: linear-gradient(90deg, rgba(138, 159, 209, 0.18) 0%, rgba(138, 159, 209, 0.25) 100%);
                border-bottom-right-radius: 4px;
                align-self: flex-end;
                color: theme(text-primary);
            }

            // 消息时间
            .message-time {
                font-size: 12px;
                color: theme(text-tertiary);
                margin-top: 4px;
                align-self: flex-end;
            }
        }
    }
}

// ========== 输入框样式 ==========
.input-container {
    position: fixed;
    bottom: 24px;
    left: 320px;
    right: 24px;
    background: theme(glass-bg);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: 24px;
    padding: 12px 16px;
    border: 1px solid theme(glass-border);
    box-shadow: theme(shadow-md);
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: all 0.3s ease;

    // 侧边栏折叠时的样式
    &--expanded {
        left: 110px;
    }

    .input-wrapper {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;

        .message-input {
            flex: 1;
            border: none !important;
            background: transparent !important;
            outline: none !important;
            font-size: 15px !important;
            color: theme(text-primary) !important;
            resize: none !important;
            max-height: 120px !important;
            line-height: 1.5 !important;
            min-height: 50px !important;

            &::placeholder {
                color: theme(text-tertiary) !important;
            }

            &:focus {
                box-shadow: none !important;
            }
        }

        .send-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, theme(primary) 0%, #7A8FC1 100%);
            border: none;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            flex-shrink: 0;

            &:hover {
                transform: scale(1.05);
                box-shadow: theme(shadow-sm);
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
        }
    }

    .input-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: theme(text-tertiary);
    }
}

// ========== 响应式适配 ==========
@media (max-width: 768px) {
    .sidebar {
        width: 240px;
        padding: 16px 12px;

        &--collapsed {
            width: 0;
            padding: 0;
            overflow: hidden;
        }
    }

    .main-container {
        margin-left: 240px;
        padding: 16px 20px 80px;

        &--expanded {
            margin-left: 0;
        }
    }

    .input-container {
        left: 260px;
        right: 16px;
        bottom: 16px;

        &--expanded {
            left: 16px;
        }
    }

    .message-bubble {
        max-width: 80% !important;
    }

    // 移动设备上隐藏折叠按钮
    .sidebar-toggle {
        display: none;
    }
}

// ========== 风险提示弹窗样式 ==========
.risk-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;

    .risk-modal-container {
        background: theme(glass-bg);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-radius: 24px;
        border: 1px solid theme(glass-border);
        box-shadow: theme(shadow-lg), 0 20px 60px rgba(0, 0, 0, 0.15);
        max-width: 520px;
        width: 100%;
        overflow: hidden;
        animation: modalSlideIn 0.3s ease-out;

        .modal-header {
            background: linear-gradient(135deg, rgba(242, 181, 212, 0.3) 0%, rgba(168, 216, 185, 0.3) 100%);
            padding: 28px 32px 24px;
            text-align: center;

            .modal-icon {
                font-size: 48px;
                margin-bottom: 12px;
                animation: pulse 2s ease-in-out infinite;
            }

            .modal-title {
                font-size: 22px;
                font-weight: 600;
                color: theme(text-primary);
                margin: 0;
            }
        }

        .modal-body {
            padding: 28px 32px;

            .modal-description {
                font-size: 18px;
                line-height: 1.7;
                color: theme(text-secondary);
                margin: 0 0 24px 0;
                text-align: center;
            }

            .hotline-section {
                background: linear-gradient(135deg, rgba(138, 159, 209, 0.08) 0%, rgba(168, 216, 185, 0.08) 100%);
                border-radius: 16px;
                padding: 20px 24px;
                margin-bottom: 20px;

                .hotline-title {
                    font-size: 22px;
                    font-weight: 600;
                    color: black;
                    margin-bottom: 16px;
                    text-align: center;
                }

                .hotline-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;

                    .hotline-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 16px;
                        background: rgba(255, 255, 255, 0.6);
                        border-radius: 12px;
                        transition: all 0.3s ease;

                        &:hover {
                            background: rgba(255, 255, 255, 0.9);
                            transform: translateX(4px);
                        }

                        .hotline-name {
                            font-size: 14px;
                            color: theme(text-secondary);
                        }

                        .hotline-number {
                            font-size: 16px;
                            font-weight: 600;
                            color: theme(primary);
                            letter-spacing: 0.5px;
                        }
                    }
                }
            }

            .modal-footer-text {
                font-size: 18px;
                line-height: 1.6;
                color: balck;
                margin: 0;
                text-align: center;
            }
        }

        .modal-close-btn {
            width: calc(100% - 64px);
            margin: 0 32px 28px;
            padding: 14px 24px;
            background: linear-gradient(135deg, theme(primary) 0%, #7A8FC1 100%);
            border: none;
            border-radius: 16px;
            color: #fff;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-2px);
                box-shadow: theme(shadow-sm);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }
}

// ========== 弹窗动画 ==========
@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-30px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}

// Vue Transition 动画
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;

    .risk-modal-container {
        transition: all 0.3s ease;
    }
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;

    .risk-modal-container {
        transform: translateY(-30px) scale(0.95);
    }
}
</style>