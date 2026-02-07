<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../../posts.data'
import type { Post } from '../../../posts.data'

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

// --- 逻辑处理 ---

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

// 3. 过滤函数（可选）
const showAllPosts = computed(() => true) // 可以改为 false 来显示筛选功能
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
      <div v-for="(group, index) in groupedByYear" :key="group.year" class="year-group">
        <!-- 年份标题 -->
        <div class="year-label">
          <span class="year-number">{{ group.year }}</span>
          <span class="year-line"></span>
        </div>

        <!-- 年份内的文章卡片 -->
        <div class="posts-group">
          <div
            v-for="(article, index) in group.posts"
            :key="article.url"
            class="article-card"
            :style="{ '--delay': `${index * 0.1}s` }"
          >
            <!-- 时间标记 -->
            <div class="time-marker">
              <div class="time-circle"></div>
              <div class="time-label">{{ new Date(article.date.time).toLocaleDateString('zh-CN', {
                month: '2-digit',
                day: '2-digit'
              }) }}</div>
            </div>

            <!-- 卡片内容 -->
            <div class="card-content" @click="$router.go(article.url)">
              <div class="card-cover">
                <img
                  :src="article.cover || getRandomImageUrl(article.url)"
                  :alt="article.title"
                  loading="lazy"
                />
              </div>

              <div class="card-info">
                <h3 class="card-title">{{ article.title }}</h3>
                <p class="card-excerpt">{{ article.excerpt || '点击阅读全文...' }}</p>
                <div class="card-meta">
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 1L6 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-6-4z"/>
                    </svg>
                    {{ article.readingTime }} min
                  </span>
                  <span v-if="article.tags && article.tags.length > 0" class="tags-inline">
                    <span v-for="tag in article.tags" :key="tag" class="tag-badge-sm">
                      #{{ tag }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
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
  --card-bg: var(--vp-c-bg-soft);
  --card-border: var(--vp-c-divider-light);
  --card-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  --card-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.12);

  --accent-color: var(--vp-c-brand);
  --accent-light: var(--vp-c-brand-light);

  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* 暗色模式 Overrides */
:root.dark .timeline-page {
  --card-border: rgba(255, 255, 255, 0.08);
  --card-shadow: 0 4px 20px rgba(255, 255, 255, 0.05);
  --card-shadow-hover: 0 8px 32px rgba(255, 255, 255, 0.08);
}

/* =================================================================
   头部区域
   ================================================================= */
.header-section {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.6s ease-out;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0;
  font-weight: 400;
  position: relative;
  display: inline-block;
  padding: 8px 24px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--card-bg) 0%, var(--vp-c-bg-alt) 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--vp-c-divider-light);
  transition: all 0.3s ease;
}

.page-description:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--vp-c-brand-rgb), 0.15);
  border-color: var(--accent-color);
}

/* =================================================================
   时间轴容器
   ================================================================= */
.timeline-container {
  position: relative;
  padding-left: 60px;
}

/* 时间轴线 */
.timeline-container::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom,
    var(--accent-color) 0%,
    var(--accent-light) 50%,
    var(--accent-color) 100%
  );
  border-radius: 2px;
}

/* 年份分组 */
.year-group {
  margin-bottom: 60px;
  position: relative;
  animation: fadeInUp 0.6s ease-out;
}

/* 年份标签 */
.year-label {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.year-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-color);
  line-height: 1;
  position: relative;
  z-index: 2;
}

.year-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    to right,
    var(--vp-c-divider),
    var(--accent-color)
  );
}

/* 文章卡片 */
.article-card {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  animation: fadeInUp 0.5s ease-out;
}

/* 时间标记 */
.time-marker {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
  margin-top: 4px;
}

.time-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--accent-color);
  border: 4px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--accent-color);
  transition: all 0.3s ease;
}

.article-card:hover .time-circle {
  transform: scale(1.3);
  background-color: var(--accent-light);
}

.time-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  text-align: center;
  padding-top: 4px;
}

/* 卡片内容 */
.card-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--card-border);
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.card-content:hover {
  transform: translateY(-4px);
  border-color: var(--accent-color);
  box-shadow: var(--card-shadow-hover);
}

/* 封面图 */
.card-cover {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--vp-c-bg-mute);
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card-content:hover .card-cover img {
  transform: scale(1.08);
}

/* 卡片信息 */
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-excerpt {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0 0 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  min-width: 0;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 0.85rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  font-family: var(--vp-font-family-mono);
}

.meta-item svg {
  opacity: 0.7;
}

.tags-inline {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.tag-badge-sm {
  font-size: 0.75rem;
  color: var(--accent-color);
  background-color: var(--vp-c-bg-alt);
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tag-badge-sm:hover {
  background-color: var(--accent-color);
  color: white;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px;
  color: var(--vp-c-text-3);
  font-size: 1.2rem;
}

/* =================================================================
   动画
   ================================================================= */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =================================================================
   响应式设计
   ================================================================= */
@media (max-width: 768px) {
  .timeline-page {
    padding: 30px 16px;
  }

  .page-title {
    font-size: 2rem;
  }

  .timeline-container {
    padding-left: 40px;
  }

  .article-card {
    flex-direction: column;
    gap: 12px;
  }

  .time-marker {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .card-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .card-cover {
    width: 100%;
    height: 140px;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-excerpt {
    font-size: 0.85rem;
  }

  .tags-inline {
    gap: 3px;
  }

  .tag-badge-sm {
    font-size: 0.7rem;
    padding: 2px 5px;
  }
}
</style>
