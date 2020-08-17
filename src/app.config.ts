
export default {
  pages: [
    'pages/liveChat/index',
    'pages/mine/index',
    
    
    'pages/chat/index',
    'pages/rePassword/index',
    'pages/tags/index',
    'pages/myInfo/index',
    'pages/search/index',
    
    'pages/login/index',
    'pages/users/index'
    
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
      iconPath: './assets/images/fans.png',
      selectedIconPath: './assets/images/fans_act.png'
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
