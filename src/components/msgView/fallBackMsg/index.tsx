import React, { useEffect, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { forwardRef } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

const FallBackMsg = (props, ref) => {
  const isR = props.msgItem.isServe
  const copy=()=>{
    Taro.setClipboardData({
      data: props.msgItem.text,
    })
  }
  return (
    <View className='fallback-msg'>
      <View className={`fallback-msg-detail ${isR ? 'right' : ''}`} onClick={copy}>
        <Text className={`pure-text ${isR ? 'right' : ''}`}>{props.msgItem.text}</Text>
      </View>
    </View>
  )
}

export default forwardRef(FallBackMsg)
