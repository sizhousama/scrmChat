import React from 'react'
import { AtTabBar } from 'taro-ui'
// import { View } from '@tarojs/components'
import './index.scss'
import { useState } from 'react'

function TabBar() {
  const [current,setCurrent] = useState(0)
  const [tabList,setTabList] = useState(
    [
      {
        title:'消息',
        image:'../assets/images/chat.png',
        selectedImage:'../assets/images/chat_act.png'
      },
      {
        title:'通讯录',
        image:'../assets/images/users.png',
        selectedImage:'../assets/images/users_act.png'
      },
      {
        title:'我的',
        image:'../assets/images/mine.png',
        selectedImage:'../assets/images/mine_act.png'
      }
    ]
  )
  function handleClick(v){
    setCurrent(v)
  }
  return (
    <AtTabBar
    tabList={tabList}
    onClick={handleClick}
    current={current}
  />
  )
}

export default TabBar
