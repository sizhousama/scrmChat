
export default {
  pages: [
    'pages/login/index',
    'pages/chat/index',
    'pages/users/index',
    'pages/mine/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom:true,
    list: [{
      pagePath: 'pages/chat/index',
      text: '消息',
      iconPath: './assets/images/chat.png',
      selectedIconPath: './assets/images/chat_act.png'
    },
    {
      pagePath: 'pages/users/index',
      text: '通讯录',
      iconPath: './assets/images/users.png',
      selectedIconPath: './assets/images/users_act.png'
    },
    {
      pagePath: 'pages/mine/index',
      text: '我的',
      iconPath: './assets/images/mine.png',
      selectedIconPath: './assets/images/mine_act.png'
    }    
  ],
    color: '#8a8a8a',
    selectedColor: '#f4d231',
    backgroundColor: '#ffffff',
    borderStyle: 'black'
  },
}
