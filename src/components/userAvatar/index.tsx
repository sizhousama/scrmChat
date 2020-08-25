import React, { useState, useEffect, useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { forwardRef } from 'react'
import { AtAvatar } from 'taro-ui'
import { imgUrl } from '@/servers/baseUrl'

const userAvatar = (props, ref) => {
  // const [avatar,setAvatar] = useState('')
  const isR = props.msgItem.isServe
  const isfake = props.msgItem.fake
  const userId = props.msgItem.userId
  const pageId = props.fan.pageId
  const fanId = props.fan.fanId
  const baseUrl = imgUrl()
  const avatar = isfake ?
    userId !== 0 ? `${baseUrl}/sys/user/avatar/${userId}.jpg` : `${baseUrl}/header/${pageId}.jpg`
    : isR ?
      userId !== 0 ? `${baseUrl}/sys/user/avatar/${userId}.jpg` : `${baseUrl}/header/${pageId}.jpg`
      : `${baseUrl}/header/${pageId}/${fanId}.jpg`
  return (
    <AtAvatar
      className={`avatar ${isR ? 'ra' : 'la'}`}
      circle
      image={avatar}
      text={props.fan.fanName}
    >
    </AtAvatar>
  )
}

export default forwardRef(userAvatar)
