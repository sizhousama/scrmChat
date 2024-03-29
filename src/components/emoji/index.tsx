import React, { forwardRef } from 'react'
import { View, Text,ScrollView } from '@tarojs/components'
import {Emojis} from '@/constant/index'
import './index.scss'

const Emoji = (props, ref) => {
  const emojis = Emojis
  const setemoji = (e)=>{
    props.handleClick(e.currentTarget.dataset.item)
    e.stopPropagation()
  }
  return (
    <View className='emojibox'>
      <ScrollView scrollY className='emojiscroll'>
        <View className='emojiinner'>
          {emojis.map((emoji,idx)=>{
            return (
              <View className='emoji' onClick={setemoji} data-item={emoji} key={idx}>
                <Text >{emoji}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default forwardRef(Emoji)
