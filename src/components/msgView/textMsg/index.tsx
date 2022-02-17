import React, { forwardRef, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useUserStore } from '@/store'
import './index.scss'

const TextMsg = (props, ref) => {
  const { type, themeColor } = useUserStore()
  const isR = props.msgItem.isServe
  const copy=()=>{
    Taro.setClipboardData({
      data: props.msgItem.text,
    })
  }

  const color = () => {
    switch(type){
      case 'messenger': return isR ? themeColor : '#fff'
      case 'whatsapp': return isR ? themeColor: '#fff'
      case 'ins': return isR ? themeColor : '#fff'
      default: return isR ? themeColor : '#fff'
    }
  }

  const openTools = () =>{
    props.open()
  }

  const translate = () =>{
    props.translate()
  }
  
  return (
    <View className='text-msg'>
      <View onLongPress={openTools} className={`text-msg-detail ${isR ? 'right' : ''}`} style={{background: color()}}>
        <Text selectable className={`pure-text ${isR ? 'right' : ''}`}>
          {props.msgItem.text}
        </Text>
        { props.msgItem.translateText && <Text className='line'></Text> }
        <Text selectable className={`trans-text ${isR ? 'right' : ''}`}>{props.msgItem.translateText}</Text>
        { props.msgItem.showTools && 
          <View className={`tools ${isR ? 'right' : 'left'}`}>
            <View className='tool' onClick={copy}>
              <View className='icon icon-copy'></View>
              <View className='tool-label'>复制</View>
            </View>
            { (!props.msgItem.translateText && !isR) &&
              <View className='tool' onClick={translate}>
                <View className='icon icon-translate'></View>
                <View className='tool-label'>翻译</View>
              </View>
            }
          </View>
        }
        {
          (props.msgItem.type === 'postback' && props.msgItem.errorText) &&
            <Text className='error-text'>{props.msgItem.errorText}</Text>
        }
      </View>
    </View>
  )
}

export default forwardRef(TextMsg)
