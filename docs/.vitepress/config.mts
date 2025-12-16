import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import { withMermaid } from 'vitepress-plugin-mermaid'
import markdownItTaskList from 'markdown-it-task-lists';

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  head: [["link", { rel: "icon", href: "/folder.svg" }]],
  title: "风驻云不归的博客",
  description: "Personal Knowledge Base",
  mermaid: {
    // 例如：设置默认主题
    theme: 'default', 
  },
  themeConfig: {
    logo: "/folder.svg",
    outlineTitle: "目录",
    outline:[2,6],
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {text: 'Moments', link: '/moments'},
      { text: 'Articles', link: '/tags' }
    ],
    sidebar: generateSidebar([
      {
        documentRootPath: 'docs',
        scanStartPath: 'python',
        resolvePath: '/python/',
        useTitleFromFileHeading: true,
        collapsed: false,         // 是否折叠
        sortMenusByFrontmatterOrder: true
        // manualSortFileNameByPriority: ['intro.md', 'installation.md'] // 手动排序
      },
      {
        documentRootPath: 'docs',
        scanStartPath: 'git',
        resolvePath: '/git/',
        useTitleFromFileHeading: true,
        collapsed: false,         // 是否折叠
        sortMenusByFrontmatterOrder: true
        // manualSortFileNameByPriority: ['intro.md', 'installation.md'] // 手动排序
      },
      {
        documentRootPath: 'docs',
        scanStartPath: 'Ads',
        resolvePath: '/Ads/',
        useTitleFromFileHeading: true,
        collapsed: false,         // 是否折叠
        sortMenusByFrontmatterOrder: true
        // manualSortFileNameByPriority: ['intro.md', 'installation.md'] // 手动排序
      },
      {
        documentRootPath: 'docs',
        scanStartPath: 'English',
        resolvePath: '/English/',
        useTitleFromFileHeading: true,
        collapsed: false,         // 是否折叠
        sortMenusByFrontmatterOrder: true
        // manualSortFileNameByPriority: ['intro.md', 'installation.md'] // 手动排序
      }
    ]),
    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2025-present IvoryGate',
    // },
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
    lineNumbers: true,
    config: (md) => {
      // 使用 markdown-it-task-lists 插件
      // 默认配置下，复选框是禁用的（disabled），需要点击才能更改状态。
      // 传入 true，表示复选框在非渲染状态下也是可交互的。
      md.use(markdownItTaskList, { enabled: true }); 
    }
  },
}))
