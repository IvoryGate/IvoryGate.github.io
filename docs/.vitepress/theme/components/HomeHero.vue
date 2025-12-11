<template>
  <div class="hero-container">
    <div class="hero-content">
      
      <div class="text-section">
        <h3>
          <span class="greeting">Hello, It's me.</span>
          <br>
          <span class="self-introduction">Call Me IvoryGate.</span>
          <span class="typewriter-wrapper">
            <span class="typewriter">{{ message }}<span class="mark">_</span></span>
          </span>
          <p class="tagline">Some of us get dipped in flat, some in satin, some in gloss. But every once in a while you find someone who's iridescent, and when you do, nothing will ever compare.</p>
        </h3>
        <div class="action-buttons">
          <a :href="toLink" class="action-btn primary-btn">{{ toText }}</a>
          <a :href="cvLink" target="_blank" class="action-btn secondary-btn">个人CV</a>
        </div>
      </div>

      <div class="avatar-section">
        <img :src="avatarUrl" alt="Avatar" class="hero-avatar">
        <div class="avatar-glow"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// --- 组件属性 ---
const props = defineProps({
  avatarUrl: {
    type: String,
    default: "/xiaolan.jpg" 
  },
  toLink: {
    type: String,
    default: '/tags.html'
  },
  toText: {
    type: String,
    default: '进入博客'
  },
  cvLink: {
    type: String,
    default: '/'
  }
});

// --- 打字机逻辑 (维持原样) ---
const message = ref('');
const texts = ref(['或许不知是梦的缘故，流离之人追逐幻影。','枕头里藏着发霉的梦，梦里住着无法拥有的人！']);
let index = 0;
let charIndex = 0;
let delta = 300;
let start: number | null = null;
let isDeleting = false;

function type(time: number){
    if (start === null) start = time;
    const progress = time - start;
    
    if (progress > delta) {
        const text = texts.value[index];
        
        if (!isDeleting) {
            message.value = text.slice(0, ++charIndex);
            delta = 500 - Math.random() * 400;
        } else {
            message.value = text.slice(0, charIndex--);
        }
        
        start = time;
        
        if (charIndex === text.length) {
            isDeleting = true;
            delta = 200;
            start = time + 1200;
        }
        
        if (charIndex < 0) {
            isDeleting = false;
            start = time + 200;
            index = ++index % texts.value.length;
        }
    }
    window.requestAnimationFrame(type);
}

onMounted(() => {
    window.requestAnimationFrame(type);
});
</script>

<style scoped>
/* ========================================================= */
/* 0. 关键修复：清除 VitePress 默认布局的顶部填充 */
/* ========================================================= */
/* 强制清除 VitePress 布局容器的顶部填充/边距，确保 hero-container 紧贴导航栏底部。
   这是解决宽屏模式下有空隙的根本方法。 */
:deep(.VPHome) {
    padding-top: 0 !important;
}

:deep(.VPContent) {
    padding-top: 0 !important;
}

/* ========================================================= */
/* 1. 核心布局和定位 (占据视窗剩余空间并 Flexbox 居中) */
/* ========================================================= */
.hero-container {
  /* PC端：绝对定位，从导航栏下方开始，占据剩余视窗空间 */
  position: absolute; 
  top: -64px; /* 紧贴导航栏底部 */
  left: 0; 
  right: 0;
  /* 高度公式正确，确保占满剩余视窗 */
  height: calc(100vh - var(--vp-nav-height, 64px)); 
  
  /* Flexbox 容器：负责将 hero-content 垂直居中 */
  display: flex;
  align-items: center; /* 垂直居中 hero-content */
  justify-content: center;
  
  width: 100%;
  overflow: hidden;
  background-color: var(--vp-c-bg);
  transition: background-color 0.3s;
}

.hero-content {
  width: 100%;
  max-width: var(--vp-layout-max-width, 1280px);
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  /* 【关键修复】：移除所有 margin-top 补偿，完全依赖父容器 Flexbox 居中 */
  margin-top: 0; 
}

/* ========================================================= */
/* 2. 左侧文本区样式 (无变化) */
/* ========================================================= */

.text-section {
  max-width: 50%;
  color: var(--vp-c-text-1);
}

.text-section h3 {
  margin: 0;
  padding: 0;
  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: 500;
  line-height: 1.5;
}

.greeting {
  font-size: 1.4em;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.self-introduction {
  font-size: 1.8em;
  font-weight: 800;
  color: var(--vp-c-brand-1);
}

/* 外部 Flex 容器：用于垂直居中和锁定高度 */
.typewriter-wrapper {
    display: flex;
    align-items: center;
    min-height: 3.5em; /* 锁定高度 */
    line-height: 1.5;
    margin-top: 1em;
    margin-bottom: 0.5em; 
    width: 100%;
}

/* 内部文本容器：确保内容可以换行，且光标跟随 */
.typewriter {
  font-size: 1.2em;
  font-weight: 600;
  display: inline-block; 
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.tagline {
  font-size: 16px;
  color: var(--vp-c-text-3);
  margin-top: 0;
  margin-bottom: 2em;
  max-width: 500px;
}

/* 光标样式 */
span.mark {
  display: inline-block;
  color: var(--vp-c-brand-1);
  animation: blink 1s ease infinite;
}

@keyframes blink {
  from,
  to {
    color: transparent;
  }
  50% {
    color: var(--vp-c-brand-1);
  }
}


/* ========================================================= */
/* 3. 按钮区 (无变化) */
/* ========================================================= */

.action-buttons {
  display: flex;
  gap: 1.5rem;
  margin-top: 0;
}

.action-btn {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 40px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  text-align: center;
  border: 2px solid transparent;
}

.primary-btn {
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg-soft, white);
  box-shadow: 0 4px 15px rgba(var(--vp-c-brand-rgb), 0.3);
}

.primary-btn:hover {
  background-color: var(--vp-c-brand-2);
  box-shadow: 0 6px 20px rgba(var(--vp-c-brand-rgb), 0.4);
  transform: translateY(-2px);
}

.primary-btn:active {
  background-color: transparent;
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  box-shadow: none;
  transform: scale(0.98);
}

.secondary-btn {
  background-color: transparent;
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.secondary-btn:hover {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.secondary-btn:active {
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg-soft, white);
  border-color: var(--vp-c-brand-1);
  transform: scale(0.98);
}


/* ========================================================= */
/* 4. 右侧头像区和动画 (无变化) */
/* ========================================================= */

.avatar-section {
  position: relative;
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 2;
  animation: floatImage 4s ease-in-out infinite;
  border: 5px solid var(--vp-c-bg-soft); 
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2); 
  transition: all 0.3s;
}

:root.dark .hero-avatar {
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.08);
}

@keyframes floatImage {
  0%{ transform: translateY(0); }
  50%{ transform: translateY(-16px); }
  100%{ transform: translateY(0); }
}

.avatar-glow {
    position: absolute;
    width: 330px;
    height: 330px;
    border-radius: 50%;
    background: radial-gradient(circle at center, var(--vp-c-brand-3) 0%, transparent 70%);
    opacity: 0.1;
    z-index: 1;
    animation: floatImage 4s ease-in-out infinite 0.5s; 
}


/* ========================================================= */
/* 5. 响应式布局 (移动端恢复自然流) */
/* ========================================================= */

@media (max-width: 960px) {
  /* 移动端：恢复 relative 定位，让组件在内容流中自然显示 */
  .hero-container {
    position: relative; 
    top: auto;
    height: auto;
    min-height: calc(100vh - var(--vp-nav-height, 64px));
    padding: 64px 0;
  }
  
  .hero-content {
    flex-direction: column;
    text-align: center;
    padding: 0 24px;
    margin-top: 0; 
  }

  .text-section {
    max-width: 100%;
    order: 2;
  }
  
  .typewriter-wrapper {
      min-height: 4.5em; 
      display: flex;
      align-items: center;
      margin-top: 0.8em; 
      margin-bottom: 0.5em;
  }
  
  .text-section h3 {
      font-size: 18px;
  }
  .self-introduction {
    font-size: 1.6em;
  }
  .typewriter {
    font-size: 1.1em;
  }

  .avatar-section {
    order: 1;
    width: 250px;
    height: 250px;
    margin-bottom: 2.5rem;
    margin-left: 0 !important;
  }
  
  .hero-avatar {
      margin-left: 0;
  }

  .avatar-glow {
      width: 260px;
      height: 260px;
  }

  .action-buttons {
    justify-content: center;
    gap: 1rem;
    width: 100%;
  }
}
</style>