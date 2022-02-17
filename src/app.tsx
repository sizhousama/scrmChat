import React, { useEffect } from 'react'
import { Provider, observer } from 'mobx-react'
import 'taro-ui/dist/style/index.scss'
import Taro from '@tarojs/taro'
import { stores, StoresContext } from './store';
import './app.scss'
import './icon.scss'

// cnpm install taro-ui@3.0.0-alpha.3

const App = (props) => {
  
  useEffect(() => {
    // 检查是否授权
    Taro.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 检查授权登录是否过期
          // Taro.checkSession({
          //   success(res) {
          //     console.log('已授权')
          //   },
          //   fail(err) {
          //     Toast('授权过期！','none')
          //     redirectTo('/pages/login/index')
          //   }
          // })
        } else {
          console.log('未授权')
        }
      }
    })
  }, [])
  
  return (
    <Provider {...stores}>
      <StoresContext.Provider value={stores}>
        {props.children}
      </StoresContext.Provider>
    </Provider>
  )
}

export default observer(App)
