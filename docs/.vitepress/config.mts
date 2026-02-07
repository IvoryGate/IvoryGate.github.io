import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import { withMermaid } from 'vitepress-plugin-mermaid'
import markdownItTaskList from 'markdown-it-task-lists'
import viteImagemin from 'vite-plugin-imagemin'

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  head: [
    ["link", { rel: "icon", href: "/folder.svg" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    ["link", { rel: "preload", href: "/folder.svg", as: "image" }]
  ],
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
      { text: 'Moments', link: '/moments'},
      { text: 'Articles', link: '/tags' },
      { text: 'Timeline', link: '/articles-timeline' }
    ],
    sidebar: generateSidebar([
      {
        documentRootPath: 'docs',
        scanStartPath: 'python',
        resolvePath: '/python/',
        useTitleFromFileHeading: true,
        collapsed: false,
        sortMenusByFrontmatterOrder: true,
        ignore: ['articles-timeline.md', 'index-index.md', 'moments.md', 'tags.md']
      },
      {
        documentRootPath: 'docs',
        scanStartPath: 'git',
        resolvePath: '/git/',
        useTitleFromFileHeading: true,
        collapsed: true,
        sortMenusByFrontmatterOrder: true,
        ignore: ['articles-timeline.md', 'index-index.md', 'moments.md', 'tags.md']
      },
      {
        documentRootPath: 'docs',
        scanStartPath: 'Ads',
        resolvePath: '/Ads/',
        useTitleFromFileHeading: true,
        collapsed: true,
        sortMenusByFrontmatterOrder: true,
        ignore: ['articles-timeline.md', 'index-index.md', 'moments.md', 'tags.md']
      },
      {
        documentRootPath: 'docs',
        scanStartPath: 'English',
        resolvePath: '/English/',
        useTitleFromFileHeading: true,
        collapsed: true,
        sortMenusByFrontmatterOrder: true,
        ignore: ['articles-timeline.md', 'index-index.md', 'moments.md', 'tags.md']
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
      md.use(markdownItTaskList, { enabled: true });
    }
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'markdown': ['markdown-it', 'markdown-it-mathjax3'],
            'vue-vendor': ['vue'],
            'mermaid': ['mermaid'],
            'icons': ['vitepress-sidebar']
          }
        }
      }
    },
    plugins: [
      viteImagemin({
        gifsicle: { optimizationLevel: 7 },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 80 },
        webp: { quality: 75 }
      })
    ]
  },
}))
