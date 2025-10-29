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
  description: '',
  lastUpdated: false,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  markdown: {
    lineNumbers: true
  },
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
          { text: 'JUC', link: '/1-基础/JUC/1-并发编程基础'},
          { text: 'JVM', link: '/1-基础//JVM/问题分析'},
          { text: '集合', link: '/1-基础/集合/List'},
          { text: '设计模式', link: '/1-基础/设计模式/状态模式'},
        ]
      },
      {
        text: '开发框架',
        items: [
          { text: 'Dubbo', link: '/2-Framework/Dubbo/1-概述'},
          { text: 'Spring', link: '/2-Framework/Spring/11-事务源码分析'},
          { text: 'SpringBoot', link: '/2-Framework/SpringBoot/启动流程'},
          { text: 'SpringCloud', link: '/2-Framework/SpringCloud/Sentinel/Sentinel'},
        ]
      },
      {
        text: '数据库',
        link: '/3-数据库/MySQL/1-索引'
      },
      {
        text: '中间件',
        items: [
          { text: '消息队列', link: '/7-消息队列/Kafka/01.基础术语'}
        ]
      },
      {
        text: '分布式系列',
        items: [
          { text: '唯一ID', link: '/5-分布式系列/1-唯一ID'},
          { text: 'Netty', link: '/5-分布式系列/Netty/NIO/传统网络开发'}
        ]
      },
      {
        text: '部署',
        items: [
          { text: 'Linux', link: '/4-部署/Linux/Shell脚本'}
        ]
      },
      {
        text: '日常学习',
        link: '/日常开发/日常开发篇/1-Maven'
      }
    ],
    sidebar: {
      '1-基础/JVM': [
        {
          text: '目录',
          items: [
            { text: '问题排查', link: '/1-基础/JVM//问题分析' }
          ]
        }
      ],
      '1-基础/设计模式': [
        {
          text: '目录',
          items: [
            { text: '状态设计模式', link: '/1-基础/设计模式/状态模式' },
            { text: '适配器设计模式', link: '/1-基础/设计模式/适配器模式' },
            { text: '观察者设计模式', link: '/1-基础/设计模式/观察者模式' },
          ]
        }
      ],
      '/1-基础/JUC': [
        {
          text: '目录',
          items: [
            { text: '并发编程基础', link: '/1-基础/JUC/1-并发编程基础' },
            { text: 'ThreadLocal', link: '/1-基础/JUC/2-ThreadLocal' },
            { text: 'CAS', link: '/1-基础/JUC/3-CAS' },
            { text: 'AQS', link: '/1-基础/JUC/4-AQS' },
            { text: 'ForkJoin', link: '/1-基础/JUC/5-ForkJoin' },
            { text: 'CompletableFuture', link: '/1-基础/JUC/6-CompletableFuture' },
            { text: '线程池', link: '/1-基础/JUC/7-线程池' },
          ]
        }
      ],
      '/1-基础/集合': [
        {
          text: '目录',
          items: [
            { text: 'List', link: '/1-基础/集合/List' },
            { text: 'Map', link: '/1-基础/集合/Map' }
          ]
        }
      ],
      '/2-Framework/Dubbo/': [
        {
          text: '目录',
          items: [
            { text: '概述', link: '/2-Framework/Dubbo/1-概述' },
            { text: '网络通信', link: '/2-Framework/Dubbo/2-网络通信' },
            { text: '服务发现', link: '/2-Framework/Dubbo/3-服务发现' },
            { text: '流量管控', link: '/2-Framework/Dubbo/4-流量管控' },
            { text: '线程池', link: '/2-Framework/Dubbo/5-线程池' },
            { text: '过滤器', link: '/02-Framework/Dubbo/6-过滤器' },
            { text: '泛化调用', link: '/2-Framework/Dubbo/7-泛化调用' },
          ]
        }
      ],
      '/2-Framework/Spring/': [
        {
          text: '目录',
          items: [
            { text: '事务源码分析', link: '/2-Framework/Spring/11-事务源码分析' }
          ]
        }
      ],
      '/2-Framework/SpringBoot/': [
        {
          text: '目录',
          items: [
            { text: '启动流程', link: '/2-Framework/SpringBoot/启动流程' }
          ]
        }
      ],
      '/2-Framework/SpringCloud/': [
        {
          text: '目录',
          items: [
            {
              text: 'Sentinel',
              items: [
                { text: '简介', link: '/2-Framework/SpringCloud/Sentinel/Sentinel' }
              ]
            }
          ]
        }
      ],
      '/3-数据库': [
        {
          items: [
            {
              text: 'MySQL',
              items: [
                { text: '索引', link: '/3-数据库/MySQL/1-索引' },
                { text: '日志', link: '/3-数据库/MySQL/2-日志' },
                { text: '事务', link: '/3-数据库/MySQL/3-事务' },
                { text: '锁', link: '/3-数据库/MySQL/4-锁' }
              ]
            },
            {
              text: 'Redis',
              items: [
                { text: '数据结构', link: '/3-数据库/Redis/1-数据结构' },
                { text: '架构演进', link: '/3-数据库/Redis/3-架构演进' }
              ]
            }
          ]
        }
      ],
      '/4-部署': [
        {
          items: [
            {
              text: 'Linux',
              items: [
                { text: 'Shell脚本', link: '/4-部署/Linux/Shell脚本' }
              ]
            }
          ]
        }
      ],
      '/5-分布式系列': [
        {
          text: '目录',
          items: [
            { text: '唯一ID', link: '/5-分布式系列/1-唯一ID' }
          ]
        }
      ],
      '/5-分布式系列/Netty': [
        {
          text: '目录',
          items: [
            {
              text: 'NIO',
              items: [
                { text: '传统网络开发', link: '/5-分布式系列/Netty/NIO/传统网络开发' }
              ]
            }
          ]
        }
      ],
      '/7-消息队列': [
        {
          items: [
            {
              text: 'Kafka',
              items: [
                { text: '基础术语', link: '/7-消息队列/Kafka/01.基础术语' },
                { text: '环境搭建', link: '/7-消息队列/RocketMQ/02.环境搭建' }
              ]
            },
              {
                  text: 'RocketMQ',
                  items: [
                      { text: '消息类型', link: '/7-消息队列/RocketMQ/消息类型' },
                      { text: '消费者特性', link: '/7-消息队列/RocketMQ/消费者特性' },
                  ]
              }
          ]
        }
      ],
      '/日常开发': [
        {
          text: '目录',
          items: [
            {
              text: '日常开发',
              collapsed: true,
              items: [
                { text: 'Maven', link: '/日常开发/日常开发篇/1-Maven' },
                { text: '时间传参',link: '/日常开发/日常开发篇/2-时间传参' }
              ]

            },
            {
              text: '缓存篇',
              collapsed: true,
              items: [
                  { text: "Redis缓存", link: '/日常开发/缓存篇/Redis缓存'},
                  { text: "本地缓存", link: '/日常开发/缓存篇/本地缓存'},
              ]
            },
            {
              text: "工具集成篇",
              collapsed: true,
              items: [
                { text: 'H2', link: '/日常开发/工具集成篇/集成H2' },
                { text: 'Knife4j', link: '/日常开发/工具集成篇/集成Knife4j' },
              ]
            }
          ]
        }
      ],
    },
    socialLinks: []
  }
})
