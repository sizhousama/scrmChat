import React, { useEffect, useRef } from 'react'
import { View, Text, RichText } from '@tarojs/components'
import { forwardRef } from 'react'
import './index.scss'

const TextMsg = (props, ref) => {
  const isR = props.msgItem.isServe
  return (
    <View className='text-msg'>
      <View className={`text-msg-detail ${isR ? 'right' : ''}`}>
        <Text className={`pure-text ${isR ? 'right' : ''}`}>{props.msgItem.text}</Text>
        {
          props.msgItem.type === 'postback' && props.msgItem.errorText ?
            <Text className='error-text'>{props.msgItem.errorText}</Text>
            : ''
        }
      </View>
    </View>
  )
}

export default forwardRef(TextMsg)
