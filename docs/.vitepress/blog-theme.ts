// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node'


// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  recommend: false,
  tabs: true,
  mermaid: true,
  article: {
    hiddenCover: true,
    readingTime: true
  },
  hotArticle: false,
  search: false,
  footer: {
    message: 'Released under the MIT License.',
    copyright: 'Copyright © 2019-present Evan You'
  },
  home: {
    avatarMode: 'card',
    analysis: {
      articles: {
        title: ['']
      }
    }
  },

  // 主题色修改
  themeColor: 'vp-default',

  // 文章默认作者
  author: '城南花已开',

  oml2d: {
    mobileDisplay: true,
    models: [
      {
        path: 'https://registry.npmmirror.com/oml2d-models/latest/files/models/Senko_Normals/senko.model3.json'
      }
    ]
  },
  comment: {
    type: 'giscus',
    options: {
      repo: 'freedom0123/coding',
      repoId: 'R_kgDONdkf8A',
      category: 'Announcements',
      categoryId: 'DIC_kwDONdkf8M4Cng56',
      inputPosition: 'top'
    },
    mobileMinify: true
  }
})

export { blogTheme }
