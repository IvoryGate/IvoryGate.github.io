<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import { data as posts } from '../../../posts.data'
import type { Post } from '../../../posts.data'

const router = useRouter()

// 更加抽象的标题
const PAGE_TITLE = 'MEMORIES'
const SUB_TITLE = 'Chronicle of Growth'

// 按日期分组逻辑 (保持不变，因为逻辑是正确的)
const groupedPosts = computed(() => {
  const groups = new Map<number, Post[]>()
  const sortedPosts = [...posts].sort((a, b) => b.date.time - a.date.time)
  
  sortedPosts.forEach(post => {
    const date = new Date(post.date.time)
    const key = date.getFullYear()
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(post)
  })

  return Array.from(groups.entries())
    .map(([year, posts]) => ({
      year,
      posts: posts.sort((a, b) => b.date.time - a.date.time)
    }))
    .sort((a, b) => b.year - a.year)
})

// 格式化日期：只保留月.日，用更具科技感的格式 (e.g. 09.24)
const formatSimpleDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  return `${m}.${d}`
}

const goToArticle = (url: string) => {
  if (url) router.go(url)
}

// 简单的交错动画延迟计算
const getDelay = (groupIndex: number, itemIndex: number) => {
  return `${(groupIndex * 0.1) + (itemIndex * 0.05)}s`
}
</script>

<template>
  <div class="timeline-container">
    <!-- 浮动光斑装饰 -->
    <div class="floating-bulb-1"></div>
    <div class="floating-bulb-2"></div>

    <header class="timeline-header">
      <h1 class="glitch-title" :data-text="PAGE_TITLE">{{ PAGE_TITLE }}</h1>
      <span class="subtitle">{{ SUB_TITLE }}</span>
      <div class="header-line"></div>
    </header>

    <div class="stream-wrapper">
      <div class="main-line"></div>

      <div 
        v-for="(group, gIndex) in groupedPosts" 
        :key="group.year" 
        class="year-section"
      >
        <div class="year-watermark">{{ group.year }}</div>

        <div class="posts-list">
          <div 
            v-for="(post, pIndex) in group.posts"
            :key="post.url"
            class="memory-node"
            :style="{ animationDelay: getDelay(gIndex, pIndex) }"
            @click="goToArticle(post.url)"
          >
            <div class="date-col">
              <span class="mono-date">{{ formatSimpleDate(post.date.time) }}</span>
            </div>

            <div class="track-col">
              <div class="node-point">
                <div class="pulse-ring"></div>
              </div>
            </div>

            <div class="content-col">
              <h3 class="post-title">{{ post.title }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 变量定义：赛博/科技风格配色 */
:root {
  --line-color: rgba(60, 60, 67, 0.3);
  --accent-glow: #3eaf7c; /* VitePress 默认绿，可改为 #5a9bd4 蓝色系 */
  --text-dim: var(--vp-c-text-3);
  --text-main: var(--vp-c-text-1);
}

.timeline-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  font-family: var(--vp-font-family-base);
  position: relative;
  overflow: hidden; /* 防止水印溢出 */
}

/* Light 模式弥散背景 */
.timeline-container.light-mode {
  background:
    radial-gradient(circle at 20% 30%, rgba(90, 155, 212, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(107, 181, 240, 0.06) 0%, transparent 35%),
    radial-gradient(circle at 50% 50%, rgba(90, 155, 212, 0.04) 0%, transparent 50%);
  animation: breatheLight 8s ease-in-out infinite;
  position: relative;
}

/* Light 模式呼吸动画 */
@keyframes breatheLight {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

/* Dark 模式弥散背景 */
.timeline-container.dark-mode {
  background:
    radial-gradient(circle at 20% 30%, rgba(90, 155, 212, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(107, 181, 240, 0.1) 0%, transparent 35%),
    radial-gradient(circle at 50% 50%, rgba(90, 155, 212, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 30% 80%, rgba(255, 107, 107, 0.05) 0%, transparent 30%);
  animation: breatheDark 10s ease-in-out infinite;
  position: relative;
}

/* Dark 模式呼吸动画 */
@keyframes breatheDark {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

/* 网格纹理叠加（仅 Dark 模式） */
.timeline-container.dark-mode::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(rgba(90, 155, 212, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 155, 212, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 40px;
  }
}

/* 添加更多背景光斑装饰 */
.timeline-container.light-mode::before,
.timeline-container.dark-mode::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

/* Light 模式额外光斑 */
.timeline-container.light-mode::before {
  background:
    radial-gradient(circle at 10% 80%, rgba(167, 139, 250, 0.04) 0%, transparent 30%),
    radial-gradient(circle at 90% 20%, rgba(52, 211, 153, 0.04) 0%, transparent 30%);
}

/* Dark 模式额外光斑 */
.timeline-container.dark-mode::before {
  background:
    radial-gradient(circle at 15% 90%, rgba(236, 72, 153, 0.06) 0%, transparent 35%),
    radial-gradient(circle at 85% 10%, rgba(34, 211, 238, 0.05) 0%, transparent 35%);
}

/* 外部光晕边框 */
.timeline-container.light-mode {
  box-shadow:
    0 0 0 1px rgba(90, 155, 212, 0.05),
    0 0 40px rgba(90, 155, 212, 0.03),
    inset 0 0 60px rgba(90, 155, 212, 0.02);
}

.timeline-container.dark-mode {
  box-shadow:
    0 0 0 1px rgba(90, 155, 212, 0.1),
    0 0 60px rgba(90, 155, 212, 0.08),
    inset 0 0 80px rgba(90, 155, 212, 0.05);
}

/* 浮动光斑动画 */
@keyframes floatLight {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translate(10px, -15px) scale(1.1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-5px, -10px) scale(0.9);
    opacity: 0.5;
  }
  75% {
    transform: translate(5px, -20px) scale(1.05);
    opacity: 0.7;
  }
}

@keyframes floatDark {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  33% {
    transform: translate(15px, -25px) scale(1.2);
    opacity: 0.6;
  }
  66% {
    transform: translate(-10px, -15px) scale(0.85);
    opacity: 0.5;
  }
}

/* 浮动光斑元素 */
.timeline-container.light-mode .floating-bulb-1,
.timeline-container.dark-mode .floating-bulb-1 {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  filter: blur(40px);
  animation: floatLight 15s ease-in-out infinite;
}

.timeline-container.light-mode .floating-bulb-1 {
  top: 10%;
  right: -20px;
  background: rgba(90, 155, 212, 0.15);
}

.timeline-container.dark-mode .floating-bulb-1 {
  top: 20%;
  right: -30px;
  background: rgba(90, 155, 212, 0.2);
}

.timeline-container.light-mode .floating-bulb-2,
.timeline-container.dark-mode .floating-bulb-2 {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  filter: blur(30px);
  animation: floatLight 12s ease-in-out infinite reverse;
}

.timeline-container.light-mode .floating-bulb-2 {
  bottom: 20%;
  left: -15px;
  background: rgba(167, 139, 250, 0.12);
}

.timeline-container.dark-mode .floating-bulb-2 {
  bottom: 30%;
  left: -20px;
  background: rgba(236, 72, 153, 0.15);
}

/* --- 头部设计 --- */
.timeline-header {
  margin-bottom: 6rem;
  text-align: left;
  position: relative;
}

.glitch-title {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  margin: 0;
  line-height: 1;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
}

.subtitle {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-top: 0.5rem;
  opacity: 0.6;
}

.header-line {
  width: 40px;
  height: 4px;
  background: var(--vp-c-brand-1);
  margin-top: 1.5rem;
  border-radius: 2px;
}

/* --- 主体结构 --- */
.stream-wrapper {
  position: relative;
  padding-left: 0;
}

/* 贯穿全局的线条 */
.main-line {
  position: absolute;
  left: 93px; /* 调整此值以对齐中间节点 */
  top: -20px;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    var(--vp-c-brand-2) 20%, 
    var(--vp-c-brand-2) 80%, 
    transparent 100%
  );
  opacity: 0.2;
  z-index: 0;
}

/* --- 年份区块 --- */
.year-section {
  position: relative;
  margin-bottom: 6rem;
}

/* 炫技点：巨大背景水印 */
.year-watermark {
  position: absolute;
  top: -3rem;
  left: -2rem;
  font-size: 8rem;
  font-weight: 900;
  color: var(--vp-c-text-1);
  opacity: 0.03; /* 极淡 */
  z-index: -1;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  font-family: var(--vp-font-family-mono);
  transition: transform 0.5s ease;
}

.year-section:hover .year-watermark {
  transform: translateX(10px);
  opacity: 0.06;
}

/* --- 记忆节点 --- */
.memory-node {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  cursor: pointer;
  position: relative;
  opacity: 0; /* 初始隐藏，给动画用 */
  animation: slideInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* 1. 左侧日期 */
.date-col {
  width: 80px;
  text-align: right;
  padding-right: 20px;
}

.mono-date {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  color: var(--text-dim);
  transition: color 0.3s ease;
}

/* 2. 中间轨道与光点 */
.track-col {
  width: 26px; /* 包含线的宽度和点的直径 */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.node-point {
  width: 8px;
  height: 8px;
  background-color: var(--vp-c-bg);
  border: 2px solid var(--vp-c-text-3);
  border-radius: 50%;
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 呼吸光环 */
.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  border-radius: 50%;
  border: 1px solid var(--vp-c-brand-1);
  opacity: 0;
  transition: all 0.4s ease;
}

/* 3. 右侧内容 */
.content-col {
  flex: 1;
  padding-left: 20px;
}

.post-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--vp-c-text-2); /* 默认稍暗 */
  transition: all 0.3s ease;
  line-height: 1.4;
}

/* --- 交互效果 (HOVER STATE) --- */

.memory-node:hover .mono-date {
  color: var(--vp-c-brand-1);
  font-weight: bold;
}

.memory-node:hover .node-point {
  background-color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  transform: scale(1.3);
  box-shadow: 0 0 15px var(--vp-c-brand-1);
}

.memory-node:hover .pulse-ring {
  width: 300%;
  height: 300%;
  opacity: 0.3;
}

.memory-node:hover .post-title {
  color: var(--vp-c-text-1);
  transform: translateX(8px); /* 细微位移 */
  text-shadow: 0 0 1px rgba(0,0,0,0.1);
}

/* --- 动画 --- */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移动端适配 */
@media (max-width: 640px) {
  .timeline-container {
    padding: 2rem 1rem;
  }
  
  .glitch-title {
    font-size: 2rem;
  }

  .main-line {
    left: 19px; /* 移动端靠左 */
  }

  .date-col {
    display: none; /* 移动端隐藏左侧日期，太挤了 */
  }

  .track-col {
    width: 40px;
    justify-content: flex-start;
  }

  .content-col {
    padding-left: 10px;
  }

  .post-title {
    font-size: 1rem;
  }
  
  /* 移动端把日期显示在标题上方 */
  .post-title::before {
    content: attr(data-date); /* 需要在template里加data-date吗？或者直接在这里改结构。为简单起见，这里保持极简，或者你可以让日期作为小字显示在标题上 */
    display: block;
    font-size: 0.7rem;
    font-family: var(--vp-font-family-mono);
    color: var(--vp-c-brand-2);
    margin-bottom: 4px;
  }
  
  /* 修正：在CSS里无法直接读取vue数据做content，更稳妥的方式是在template里修改移动端布局。
     但为了保持“极简”，移动端我们只让节点发光，用户点击进去看日期也行。
     或者我们让 .mono-date 变成 absolute 浮动。
  */
}
</style>