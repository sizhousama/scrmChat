import React, { useEffect, useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import {NavTo} from '@/utils/index'
import { observer } from 'mobx-react';
import { useFanStore } from '@/store';
import { useState, forwardRef } from 'react'
import message from '@/assets/images/message.png'
import fans from '@/assets/images/happy.png'
import './index.scss'
const Header = (props, ref) => {
  // const childref = useRef()
  const {setSearchFrom} = useFanStore()
  const navto = ()=>{
    setSearchFrom(props.icon)
    NavTo(`/pages/search/index`)
  }
  return (
    <View className='header'>
      <View className='left'>
        { props.icon==='message'? <Image style='margin-top:5px' src={message} />:<Image src={fans} /> }
        <Text>{props.title}</Text>
      </View>
      <View className='right' onClick={navto}>
        <View className='at-icon at-icon-search'></View>
      </View>
    </View>
  )
}

export default observer(forwardRef(Header))
