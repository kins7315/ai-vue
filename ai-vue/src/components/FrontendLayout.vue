<template>
    <div class="frontend-layout">
        <!-- 导航栏外层：玻璃态核心容器 -->
        <header 
            class="navbar-wrapper" 
            :class="{ 
                'navbar-wrapper--home': isHomePage, 
                'navbar-wrapper--scrolled': isScrolled 
            }"
        >
            <div class="navbar-container">
                <div class="brand-section" @click="router.push('/')">
                    <el-image 
                        :src="robotImage" 
                        class="brand-logo" 
                        alt="心理健康AI助手logo" 
                        fit="cover"
                    />
                    <h1 class="brand-name" :class="{ 'brand-name--home': isHomePage }">
                        心理健康AI助手
                    </h1>
                </div>
                <nav class="nav-section">
                    <router-link 
                        v-for="route in navRoutes" 
                        :key="route.path"
                        :to="route.path" 
                        class="nav-link" 
                        :class="{ 
                            'nav-link--active': isActiveRoute(route.path),
                            'nav-link--home': isHomePage
                        }"
                        v-if="!route.requireLogin || isLogin"
                    >
                        {{ route.name }}
                    </router-link>
                    <!-- 未登录：登录/注册 -->
                    <template v-if="!isLogin">
                        <router-link 
                            to="/auth/login" 
                            class="nav-link" 
                            :class="{ 'nav-link--home': isHomePage }"
                        >
                            登录
                        </router-link>
                        <router-link to="/auth/register" class="nav-link nav-link--primary">
                            注册
                        </router-link>
                    </template>

                    <!-- 已登录：退出登录 -->
                    <el-button 
                        v-else
                        class="logout-btn" 
                        :class="{ 'logout-btn--home': isHomePage }"
                        text
                        @click="handleLogout"
                    >
                        退出登录
                    </el-button>
                </nav>

                <!-- 用户信息区（已登录） -->
                <div v-if="isLogin" class="user-section">
                    <el-dropdown class="user-dropdown" @command="handleCommand">
                        <div class="user-avatar-wrapper">
                            <el-image 
                                :src="userImage" 
                                class="user-avatar" 
                                alt="用户头像" 
                                fit="cover"
                            />
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu class="user-dropdown-menu">
                                <el-dropdown-item icon="User" command="personal-center">个人中心</el-dropdown-item>
                                <el-dropdown-item icon="Service" command="feedback">意见与反馈</el-dropdown-item>
                                <el-dropdown-item icon="Connection" command="contact">联系作者</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </header>

        <!-- 主内容区 -->
        <main class="main-container">
            <router-view></router-view>
        </main>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { logout } from '../api/admin'

const router = useRouter()
const route = useRoute()

// 静态资源
const robotImage = new URL('@/assets/images/机器人.png', import.meta.url).href
const userImage = new URL('@/assets/images/users.png', import.meta.url).href

// 状态
const isLogin = ref(false)
const userInfo = ref(null)
const isScrolled = ref(false)

// 导航路由配置
const navRoutes = [
    { path: '/', name: '首页', requireLogin: false },
    { path: '/consultation', name: '咨询', requireLogin: true },
    { path: '/emotional-diary', name: '情绪日记', requireLogin: true },
    { path: '/knowledge', name: '知识库', requireLogin: false }
]

// 计算：是否为首页
const isHomePage = computed(() => {
    return route.path === '/'
})

// 计算当前路由是否激活
const isActiveRoute = (path) => {
    if (path === '/') {
        return route.path === '/'
    }
    return route.path.startsWith(path)
}

// 下拉菜单命令处理
const handleCommand = (command) => {
    const commandMap = {
        'personal-center': '/personal-center',
        'feedback': '/feedback',
        'contact': '/contact'
    }
    if (commandMap[command]) {
        router.push(commandMap[command])
    }
}

// 退出登录
const handleLogout = () => {
    logout().then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        isLogin.value = false
        userInfo.value = null
        router.push('/auth/login')
    })
}

// 监听页面滚动
const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
}

// 生命周期
onMounted(() => {
    isLogin.value = localStorage.getItem('token') !== null
    const storedUserInfo = localStorage.getItem('userInfo')
    userInfo.value = storedUserInfo ? JSON.parse(storedUserInfo) : null
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
// 与首页完全统一的色彩规范
$primary-color: hsl(172, 35%, 48%);
$primary-hover: hsl(172, 35%, 42%);
$primary-dark: hsl(172, 35%, 28%);
$primary-light: hsl(172, 35%, 58%);
$text-primary: #333333;
$text-secondary: #4B5563;
$text-white: #FFFFFF;
$text-white-soft: rgba(255, 255, 255, 0.9);
$bg-white: #FFFFFF;
$bg-hover: #F5F7F9;
$transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

.frontend-layout {
    min-height: 100vh;
    background-color: #F8FAFB;

    // 玻璃态导航核心样式
    .navbar-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
        height: 72px;
        transition: $transition-normal;
        background-color: $bg-white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        // 首页专属：透明玻璃态，同色系蒙层
        &--home {
            background-color: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: none;

            // 滚动后：同色系加深背景，无暖黄
            &.navbar-wrapper--scrolled {
                background-color: hsla(172, 35%, 28%, 0.7);
                border-bottom-color: rgba(255, 255, 255, 0.15);
            }
        }

        .navbar-container {
            max-width: 1280px;
            height: 100%;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    // 品牌区
    .brand-section {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        transition: $transition-normal;

        &:hover {
            opacity: 0.85;
        }

        .brand-logo {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background-color: $bg-hover;
            overflow: hidden;
        }

        .brand-name {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: $text-primary;
            letter-spacing: 0.5px;
            transition: $transition-normal;

            &--home {
                color: $text-white;
            }
        }
    }

    // 导航区：移除所有暖黄色，统一主色系
    .nav-section {
        display: flex;
        align-items: center;
        gap: 32px;

        .nav-link {
            position: relative;
            color: $text-secondary;
            font-size: 16px;
            font-weight: 500;
            text-decoration: none;
            transition: $transition-normal;
            padding: 6px 0;

            // hover态：主色系，无暖黄
            &:hover {
                color: $primary-color;
            }

            // 首页文字：白色，hover主色系浅调
            &--home {
                color: $text-white-soft;

                &:hover {
                    color: $primary-light;
                }
            }

            // 激活态：主色系，无暖黄
            &--active {
                color: $primary-color;
                font-weight: 600;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: linear-gradient(90deg, $primary-color, $primary-light);
                    border-radius: 2px;
                }

                // 首页激活态：白色，更亮更突出
                &.nav-link--home {
                    color: $text-white;

                    &::after {
                        background: $text-white;
                    }
                }
            }

            // 注册按钮：主色系，无暖黄
            &--primary {
                padding: 8px 20px;
                background-color: $primary-color;
                color: $text-white !important;
                border-radius: 8px;

                &:hover {
                    background-color: $primary-hover;
                    transform: translateY(-1px);
                }
            }
        }

        // 退出登录按钮：主色系，无暖黄
        .logout-btn {
            color: $text-secondary;
            font-size: 16px;
            padding: 6px 12px;
            border-radius: 6px;

            &:hover {
                color: $primary-color;
                background-color: $bg-hover;
            }

            &--home {
                color: $text-white-soft;

                &:hover {
                    color: $primary-light;
                    background-color: rgba(255, 255, 255, 0.1);
                }
            }
        }
    }

    // 用户信息区
    .user-section {
        .user-avatar-wrapper {
            padding: 2px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            transition: $transition-normal;
            cursor: pointer;

            &:hover {
                background-color: rgba(255, 255, 255, 0.2);
                transform: scale(1.05);
            }

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: $text-secondary;
                overflow: hidden;
            }
        }
    }

    // 主内容区
    .main-container {
        padding-top: 72px;
        min-height: calc(100vh - 72px);
    }
}

// 全局下拉菜单样式
:deep(.user-dropdown-menu) {
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
</style>