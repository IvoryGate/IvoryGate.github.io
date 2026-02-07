import fs from 'fs'
import matter from 'gray-matter'

function generateIndex() {
  const docsDir = 'docs'
  const years = getYearsFromFiles(docsDir)
  const indexContent = generateYearIndexContent(years)

  fs.writeFileSync('docs/index-index.md', indexContent)
  console.log(`✓ 内容索引已生成，包含 ${years.length} 个年份`)
  console.log(`  年份: ${years.join(', ')}`)
}

function getYearsFromFiles(dir: string): number[] {
  const files = getAllMarkdownFiles(dir)
  const years = new Set<number>()
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8')
    const { frontmatter } = matter(content)
    const date = frontmatter?.date
    const year = date ? new Date(date).getFullYear() : new Date().getFullYear()
    years.add(year)
  })
  return Array.from(years).sort((a, b) => b - a)
}

function generateYearIndexContent(years: number[]): string {
  let content = '# 📚 内容索引\n\n按时间浏览所有内容\n\n'
  years.forEach(year => {
    content += `## 📅 ${year}年\n\n`
    content += `<!-- ${year} -->\n\n`
  })
  return content
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

generateIndex()
