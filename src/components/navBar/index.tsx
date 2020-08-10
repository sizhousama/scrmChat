import React, { useState,useEffect, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { Back, getSysInfo } from '@/utils/index'
import './index.scss'
import { forwardRef } from 'react'

const NavBar = (props, ref) => {
  const [blockStyle,setStyle] = useState({})
  
  useEffect(() => {
    const barHeight = getSysInfo().statusBarHeight
    setStyle({
      width:"100%",
      height:barHeight+44+'px',
      background:"#fff"
    })
  }, [])
  return (
    <View>
      <View style={blockStyle}></View>
      <View className='navbar'>
        <View className='left' onClick={Back}>
          <View className='at-icon at-icon-chevron-left'></View>
          <Text>{props.title}</Text>
        </View>
        <View className='right'>
          {props.btn}
        </View>
      </View>
    </View>
  )
}

export default forwardRef(NavBar)
