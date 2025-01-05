// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node'


// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  recommend: {
    style: 'sidebar',
    sort: 'filename',
    title: '目录'
  },
  tabs: true,
  mermaid: true,
  article: {
    hiddenCover: true
  },
  hotArticle: false,
  search: false,
  footer: {
    version: false
  },

  // 主题色修改
  themeColor: 'el-blue',

  // 文章默认作者
  author: '城南花已开',
})

export { blogTheme }
