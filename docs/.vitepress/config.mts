import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// 如果项目名已经为 name.github.io 域名，则不需要修改！
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/coding/',
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  // base,
  lang: 'zh-cn',
  title: '城南花已开',
  description: '粥里有勺糖的博客主题，基于 vitepress 实现',
  lastUpdated: false,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 6],
      label: '目录'
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    lastUpdatedText: '上次更新于',

    // 设置logo
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      {
        text: '开发框架',
        items: [
          { text: 'Dubbo', link: '/01.Framework/Dubbo/1-概述'},
          { text: 'Spring', link: '/01.Framework/Spring/'}
        ]
      },
      {
        text: '分布式系列',
        items: [
          { text: 'RPC', link: '/03.RPC/RPC系列/01.概述'}
        ]
      },
      {
        text: 'Java',
        items: [
          { text: 'JVM', link: '/02.JVM/index'},
          { text: 'JUC', link: '/06.JUC/CompletableFuture'},
        ]
      },
      {
        text: '数据库',
        items: [
          { text: 'Redis', link: '/04.数据库/Redis/3-架构演进'},
          { text: 'MySQL', link: '/04.数据库/MySql/index'}
        ]
      },
      {
        text: '设计模式',
        link: '/05.设计模式/index'
      }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ATQQ/sugar-blog/tree/master/packages/theme'
      }
    ]
  }
})
