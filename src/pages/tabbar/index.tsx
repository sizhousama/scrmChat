import React, { useEffect,useRef } from 'react'
import { AtTabBar } from 'taro-ui'
import './index.scss'
import { useState,forwardRef } from 'react'
import Taro from '@tarojs/taro'

const TabBar = (props) => {
  // const childref = useRef()
  const [current,setCurrent] = useState(0)
  const [tabList,setTabList] = useState(
    [
      {
        title:'消息',
        image:'../../assets/images/chat.png',
        selectedImage:'../../assets/images/chat_act.png'
      },
      {
        title:'通讯录',
        image:'../../assets/images/users.png',
        selectedImage:'../../assets/images/users_act.png'
      },
      {
        title:'我的',
        image:'../../assets/images/mine.png',
        selectedImage:'../../assets/images/mine_act.png'
      }
    ]
  )
  useEffect(()=>{
    setCurrent(props.cur)
  },[])
  const handleClick = v =>{
    if(v===0){
      Taro.switchTab({url:'../chat/index'})
    }
    if(v===1){
      Taro.switchTab({url:'../users/index'})
    }
    if(v===2){
      Taro.switchTab({url:'../mine/index'})
    }
  }
  return (
    <AtTabBar
    fixed
    tabList={tabList}
    onClick={handleClick}
    current={current}
    color='#8a8a8a'
    selectedColor='#f4d231'
  />
  )
}

export default forwardRef(TabBar)
