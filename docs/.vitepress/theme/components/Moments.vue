<script setup lang="ts">
import { computed } from 'vue'
import { data as moments } from '../../../moments.data'
import IconHelper from './IconHelper.vue'

// --- 配置项 ---
const USER_AVATAR = '/xiaolan.webp'
const COVER_BG_IMG = '/moents_head_card.webp'
const PAGE_TITLE = '我的朋友圈'
const USER_NICKNAME = 'IvoryGate'
const USER_BIO = '记录生活，碎碎念。' 

// --- 逻辑处理 ---

// 1. 强制按时间倒序 (从新到旧)
const sortedMoments = computed(() => {
  return [...moments].sort((a, b) => b.date.time - a.date.time)
})

// 2. 时间格式化：实现 yyyy-mm-dd hh:mm
const timeAgo = (timestamp: number) => {
  const now = Date.now()
  const diff = (now - timestamp) / 1000 
  
  // 7天内显示相对时间，增加社交属性
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 3600 * 24) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 3600 * 24 * 7) return `${Math.floor(diff / (3600 * 24))}天前`
  
  // 超过7天，显示完整格式：yyyy-mm-dd hh:mm
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  
  return `${year}-${month}-${day} ${hour}:${minute}`
}

const previewImage = (src: string) => {
  if (typeof window !== 'undefined') {
    window.open(src, '_blank')
  }
}
</script>

<template>
  <div class="moments-page">
    
    <!-- 1. 头部区域 -->
    <div class="profile-header fade-in-up">
      <!-- 封面图 -->
      <div class="cover-image" :style="{ backgroundImage: `url(${COVER_BG_IMG})` }"></div>
      
      <!-- 头部信息卡片 (样式由 CSS 变量控制) -->
      <div class="profile-info-card">
        <div class="avatar-wrapper">
          <img :src="USER_AVATAR" alt="avatar" />
        </div>
        <div class="text-wrapper">
          <h2 class="page-title">{{ PAGE_TITLE }}</h2>
          <p class="user-bio">{{ USER_BIO }}</p>
        </div>
      </div>
    </div>

    <!-- 2. 列表区域 -->
    <div class="timeline">
      <div 
        v-for="(moment, index) in sortedMoments" 
        :key="index" 
        class="moment-card fade-in-up"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-header">
          <div class="user-meta">
            <img :src="USER_AVATAR" class="mini-avatar" alt="user" />
            <div class="meta-text">
              <span class="nickname">{{ USER_NICKNAME }}</span>
              <!-- 时间显示区域 -->
              <span class="publish-time">{{ timeAgo(moment.date.time) }}</span>
            </div>
          </div>
          <div v-if="moment.location" class="location-tag">
            <IconHelper icon="lucide:map-pin" size="16" color="#5a9bd4" class="location-icon" />
            {{ moment.location }}
          </div>
        </div>

        <div class="card-body">
          <div class="text-content vp-doc" v-html="moment.html"></div>
          <!-- 图片网格 -->
          <div v-if="moment.images && moment.images.length" 
               class="image-grid"
               :class="`count-${moment.images.length}`"
          >
            <div 
              v-for="(img, imgIndex) in moment.images" 
              :key="imgIndex" 
              class="image-item"
              :style="{ backgroundImage: `url(${img})` }"
              @click="previewImage(img)"
            ></div>
          </div>
        </div>
      </div>

      <div v-if="sortedMoments.length === 0" class="empty-state fade-in-up">
        <IconHelper icon="lucide:cloud" size="64" color="#a0aec0" class="empty-icon" />
        <p>这里空空如也...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =================================================================
   CSS 变量定义
   ================================================================= */

/* 1. 默认状态 (亮色模式) */
.moments-page {
  /* 头部卡片：亮透白 */
  --glass-bg: rgba(255, 255, 255, 0.75);
  --glass-border: rgba(255, 255, 255, 0.8);
  --glass-shadow: var(--shadow-lg);
  --glass-text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  /* 列表卡片：标准背景 */
  --card-bg: var(--vp-c-bg-soft);
  --card-border: var(--vp-c-border);
  --card-shadow: var(--shadow-md);
  --card-shadow-hover: var(--shadow-lg);

  /* 头像边框 */
  --avatar-border: rgba(255, 255, 255, 0.9);

  max-width: 760px;
  margin: 0 auto;
  padding: var(--spacing-5) var(--spacing-5);
}

/* 2. 暗色模式 overrides (使用 :root.dark 确保优先级) */
:root.dark .moments-page {
  /* 头部卡片：深黑透，亮色微光阴影 */
  --glass-bg: rgba(20, 20, 22, 0.65);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-shadow: var(--shadow-lg);
  --glass-text-shadow: none;

  /* 列表卡片：深色背景，亮色微光阴影 */
  --card-bg: var(--vp-c-bg-soft);
  --card-border: rgba(255, 255, 255, 0.08);
  --card-shadow: var(--shadow-sm);
  --card-shadow-hover: var(--shadow-md);

  /* 头像边框变暗 */
  --avatar-border: rgba(255, 255, 255, 0.2);
}

/* =================================================================
   样式实现
   ================================================================= */

/* --- 头部区域 --- */
.profile-header {
  position: relative;
  margin-bottom: 40px;
}

.cover-image {
  height: 260px;
  width: 100%;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-xl);
  filter: brightness(0.9);
}

/* 头部信息卡片 */
.profile-info-card {
  position: relative;
  margin-top: -80px;
  margin-left: var(--spacing-5);
  margin-right: var(--spacing-5);
  padding: var(--spacing-6);
  border-radius: var(--radius-xl);

  display: flex;
  align-items: center;
  gap: var(--spacing-5);
  z-index: 10;

  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);

  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);

  transition: all 0.3s ease;
}

.avatar-wrapper img {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 2px solid var(--avatar-border);
  box-shadow: var(--shadow-sm);
}

.text-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-shadow: var(--glass-text-shadow);
}

.page-title {
  margin: 0;
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-extrabold);
  color: var(--vp-c-text-1);
  line-height: var(--line-height-normal);
}

.user-bio {
  margin: var(--spacing-2) 0 0 0;
  font-size: var(--font-size-base);
  color: var(--vp-c-text-2);
}


/* --- 列表区域 --- */
.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.moment-card {
  background-color: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.moment-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--card-shadow-hover);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-3);
  border-bottom: 1px dashed var(--vp-c-divider);
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 1px solid var(--vp-c-divider);
}

.meta-text {
  display: flex;
  flex-direction: column;
  line-height: var(--line-height-normal);
}

.nickname {
  font-weight: var(--font-weight-bold);
  color: var(--vp-c-text-1);
  font-size: var(--font-size-base);
}

/* 时间字体优化 */
.publish-time {
  font-size: var(--font-size-sm);
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono); /* 使用等宽字体让数字排列整齐 */
}

.location-tag {
  font-size: var(--font-size-sm);
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-alt);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.location-icon {
  font-size: 14px;
  position: relative;
  top: -2px;
}

.card-body {
  padding-left: 0;
}

.text-content {
  font-size: var(--font-size-base);
  color: var(--vp-c-text-1);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-4);
}
.text-content :deep(p) {
  margin: 0 0 var(--spacing-3) 0;
}

/* Grid Images */
.image-grid {
  display: grid;
  gap: var(--spacing-2);
  width: 100%;
  max-width: 500px;
}
.image-grid.count-1 {
  grid-template-columns: 1fr;
  max-width: 300px;
}
.image-grid.count-1 .image-item {
  padding-top: 60%;
  border-radius: var(--radius-md);
}
.image-grid.count-2, .image-grid.count-4 {
  grid-template-columns: repeat(2, 1fr);
}
.image-grid:not(.count-1):not(.count-2):not(.count-4) {
  grid-template-columns: repeat(3, 1fr);
}
.image-item {
  width: 100%;
  padding-top: 100%;
  background-position: center;
  background-size: cover;
  background-color: var(--vp-c-bg-alt);
  border-radius: var(--radius-sm);
  cursor: zoom-in;
  transition: filter 0.2s;
}
.image-item:hover {
  filter: brightness(0.9);
}

/* Responsive */
@media (max-width: 600px) {
  .cover-image {
    height: 200px;
  }
  .profile-info-card {
    flex-direction: column;
    text-align: center;
    margin-top: -60px;
    gap: var(--spacing-3);
  }
  .user-bio {
    font-size: var(--font-size-sm);
  }
}

/* Animations */
.fade-in-up {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}
@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.empty-state {
  text-align: center;
  padding: var(--spacing-15);
  color: var(--vp-c-text-3);
  font-style: italic;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
}

.empty-icon {
  font-size: 48px;
  color: var(--vp-c-text-3);
}
</style>