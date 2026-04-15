<template>
    <div class="page-container">
        <!-- 导航栏 -->
        <header class="navbar" role="banner">
            <div class="logo-area">
                <div class="logo-icon" aria-hidden="true">🌿</div>
                <span class="logo-text">心晴日记</span>
            </div>
        </header>

        <div class="app-container">
        <!-- 主内容 -->
        <main>
            <!-- 模块1: 今日情绪评分 -->
            <section class="card" aria-labelledby="rating-heading">
                <div class="card-title" id="rating-heading">
                    <div class="icon-container star-icon">
                        <el-icon aria-hidden="true">
                            <StarFilled />
                        </el-icon>
                    </div>
                    <span>今日情绪评分</span>
                </div>
                <div class="rating-section">
                    <div class="stars-container" role="group" aria-label="1到10分评分，1分代表非常低落，10分代表非常愉快">
                        <el-rate 
                            v-model="diaryForm.moodScore" 
                            :max="10" 
                            show-text 
                            size="large"
                            class="custom-rate"
                        />
                    </div>
                    <div class="score-feedback" id="scoreFeedback" aria-live="polite">
                        {{ diaryForm.moodScore ? getEmotionFeedback(diaryForm.moodScore) : '✨ 点击星星记录此刻心情' }}
                    </div>
                </div>
            </section>

            <!-- 模块2: 主要情绪 -->
            <section class="card" aria-labelledby="emotion-heading">
                <div class="card-title" id="emotion-heading">
                    <div class="icon-container heart-icon">
                        <el-icon aria-hidden="true">
                            <Star />
                        </el-icon>
                    </div>
                    <span>主要情绪</span>
                </div>
                <div class="emotion-grid" id="emotionGrid" role="group" aria-label="选择你当下的主要情绪">
                    <div v-for="emotion in emotionOptions" :key="emotion.name" class="emotion-btn"
                        @click="handleEmotionClick(emotion.name)"
                        :class="{ 'selected': emotion.name === diaryForm.dominantEmotion }"
                        :data-emotion-key="emotion.name"
                        :aria-pressed="emotion.name === diaryForm.dominantEmotion">
                        {{ getEmotionIcon(emotion.name) }}
                        <span>{{ emotion.name }}</span>
                    </div>
                </div>
                <p class="sr-only" aria-live="polite" id="emotionAriaLive"></p>
            </section>

            <!-- 模块3: 详细记录 -->
            <section class="card" aria-labelledby="detail-heading">
                <div class="card-title" id="detail-heading">
                    <div class="icon-container pencil-icon">
                        <el-icon aria-hidden="true">
                            <Edit />
                        </el-icon>
                    </div>
                    <span>详细记录</span>
                </div>
                <form class="record-form" id="emotionForm">
                    <div class="input-group">
                        <label for="thoughts">
                            <div class="icon-container small-icon ">
                                <el-icon>
                                    <ChatDotRound />
                                </el-icon>
                            </div>
                            发生了什么？
                        </label>
                        <el-input id="thoughts" v-model="diaryForm.emotionTriggers" placeholder="写下触发情绪的事件或想法…" type="textarea"
                            :rows="3" maxLength="500" show-word-limit></el-input>
                    </div>
                    <div class="input-group">
                        <label for="bodyFeel">
                            <div class="icon-container small-icon ">
                                <el-icon>
                                    <UserFilled />
                                </el-icon>
                            </div>
                            身体感受
                        </label>
                        <el-input id="bodyFeel" v-model="diaryForm.bodyFeeling" placeholder="例如：胸口闷、肩膀紧绷…" type="textarea"
                            :rows="3" maxLength="500" show-word-limit></el-input>
                    </div>
                    <div class="form-actions">
                        <el-button type="primary" @click="submitDiary" aria-label="提交情绪记录" class="btn btn-primary">
                            <el-icon><Check /></el-icon>
                            提交记录
                        </el-button>
                        <el-button @click="resetForm" aria-label="重置表单" class="btn btn-secondary">
                            <el-icon><Refresh /></el-icon>
                            重置
                        </el-button>
                    </div>
                </form>
            </section>
        </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { dayjs, ElMessage } from 'element-plus'
import { addEmotionDiary } from '@/api/frontend'
import { StarFilled, Star, Edit, ChatDotRound, UserFilled, Check, Refresh } from '@element-plus/icons-vue'


const imageUrl = new URL('@/assets/images/like.png', import.meta.url).href

// 情绪选项
const emotionOptions = [
    { name: '开心', url: new URL('@/assets/images/开心.png', import.meta.url).href },
    { name: '平静', url: new URL('@/assets/images/平静.png', import.meta.url).href },
    { name: '焦虑', url: new URL('@/assets/images/焦虑.png', import.meta.url).href },
    { name: '感激', url: new URL('@/assets/images/感激.png', import.meta.url).href },
    { name: '疲惫', url: new URL('@/assets/images/疲惫.png', import.meta.url).href },
    { name: '兴奋', url: new URL('@/assets/images/兴奋.png', import.meta.url).href },
    { name: '悲伤', url: new URL('@/assets/images/悲伤.png', import.meta.url).href },
    { name: '愤怒', url: new URL('@/assets/images/愤怒.png', import.meta.url).href },

]

// 处理情绪点击
const handleEmotionClick = (emotion) => {
    diaryForm.dominantEmotion = emotion
}



// 情绪反馈文字
const getEmotionFeedback = (score) => {
    if (score >= 9) return '🎉 超级棒！充满能量！';
    if (score >= 8) return '☀️ 心情明朗，真好！';
    if (score >= 7) return '🌸 感觉挺舒服的';
    if (score >= 6) return '🌱 一点点轻快～';
    if (score >= 5) return '🌤️ 中规中矩，还不错';
    if (score >= 4) return '🌥️ 有一点点阴霾';
    if (score >= 3) return '☁️ 微微沉重，可以休息一下';
    if (score >= 2) return '🌧️ 有些低落呢，没关系';
    return '😔 抱抱你，今天可能很难熬';
}

// 情绪图标映射
const getEmotionIcon = (emotionName) => {
    const iconMap = {
        '开心': '😊',
        '平静': '😌',
        '焦虑': '😰',
        '悲伤': '😢',
        '兴奋': '🤩',
        '疲惫': '😴',
        '惊讶': '😲',
        '困惑': '😕',
        '感激': '🥹',
        '愤怒': '😤'
    };
    return iconMap[emotionName] || '😐';
}

// 情绪评分
const diaryForm = reactive({
    diaryDate: dayjs().format('YYYY-MM-DD'),
    moodScore: null,
    dominantEmotion: '',
    emotionTriggers: '',
    diaryContent: '',
    bodyFeeling: ''
})

// 重置、提交记录
const resetForm = () => {
    Object.assign(diaryForm, {
        diaryDate: dayjs().format('YYYY-MM-DD'),
        moodScore: null,
        dominantEmotion: '',
        emotionTriggers: '',
        diaryContent: '',
        bodyFeeling: ''
    })
}

const submitDiary = () => {
    console.log('提交日记:', diaryForm)
    if (!diaryForm.moodScore) {
        ElMessage.error('请选择情绪评分')
        return
    }
    addEmotionDiary(diaryForm).then(res => {
        console.log(res)
        if (String(res.code) === '200') {
            ElMessage.success('提交成功')
            resetForm()
        } else {
            ElMessage.error(res.msg || '提交失败')
        }
    })
}

</script>

<style scoped lang="scss">
/* 确保body和html宽度为100% */
:deep(body),
:deep(html) {
    width: 100%;
    margin: 0;
    padding: 0;
}

/* 页面容器，占据整个屏幕宽度 */
.page-container {
    width: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    overflow-x: hidden;
}

.app-container {
    width: 100%;
    margin: 0;
    padding: 16px;
    box-sizing: border-box;
    display: block;
}

/* 确保main标签宽度为100% */
main {
    width: 100%;
    display: block;
}

/* PC端适配 */
@media (min-width: 768px) {
    /* 卡片优化 */
    .card {
        padding: 32px 28px;
        border-radius: 36px;
        box-shadow: 0 8px 20px rgba(80, 60, 40, 0.04), 0 3px 8px rgba(0,0,0,0.02);
    }

    /* 主要情绪网格布局调整 */
    .emotion-grid {
        grid-template-columns: repeat(8, 1fr);
        gap: 16px;
    }

    .emotion-btn {
        padding: 18px 10px;
        font-size: 1.9rem;

        span {
            font-size: 0.9rem;
        }
    }

    /* 详细记录输入框高度调整 */
    .el-input {
        textarea.el-textarea__inner {
            min-height: 120px;
        }
    }

    /* 按钮位置调整 */
    .form-actions {
        flex-direction: row;
        justify-content: center;

        .btn {
            flex: 0 0 200px;
        }
    }
}

/* ----- 顶部导航栏 (卡片式) ----- */
.navbar {
    width: 100%;
    height: 156px;
    //橙绿渐变
    background: linear-gradient(135deg, #e79a4c 0%, #98d42f 100%);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: 12px 20px;
    margin-bottom: 24px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02), 0 2px 6px rgba(0, 0, 0, 0.03);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-sizing: border-box;
}

.logo-area {
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-icon {
    background: linear-gradient(135deg, #f9d5b0 0%, #f7c9a8 100%);
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b4f3c;
    font-size: 20px;
    box-shadow: 0 4px 8px rgba(233, 186, 143, 0.2);
}

.logo-text {
    font-weight: 600;
    font-size: 40px;
    color: #5e4b3a;
    letter-spacing: -0.01em;
}

.nav-menu {
    display: flex;
    gap: 24px;
    align-items: center;
}

.nav-item {
    font-size: 20px;
    color: #7a6856;
    text-decoration: none;
    font-weight: 480;
    padding: 6px 0;
    position: relative;
    transition: color 0.2s;
}

/* 当前选中项“情绪日记”高亮下划线 */
.nav-item.active {
    color: #b46e4c;
    font-weight: 550;
}

.nav-item.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background: #c28b6e;
    border-radius: 20px;
}

.user-avatar {
    width: 44px;
    height: 44px;
    border-radius: 40px;
    background: #e7d9cf;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b4f3c;
    font-size: 20px;
    border: 2px solid #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.02);
    transition: transform 0.1s;
}

.user-avatar i {
    font-size: 22px;
}

/* ----- 卡片通用设计 ----- */
.card {
    background: #ffffffd9;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 32px;
    padding: 28px 24px;
    margin-bottom: 20px;
    box-shadow: 0 12px 28px -6px rgba(80, 60, 40, 0.06), 0 4px 12px rgba(0,0,0,0.02);
    border: 1px solid rgba(253, 245, 235, 0.6);
    transition: box-shadow 0.25s;
}

.card-title {
    font-size: 1.35rem;
    font-weight: 620;
    color: #4e3f32;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.card-title .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    :deep(el-icon) {
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
}

/* 图标容器尺寸变体 */
.icon-container.small-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;

    :deep(el-icon) {
        font-size: 0.9rem;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

/* ----- 今日情绪评分 (星星) ----- */
.rating-section {
    text-align: left;
}

.stars-container {
    display: flex;
    gap: 10px;
    margin: 16px 0 8px;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.custom-rate {
    .el-rate__icon {
        font-size: 2.4rem;
        color: #e2cfbe;
        transition: all 0.15s ease;
        padding: 0 4px;
        line-height: 1;
        border-radius: 20px;

        &:hover {
            transform: scale(1.18);
            color: #f3bc6c;
        }

        &.is-active {
            color: #f5a65b;
            text-shadow: 0 0 8px rgba(245, 166, 91, 0.3);
        }
    }

    .el-rate__text {
        display: none;
    }
}

.score-feedback {
    min-height: 48px;
    background: #faf3ec;
    border-radius: 40px;
    padding: 12px 20px;
    color: #6a4e3a;
    font-size: 1.1rem;
    font-weight: 460;
    margin: 16px 0 4px;
    border-left: 6px solid #e3b99a;
    transition: background 0.2s;
    display: flex;
    align-items: center;
}

/* ----- 主要情绪 (8个图标) ----- */
.emotion-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px 10px;
    margin-top: 6px;
}

.emotion-btn {
    background: #fefcf9;
    border: 1.5px solid #f0e2d8;
    border-radius: 48px;
    padding: 14px 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-size: 1.7rem;
    color: #7b6252;
    font-weight: 500;
    transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.01);
    user-select: none;
    backdrop-filter: blur(2px);

    span {
        font-size: 0.85rem;
        font-weight: 520;
        color: #6a5546;
    }

    /* 微动效: 悬浮上浮+阴影 */
    &:hover {
        transform: translateY(-3px);
        background: #fffaf3;
        border-color: #dbbca4;
        box-shadow: 0 12px 18px -8px rgba(150, 110, 80, 0.12);
    }

    /* 选中状态: 高亮描边+背景色变化 */
    &.selected {
        background: #f7e4d8;
        border: 2px solid #c28463;
        box-shadow: 0 6px 12px rgba(194, 132, 99, 0.15);
        color: #5d3f2e;

        span {
            color: #543f30;
            font-weight: 560;
        }
    }

    &:focus-visible {
        outline: 3px solid #b47d60;
        outline-offset: 2px;
    }
}

/* ----- 详细记录区域 ----- */
.record-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.input-group label {
    font-weight: 530;
    color: #5e4b3b;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.input-group label .icon-container {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(el-icon) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

/* 多行文本框 */
.el-input {
    width: 100%;

    textarea.el-textarea__inner {
        background: #fdfaf7;
        border: 1.5px solid #ead9cf;
        border-radius: 22px;
        padding: 16px 18px;
        font-size: 1rem;
        color: #2f241c;
        resize: vertical;
        min-height: 100px;
        line-height: 1.5;
        transition: border 0.2s, box-shadow 0.2s;
        font-family: inherit;

        &:focus {
            border-color: #c28463;
            box-shadow: 0 0 0 4px rgba(194, 132, 99, 0.15);
            outline: none;
            background: #ffffff;
        }

        &::placeholder {
            color: #9CA3AF;
            font-size: 14px;
        }
    }
}

/* 按钮区域 */
.form-actions {
    display: flex;
    gap: 16px;
    margin-top: 12px;
    flex-wrap: wrap;
}

.btn {
    border: none;
    padding: 16px 24px;
    border-radius: 60px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1 1 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);

    :deep(el-icon) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.btn-primary {
    background: linear-gradient(115deg, #eac1a8 0%, #dbaa88 100%);
    color: #442f23;
    border: 1px solid #e7cbb9;
    box-shadow: 0 10px 18px -8px rgba(180, 120, 80, 0.3);

    &:hover {
        background: linear-gradient(115deg, #e6b89b 0%, #d19b79 100%);
        transform: scale(1.01);
        box-shadow: 0 14px 22px -10px rgba(160, 100, 60, 0.3);
    }
}

.btn-secondary {
    background: transparent;
    border: 1.8px solid #cfbcae;
    color: #5f4a3a;
    box-shadow: none;

    &:hover {
        background: #f5ede7;
        border-color: #b3927e;
    }
}

.btn:focus-visible {
    outline: 3px solid #b47d60;
    outline-offset: 3px;
}

/* 移动端微调 */
@media (max-width: 767px) {
    .app-container {
        padding: 10px;
    }

    .navbar {
        padding: 10px 16px;
    }

    .logo-text {
        font-size: 1.1rem;
    }

    .nav-menu {
        gap: 14px;
    }

    .emotion-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
    }

    .emotion-btn {
        padding: 12px 4px;
        font-size: 1.5rem;
    }

    .stars-container {
        gap: 4px;
    }

    .custom-rate {
        .el-rate__icon {
            font-size: 2rem;
        }
    }

    .card {
        padding: 22px 18px;
    }

    .form-actions {
        flex-direction: column;

        .btn {
            flex: 1 1 auto;
        }
    }
}

/* 提示与无障碍 */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
}

[aria-hidden="true"] {
    user-select: none;
}

i {
    pointer-events: none;
}
</style>