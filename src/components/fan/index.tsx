import React, { forwardRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import {imgUrl} from '@/servers/baseUrl'
import './index.scss'

const Fan = (props, ref) => {
  const imgurl = imgUrl()
  return (
    <View className='fanbox'>
      <View className='left'>
        <Image 
        className='head' 
        src={`${imgurl}/header/${props.pageId}/${props.senderId}.jpg`}></Image>
      </View>
      <View className='right'>
        <View className='top'>
          <Text className='name'>{props.name}</Text>
        </View>
        <View className='bot'>
          <Text className='newmsg break'>pageId：{props.pageId}</Text>
        </View>
      </View>
    </View>
  )
}

export default forwardRef(Fan)
