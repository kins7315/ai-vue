<template>
  <div class="psychological-assessment">
    <div class="blur-overlay"></div>
    <div class="card-wrapper" id="appRoot">
      <!-- 初始欢迎界面 -->
      <div id="welcomeScreen" class="glass-card text-center" style="padding: 60px 28px;">
        <h2 style="color: #3d6845; margin-bottom: 16px;">🌱 心理状态初筛</h2>
        <p style="color: #638b6b; margin-bottom: 48px;">10道温暖题目 · 倾听内心的声音</p>
        <button id="startBtn" style="background:#86b38f; border:none; padding:14px 42px; border-radius:60px; color:white; font-size:1.1rem; font-weight:bold; cursor:pointer;" @click="startQuiz">✨ 开始测评</button>
        <footer>匿名评估 · 仅用于自我关怀</footer>
      </div>

      <!-- 答题界面 -->
      <div id="quizScreen" class="hidden">
        <div class="glass-card">
          <div class="progress-section">
            <div class="progress-meta">
              <span>🌸 心灵里程</span>
              <span id="questionCounter">第 {{ currentIndex + 1 }} / 10 题</span>
            </div>
            <div class="progress-bar-bg">
              <div id="progressFill" class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
          <div class="question-area">
            <div class="question-title" id="questionText" v-if="currentQuestion">{{ currentQuestion.title }}</div>
            <div class="question-title" id="questionText" v-else>加载中...</div>
            <div class="options-row" id="optionsContainer" v-if="currentQuestion">
              <button 
                v-for="option in currentQuestion.options" 
                :key="option"
                class="opt-btn"
                :class="{ selected: answers[currentQuestion.id] === option }"
                @click="selectOption(option)"
              >
                {{ option }}
              </button>
            </div>
            <div class="options-row" id="optionsContainer" v-else>
              <!-- 加载中 -->
            </div>
            <div id="errorMsgArea" class="warning-toast hidden" v-if="errorMsg">{{ errorMsg }}</div>
          </div>
          <div class="nav-buttons">
            <button id="prevBtn" class="nav-btn" @click="goPrev">◀ 上一题</button>
            <button 
              id="nextSubmitBtn" 
              class="nav-btn primary" 
              :class="{ disabled: !canSubmit }"
              @click="goNextOrSubmit"
              :disabled="!canSubmit"
            >
              {{ isLastQuestion ? '📬 提交评估' : '下一题 ▶' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 结果界面 -->
      <div id="resultScreen" class="hidden">
        <div class="result-container">
          <h2 style="color:#366e42; text-align:center; margin-bottom: 8px;">📊 心晴报告</h2>
          <div class="dashboard-stats" id="statsDashboard">
            <div class="stat-card"><strong>综合分</strong><br>{{ report.totalScore }}/40</div>
            <div class="stat-card"><strong>压力值</strong><br>{{ report.pressure }}</div>
            <div class="stat-card"><strong>愉悦度</strong><br>{{ report.joy }}</div>
          </div>
          <div class="radar-box">
            <canvas id="radarCanvas" width="300" height="300"></canvas>
          </div>
          <div id="aiSuggestion" class="ai-message">🤍 AI 关怀建议<br>{{ report.suggestion }}</div>
          <button id="homeFromResult" class="home-button" @click="resetToHome">🏠 进入主页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 状态变量
const questions = ref([]);              // 从后端获取的题目
const currentIndex = ref(0);            // 0-9
const answers = ref({});                // { questionId: "选项文字" }
const errorMsg = ref('');
const isLoading = ref(false);
const report = ref({
  totalScore: 0,
  pressure: 0,
  anxiety: 0,
  joy: 0,
  suggestion: '',
  radar: {
    labels: ["压力指数", "焦虑倾向", "愉悦活力"],
    values: [0, 0, 0]
  }
});

// 计算属性
const currentQuestion = computed(() => {
  return questions.value[currentIndex.value];
});

const isLastQuestion = computed(() => {
  return currentIndex.value === 9;
});

const answeredCount = computed(() => {
  return Object.keys(answers.value).length;
});

const progressPercent = computed(() => {
  return (answeredCount.value / questions.value.length) * 100;
});

const canSubmit = computed(() => {
  if (isLastQuestion.value && questions.value.length > 0) {
    const lastQid = questions.value[9].id;
    return !!answers.value[lastQid];
  }
  return true;
});

// 获取题目
async function fetchQuestions() {
  try {
    isLoading.value = true;
    // 使用静态题目数据，不依赖后端
    const staticQuestions = [
      { id: 1, title: '最近一周，我感到情绪低落或沮丧', options: ['从不', '很少', '有时', '经常', '总是'] },
      { id: 2, title: '我对平时感兴趣的事情失去了兴趣', options: ['从不', '很少', '有时', '经常', '总是'] },
      { id: 3, title: '我感到疲倦或缺乏精力', options: ['从不', '很少', '有时', '经常', '总是'] },
      { id: 4, title: '我难以集中注意力或做出决定', options: ['从不', '很少', '有时', '经常', '总是'] },
      { id: 5, title: '我感到焦虑或紧张', options: ['从不', '很少', '有时', '经常', '总是'] },
      { id: 6, title: '我睡眠质量不好（难以入睡或早醒）', options: ['从不', '很少', '有时', '经常', '总是'] },
      { id: 7, title: '我感到生活没有希望', options: ['从不', '很少', '有时', '经常', '总是'] },
      { id: 8, title: '我感到自己没有价值', options: ['从不', '很少', '有时', '经常', '总是'] },
      { id: 9, title: '我感到压力很大', options: ['从不', '很少', '有时', '经常', '总是'] },
      { id: 10, title: '我感到孤独或与他人隔离', options: ['从不', '很少', '有时', '经常', '总是'] }
    ];
    questions.value = staticQuestions;
    return true;
  } catch (error) {
    console.error('获取题目失败:', error);
    showErrorToast('加载题目失败');
    return false;
  } finally {
    isLoading.value = false;
  }
}

// 辅助函数
function showErrorToast(msg) {
  errorMsg.value = msg;
  // 震动卡片
  const cardElem = document.querySelector('.glass-card');
  if(cardElem) {
    cardElem.classList.add('shake-card');
    setTimeout(() => cardElem.classList.remove('shake-card'), 400);
  }
  setTimeout(() => {
    if(errorMsg.value === msg) errorMsg.value = '';
  }, 1800);
}

function clearError() {
  errorMsg.value = '';
}

// 选择选项
function selectOption(option) {
  if (currentQuestion.value) {
    answers.value[currentQuestion.value.id] = option;
    clearError();
  }
}

// 上一题
function goPrev() {
  if(currentIndex.value > 0) {
    currentIndex.value--;
    clearError();
  }
}

// 下一题逻辑 + 防呆
function goNextOrSubmit() {
  const currentQ = currentQuestion.value;
  if (!currentQ) {
    return;
  }
  const hasAnswered = answers.value[currentQ.id];
  if(!hasAnswered) {
    showErrorToast("✨ 请先选择一个选项再继续");
    return;
  }
  clearError();
  // 如果是最后一题 -> 提交
  if(currentIndex.value === 9) {
    submitAssessment();
    return;
  }
  // 否则切换到下一题
  if(currentIndex.value < 9) {
    currentIndex.value++;
  }
}

// 提交并跳转结果
async function submitAssessment() {
  // 完整性校验 (再次确保10题全)
  for(let i=0; i<questions.value.length; i++) {
    const qid = questions.value[i].id;
    if(!answers.value[qid]) {
      currentIndex.value = i;
      showErrorToast(`还有未答题目，已自动跳转至第${i+1}题`);
      return;
    }
  }
  // 显示加载状态（简单禁用按钮+文字）
  isLoading.value = true;
  try {
    // 使用静态结果数据，不依赖后端
    // 根据用户选择的选项计算得分（示例逻辑）
    const optionScores = { '从不': 1, '很少': 2, '有时': 3, '经常': 4, '总是': 5 };
    let totalScore = 0;
    let pressureScore = 0;
    let anxietyScore = 0;
    let joyScore = 0;
    
    // 计算各维度得分
    Object.values(answers.value).forEach(option => {
      const score = optionScores[option] || 3;
      totalScore += score;
    });
    
    // 模拟生成结果数据
    pressureScore = Math.min(100, Math.round((totalScore / 50) * 100));
    anxietyScore = Math.min(100, Math.round((totalScore / 50) * 80 + Math.random() * 20));
    joyScore = Math.max(0, Math.round(100 - (totalScore / 50) * 70 + Math.random() * 10));
    
    // 生成建议
    let suggestion = '';
    if (totalScore < 20) {
      suggestion = '你的心理状态非常健康！继续保持积极的生活态度，享受每一天的美好时光。';
    } else if (totalScore < 30) {
      suggestion = '你的心理状态良好，但可以适当关注自己的情绪变化。建议多参加户外活动，保持规律作息。';
    } else {
      suggestion = '你可能面临一些心理压力，建议适当放松自己，寻求朋友或专业人士的支持。';
    }
    
    // 设置静态报告数据
    report.value = {
      totalScore: totalScore,
      pressure: pressureScore,
      anxiety: anxietyScore,
      joy: joyScore,
      suggestion: suggestion,
      radar: {
        labels: ["压力指数", "焦虑倾向", "愉悦活力"],
        values: [pressureScore, anxietyScore, joyScore]
      }
    };
    
    // 展示结果页
    showResultPage();
  } catch(err) {
    console.error('提交答案失败:', err);
    showErrorToast('处理结果失败');
  } finally {
    isLoading.value = false;
  }
}

// 结果渲染 + 雷达图 + 仪表盘
function showResultPage() {
  document.getElementById('quizScreen').classList.add('hidden');
  document.getElementById('welcomeScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.remove('hidden');
  
  // 绘制雷达图
  setTimeout(() => {
    drawRadar();
  }, 100);
}

function drawRadar() {
  const canvas = document.getElementById('radarCanvas');
  const labels = report.value.radar.labels;
  const values = report.value.radar.values;
  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;
  let size = Math.min(container.clientWidth, 260);
  canvas.width = size;
  canvas.height = size;
  const centerX = size/2, centerY = size/2, radius = size * 0.33;
  const angles = labels.map((_, idx) => (idx * 2 * Math.PI / labels.length) - Math.PI/2);
  
  ctx.clearRect(0, 0, size, size);
  // 画网格
  for(let level=1; level<=4; level++) {
    ctx.beginPath();
    let r = (radius/4)*level;
    for(let i=0; i<labels.length; i++) {
      let x = centerX + r * Math.cos(angles[i]);
      let y = centerY + r * Math.sin(angles[i]);
      if(i===0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#cbdcca";
    ctx.stroke();
  }
  // 轴线与标签
  for(let i=0; i<labels.length; i++) {
    let xEnd = centerX + radius * Math.cos(angles[i]);
    let yEnd = centerY + radius * Math.sin(angles[i]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(xEnd, yEnd);
    ctx.strokeStyle = "#bdd6b4";
    ctx.stroke();
    let labelX = centerX + (radius+16) * Math.cos(angles[i]);
    let labelY = centerY + (radius+12) * Math.sin(angles[i]);
    ctx.fillStyle = "#4c6e4a";
    ctx.font = "11px 'Segoe UI'";
    ctx.fillText(labels[i], labelX-12, labelY-4);
  }
  // 绘制数据区域
  ctx.beginPath();
  for(let i=0; i<labels.length; i++) {
    let valueNorm = values[i]/100;
    let rData = radius * valueNorm;
    let x = centerX + rData * Math.cos(angles[i]);
    let y = centerY + rData * Math.sin(angles[i]);
    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(150, 190, 140, 0.5)";
  ctx.fill();
  ctx.strokeStyle = "#6f9a75";
  ctx.lineWidth = 2;
  ctx.stroke();
  for(let i=0; i<labels.length; i++) {
    let valueNorm = values[i]/100;
    let rData = radius * valueNorm;
    let x = centerX + rData * Math.cos(angles[i]);
    let y = centerY + rData * Math.sin(angles[i]);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2*Math.PI);
    ctx.fillStyle = "#56855f";
    ctx.fill();
  }
}

// 重置全部状态，返回主页
function resetToHome() {
  currentIndex.value = 0;
  answers.value = {};
  questions.value = [];
  errorMsg.value = '';
  document.getElementById('welcomeScreen').classList.remove('hidden');
  document.getElementById('quizScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.add('hidden');
  clearError();
}

// 开始答题
async function startQuiz() {
  // 先获取题目
  const success = await fetchQuestions();
  if (success) {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    document.getElementById('resultScreen').classList.add('hidden');
    currentIndex.value = 0;
    answers.value = {};
    clearError();
  }
}

// 生命周期
onMounted(() => {
  // 初始化页面
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, 'Segoe UI', 'Quicksand', 'Poppins', sans-serif;
}

.psychological-assessment {
  min-height: 100vh;
  background: linear-gradient(145deg, #d4e2d4 0%, #c2d9cf 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

/* 沉浸式模糊背景 */
.blur-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background: rgba(235, 245, 235, 0.3);
  z-index: 0;
}

/* 主卡片容器 */
.card-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 620px;
  margin: 20px auto;
}

/* 治愈卡片 */
.glass-card {
  background: rgba(255, 255, 250, 0.94);
  backdrop-filter: blur(4px);
  border-radius: 56px;
  box-shadow: 0 30px 45px rgba(80, 100, 70, 0.15), 0 0 0 1px rgba(255,255,235,0.6);
  padding: 32px 28px 42px;
  transition: all 0.2s ease;
}

/* 进度区域 */
.progress-section {
  margin-bottom: 28px;
}
.progress-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #6c7e6a;
  margin-bottom: 8px;
  font-weight: 500;
}
.progress-bar-bg {
  background: #e2ece2;
  border-radius: 30px;
  height: 8px;
  overflow: hidden;
}
.progress-fill {
  background: #8bbf92;
  width: 0%;
  height: 100%;
  border-radius: 30px;
  transition: width 0.3s ease;
}

/* 题目区 */
.question-area {
  margin: 28px 0 32px;
}
.question-title {
  font-size: 1.7rem;
  font-weight: 600;
  color: #2a4932;
  line-height: 1.35;
  margin-bottom: 36px;
}

/* 选项组 — 李克特5级 */
.options-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
}
.opt-btn {
  flex: 1;
  min-width: 68px;
  background: #fffcf3;
  border: 1px solid #d4e2d0;
  border-radius: 60px;
  padding: 12px 6px;
  font-weight: 500;
  font-size: 0.85rem;
  color: #47664e;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}
.opt-btn:hover {
  background: #f0f8ea;
  transform: scale(0.96);
}
.opt-btn.selected {
  background: #a5cfaf;
  border-color: #5e8f6a;
  color: white;
  transform: scale(1.02);
  box-shadow: 0 8px 18px rgba(100, 140, 110, 0.3);
}

/* 提示震动 */
.shake-card {
  animation: shakeAnim 0.4s ease-in-out;
}
@keyframes shakeAnim {
  0% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
  100% { transform: translateX(0); }
}
.warning-toast {
  color: #dc7a5a;
  background: #fff1e6;
  padding: 8px 14px;
  border-radius: 40px;
  display: inline-block;
  width: auto;
  font-size: 0.8rem;
  margin-top: 16px;
  text-align: center;
}

/* 按钮组 */
.nav-buttons {
  display: flex;
  gap: 16px;
  margin-top: 28px;
}
.nav-btn {
  flex: 1;
  background: #eef3e8;
  border: none;
  padding: 12px 20px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  color: #517a5a;
  cursor: pointer;
  transition: 0.2s;
}
.nav-btn.primary {
  background: #86b38f;
  color: white;
  box-shadow: 0 4px 10px rgba(90, 120, 80, 0.2);
}
.nav-btn.primary.disabled {
  background: #c2d9c5;
  color: #eef3e3;
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.7;
}
.nav-btn:active { transform: scale(0.97); }

/* 结果页 */
.result-container {
  background: rgba(255, 255, 250, 0.97);
  border-radius: 56px;
  padding: 28px 24px 38px;
}
.radar-box {
  display: flex;
  justify-content: center;
  margin: 20px 0 20px;
}
canvas {
  background: #fefef7;
  border-radius: 40px;
  padding: 12px;
  max-width: 280px;
  width: 100%;
  height: auto;
}
.dashboard-stats {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 20px 0 12px;
}
.stat-card {
  background: #f5faf0;
  border-radius: 32px;
  padding: 12px 16px;
  text-align: center;
  flex: 1;
}
.ai-message {
  background: #ecf5e6;
  border-radius: 32px;
  padding: 20px 24px;
  margin: 24px 0 20px;
  border-left: 6px solid #9bc0a3;
  font-size: 0.96rem;
  line-height: 1.45;
  color: #2c4d35;
}
.home-button {
  width: 100%;
  background: #86b38f;
  border: none;
  padding: 14px;
  border-radius: 60px;
  font-size: 1.05rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  margin-top: 8px;
}
.hidden {
  display: none;
}
.text-center {
  text-align: center;
}
footer {
  font-size: 11px;
  text-align: center;
  margin-top: 24px;
  color: #95b397;
}
</style>