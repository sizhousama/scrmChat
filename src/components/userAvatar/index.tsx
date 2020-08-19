import React, { useEffect, useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { useState, forwardRef } from 'react'
import { AtAvatar } from 'taro-ui'
const userAvatar = (props, ref) => {
  // const childref = useRef()
  const isR = props.msgItem.isServe
  return (
    <AtAvatar
    className={`avatar ${isR?'ra':'la'}`}
    circle
    text='阎王爷'
    >
    </AtAvatar>
  )
}

export default forwardRef(userAvatar)
