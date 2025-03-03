import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'

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
        text: '基础',
        items: [
          { text: 'JUC', link: '/06.JUC/1-并发编程基础'},
          { text: 'JVM', link: '/02.JVM/问题分析'},
          { text: '集合', link: '/07.集合/List'},
          { text: '设计模式', link: '/05.设计模式/状态模式'},
        ]
      },
      {
        text: '开发框架',
        items: [
          { text: 'Dubbo', link: '/01.Framework/Dubbo/1-概述'},
          { text: 'Spring', link: '/01.Framework/Spring/11-事务源码分析'},
          { text: 'SpringCloud', link: '/01.Framework/SpringCloud/Sentinel/Sentinel'},
        ]
      },
      {
        text: '数据库',
        items: [
          { text: 'MySQL', link: '/04.数据库/MySQL/02-索引'},
          { text: 'Redis', link: '/04.数据库/Redis/3-架构演进'}
        ]
      },
      {
        text: '消息队列',
        items: [
          { text: 'Kafka', link: '/09.消息队列/Kafka/01.基础术语'}
        ]
      },
      {
        text: '分布式系列',
        items: [
          { text: '唯一ID', link: '/08.分布式系列/1-唯一ID'}
        ]
      },
      {
        text: '日常开发',
        link: '/999.日常开发/1-Maven'
      }
    ],
    sidebar: {
      '/01.Framework/Dubbo/': [
        {
          text: '目录',
          items: [
            { text: '概述', link: '/01.Framework/Dubbo/1-概述' },
            { text: '网络通信', link: '/01.Framework/Dubbo/2-网络通信' },
            { text: '服务发现', link: '/01.Framework/Dubbo/3-服务发现' },
            { text: '流量管控', link: '/01.Framework/Dubbo/4-流量管控' },
            { text: '线程池', link: '/01.Framework/Dubbo/5-线程池' },
            { text: '过滤器', link: '/01.Framework/Dubbo/6-过滤器' },
            { text: '泛化调用', link: '/01.Framework/Dubbo/7-泛化调用' },
          ]
        }
      ],
      '/01.Framework/Spring/': [
        {
          text: '目录',
          items: [
            { text: '事务源码分析', link: '/01.Framework/Spring/11-事务源码分析' }
          ]
        }
      ],
      '/01.Framework/SpringCloud/': [
        {
          text: '目录',
          items: [
            {
              text: 'Sentinel',
              items: [
                { text: '简介', link: '/01.Framework/SpringCloud/Sentinel/Sentinel' }
              ]
            }
          ]
        }
      ],
      '/02.JVM': [
        {
          text: '目录',
          items: [
            { text: '问题排查', link: '/02.JVM/问题分析' }
          ]
        }
      ],
      '/04.数据库/MySQL/': [
        {
          text: '目录',
          items: [
            { text: '索引', link: '/04.数据库/MySQL/02-索引' },
            // { text: '日志', link: '/04.数据库/MySQL/03-日志' },
            // { text: '事务', link: '/04.数据库/MySQL/04-事务' },
            // { text: '锁', link: '/04.数据库/MySQL/05-锁' }
          ]
        }
      ],
      '/04.数据库/Redis/': [
        {
          text: '目录',
          items: [
            { text: '架构演进', link: '/04.数据库/Redis/3-架构演进' }
          ]
        }
      ],
      '/05.设计模式/': [
        {
          text: '目录',
          items: [
            { text: '状态设计模式', link: '/05.设计模式/状态模式' }
          ]
        }
      ],
      '/06.JUC': [
        {
          text: '目录',
          items: [
            { text: '并发编程基础', link: '/06.JUC/1-并发编程基础' },
            { text: 'ThreadLocal', link: '/06.JUC/2-ThreadLocal' },
            { text: 'CAS', link: '/06.JUC/3-CAS' },
            { text: 'AQS', link: '/06.JUC/4-AQS' },
            { text: 'ForkJoin', link: '/06.JUC/5-ForkJoin' },
            { text: 'CompletableFuture', link: '/06.JUC/CompletableFuture' },
            { text: '线程池', link: '/06.JUC/线程池' },
          ]
        }
      ],
      '/07.集合': [
        {
          text: '目录',
          items: [
            { text: 'List', link: '/07.集合/List' },
            { text: 'Map', link: '/07.集合/Map' }
          ]
        }
      ],
      '/08.分布式系列': [
        {
          text: '目录',
          items: [
            { text: '唯一ID', link: '/08.分布式系列/1-唯一ID' }
          ]
        }
      ],
      '/09.消息队列': [
        {
          text: '目录',
          items: [
            {
              text: 'Kafka',
              items: [
                { text: '基础术语', link: '/09.消息队列/Kafka/01.基础术语' }
              ]
            }
          ]
        }
      ],
      '/999.日常开发': [
        {
          text: '目录',
          items: [
            { text: 'Maven', link: '/999.日常开发/1-Maven' },
            { text: '时间传参',link: '/999.日常开发/2-时间传参' }
          ]
        }
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ATQQ/sugar-blog/tree/master/packages/theme'
      }
    ]
  }
})
