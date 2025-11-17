import { defineConfig } from 'vitepress'
import { set_sidebar } from "./utils/auto_sidebar.mjs";

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
      { text: 'Documents', link: '/documents.md' }
    ],

    sidebar: {
      "/PYTHON": set_sidebar("/PYTHON"),
    },
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
    math: true
  }
})
