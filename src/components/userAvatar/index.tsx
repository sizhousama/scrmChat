import React, { useState, useEffect, useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { forwardRef } from 'react'
import { AtAvatar } from 'taro-ui'
import { NavTo } from '@/utils/index'
import { imgUrl } from '@/servers/baseUrl'
import fan from '../fan'

const userAvatar = (props, ref) => {
  const [error, setError] = useState(false)
  const isR = props.msgItem.isServe
  const isfake = props.msgItem.fake
  const userId = props.msgItem.userId
  const pageId = props.fan.pageId
  const name = props.fan.pageName
  const fanId = props.fan.fanId
  const baseUrl = imgUrl()
  
  const avatar = isR
    ? userId !== 0
      ? `${baseUrl}/sys/user/avatar/${userId}.jpg?v=${props.redom}`
      : `${baseUrl}/header/${pageId}.jpg`
    : `${baseUrl}/header/${pageId}/${fanId}.jpg`


  const clickAva = () => {
    !isR ? NavTo('/pages/fanInfo/index') : ''
  }
  const loadErr = () => {
    setError(true)
  }
  return (
    <View>
      {
        error ? 
        <AtAvatar 
        className={`avatar ${isR ? 'ra' : 'la'}`} 
        text={name}></AtAvatar>
          : <Image
            className={`avatar ${isR ? 'ra' : 'la'}`}
            src={avatar}
            onClick={clickAva}
            onError={loadErr}
          ></Image>
      }
    </View>
  )
}

export default forwardRef(userAvatar)
