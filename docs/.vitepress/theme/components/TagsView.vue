<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vitepress' // 1. 引入路由
import { data as posts } from '../../../posts.data'
import type { Post } from '../../../posts.data'
import IconHelper from './IconHelper.vue' // 2. 引入图标助手组件

interface TagInfo {
  name: string
  count: number
}

interface ExtendedPost extends Post {
  displayTitle?: string;
  randomCoverUrl?: string;
}

const router = useRouter() // 2.以此获取路由实例

// --- 图片 URL 缓存 ---
const imageCache = new Map<string, string>(); 
const RANDOM_IMAGE_API = 'https://www.dmoe.cc/random.php';

const getRandomImageUrl = (key: string) => {
  if (imageCache.has(key)) return imageCache.get(key);
  const url = `${RANDOM_IMAGE_API}?t=${Math.random()}`; 
  imageCache.set(key, url);
  return url;
};

// --- 逻辑处理 ---
const allTags = computed<TagInfo[]>(() => {
  const map: Record<string, number> = {}
  posts.forEach((post) => {
    const tags = post.tags || []
    tags.forEach((tag) => {
      if (!map[tag]) map[tag] = 0
      map[tag]++
    })
  })
  return Object.keys(map)
    .map((name) => ({ name, count: map[name] }))
    .sort((a, b) => b.count - a.count)
})

const activeTag = ref<string>('')

const toggleTag = (tagName: string) => {
  activeTag.value = activeTag.value === tagName ? '' : tagName
}

// 3. 卡片跳转函数
const goToArticle = (url: string) => {
  if (url) {
    router.go(url)
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
    
    // 封面图处理
    const coverUrl = post.cover 
      ? post.cover 
      : getRandomImageUrl(post.url);

    return { 
      ...post, 
      displayTitle: title,
      randomCoverUrl: coverUrl 
    };
  });
})
</script>

<template>
  <div class="tags-page-wrapper">
    <!-- 头部标签云 -->
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

    <!-- 文章列表 -->
    <div class="posts-section">
      <div class="section-title">
        {{ activeTag ? `包含 "${activeTag}" 的文章` : '所有文章' }}
      </div>
      
      <div class="post-list">
        <!-- 
           4. 修改为 div 标签 
           使用 @click 处理跳转，这样内部的 stop 修饰符才能生效
        -->
        <div 
          v-for="(article, index) in filteredPosts" 
          :key="article.url" 
          class="post-item"
          :class="{ 'reverse': index % 2 !== 0 }" 
          @click="goToArticle(article.url)"
        >
          <!-- 封面图区域 -->
          <div class="post-cover">
            <img 
              :src="article.randomCoverUrl" 
              :alt="article.displayTitle" 
              loading="lazy" 
            />
          </div>
          
          <!-- 内容区域 -->
          <div class="post-summary">
            <div class="post-header">
              <h2 class="title">{{ article.displayTitle || article.title }}</h2>

              <div class="meta-row">
                <span class="meta-item date">
                  <IconHelper icon="lucide:calendar" size="16" color="#5a9bd4" />
                  {{ article.date.string }}
                </span>
                <span class="meta-separator">·</span>
                <span class="meta-item reading-time">
                  <IconHelper icon="lucide:clock" size="16" color="#6bb5f0" />
                  {{ article.readingTime }} min
                </span>
              </div>
            </div>
            
            <p class="excerpt">
              {{ article.excerpt || '暂无摘要，点击阅读全文...' }}
            </p>
            
            <div class="post-footer" v-if="article.tags">
              <!-- 
                 5. 小标签点击事件
                 .stop 阻止冒泡，防止触发外层 div 的 goToArticle
              -->
              <span 
                v-for="t in article.tags" 
                :key="t" 
                class="mini-tag"
                :class="{ active: activeTag === t }"
                @click.stop="toggleTag(t)"
              >
                # {{ t }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredPosts.length === 0" class="empty-state">
        没有找到相关文章...
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =================================================================
   CSS 变量定义
   ================================================================= */
.tags-page-wrapper {
  /* 默认 (亮色模式) */
  --card-bg: var(--vp-c-bg-soft);
  --card-border: var(--vp-c-border);
  --card-shadow: var(--shadow-md);
  --card-shadow-hover: var(--shadow-lg);

  --tag-bg: var(--vp-c-bg-alt);
  --tag-hover-shadow: 0 4px 10px rgba(var(--vp-c-brand-rgb), 0.15);

  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-8) var(--spacing-5);
}

/* 暗色模式 Overrides */
:root.dark .tags-page-wrapper {
  --card-border: rgba(255, 255, 255, 0.08);
  --card-shadow: 0 4px 16px rgba(255, 255, 255, 0.05);
  --card-shadow-hover: 0 10px 30px rgba(255, 255, 255, 0.08);
  
  --tag-hover-shadow: 0 4px 12px rgba(var(--vp-c-brand-rgb), 0.3);
}

/* =================================================================
   组件样式
   ================================================================= */

/* --- 1. 顶部标签云 --- */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  justify-content: center;
  margin-bottom: var(--spacing-12);
}
.tag-pill {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-xl);
  border: 1px solid var(--vp-c-divider);
  background-color: var(--tag-bg);
  color: var(--vp-c-text-2);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}
.tag-pill:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  box-shadow: var(--tag-hover-shadow);
  transform: translateY(-2px);
}
.tag-pill.active {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-rgb), 0.4);
}
.count {
  font-size: var(--font-size-xs);
  background-color: var(--vp-c-bg-alt);
  padding: 0 var(--spacing-2);
  border-radius: var(--radius-md);
  line-height: 1.4;
}
:root.dark .count {
  background-color: rgba(255, 255, 255, 0.1);
}
.tag-pill.active .count {
  background-color: rgba(255, 255, 255, 0.25);
  color: white;
}

/* --- 2. 列表区域 --- */
.section-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-3);
  border-bottom: 1px dashed var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

/* 卡片容器 */
.post-item {
  display: flex;
  align-items: stretch;
  background-color: var(--card-bg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--card-border);
  /* 显式设置手型光标 */
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  height: 240px;
  position: relative;
  z-index: 1;
}

.post-item:hover {
  transform: translateY(-5px);
  border-color: var(--vp-c-brand);
  box-shadow: var(--card-shadow-hover); 
}

/* Z字形交错 */
.post-item.reverse {
  flex-direction: row-reverse;
}

/* 图片 */
.post-cover {
  flex: 0 0 42%; 
  overflow: hidden;
  position: relative;
}
.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.post-item:hover .post-cover img {
  transform: scale(1.08); 
}

/* 文字部分 */
.post-summary {
  flex: 1; 
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.post-header {
  margin-bottom: 12px;
}

.title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--vp-c-text-1);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-2) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-row {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-weight: var(--font-weight-medium);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
  height: 24px;
  padding: 0 4px;
  position: relative;
}

.meta-item span:not(.iconify-wrapper) {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  height: 24px;
}

/* 图标向上偏移4px */
.meta-item .iconify-wrapper {
  position: relative;
  top: -2px;
}

.meta-icon {
  margin-right: 4px;
}

.date-icon {
  color: var(--vp-c-brand-2);
}

.time-icon {
  color: var(--vp-c-brand-3);
}

.meta-separator {
  margin: 0 var(--spacing-2);
  opacity: 0.5;
}

.excerpt {
  margin-bottom: var(--spacing-5);
  color: var(--vp-c-text-2);
  line-height: var(--line-height-normal);
  font-size: var(--font-size-base);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 
   小标签交互样式 
*/
.post-footer {
  margin-top: auto; 
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  position: relative;
  /* 确保 z-index 高于卡片本体 */
  z-index: 2;
}

.mini-tag {
  font-size: var(--font-size-sm);
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-alt);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

.mini-tag:hover {
  background-color: var(--vp-c-bg-mute);
  transform: translateY(-1px);
  color: var(--vp-c-brand-1);
  border-color: rgba(var(--vp-c-brand-rgb), 0.2);
}

.mini-tag.active {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-20);
  color: var(--vp-c-text-3);
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .post-item {
    flex-direction: column;
    height: auto;
  }
  .post-item.reverse {
    flex-direction: column;
  }
  .post-cover {
    flex: 0 0 auto;
    width: 100%;
    height: 200px;
  }
  .post-summary {
    padding: var(--spacing-5);
  }
  .title {
    font-size: var(--font-size-h3);
  }
  .excerpt {
    font-size: var(--font-size-sm);
    -webkit-line-clamp: 3;
  }
}
</style>