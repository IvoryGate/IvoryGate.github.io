<script setup lang="ts">
import { computed, ref } from 'vue'
import { data as posts } from '../../../posts.data.ts' 
import type { Post } from '../../../posts.data.ts'

interface TagInfo {
  name: string
  count: number
}

interface ExtendedPost extends Post {
  coverImage?: string;
  excerpt?: string;
  displayTitle?: string; 
  randomCoverUrl?: string; // 新增：用于随机图片 URL
}

// 图片 URL 缓存：避免重复生成随机 URL 和频繁调用 API
const imageCache = new Map<string, string>(); 
const RANDOM_IMAGE_API = 'https://www.dmoe.cc/random.php';

// 生成或获取随机图片 URL
const getRandomImageUrl = (key: string) => {
  if (imageCache.has(key)) {
    return imageCache.get(key);
  }
  
  // 仅在首次生成时加入时间戳或随机数，以确保 API 返回不同的图片
  // 因为这是占位符，我们只需要确保 URL 不同即可
  const url = `${RANDOM_IMAGE_API}?t=${Date.now()}`; 
  imageCache.set(key, url);
  return url;
};

// --- 逻辑处理 ---
const allTags = computed<TagInfo[]>(() => {
  // ... (allTags 逻辑不变) ...
  const map: Record<string, number> = {}
  
  posts.forEach((post) => {
    const tags = post.tags || []
    tags.forEach((tag) => {
      if (!map[tag]) map[tag] = 0
      map[tag]++
    })
  })

  return Object.keys(map)
    .map((name) => ({
      name,
      count: map[name]
    }))
    .sort((a, b) => b.count - a.count)
})

const activeTag = ref<string>('')

const toggleTag = (tagName: string) => {
  if (activeTag.value === tagName) {
    activeTag.value = ''
  } else {
    activeTag.value = tagName
  }
}

const filteredPosts = computed<ExtendedPost[]>(() => {
  let result = posts as ExtendedPost[];
  
  if (activeTag.value) {
    result = result.filter((post) => 
      post.tags && post.tags.includes(activeTag.value)
    );
  }

  return result.map(post => {
    let title = post.title;
    if (title.endsWith('.html')) {
      title = title.substring(0, title.length - 5); 
    }
    
    // **核心修改：生成随机图片 URL**
    const coverUrl = post.coverImage 
      ? post.coverImage 
      : getRandomImageUrl(post.url); // 使用文章 URL 作为缓存键

    return { 
      ...post, 
      displayTitle: title,
      randomCoverUrl: coverUrl // 绑定到新的字段
    };
  });
})

const formatDate = (date: ExtendedPost['date']) => {
  const d = new Date(date.time)
  return d.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}
</script>

<template>
  <div class="tags-page-wrapper">
    <div class="header-section">
      <div class="tags-cloud">
        <button 
          class="tag-pill" 
          :class="{ active: !activeTag }" 
          @click="activeTag = ''"
        >
          全部 <span class="count">{{ posts.length }}</span>
        </button>
        <button 
          v-for="tagItem in allTags" 
          :key="tagItem.name" 
          class="tag-pill" 
          :class="{ active: activeTag === tagItem.name }" 
          @click="toggleTag(tagItem.name)"
        >
          {{ tagItem.name }} <span class="count">{{ tagItem.count }}</span>
        </button>
      </div>
    </div>

    <div class="posts-section">
      <div class="section-title">
        {{ activeTag ? `包含 "${activeTag}" 的文章` : '所有文章' }}
      </div>
      
      <div class="post-list">
        <a 
          v-for="(article, index) in filteredPosts" 
          :key="article.url" 
          :href="article.url" 
          class="post-item"
          :class="{ 'reverse': index % 2 !== 0 }" 
        >
          <div class="post-cover">
            <img 
              :src="article.randomCoverUrl" 
              :alt="article.displayTitle" 
              loading="lazy" 
              v-if="article.randomCoverUrl"
            />
            <div v-else class="placeholder-image">🖼️</div>
          </div>
          
          <div class="post-summary">
            <div class="post-header">
              <div class="title">{{ article.displayTitle || article.title }}</div>
              <div class="date">📅 {{ formatDate(article.date) }}</div>
            </div>
            
            <p class="excerpt">
              {{ article.excerpt || '文章摘要占位：点击此处阅读全文并查看详细内容...' }}
            </p>
            
            <div class="post-footer" v-if="article.tags">
              <span v-for="t in article.tags" :key="t" class="mini-tag"># {{ t }}</span>
            </div>
          </div>
        </a>
      </div>

      <div v-if="filteredPosts.length === 0" class="empty-state">
        没有找到相关文章...
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ------------------------------------------------------------------- */
/* CSS 变量定义 - 阴影修正 */
/* ------------------------------------------------------------------- */
:root {
  /* 亮色模式：深色、柔和的阴影 */
  --custom-shadow-light: 0 6px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.05);
  /* 暗色模式：亮色、柔和的阴影，实现悬浮感 */
  --custom-shadow-dark: 0 4px 12px rgba(255, 255, 255, 0.08), 0 1px 3px rgba(255, 255, 255, 0.05);
}

/* ------------------------------------------------------------------- */
/* 页面头部和标签云样式 */
/* ------------------------------------------------------------------- */

.tags-page-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 0;
}
.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-weight: 800;
  font-size: 2.8rem; 
  letter-spacing: -0.05em; 
  color: var(--vp-c-text-1); 
}
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 50px;
}
.tag-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider); 
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.tag-pill:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  box-shadow: 0 4px 8px rgba(var(--vp-c-brand-rgb), 0.1);
}
.tag-pill.active {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 10px rgba(var(--vp-c-brand-rgb), 0.3);
}
.count {
  font-size: 12px;
  background-color: var(--vp-c-gray-light-3); 
  padding: 0 6px;
  border-radius: 10px;
  opacity: 0.9;
}
.tag-pill.active .count {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}
.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

/* ------------------------------------------------------------------- */
/* 卡片交错、配色和阴影适配 */
/* ------------------------------------------------------------------- */

.post-list {
  display: flex;
  flex-direction: column;
  gap: 40px; 
}
.post-item {
  display: flex;
  align-items: stretch;
  background-color: var(--vp-c-bg-soft); 
  border-radius: 12px; 
  border: 1px solid var(--vp-c-divider-light); 
  text-decoration: none !important;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  overflow: hidden; 
  
  box-shadow: var(--custom-shadow-light); 
}

/* 暗色模式下的亮色阴影 */
:root.dark .post-item {
    box-shadow: var(--custom-shadow-dark); 
}

.post-item:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); 
}
:root.dark .post-item:hover {
    box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
}


/* Z字形交错布局核心 */
.post-item.reverse {
  flex-direction: row-reverse;
}

/* 图片区域 */
.post-cover {
  flex: 0 0 35%; 
  min-height: 220px; 
  overflow: hidden;
}
.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  transition: transform 0.5s;
}
.post-item:hover .post-cover img {
  transform: scale(1.05); 
}
.placeholder-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--vp-c-gray-light-3); 
  font-size: 3rem;
  color: var(--vp-c-text-3);
}
:root.dark .placeholder-image {
    background-color: var(--vp-c-bg-mute);
}

/* 内容摘要区域 */
.post-summary {
  flex: 1; 
  padding: 24px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.post-header {
  display: flex;
  flex-direction: column; 
  margin-bottom: 10px;
  gap: 4px;
}
.title {
  font-size: 1.4rem; 
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}
.date {
  font-size: 0.95rem;
  color: var(--vp-c-text-3);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}
.excerpt {
  margin-top: 8px;
  margin-bottom: 18px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-footer {
  margin-top: auto; 
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.mini-tag {
  font-size: 0.8rem;
  color: var(--vp-c-brand-2);
  background-color: var(--vp-c-bg); 
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 500;
}
.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .post-item {
    flex-direction: column; 
    box-shadow: var(--custom-shadow-light); 
  }
  .post-item.reverse {
    flex-direction: column; 
  }
  :root.dark .post-item {
     box-shadow: var(--custom-shadow-dark); 
  }

  .post-cover {
    flex: 0 0 auto;
    width: 100%;
    min-height: 150px;
    max-height: 250px;
    order: 1; 
  }
  .post-summary {
    order: 2; 
    padding: 20px;
    border-radius: 0 0 12px 12px;
  }
  
  .post-cover {
      border-radius: 12px 12px 0 0;
  }
}
</style>