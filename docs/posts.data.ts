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
  cover: string | undefined // 封面图
  readingTime: number       // 阅读时长 (分钟)
}

// 辅助函数：格式化日期
function formatDate(raw: string | number | Date | undefined): Post['date'] {
  const date = new Date(raw || Date.now())
  return {
    time: +date,
    string: date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
}

// 辅助函数：计算阅读时长 (简单估算：中英文混合，按每分钟 500 字计算)
function getReadingTime(content: string): number {
  if (!content) return 0;
  // 去除 markdown 符号和换行，简单统计字符数
  const text = content.replace(/[#*`~>\[\]\(\)\n\r\-]/g, '');
  const wordCount = text.length;
  return Math.ceil(wordCount / 500) || 1; // 至少 1 分钟
}

export default createContentLoader<Post[]>('**/*.md', {
  excerpt: true, // 提取摘要
  includeSrc: true, // 必须开启，才能获取原始内容计算阅读时长
  transform(raw: ContentData[]): Post[] {
    return raw
      .filter(({ frontmatter }) => frontmatter.tags) // 过滤掉没有 tags 的文章
      .map(({ url, frontmatter, excerpt, src }) => ({
        title: frontmatter.title || url.split('/').pop()?.replace('.md', '') || 'Untitled',
        url,
        excerpt: frontmatter.description || excerpt, // 优先使用 frontmatter 中的 description
        date: formatDate(frontmatter.date),
        tags: (frontmatter.tags as string[]) || [],
        cover: frontmatter.cover || frontmatter.coverImage, // 兼容 cover 或 coverImage 字段
        readingTime: getReadingTime(src || '')
      }))
      .sort((a, b) => b.date.time - a.date.time) // 按日期降序
  }
})