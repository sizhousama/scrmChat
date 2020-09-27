import React, { useEffect, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { forwardRef } from 'react'
import Taro from "@tarojs/taro";
import './index.scss'


const ButtonMsg = (props, ref) => {
  const copy=()=>{
    Taro.setClipboardData({
      data: props.msgItem.text,
    })
  }
  return (
    <View className='button-msg'>
      <View className='pure-text' onClick={copy}>
        <Text>{props.msgItem.text}</Text>
      </View>
      <View className='button-msg-btns'>
        {
          props.msgItem.elements.map((btn, idx) => {
            return (
              <Text className='break' key={idx}>{btn.title}</Text>
            )
          })
        }
      </View>

    </View>
  )
}

export default forwardRef(ButtonMsg)
