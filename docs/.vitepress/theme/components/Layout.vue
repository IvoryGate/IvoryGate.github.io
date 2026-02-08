<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme

// 图标映射
const iconMap: Record<string, string> = {
  'Home': 'lucide:home',
  'Moments': 'lucide:heart',
  'Timeline': 'lucide:timeline',
  'Articles': 'lucide:file-text',
  'English': 'lucide:globe',
  'Notes': 'lucide:notebook',
  '首页': 'lucide:home',
  '说说': 'lucide:heart',
  '时间轴': 'lucide:timeline',
  '文章': 'lucide:file-text',
  '英文': 'lucide:globe',
  '笔记': 'lucide:notebook',
}

// 为侧边栏链接添加图标
const enhanceSidebar = () => {
  nextTick(() => {
    // 查找所有侧边栏链接
    const links = document.querySelectorAll('.sidebar-link')

    links.forEach((link) => {
      // 避免重复添加图标
      if (link.querySelector('.sidebar-icon')) return

      // 获取链接文本
      const text = link.textContent || ''
      let icon = 'lucide:file'

      // 查找匹配的图标
      for (const [key, value] of Object.entries(iconMap)) {
        if (text.includes(key)) {
          icon = value
          break
        }
      }

      // 创建图标元素
      const iconElement = document.createElement('span')
      iconElement.className = 'sidebar-icon iconify'
      iconElement.setAttribute('data-icon', icon)
      iconElement.setAttribute('data-inline', 'false')

      // 插入到链接前
      link.prepend(iconElement)
    })
  })
}

onMounted(() => {
  // 等待侧边栏渲染完成
  setTimeout(enhanceSidebar, 100)
  setTimeout(enhanceSidebar, 500)
  setTimeout(enhanceSidebar, 1000)
})
</script>

<template>
  <Layout class="custom-layout">
    <!-- 这里预留插槽，以后可以放全站评论区等 -->
  </Layout>
</template>

<style scoped>
/* 侧边栏图标样式 */
.sidebar-icon {
  margin-right: 8px;
  font-size: 16px;
  color: var(--vp-c-brand-2);
  vertical-align: middle;
  transition: color 0.2s ease;
}

.sidebar-link:hover .sidebar-icon {
  color: var(--vp-c-brand-1);
}

/* 深色模式 */
:root.dark .sidebar-icon {
  color: var(--vp-c-brand-2);
}
</style>