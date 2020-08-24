import React, { useEffect, useRef,useContext } from 'react'
import { View, Image, Text } from '@tarojs/components'
import {Emojis} from '@/constant/index'
import { forwardRef } from 'react'
import './index.scss'
const Emoji = (props, ref) => {
  const emojis = Emojis
  const setemoji = (e)=>{
    props.handleClick(e.currentTarget.dataset.item)
    e.stopPropagation()
  }
  return (
    <View className='emojibox'>
      {
        emojis.map((emoji,idx)=>{
        return (
          <View className='emoji' onClick={setemoji} data-item={emoji} key={idx}>
            <Text >{emoji}</Text>
          </View>
        )
        })
      } 
    </View>
  )
}

export default forwardRef(Emoji)
