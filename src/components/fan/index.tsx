import React, { forwardRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import {imgUrl} from '@/servers/baseUrl'
import {NavTo} from '@/utils/index'
import { observer } from 'mobx-react';
import { useFanStore } from '@/store';
import './index.scss'

const Fan = (props, ref) => {
  const imgurl = imgUrl()
  const {setFan} = useFanStore()
  const gofanpage=()=>{
    setFan(props.fan)
    NavTo('/pages/fanPage/index')
  }
  return (
    <View className='fanbox' onClick={gofanpage}>
      <View className='left'>
        <Image 
        className='head' 
        src={`${imgurl}/header/${props.fan.pageId}/${props.fan.senderId}.jpg`}></Image>
      </View>
      <View className='right'>
        <View className='top'>
          <Text className='name'>{props.fan.facebookName}</Text>
        </View>
        <View className='bot'>
          <Text className='newmsg break'>主页：{props.fan.pageName}</Text>
        </View>
      </View>
    </View>
  )
}

export default observer(forwardRef(Fan))
