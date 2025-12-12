// .vitepress/moments.data.ts
import { createContentLoader, type ContentData } from 'vitepress'

// 定义说说的数据接口
export interface Moment {
  html: string        // 渲染后的 HTML 内容
  date: {
    time: number
    string: string
  }
  location?: string   // 地点（可选）
  images: string[]    // 图片数组
}

declare const data: Moment[]
export { data }

// 辅助函数：格式化日期（为了显示友好，这里处理成标准格式，组件里可以再处理成“xx小时前”）
function formatDate(raw: string | number | Date): Moment['date'] {
  const date = new Date(raw)
  return {
    time: +date,
    string: date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

export default createContentLoader<Moment[]>('Moments/*.md', {
  includeSrc: false, // 我们不需要原始 markdown
  render: true,      // 关键：让 VitePress 帮我们把 md 渲染成 HTML
  transform(raw: ContentData[]): Moment[] {
    return raw
      .map(({ frontmatter, html }) => ({
        html: html, // 渲染好的 HTML
        date: formatDate(frontmatter.date || new Date()),
        location: frontmatter.location,
        images: frontmatter.images || []
      }))
      .sort((a, b) => b.date.time - a.date.time) // 按时间倒序
  }
})