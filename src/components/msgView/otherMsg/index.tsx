import React, {  forwardRef } from 'react'
import { View, Text } from '@tarojs/components'
import { useUserStore } from '@/store'
import './index.scss'


const OtherMsg = (props, ref) => {
  const { type, themeColor } = useUserStore()
  const isR = props.msgItem.isServe
  const color = () => {
    switch(type){
      case 'messenger': return isR ? themeColor : '#fff'
      case 'whatsapp': return isR ? themeColor: '#fff'
      case 'ins': return isR ? themeColor : '#fff'
      default: return isR ? themeColor : '#fff'
    }
  }
  return (
    <View className='text-msg'>
      <View className={`text-msg-detail ${isR ? 'right' : ''}`} style={{background: color()}}>
        <Text className={`pure-text ${isR ? 'right' : ''}`}>请在电脑端查看此消息！</Text>
      </View>
    </View>
  )
}

export default forwardRef(OtherMsg)
