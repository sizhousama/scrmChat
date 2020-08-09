import React, { useEffect, useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { useState, forwardRef } from 'react'
import message from '@/assets/images/message.png'
import fans from '@/assets/images/happy.png'

const Header = (props, ref) => {
  // const childref = useRef()
  return (
    <View className='header'>
      <View className='left'>
        { props.icon==='message'? <Image style='margin-top:5px' src={message} />:<Image src={fans} /> }
        <Text>{props.title}</Text>
      </View>
      <View className='right'>
        <View className='at-icon at-icon-search'></View>
      </View>
    </View>
  )
}

export default forwardRef(Header)
