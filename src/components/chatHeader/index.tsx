import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, Picker } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { Back, getSysInfo } from '@/utils/index'
import livechat from '@/assets/images/livechat.png'
import user from '@/assets/images/mine.png'
import './index.scss'
import { forwardRef } from 'react'

const ChatHeader = (props, ref) => {
  const [blockStyle, setStyle] = useState({})
  const [services, setServices] = useState(['1234567891111', '2', '3', '4'])
  const [selectSer, setSelectSer] = useState('1234567891111')
  useEffect(() => {
    const barHeight = getSysInfo().statusBarHeight
    setStyle({
      width: "100%",
      height: barHeight + 44 + 'px',
      background: "#fff"
    })
  }, [])
  const onChange = (e) => {
    setSelectSer(services[e.detail.value])
  }
  return (
    <View>
      <View style={blockStyle}></View>
      <View className='chatinfo' style={{ height: '44px' }}>
        <View className='icon'>
          <Image src={livechat}></Image>
        </View>
        <View className='left'>
          <Text className='name'>{props.fan.fanName}</Text>
          <Text className='pageid'>主页ID：{props.fan.pageId}</Text>
        </View>
        <View className='right'>
          <Image src={user}></Image>
        </View>
      </View>
      <View className='navbar' style={{ height: '44px' }}>
        <View className='left' onClick={Back}>
          <View className='at-icon at-icon-chevron-left'></View>
        </View>
        <View className='right'>
          <View className='serselect'>
            <View className='at-icon at-icon-chevron-down'></View>
            <Picker className='picker' mode='selector' value={0} range={services} onChange={onChange}>
              <AtList>
                <AtListItem extraText={selectSer} />
              </AtList>
            </Picker>
          </View>
        </View>
      </View>
    </View>
  )
}

export default forwardRef(ChatHeader)
