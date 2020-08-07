import React, { useEffect, useRef } from 'react'
// import { AtTabBar } from 'taro-ui'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { useState, forwardRef } from 'react'
import Taro from '@tarojs/taro'

const TabBar = (props,ref) => {
  // const childref = useRef()
  const [tabList, setTabList] = useState(
    [
      {
        title: '',
        image: '../../assets/images/chat.png',
        selectedImage: '../../assets/images/chat_act.png'
      },
      {
        title: '',
        image: '../../assets/images/fans.png',
        selectedImage: '../../assets/images/fans_act.png'
      },
      {
        title: '',
        image: '../../assets/images/mine.png',
        selectedImage: '../../assets/images/mine_act.png'
      }
    ]
  )
  const handleClick = v => {
    const id = v.currentTarget.dataset.key
    if (id === 0) {
      Taro.switchTab({ url: '../chat/index' })
    }
    if (id === 1) {
      Taro.switchTab({ url: '../users/index' })
    }
    if (id === 2) {
      Taro.switchTab({ url: '../mine/index' })
    }
  }
  return (
    <View className='tabbar'>
      {
        tabList.map((item, index) => {
          return (
            <View
              className='tab'
              key={index}
              onClick={handleClick}
              data-key={index}
            >
              <Image src={props.cur === index ? item.selectedImage : item.image} />
            </View>
          )
        })
      }
    </View>
  )
}

export default forwardRef(TabBar)
