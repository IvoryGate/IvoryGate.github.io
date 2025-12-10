import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [["link", { rel: "icon", href: "/folder.svg" }]],
  title: "IvoryGate的个人知识库",
  description: "Personal Knowledge Base",
  themeConfig: {
    logo: "/folder.svg",
    outlineTitle: "目录",
    outline:[2,6],
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {text: 'Moments', link: '/'},
      { text: 'tags', link: '/tags' },
    ],

    sidebar: generateSidebar([
      {
        documentRootPath: 'docs',
        scanStartPath: 'PYTHON',
        resolvePath: '/PYTHON/',
        useTitleFromFileHeading: true,
        collapsed: false,         // 是否折叠
        sortMenusByFrontmatterOrder: true
        // manualSortFileNameByPriority: ['intro.md', 'installation.md'] // 手动排序
      }
    ]),
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present IvoryGate',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/IvoryGate' }
    ],
       // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  },
  markdown: {
    math: true,
    lineNumbers: true
  }
})
