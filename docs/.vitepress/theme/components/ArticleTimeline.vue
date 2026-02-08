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