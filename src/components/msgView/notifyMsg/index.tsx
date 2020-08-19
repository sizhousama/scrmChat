import React, { useEffect, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { forwardRef } from 'react'
import Taro from "@tarojs/taro";
import './index.scss'


const NotifyMsg = (props, ref) => {
  return (
    <View className='notify-msg'>
      {
        props.msgItem.elements.map((item, idx) => {
          return (
            <View key={idx} className="notify-msg-content">
              <View className="notify-msg-content-title">
                {item.title}
              </View>
              <View className="notify-msg-content-subtitle">
                {item.subtitle}
              </View>
              {
                item.buttons.map((btn, i) => {
                  return (
                    <View key={i} className="notify-msg-content-btn">
                      {btn.title}
                    </View>
                  )
                })
              }
            </View>
          )
        })
      }
    </View>
  )
}

export default forwardRef(NotifyMsg)
