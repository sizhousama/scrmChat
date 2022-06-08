import React, { forwardRef, useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import {imgUrl} from '@/servers/baseUrl'
import {NavTo} from '@/utils/index'
import { observer } from 'mobx-react';
import { useFanStore, useUserStore } from '@/store';
import { AtAvatar } from 'taro-ui';
import './index.scss'


const Fan = (props, ref) => {
  const imgurl = imgUrl()
  const { setFan } = useFanStore()
  const { type } = useUserStore()
  const [error, setError] = useState(false)

  const gofanpage=()=>{
    setFan(props.fan)
    NavTo('/pages/fanInfo/index?from=user')
  }

  const fanHeader = () =>{
    switch(type){
      case 'messenger': return (
        <AtAvatar circle image={`${imgurl}/header/${props.fan.pageId}/${props.fan.senderId}.jpg`}></AtAvatar>
      )
      case 'whatsapp': return (
        <AtAvatar circle text={props.fan.username}></AtAvatar>
      )
      case 'ins': return (
        !error ? <Image
          className='head'
          src={`${imgurl}/instagram/header/${props.fan.instagramAccountId}/${props.fan.instagramUserId}.jpg`}
          onError={()=>setError(true)}
        ></Image>
        : <AtAvatar circle text={props.fan.username}></AtAvatar>
      )
    }
  }

  const fanName = () =>{
    switch(type){
      case 'messenger': return (
        <Text className='name'>{props.fan.facebookName}</Text>
      )
      case 'whatsapp': return (
        <Text className='name'>{props.fan.username}</Text>
      )
      case 'ins': return (
        <Text className='name'>{props.fan.username}</Text>
      )
    }
  }

  const fanInfo = () =>{
    switch(type){
      case 'messenger': return (
        <Text className='newmsg break'>主页：{props.fan.pageName}</Text>
      )
      case 'whatsapp': return (
        <Text className='newmsg break'>手机：{props.fan.whatsappUserIdShow}</Text>
      )
      case 'ins': return (
        <Text className='newmsg break'>所属账号：{props.fan.instagramAccountName}</Text>
      )
    }
  }

  return (
    <View className='fanbox' onClick={gofanpage}>
      <View className='left'>
        {fanHeader()}
      </View>
      <View className='right'>
        <View className='top'>
          {fanName()}
        </View>
        <View className='bot'>
          {fanInfo()}
          <Text className='time break'>{props.fan.lasttime}</Text>
        </View>
      </View>
    </View>
  )
}

export default observer(forwardRef(Fan))
