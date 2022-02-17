import React, { forwardRef, useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { observer } from 'mobx-react';
import { useFanStore,useUserStore } from '@/store';
import { AtAvatar, AtBadge } from 'taro-ui'
import { imgUrl } from '@/servers/baseUrl'
import { NavTo } from '@/utils/index'
import './index.scss'

const ChatFan = (props, ref) => {
  const imgurl = imgUrl()
  const [error, setError] = useState(false)
  const { setFan } = useFanStore()
  const { type ,themeColor } = useUserStore()

  const goChat = () => {
    props.handleClick(props.fan)
    setFan(props.fan)
    if(type ==='messenger') NavTo('/pages/liveChat/index')
    if(type ==='whatsapp') NavTo('/pages/liveChatWa/index')
    if(type ==='ins') NavTo('/pages/liveChatIns/index')
  }

  const tagStyle = () => {
    switch(type){
      case 'messenger': return { background: '#eef1fa', color: themeColor }
      case 'whatsapp': return { background: '#e7f8f4', color: themeColor }
      case 'ins': return { background: '#f8eef5', color: themeColor }
      default: return { background: '#eef1fa', color: themeColor }
    }
  }

  const fanHeader = () =>{
    switch(type){
      case 'messenger': return (
        <AtAvatar circle image={`${imgurl}/header/${props.fan.pageId}/${props.fan.fanId}.jpg`}></AtAvatar>
      )
      case 'whatsapp': return (
        <AtAvatar circle text={props.fan.whatsappUserName}></AtAvatar>
      )
      case 'ins': return (
        !error ? <Image
          className='head'
          src={`${imgurl}/instagram/header/${props.fan.instagramAccountId}/${props.fan.instagramUserId}.jpg`}
          onError={()=>setError(true)}
        ></Image>
        : <AtAvatar circle text={props.fan.instagramUserName}></AtAvatar>
      )
    }
  }

  const fanInfo = () =>{
    if(type === 'messenger'){
      return (
        <View className='top'>
          <Text className='name'>{props.fan.fanName}</Text>
          <Text className='page break'>{props.fan.pageName}</Text>
        </View>
      )
    }
    if(type === 'whatsapp'){
      return (
        <View className='top'>
          <Text className='name'>{props.fan.whatsappUserName}({props.fan.whatsappAccountName})</Text>
        </View>
      )
    }
    if(type === 'ins'){
      return (
        <View className='top'>
          <Text className='name'>{props.fan.instagramUserName}</Text>
          <Text className='page break'>{props.fan.instagramAccountName}</Text>
        </View>
      )
    }
  }

  return (
    <View className='fanbox' onClick={goChat}>
      <View className='left'>
        <AtBadge className='badge' dot={props.fan.read === 0}>
          {fanHeader()}
        </AtBadge>
      </View>
      <View className='right'>
        {fanInfo()}
        <View className='tagbox'>
          {
            props.fan.tagsArr.map((tag, i) => {
              return <Text key={tag + i} className='tag break' style={tagStyle()}>{tag}</Text>
            })
          }
        </View>
        <View className='bot'>
          <Text className='newmsg break'>{props.fan.msg}</Text>
          <Text className='date break'>{props.fan.formatTime}</Text>
        </View>
      </View>
    </View>
  )
}

export default observer(forwardRef(ChatFan))
