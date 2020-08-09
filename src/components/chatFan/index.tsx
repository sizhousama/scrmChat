import React, { useEffect, useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { forwardRef } from 'react'
import { AtBadge } from 'taro-ui'
import { imgUrl } from '@/servers/baseUrl'

const ChatFan = (props, ref) => {
  const imgurl = imgUrl()
  // useEffect(()=>{
  //   console.log(props)
  // },[])
  return (
    <View className='fanbox'>
      <View className='left'>
        <AtBadge value={''} maxValue={99}>
          <Image
            className='head'
            src={`${imgurl}/header/${props.pageId}/${props.fanId}.jpg`}></Image>
        </AtBadge>
      </View>
      <View className='right'>
        <View className='top'>
          <Text className='name'>{props.fanName}</Text>
          <Text className='page break'>{props.pageName}</Text>
          <View className='tagbox'>
            {
              props.tagsArr.map((tag, i) => {
                return <Text key={tag + i} className='tag break'>{tag}</Text>
              })
            }
          </View>
        </View>
        <View className='bot'>
          <Text className='newmsg break'>{props.msg}</Text>
          <Text className='date'>2020/05/05</Text>
        </View>
      </View>
    </View>
  )
}

export default forwardRef(ChatFan)
