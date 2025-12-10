import { createContentLoader, type ContentData } from 'vitepress'

// 定义返回的数据结构接口
export interface Post {
  title: string
  url: string
  excerpt: string | undefined
  date: {
    time: number
    string: string
  }
  tags: string[]
}

// 辅助函数：格式化日期
function formatDate(raw: string | number | Date | undefined): Post['date'] {
  const date = new Date(raw || Date.now())
  return {
    time: +date,
    string: date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

export default createContentLoader<Post[]>('**/*.md', {
  excerpt: true, // 提取摘要
  transform(raw: ContentData[]): Post[] {
    // 过滤掉没有 frontmatter.tags 的文章，并重新映射数据结构
    return raw
      .filter(({ frontmatter }) => frontmatter.tags)
      .map(({ url, frontmatter, excerpt }) => ({
        // 处理可能为 undefined 的情况
        title: frontmatter.title || url.split('/').pop()?.replace('.md', '') || 'Untitled',
        url,
        excerpt,
        date: formatDate(frontmatter.date),
        tags: (frontmatter.tags as string[]) || []
      }))
      .sort((a, b) => b.date.time - a.date.time) // 按日期降序
  }
})