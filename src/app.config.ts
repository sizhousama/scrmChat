
export default {
  pages: [
    'pages/chat/index',
    'pages/order/index',
    'pages/login/index',
    'pages/liveChat/index',
    'pages/liveChatWa/index',
    'pages/liveChatIns/index',
    'pages/mine/index',
    'pages/fanInfo/index',
    'pages/myInsPages/index',
    'pages/myPages/index',
    'pages/myAccounts/index',
    'pages/rePassword/index',
    'pages/tags/index',
    'pages/myInfo/index',
    'pages/search/index',
    'pages/users/index',
    'pages/platform/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    list: [{
      pagePath: 'pages/chat/index',
      text: '消息',
      iconPath: './assets/images/wechat.png',
      selectedIconPath: './assets/images/wechat.png'
    },
    {
      pagePath: 'pages/users/index',
      text: '通讯录',
      iconPath: './assets/images/wechat.png',
      selectedIconPath: './assets/images/wechat.png'
    },
    {
      pagePath: 'pages/mine/index',
      text: '我的',
      iconPath: './assets/images/wechat.png',
      selectedIconPath: './assets/images/wechat.png'
    }
    ],
    color: '#8a8a8a',
    selectedColor: '#f4d231',
    backgroundColor: '#ffffff',
    borderStyle: 'black'
  },
}
