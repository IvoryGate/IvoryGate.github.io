<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vitepress'
import { data as posts } from '../../../posts.data'
import type { Post } from '../../../posts.data'

const router = useRouter()

interface ExtendedPost extends Post {
  displayTitle?: string
  randomCoverUrl?: string
}

// 图片 URL 缓存
const imageCache = new Map<string, string>()
const RANDOM_IMAGE_API = 'https://www.dmoe.cc/random.php'

const getRandomImageUrl = (key: string) => {
  if (imageCache.has(key)) return imageCache.get(key)
  const url = `${RANDOM_IMAGE_API}?t=${Math.random()}`
  imageCache.set(key, url)
  return url
}

// --- 配置项 ---
const PAGE_TITLE = '时光流转，文章有迹'
const DESCRIPTION = '时光流转，文章有迹'

// 格式化日期为 YYYY-MM
const formatDateYearMonth = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
}

// 1. 按年份分组并按时间倒序排序（从新到旧）
const groupedByYear = computed(() => {
  const groups: Record<string, ExtendedPost[]> = {}

  // 按时间倒序分组
  posts.sort((a, b) => b.date.time - a.date.time).forEach((post) => {
    const year = new Date(post.date.time).getFullYear()
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(post)
  })

  // 获取年份并按时间倒序排序
  const sortedYears = Object.keys(groups).sort((a, b) => parseInt(b) - parseInt(a))

  // 按年份顺序创建数组
  const sortedGroups = sortedYears.map(year => ({
    year,
    posts: groups[year].sort((a, b) => b.date.time - a.date.time)
  }))

  return sortedGroups
})

// 2. 过滤函数（可选）
const showAllPosts = computed(() => true)

// 3. 跳转函数
const goToArticle = (url: string) => {
  if (url) {
    console.log('点击卡片，url:', url)

    // 尝试直接跳转
    if (typeof window !== 'undefined') {
      window.location.href = url
    }
  }
}
</script>

<template>
  <div class="timeline-page">
    <!-- 头部区域 -->
    <div class="header-section">
      <h1 class="page-title">{{ PAGE_TITLE }}</h1>
      <p class="page-description">{{ DESCRIPTION }}</p>
    </div>

    <!-- 时间轴 -->
    <div class="timeline-container">
      <!-- 年份分组 -->
      <div v-for="(group, index) in groupedByYear" :key="group.year" class="year-section">
        <!-- 年份标记 -->
        <div class="year-mark">
          <div class="year-ring">
            <div class="year-content">
              <span class="year-year">{{ group.year }}</span>
              <span class="year-month">{{ formatDateYearMonth(group.posts[0]?.date.time) }}</span>
            </div>
          </div>
        </div>

        <!-- 年份内的文章列表 -->
        <div class="posts-list">
          <div
            v-for="(article, articleIndex) in group.posts"
            :key="article.url"
            class="article-item"
            :style="{ '--delay': `${articleIndex * 0.05}s` }"
            @click="goToArticle(article.url)"
          >
            <!-- 文章标题 -->
            <div class="article-title">{{ article.title }}</div>
            <div class="article-date">{{ new Date(article.date.time).toLocaleDateString('zh-CN', {
              month: '2-digit',
              day: '2-digit'
            }) }}</div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="groupedByYear.length === 0" class="empty-state">
        暂无文章
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =================================================================
   CSS 变量定义
   ================================================================= */
.timeline-page {
  --accent-color: var(--vp-c-brand);
  --accent-light: var(--vp-c-brand-light);
  --bg-gradient-start: #667eea;
  --bg-gradient-end: #764ba2;

  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 40px;
  position: relative;
}

/* 暗色模式 Overrides */
:root.dark .timeline-page {
}

/* =================================================================
   头部区域
   ================================================================= */
.header-section {
  text-align: center;
  margin-bottom: 80px;
  animation: fadeInUp 0.6s ease-out;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.page-description {
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  margin: 0;
  font-weight: 400;
  opacity: 0.9;
}

/* =================================================================
   时间轴容器
   ================================================================= */
.timeline-container {
  position: relative;
  padding-left: 80px;
}

/* 渐变竖线 */
.timeline-container::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom,
    transparent 0%,
    var(--bg-gradient-start) 15%,
    var(--bg-gradient-end) 35%,
    var(--bg-gradient-start) 50%,
    var(--bg-gradient-end) 65%,
    var(--bg-gradient-start) 85%,
    transparent 100%
  );
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

/* 竖线节点 */
.timeline-node {
  position: absolute;
  left: 0;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--vp-c-bg);
  border: 4px solid var(--bg-gradient-start);
  box-shadow: 0 0 0 2px var(--bg-gradient-end),
              0 0 20px rgba(102, 126, 234, 0.5);
  z-index: 2;
  transition: all 0.3s ease;
}

/* 年份区块 */
.year-section {
  position: relative;
  margin-bottom: 80px;
  animation: fadeInUp 0.6s ease-out;
}

.year-section:last-child {
  margin-bottom: 0;
}

/* 年份标记 */
.year-mark {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
}

.year-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.4);
  position: relative;
}

.year-ring::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  opacity: 0.5;
  animation: pulse 2s ease-in-out infinite;
}

.year-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  padding: 8px;
}

.year-year {
  display: block;
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.year-month {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.95;
}

/* 文章列表 */
.posts-list {
  margin-left: 40px;
  padding-top: 20px;
}

.article-item {
  position: relative;
  margin-bottom: 40px;
  padding-left: 40px;
  animation: slideInRight 0.5s ease-out;
}

.article-item::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  box-shadow: 0 0 0 4px var(--vp-c-bg),
              0 0 15px rgba(102, 126, 234, 0.6);
  z-index: 2;
}

.article-item:hover::before {
  box-shadow: 0 0 0 4px var(--bg-gradient-start),
              0 0 25px rgba(102, 126, 234, 0.8);
  transform: translateY(-50%) scale(1.3);
}

.article-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 16px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--vp-c-bg-alt) 0%, var(--vp-c-bg-soft) 100%);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.article-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  border-radius: 12px 0 0 12px;
  opacity: 0;
  transition: all 0.3s ease;
}

.article-item:hover .article-title {
  transform: translateX(8px);
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg-alt) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.15);
}

.article-item:hover .article-title::before {
  opacity: 1;
}

.article-date {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin-top: 8px;
  margin-left: 4px;
  font-family: var(--vp-font-family-mono);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.article-date::before {
  content: '•';
  font-size: 1.2rem;
  color: var(--bg-gradient-start);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 100px 40px;
  color: var(--vp-c-text-3);
  font-size: 1.5rem;
}

/* =================================================================
   动画
   ================================================================= */
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

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* =================================================================
   响应式设计
   ================================================================= */
@media (max-width: 768px) {
  .timeline-page {
    padding: 40px 24px;
  }

  .page-title {
    font-size: 2.5rem;
    margin-bottom: 12px;
  }

  .page-description {
    font-size: 1rem;
  }

  .timeline-container {
    padding-left: 60px;
  }

  .timeline-node {
    width: 16px;
    height: 16px;
  }

  .year-mark {
    left: -8px;
  }

  .year-ring {
    width: 60px;
    height: 60px;
  }

  .year-year {
    font-size: 1.4rem;
  }

  .year-month {
    font-size: 0.75rem;
  }

  .posts-list {
    margin-left: 28px;
    padding-top: 16px;
  }

  .article-item {
    margin-bottom: 32px;
    padding-left: 28px;
  }

  .article-item::before {
    left: 12px;
    width: 8px;
    height: 8px;
  }

  .article-title {
    font-size: 1.15rem;
    padding: 12px 16px;
  }

  .article-date {
    font-size: 0.8rem;
    margin-top: 6px;
  }
}

@media (max-width: 480px) {
  .timeline-page {
    padding: 32px 20px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 0.9rem;
  }

  .timeline-container {
    padding-left: 50px;
  }

  .timeline-node {
    width: 14px;
    height: 14px;
  }

  .year-mark {
    left: -10px;
  }

  .year-ring {
    width: 50px;
    height: 50px;
  }

  .year-year {
    font-size: 1.2rem;
  }

  .year-month {
    font-size: 0.7rem;
  }

  .posts-list {
    margin-left: 24px;
  }

  .article-item {
    margin-bottom: 24px;
    padding-left: 24px;
  }

  .article-item::before {
    left: 10px;
    width: 6px;
    height: 6px;
  }

  .article-title {
    font-size: 1rem;
    padding: 10px 14px;
  }

  .article-date {
    font-size: 0.75rem;
    margin-top: 5px;
  }
}

@media (min-width: 1200px) {
  .timeline-page {
    max-width: 1100px;
    padding: 80px 60px;
  }

  .page-title {
    font-size: 4rem;
  }

  .page-description {
    font-size: 1.3rem;
  }

  .timeline-container {
    padding-left: 100px;
  }

  .timeline-node {
    width: 24px;
    height: 24px;
  }

  .year-mark {
    left: -10px;
  }

  .year-ring {
    width: 100px;
    height: 100px;
  }

  .year-year {
    font-size: 2rem;
  }

  .year-month {
    font-size: 1rem;
  }

  .posts-list {
    margin-left: 50px;
    padding-top: 24px;
  }

  .article-item {
    margin-bottom: 50px;
    padding-left: 50px;
  }

  .article-item::before {
    left: 18px;
    width: 12px;
    height: 12px;
  }

  .article-title {
    font-size: 1.6rem;
    padding: 20px 24px;
  }

  .article-date {
    font-size: 1rem;
    margin-top: 10px;
  }
}
</style>
