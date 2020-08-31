import React, { useEffect, useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { forwardRef } from 'react'
import { observer } from 'mobx-react';
import { useFanStore } from '@/store';
import { AtBadge } from 'taro-ui'
import { imgUrl } from '@/servers/baseUrl'
import { NavTo } from '@/utils/index'
const ChatFan = (props, ref) => {
  const imgurl = imgUrl()
  const { fan, setFan } = useFanStore()
  const goChat = () => {
    console.log(props.fan)
    props.handleClick(props.fan)
    setFan(props.fan)
    NavTo('/pages/liveChat/index')
  }
  return (
    <View className='fanbox' onClick={goChat}>
      <View className='left'>
        <AtBadge className='badge' dot={props.fan.read === 0}>
          <Image
            className='head'
            src={`${imgurl}/header/${props.fan.pageId}/${props.fan.fanId}.jpg`}></Image>
        </AtBadge>
      </View>
      <View className='right'>
        <View className='top'>
          <Text className='name'>{props.fan.fanName}</Text>
          <Text className='page break'>{props.fan.pageName}</Text>
        </View>
        <View className='tagbox'>
          {
            props.fan.tagsArr.map((tag, i) => {
              return <Text key={tag + i} className='tag break'>{tag}</Text>
            })
          }
        </View>
        <View className='bot'>
          <Text className='newmsg break'>{props.fan.msg}</Text>
          <Text className='date'>{props.fan.formatTime}</Text>
        </View>
      </View>
    </View>
  )
}

export default observer(forwardRef(ChatFan))
