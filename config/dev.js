module.exports = {
  env: {
    NODE_ENV:'"development"'  //'"production"',
  },
  defineConstants: {
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        },
        // 小程序端样式引用本地资源内联配置
        url: {
          enable: true,
          config: {
            limit: 1024000 // 文件大小限制
          }
        }
      }
    }
  },
  copy: {
    patterns: [
      { from: 'sitemap.json', to: 'dist/sitemap.json' }, // 指定需要 copy 的文件
      { from: 'src/assets/icon/', to: 'dist/assets/icon/' }
    ]
  }
}
