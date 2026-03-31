<template>
  <div class="home-container">
    <!-- 背景视频 -->
    <video class="background-video" autoplay muted loop preload="auto">
      <source :src="videoSource" type="video/mp4">
    </video>
    
    <div class="content">
      <div class="text-section">
        <div class="title-group">
          <h1 class="main-title">一次温暖的对话</h1>
          <h2 class="sub-title">
            <span class="highlight-text">化孤独为慰藉</span>
          </h2>
        </div>
        
        <p class="description">
          每个深夜与焦虑时刻，我们都在这里陪你。不必独自承受，让温暖触达心底。
        </p>
        
        <div class="hero-actions">
          <el-button class="btn btn--primary" @click="goToChat">
            开始倾诉，获得陪伴
          </el-button>
          <el-button class="btn btn--secondary" @click="goToMood">
            记录心情，释放感情
          </el-button>
        </div>
      </div>
      <div class="visual-section">
        <div class="robot-wrapper">
          <img v-lazy="robotImage" class="robot-img" alt="心理健康AI助手" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const robotImage = new URL('@/assets/images/robot-fill.png', import.meta.url).href
const videoSource = new URL('@/assets/videos/preview.mp4', import.meta.url).href

// 跳转聊天页
const goToChat = () => {
  router.push('/consultation')
}

// 跳转心情页
const goToMood = () => {
  router.push('/emotional-diary')
}
</script>

<style scoped lang="scss">
// ======================
// 严格落地色彩规范
// 主色HSL范围：H:170-180, S:30-40%, L:45-55%
// 暖黄色仅用于核心高亮，严格限制使用频次
// ======================
$primary-color: hsl(172, 35%, 48%); // 标准主色：#3F998B，完全符合HSL范围
$primary-hover: hsl(172, 35%, 42%); // hover态：同色系加深
$primary-dark: hsl(172, 35%, 28%); // 深调：用于蒙层
$primary-light: hsl(172, 35%, 58%); // 浅调：用于弱高亮
$warm-yellow: hsl(42, 75%, 68%); // 低饱和暖黄：仅用于核心slogan高亮，仅此一处使用
$text-white: #FFFFFF;
$text-white-soft: rgba(255, 255, 255, 0.95);
$transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

.home-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  margin-top: -72px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $primary-color;

  // 背景视频
  .background-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  // 同色系渐变蒙层，统一色彩调性
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, hsla(172, 35%, 28%, 0.85), hsla(172, 35%, 28%, 0.75));
    z-index: 0;
  }

  .content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1280px;
    padding-top: 72px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;

    // 左侧文案区：留白优化核心区
    .text-section {
      flex: 1;
      max-width: 600px;
      padding-top: 40px; // 【需求落地】顶部新增40px留白

      .title-group {
        margin-bottom: 24px; // 【需求落地】标题组与正文间距提升至24px
        
        .main-title {
          margin: 0 0 24px 0; // 【需求落地】主副标题间距从16px提升至24px
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          color: $text-white;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .sub-title {
          margin: 0;
          font-size: 2.8rem;
          font-weight: 700;
          line-height: 1.2;
          
          // 【色彩规范】暖黄色仅此一处使用，严格限制频次
          .highlight-text {
            color: $warm-yellow;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
        }
      }

      .description {
        margin: 0 0 32px 0; // 【需求落地】正文与按钮组间距提升，增加呼吸感
        color: $text-white-soft;
        font-size: 1.125rem;
        line-height: 1.7;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .hero-actions {
        display: flex;
        gap: 1.25rem;
        flex-wrap: wrap;

        .btn {
          padding: 0.875rem 2rem;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 12px;
          border: none;
          transition: $transition-normal;
          cursor: pointer;

          // 主按钮：主色系，无暖黄撞色
          &--primary {
            background-color: $text-white;
            color: $primary-color;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

            &:hover {
              background-color: #F5F7FA;
              transform: translateY(-3px);
              box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
            }
            
            &:active {
              transform: translateY(-1px);
            }
          }

          // 次按钮：同色系半透，无暖黄撞色
          &--secondary {
            color: $text-white;
            background-color: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);

            &:hover {
              background-color: rgba(255, 255, 255, 0.25);
              border-color: $text-white;
              transform: translateY(-3px);
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            }
            
            &:active {
              transform: translateY(-1px);
            }
          }
        }
      }
    }

    // 右侧视觉区：主色系统一，无暖黄撞色
    .visual-section {
      flex-shrink: 0;
      
      .robot-wrapper {
        width: 280px;
        height: 280px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.06) 100%);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.35);
        backdrop-filter: blur(12px);
        display: flex;
        justify-content: center;
        align-items: center;
        animation: breathe 4s ease-in-out infinite;

        .robot-img {
          width: 190px;
          height: 190px;
          transition: $transition-normal;
          animation: float 6s ease-in-out infinite;
        }
      }
    }
  }
}

// 动画
@keyframes breathe {
  0%, 100% {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }
  50% {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

// 响应式适配
@media (max-width: 992px) {
  .home-container {
    padding: 3rem 1.5rem;
    
    .content {
      flex-direction: column;
      gap: 3rem;
      text-align: center;
      
      .text-section {
        max-width: 100%;
        padding-top: 0; // 移动端取消顶部留白，避免空间浪费
        
        .hero-actions {
          justify-content: center;
        }
      }
      
      .visual-section {
        .robot-wrapper {
          width: 240px;
          height: 240px;
          
          .robot-img {
            width: 160px;
            height: 160px;
          }
        }
      }
    }
  }
}

@media (max-width: 576px) {
  .home-container {
    padding: 2rem 1rem;
    
    .content {
      .text-section {
        .title-group {
          .main-title {
            font-size: 2.5rem;
            margin-bottom: 20px; // 移动端适配间距
          }
          
          .sub-title {
            font-size: 2rem;
          }
        }
        
        .description {
          font-size: 1rem;
        }
        
        .hero-actions {
          flex-direction: column;
          
          .btn {
            width: 100%;
          }
        }
      }
      
      .visual-section {
        .robot-wrapper {
          width: 200px;
          height: 200px;
          
          .robot-img {
            width: 130px;
            height: 130px;
          }
        }
      }
    }
  }
}
</style>