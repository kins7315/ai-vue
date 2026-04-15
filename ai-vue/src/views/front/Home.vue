<template>
  <div class="home-container">
    <!-- 流动 Mesh Gradient 背景 (Canvas 液态光斑) -->
    <canvas id="canvas-bg" class="canvas-bg"></canvas>
    <div class="noise-overlay"></div>

    <!-- 毛玻璃导航栏（完全保留原有结构和逻辑） -->
    <nav class="glass-nav">
      <div class="logo">✦ 心理健康对话</div>
      
      <!-- 桌面端导航 -->
      <div class="nav-links">
        <router-link to="/consultation" class="nav-link nav-link--active">听见你</router-link>
        <router-link to="/emotional-diary" class="nav-link">情绪日记</router-link>
        <router-link to="/psychological-assessment" class="nav-link">心理评估</router-link>
        <router-link to="/knowledge" class="nav-link">知识库</router-link>
        <router-link v-if="!isLoggedIn" to="/auth/login" class="nav-link">登录</router-link>
        <router-link v-if="!isLoggedIn" to="/auth/register" class="nav-link">注册</router-link>
        <div v-else class="user-avatar" @click="toggleUserMenu">
          <img :src="userAvatar || defaultAvatar" alt="用户头像" />
        </div>
      </div>
      
      <!-- 移动端导航按钮 -->
      <div class="mobile-nav-toggle" @click="toggleMobileNav">
        ☰
      </div>
    </nav>

    <!-- 用户下拉菜单 -->
    <div v-if="isLoggedIn && showUserMenu" class="user-menu">
      <div class="user-menu-item" @click="goToPersonalCenter">个人中心</div>
      <div class="user-menu-item" @click="goToFeedback">意见与反馈</div>
      <div class="user-menu-item" @click="goToContact">联系作者</div>
      <div class="user-menu-item" @click="handleLogout">退出登录</div>
    </div>

    <!-- 移动端导航 -->
    <div class="mobile-nav" :class="{ 'mobile-nav--open': showMobileNav }">
      <div class="mobile-nav-header">
        <div class="logo">✦ 心理健康对话</div>
        <div class="mobile-nav-close" @click="toggleMobileNav">×</div>
      </div>
      <div class="mobile-nav-links">
        <router-link to="/" class="mobile-nav-link mobile-nav-link--active" @click="goToChat">听见你</router-link>
        <router-link to="/emotional-diary" class="mobile-nav-link" @click="toggleMobileNav">情绪日记</router-link>
        <router-link to="/knowledge" class="mobile-nav-link" @click="toggleMobileNav">知识库</router-link>
        <router-link v-if="!isLoggedIn" to="/auth/login" class="mobile-nav-link" @click="toggleMobileNav">登录</router-link>
        <router-link v-if="!isLoggedIn" to="/auth/register" class="mobile-nav-link" @click="toggleMobileNav">注册</router-link>
        <div v-if="isLoggedIn" class="mobile-nav-link" @click="goToPersonalCenter; toggleMobileNav">个人中心</div>
        <div v-if="isLoggedIn" class="mobile-nav-link" @click="goToFeedback; toggleMobileNav">意见与反馈</div>
        <div v-if="isLoggedIn" class="mobile-nav-link" @click="goToContact; toggleMobileNav">联系作者</div>
        <div v-if="isLoggedIn" class="mobile-nav-link" @click="handleLogout; toggleMobileNav">退出登录</div>
      </div>
    </div>

    <!-- 主内容区域：左右布局（情绪容器 + 呼吸气泡） -->
    <div class="hero">
      <!-- 左侧：情感文字区 -->
      <div class="emotion-section">
        <h1 class="hero-title">一次温暖的对话</h1>

        <!-- 打字机效果轮播（保留原有文案） -->
        <div class="typewriter-area">
          <div class="dynamic-quote">
            <span class="quote-prefix">🌊</span>
            <span id="typed-message">{{ typedText }}</span>
            <span class="cursor-blink">|</span>
          </div>
        </div>

        <div class="support-text">
          24小时在线的AI心理伙伴，懂你的欲言又止，接住你的所有情绪。
        </div>

        <!-- 呼吸感输入区（仪式感极简输入框） -->
        <div class="breathing-input-area">
          <div class="input-group">
            <input
              type="text"
              class="ritual-input"
              id="emotionInput"
              v-model="inputMessage"
              placeholder="迷 | 此刻，你想倾诉什么？"
              @keypress="handleInputKeypress"
              autocomplete="off"
            />
            <div class="input-footnote">
              <span class="enter-hint">⏎ 回车发送 — 让情绪自然流动</span>
            </div>
          </div>
        </div>

        <!-- 原有按钮组（弱化但保留功能） -->
        <div class="btn-group subtle-buttons">
          <button class="btn-primary" @click="goToChat">开始倾诉 →</button>
          <button class="btn-secondary" @click="goToMood">记录心情 <span class="hand-drawn-arrow">↗</span></button>
        </div>
      </div>

      <!-- 右侧：情绪气泡（metaball + 视差 + 随输入变色） -->
      <div class="visual-bubble parallax-bubble" id="bubbleContainer">
        <div class="bubble-wrapper">
          <div class="aura-glow"></div>
          <div class="mood-blob" id="moodBlob"></div>
          <div class="blob-inner"></div>
          <div class="floating-motes" ref="motesContainer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, onUnmounted } from 'vue'

const router = useRouter()

// 静态资源
const defaultAvatar = new URL('@/assets/images/users.png', import.meta.url).href

// 登录状态
const isLoggedIn = ref(false)
const userAvatar = ref('')
const showUserMenu = ref(false)
const showMobileNav = ref(false)

// 打字机效果
const typedText = ref('')
const phrases = [
  "感到焦虑时... 我陪你深呼吸 🌿",
  "失眠时... 我陪你数星星 ✨",
  "迷茫时... 我帮你理清思绪 🪶",
  "难过时... 给你一个柔软的拥抱 🫂",
  "疲惫时... 这里有盏灯为你亮着 🏮"
]
let phraseIndex = 0
let charIndex = 0
let isDeleting = false
let typingTimer = null

// 新输入框绑定值
const inputMessage = ref('')

// 右侧气泡元素（用于变色）
let moodBlob = null

// 浮游微尘容器
const motesContainer = ref(null)
const motes = ref([])

// ---------- 原有路由跳转逻辑 ----------
const goToChat = () => {
  router.push('/consultation')
}
const goToMood = () => {
  router.push('/emotional-diary')
}
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}
const goToPersonalCenter = () => {
  router.push('/personal-center')
  showUserMenu.value = false
}
const goToFeedback = () => {
  router.push('/feedback')
  showUserMenu.value = false
}
const goToContact = () => {
  router.push('/contact')
  showUserMenu.value = false
}
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  isLoggedIn.value = false
  userAvatar.value = ''
  showUserMenu.value = false
  showMobileNav.value = false
  router.push('/auth/login')
}

// 切换移动端导航
const toggleMobileNav = () => {
  showMobileNav.value = !showMobileNav.value
}

// ---------- 打字机效果 ----------
const typeEffect = () => {
  const currentPhrase = phrases[phraseIndex]
  if (!isDeleting && charIndex <= currentPhrase.length) {
    typedText.value = currentPhrase.substring(0, charIndex)
    charIndex++
    if (charIndex > currentPhrase.length) {
      isDeleting = true
      typingTimer = setTimeout(typeEffect, 2200)
      return
    }
    typingTimer = setTimeout(typeEffect, 70)
  } else if (isDeleting && charIndex >= 0) {
    typedText.value = currentPhrase.substring(0, charIndex)
    charIndex--
    if (charIndex === 0) {
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
      typingTimer = setTimeout(typeEffect, 400)
      return
    }
    typingTimer = setTimeout(typeEffect, 45)
  } else {
    typingTimer = setTimeout(typeEffect, 100)
  }
}

// ---------- 情绪气泡变色（根据输入关键词）----------
const colorMap = {
  '难过': ['#B5C9E6', '#8FACD6', '#6E8CB0'],
  '伤心': ['#B5C9E6', '#9BB0D4', '#7B98BC'],
  '焦虑': ['#D9C2A7', '#C7AE8C', '#B8956E'],
  '开心': ['#F9C28B', '#FAB27B', '#FF9F6E'],
  '快乐': ['#FFD699', '#FFC17A', '#FAA75E'],
  '孤独': ['#CBB5D9', '#B59FCC', '#A185B9'],
  '疲惫': ['#E7D2B5', '#DBBE99', '#CAAA7A'],
  '迷茫': ['#C2D9CE', '#AAC9BC', '#91B5A5']
}
const defaultGradient = ['rgba(255, 190, 140, 0.95)', 'rgba(255, 140, 100, 0.65)']

function updateBubbleColor(text) {
  if (!moodBlob) return
  let colors = defaultGradient
  for (let [key, val] of Object.entries(colorMap)) {
    if (text.includes(key)) {
      colors = val
      break
    }
  }
  if (text.length > 0 && !Object.keys(colorMap).some(k => text.includes(k))) {
    const warmth = Math.min(70, text.length * 2)
    colors = [`hsl(${28 + warmth}, 85%, 72%)`, `hsl(${18 + warmth * 0.5}, 80%, 62%)`]
  }
  const gradStyle = `radial-gradient(circle at 35% 35%, ${colors[0]}, ${colors[1]})`
  moodBlob.style.background = gradStyle

  // 同时调整外光晕颜色
  const aura = document.querySelector('.aura-glow')
  if (aura) {
    const accent = typeof colors[0] === 'string' ? colors[0].replace('0.95', '0.3') : 'rgba(255,190,130,0.25)'
    aura.style.background = `radial-gradient(circle, ${accent}, rgba(255,120,80,0) 70%)`
  }
}

// 输入框回车处理（发送消息，模拟倾诉跳转）
const handleInputKeypress = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    const msg = inputMessage.value.trim()
    if (msg) {
      // 给予轻柔视觉反馈（气泡脉冲）
      if (moodBlob) {
        moodBlob.style.transform = 'scale(1.05)'
        setTimeout(() => { if (moodBlob) moodBlob.style.transform = '' }, 200)
      }
      // 可携带消息跳转聊天页（也可仅控制台记录，按设计稿应进入安全空间）
      router.push('/consultation')
      console.log(`✨ 情绪流动: ${msg}`)
    } else {
      // 占位提示闪烁
      const inputEl = document.querySelector('.ritual-input')
      if (inputEl) {
        inputEl.placeholder = '💭 写下你的心事... 我在听'
        setTimeout(() => {
          if (inputEl) inputEl.placeholder = '迷 | 此刻，你想倾诉什么？'
        }, 1500)
      }
    }
  }
}

// ---------- Canvas 流动 Mesh Gradient 背景 ----------
let canvas = null
let ctx = null
let animationId = null
let bgTime = 0

function initCanvasBackground() {
  canvas = document.getElementById('canvas-bg')
  if (!canvas) return
  ctx = canvas.getContext('2d')
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()

  const drawMeshGradient = (t) => {
    if (!ctx || !canvas) return
    const w = canvas.width, h = canvas.height
    const grad1 = ctx.createLinearGradient(w * 0.2, h * 0.1, w * 0.8, h * 0.9)
    grad1.addColorStop(0, `hsl(${28 + Math.sin(t * 0.2) * 4}, 85%, 78%)`)
    grad1.addColorStop(0.4, `hsl(${48 + Math.cos(t * 0.25) * 3}, 78%, 80%)`)
    grad1.addColorStop(0.7, `hsl(${280 + Math.sin(t * 0.18) * 6}, 45%, 82%)`)
    grad1.addColorStop(1, `hsl(${30 + Math.sin(t * 0.3) * 3}, 70%, 88%)`)
    ctx.fillStyle = grad1
    ctx.fillRect(0, 0, w, h)

    const radGrad = ctx.createRadialGradient(
      w * 0.4 + Math.sin(t * 0.15) * w * 0.05,
      h * 0.5 + Math.cos(t * 0.2) * h * 0.05,
      w * 0.2,
      w * 0.6 + Math.cos(t * 0.1) * w * 0.07,
      h * 0.55 + Math.sin(t * 0.12) * h * 0.07,
      w * 0.6
    )
    radGrad.addColorStop(0, 'rgba(255, 200, 150, 0.35)')
    radGrad.addColorStop(0.6, 'rgba(190, 150, 200, 0.2)')
    radGrad.addColorStop(1, 'rgba(245, 230, 210, 0)')
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = radGrad
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
  }

  const animateBg = () => {
    bgTime += 0.012
    drawMeshGradient(bgTime)
    animationId = requestAnimationFrame(animateBg)
  }
  animateBg()
}

// ---------- 鼠标视差（气泡跟随）----------
let bubbleParallaxEl = null
function initParallax() {
  bubbleParallaxEl = document.querySelector('.parallax-bubble')
  if (!bubbleParallaxEl) return
  const handleMouseMove = (e) => {
    const xAxis = (window.innerWidth / 2 - e.clientX) / 45
    const yAxis = (window.innerHeight / 2 - e.clientY) / 45
    if (bubbleParallaxEl) {
      bubbleParallaxEl.style.transform = `translate(${-xAxis * 1.2}px, ${-yAxis * 1}px)`
    }
    // 标题超微移动
    const title = document.querySelector('.hero-title')
    if (title) {
      title.style.transform = `translate(${xAxis * 0.4}px, ${yAxis * 0.3}px)`
    }
  }
  document.addEventListener('mousemove', handleMouseMove)
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
  })
}

// ---------- 生命周期 ----------
onMounted(() => {
  // 登录状态检查
  isLoggedIn.value = localStorage.getItem('token') !== null
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo && storedUserInfo !== 'undefined' && storedUserInfo !== 'null') {
    try {
      const userInfo = JSON.parse(storedUserInfo)
      userAvatar.value = userInfo.avatar || defaultAvatar
    } catch (error) {
      userAvatar.value = defaultAvatar
    }
  } else if (isLoggedIn.value) {
    userAvatar.value = defaultAvatar
  }

  // 启动打字机
  typeEffect()

  // 初始化背景、气泡、粒子
  initCanvasBackground()
  moodBlob = document.getElementById('moodBlob')
  initParallax()

  // 监听输入框变化（用于气泡变色）
  const inputEl = document.getElementById('emotionInput')
  if (inputEl) {
    inputEl.addEventListener('input', (e) => {
      updateBubbleColor(e.target.value)
    })
  }

  // 点击全局关闭用户菜单
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-avatar') && !e.target.closest('.user-menu')) {
      showUserMenu.value = false
    }
  })
})

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer)
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', initCanvasBackground)
})
</script>

<style scoped lang="scss">
// 引入现代无衬线字体
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');

.home-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, -apple-system, 'SF Pro Display', sans-serif;
  background: #fdf8f0; /* fallback */
}

/* Canvas 流动背景 */
.canvas-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

/* 噪点纹理 (温润纸张感) */
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjU1IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wNCIgLz48L3N2Zz4=');
  background-repeat: repeat;
  opacity: 0.2;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
}

/* 毛玻璃导航栏（与原风格一致，微调透明度） */
.glass-nav {
  position: fixed;
  top: 24px;
  left: 32px;
  right: 32px;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 28px;
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 60px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  font-weight: 500;
}
.logo {
  font-family: 'Inter', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  background: white;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.nav-links {
  display: flex;
  gap: 30px;
  align-items: center;
}
.nav-link {
  color: black;
  text-decoration: none;
  transition: 0.2s;
  font-weight: 500;
  position: relative;
}
.nav-link:hover {
  color: #fff;
  text-shadow: 0 0 6px rgba(255, 200, 150, 0.4);
}
.nav-link--active {
  color: #e29b3d;
  font-weight: 900;
  font-size: 1.2rem;
}
.nav-link--active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #FFD8A9;
  border-radius: 2px;
}
.user-avatar img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 170, 0.5);
  cursor: pointer;
}
.user-menu {
  position: fixed;
  top: 80px;
  right: 40px;
  z-index: 21;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  padding: 8px 0;
  min-width: 160px;
}
.user-menu-item {
  padding: 10px 20px;
  color: black;
  cursor: pointer;
  transition: 0.2s;
}
.user-menu-item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* 移动端导航适配 */
.mobile-nav-toggle {
  display: none;
  cursor: pointer;
  color: black;
  font-size: 1.5rem;
}

.mobile-nav {
  display: none;
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 300px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 22;
  transition: right 0.3s ease;
  padding: 20px;
}

.mobile-nav--open {
  right: 0;
}

.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.mobile-nav-close {
  font-size: 1.5rem;
  cursor: pointer;
  color: rgba(255, 248, 235, 0.9);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-nav-link {
  color: black;
  text-decoration: none;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-nav-link--active {
  color: #272406;
  font-weight: 600;
}

/* 主内容布局 (打破均匀留白) */
.hero {
  position: relative;
  z-index: 10;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8% 0 10%;
  gap: 4px;
}
.emotion-section {
  flex: 0 0 52%;
  max-width: 620px;
  margin-top: -5vh; /* 创造张力，略微靠上 */
  animation: fadeSlideUp 0.9s ease forwards;
}
.hero-title {
  font-size: clamp(30px, 8vw, 80px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.05;
  background: linear-gradient(135deg, #2F241B 0%, #6B4E3A 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 2px 12px rgba(245, 185, 120, 0.2);
  margin-bottom: 24px;
}
.typewriter-area {
  margin: 30px 0 28px;
}
.dynamic-quote {
  font-size: 1.9rem;
  font-weight: 450;
  color: #5E3E2C;
  display: flex;
  align-items: baseline;
  gap: 8px;
  background: rgba(241, 250, 238, 0.35);
  backdrop-filter: blur(6px);
  padding: 8px 20px;
  border-radius: 60px;
  width: fit-content;
}
.quote-prefix {
  font-size: 2rem;
}
#typed-message {
  font-weight: 550;
  background: linear-gradient(120deg, #F09D7C, #E7B27D);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  border-right: 2px solid #E9A67A;
  padding-right: 6px;
}
.cursor-blink {
  animation: gentleBlink 1s step-end infinite;
}
@keyframes gentleBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.support-text {
  font-size: 1.2rem;
  line-height: 1.5;
  color: #5F4C3A;
  max-width: 85%;
  margin: 32px 0 36px;
  font-weight: 450;
  backdrop-filter: blur(3px);
  background: rgba(255, 245, 235, 0.3);
  padding: 6px 16px;
  border-radius: 50px;
  display: inline-block;
}

/* 呼吸输入区（仪式感） */
.breathing-input-area {
  margin-top: 20px;
  width: 100%;
  max-width: 520px;
}
.input-group {
  position: relative;
  width: 100%;
}
.ritual-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid rgba(110, 70, 50, 0.35);
  font-size: 1.45rem;
  padding: 16px 6px 12px 0;
  font-family: 'Inter', monospace;
  font-weight: 500;
  color: #2F241B;
  outline: none;
  transition: all 0.25s;
  caret-color: #FF8A5C;
}
.ritual-input:focus {
  border-bottom-color: #FF9F6E;
  box-shadow: 0 0 28px -6px rgba(255, 160, 100, 0.4);
}
.ritual-input::placeholder {
  color: #BE9E84;
  font-weight: 400;
  font-size: 1.2rem;
  opacity: 0.7;
}
.input-footnote {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  font-size: 0.8rem;
  color: #C3A084;
}
.enter-hint {
  background: rgba(245, 205, 170, 0.25);
  padding: 4px 12px;
  border-radius: 40px;
  backdrop-filter: blur(2px);
}

/* 按钮组（弱化但保留功能） */
.btn-group.subtle-buttons {
  margin-top: 32px;
  gap: 24px;
}
.btn-primary {
  background: rgba(249, 162, 108, 0.85);
  backdrop-filter: blur(4px);
  border: none;
  padding: 12px 28px;
  border-radius: 60px;
  font-size: 1rem;
  font-weight: 600;
  color: #2E241F;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 12px rgba(255, 110, 64, 0.2);
}
.btn-primary:hover {
  background: #FF8A6B;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 100, 50, 0.3);
}
.btn-secondary {
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: black;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 40px;
  transition: 0.2s;
}
.btn-secondary:hover {
  color: #FFE2BB;
  text-shadow: 0 0 4px rgba(255, 200, 150, 0.5);
}
.hand-drawn-arrow {
  display: inline-block;
  transition: transform 0.2s;
  font-size: 1.2rem;
}
.btn-secondary:hover .hand-drawn-arrow {
  transform: translateX(4px) rotate(3deg);
}

/* 右侧视觉区：情绪气泡 */
.visual-bubble {
  flex: 0 0 38%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  pointer-events: none;
  min-height: 450px;
}
.bubble-wrapper {
  position: relative;
  width: 100%;
  max-width: 440px;
  aspect-ratio: 1 / 1;
  filter: drop-shadow(0 20px 35px rgba(0, 0, 0, 0.1));
}
.aura-glow {
  position: absolute;
  width: 130%;
  height: 130%;
  top: -15%;
  left: -15%;
  background: radial-gradient(circle, rgba(255, 190, 130, 0.25), rgba(255, 120, 80, 0) 70%);
  border-radius: 50%;
  filter: blur(28px);
  animation: breatheAura 9s infinite ease-in-out;
}
.mood-blob {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 35% 35%, rgba(255, 190, 140, 0.95), rgba(255, 140, 100, 0.65));
  border-radius: 55% 45% 60% 40% / 45% 55% 45% 55%;
  filter: blur(12px);
  mix-blend-mode: screen;
  animation: blobBreathing 8s infinite alternate ease-in-out;
  transition: background 0.6s cubic-bezier(0.2, 0.8, 0.4, 1);
  box-shadow: 0 0 60px rgba(255, 130, 80, 0.4);
}
.blob-inner {
  position: absolute;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 245, 210, 0.6), rgba(255, 200, 140, 0.2));
  border-radius: 50% 50% 45% 55% / 55% 45% 60% 40%;
  filter: blur(6px);
  mix-blend-mode: overlay;
}
.floating-motes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}
.mote {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  animation: moteDrift 12s infinite alternate;
}

/* 动画 */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes blobBreathing {
  0% { border-radius: 55% 45% 60% 40% / 45% 55% 45% 55%; transform: scale(1); filter: blur(12px); }
  50% { border-radius: 40% 60% 35% 65% / 60% 40% 60% 40%; transform: scale(1.02); filter: blur(14px); }
  100% { border-radius: 58% 42% 52% 48% / 38% 62% 38% 62%; transform: scale(0.99); filter: blur(13px); }
}
@keyframes breatheAura {
  0% { opacity: 0.2; transform: scale(0.95); }
  100% { opacity: 0.55; transform: scale(1.1); }
}
@keyframes moteDrift {
  0% { transform: translateY(0) translateX(0); opacity: 0.2; }
  100% { transform: translateY(-15px) translateX(10px); opacity: 0.7; }
}
@keyframes moteDriftReverse {
  0% { transform: translateY(0) translateX(0); opacity: 0.2; }
  100% { transform: translateY(15px) translateX(-10px); opacity: 0.7; }
}
.parallax-bubble {
  transition: transform 0.1s cubic-bezier(0.1, 0.7, 0.3, 1);
  will-change: transform;
}
/* 响应式 */
@media (max-width: 1024px) {
  .hero {
    flex-direction: column;
    padding: 12vh 6% 10vh;
  }
  .emotion-section {
    flex: auto;
    width: 100%;
    margin-top: 0;
  }
  .visual-bubble {
    width: 70%;
  }
}

@media (max-width: 768px) {
  /* 导航栏适配 */
  .nav-links {
    display: none;
  }
  .mobile-nav-toggle {
    display: block;
  }
  .mobile-nav {
    display: block;
  }
  .glass-nav {
    left: 16px;
    right: 16px;
    padding: 10px 20px;
  }
  .logo {
    font-size: 1.2rem;
  }
  
  /* 主内容适配 */
  .hero {
    padding: 10vh 4% 8vh;
    gap: 30px;
  }
  .hero-title {
    font-size: 48px;
    margin-bottom: 20px;
  }
  .dynamic-quote {
    font-size: 1.4rem;
    padding: 6px 16px;
  }
  .support-text {
    font-size: 1.1rem;
    margin: 24px 0 30px;
    max-width: 100%;
  }
  .breathing-input-area {
    max-width: 100%;
  }
  .ritual-input {
    font-size: 1.2rem;
    padding: 14px 6px 10px 0;
  }
  .visual-bubble {
    width: 80%;
    min-height: 350px;
  }
  .bubble-wrapper {
    max-width: 350px;
  }
  .btn-group.subtle-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .btn-primary, .btn-secondary {
    text-align: center;
    justify-content: center;
  }
  .user-menu {
    top: 70px;
    right: 20px;
  }
}

@media (max-width: 480px) {
  .hero-title { font-size: 36px; }
  .dynamic-quote { font-size: 1.2rem; }
  .ritual-input { font-size: 1.1rem; }
  .visual-bubble { width: 90%; min-height: 300px; }
  .bubble-wrapper { max-width: 300px; }
  .support-text { font-size: 1rem; }
  .glass-nav {
    padding: 8px 16px;
  }
  .logo {
    font-size: 1rem;
  }
  .user-avatar img {
    width: 30px;
    height: 30px;
  }
}
</style>