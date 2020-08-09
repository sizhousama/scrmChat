import React, { useEffect, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { useState, forwardRef } from 'react'

const NavBar = (props, ref) => {
  // const childref = useRef()
  return (
    <View className='navbar'>
      <View className='left'>
        <View className='at-icon at-icon-chevron-left'></View>
        <Text>123</Text>
      </View>
      <View className='right'>
        
      </View>
    </View>
  )
}

export default forwardRef(NavBar)
