<script setup lang="ts">
import { computed } from 'vue'

interface SidebarItem {
  text: string
  link?: string
  collapsible?: boolean
  items?: SidebarItem[]
}

interface Props {
  items: SidebarItem[]
}

const props = defineProps<Props>()

// 获取图标
const getIcon = (text: string, index?: number): string => {
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

  // 先查找精确匹配
  for (const [key, icon] of Object.entries(iconMap)) {
    if (text.includes(key)) {
      return icon
    }
  }

  // 根据索引返回不同的图标
  if (index === 0) return 'lucide:layout-grid'
  if (index === 1) return 'lucide:archive'
  if (index === 2) return 'lucide:search'
  if (index === 3) return 'lucide:bookmark'
  if (index === 4) return 'lucide:settings'

  return 'lucide:file'
}

// 处理侧边栏项目
const processedItems = computed(() => {
  return props.items.map((item, index) => {
    const icon = getIcon(item.text, index)
    return {
      ...item,
      icon,
      _originalText: item.text
    }
  })
})
</script>

<template>
  <div class="enhanced-sidebar">
    <div
      v-for="(item, index) in processedItems"
      :key="index"
      class="sidebar-item"
      :class="{ 'has-children': item.collapsible && item.items }"
    >
      <span class="sidebar-icon iconify" data-icon="lucide:arrow-right" data-inline="false"></span>
      <span class="sidebar-text">{{ item.text }}</span>

      <div v-if="item.items && item.items.length" class="sidebar-submenu">
        <EnhancedSidebar :items="item.items" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.enhanced-sidebar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vp-c-text-2);
  font-size: var(--font-size-base);
  text-decoration: none;
}

.sidebar-item:hover {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-brand-1);
}

.sidebar-item.has-children {
  font-weight: 500;
}

.sidebar-icon {
  margin-right: 8px;
  font-size: 16px;
  color: var(--vp-c-brand-2);
  transition: color 0.2s ease;
}

.sidebar-item:hover .sidebar-icon {
  color: var(--vp-c-brand-1);
}

.sidebar-text {
  flex: 1;
}

.sidebar-submenu {
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
