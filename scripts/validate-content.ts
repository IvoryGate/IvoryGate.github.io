import fs from 'fs'
import matter from 'gray-matter'

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateContent(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // 检查docs目录下所有md文件
  const docsDir = 'docs'
  const files = getAllMarkdownFiles(docsDir)

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8')
    const { frontmatter, content: markdown } = matter(content)

    // 检查必填字段
    if (!frontmatter.title) {
      errors.push(`文件 ${file}: 缺少 title 字段`)
    }

    if (!frontmatter.date) {
      warnings.push(`文件 ${file}: 缺少 date 字段，将使用文件修改时间`)
    }

    if (!frontmatter.tags || frontmatter.tags.length === 0) {
      warnings.push(`文件 ${file}: 缺少 tags 字段，建议添加标签分类`)
    }

    // 检查图片引用
    const images = extractImages(markdown)
    images.forEach(img => {
      if (!isValidImagePath(img)) {
        warnings.push(`文件 ${file}: 图片路径可能无效 ${img}`)
      }
    })
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

function getAllMarkdownFiles(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = `${dir}/${entry.name}`
    if (entry.isDirectory()) {
      getAllMarkdownFiles(path, files)
    } else if (entry.name.endsWith('.md')) {
      files.push(path)
    }
  }
  return files
}

function extractImages(markdown: string): string[] {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  const images: string[] = []
  let match
  while ((match = imageRegex.exec(markdown)) !== null) {
    images.push(match[2])
  }
  return images
}

function isValidImagePath(path: string): boolean {
  // 检查是否是相对路径且存在于public目录
  if (path.startsWith('/')) {
    const publicPath = path.replace(/^\//, 'public/')
    return fs.existsSync(publicPath)
  }
  return true
}
