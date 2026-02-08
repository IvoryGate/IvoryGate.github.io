<script setup lang="ts">
/**
 * IconHelper 组件
 * 为 VitePress 应用提供统一的图标系统
 */
import { computed } from 'vue'

interface Props {
  icon: string           // Iconify 图标名，如 "lucide:calendar"
  size?: string          // 图标大小: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string         // 图标颜色
  inline?: boolean       // 是否内联显示
  spin?: boolean         // 是否旋转动画
  pulse?: boolean        // 是否脉冲动画
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  inline: false,
  spin: false,
  pulse: false,
  color: ''
})

// 尺寸映射
const sizeMap = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px'
}

// 计算样式
const style = computed(() => {
  const sizeStyle = sizeMap[props.size]
  const colorStyle = props.color ? `color: ${props.color}` : ''
  const animation = []

  if (props.spin) {
    animation.push('animation: iconSpin 1s linear infinite')
  }

  if (props.pulse) {
    animation.push('animation: iconPulse 1.5s ease-in-out infinite')
  }

  return `${sizeStyle}; ${colorStyle}; ${animation.join('; ')}`
})
</script>

<template>
  <span
    class="iconify-wrapper"
    :class="{ 'icon-inline': inline }"
    :style="style"
  >
    <span
      class="iconify"
      :data-icon="icon"
      :data-inline="inline.toString()"
    ></span>
  </span>
</template>

<style scoped>
.iconify-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-inline {
  display: inline;
}

@keyframes iconSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
