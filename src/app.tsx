import React, { useEffect } from 'react'
import { Provider } from 'mobx-react'
import { stores, StoresContext } from './store';
import 'taro-ui/dist/style/index.scss'
import './app.scss'
import './icon.scss'
import 'mobx-react-lite/batchingForReactDom'
import { observer } from 'mobx-react';
import Taro from '@tarojs/taro'

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
