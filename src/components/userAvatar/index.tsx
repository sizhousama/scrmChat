import React, { useState, useEffect, useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { forwardRef } from 'react'
import { AtAvatar } from 'taro-ui'
import {imgUrl} from '@/servers/baseUrl'
import fan from '../fan'

const userAvatar = (props, ref) => {
  const [avatar,setAvatar] = useState('')
  const isR = props.msgItem.isServe
  const isfake = props.msgItem.uuid?true:false
  const userId = props.msgItem.userId
  const pageId = props.fan.pageId
  const fanId = props.fan.fanId
  const baseUrl = imgUrl()
  useEffect(()=>{
    seturl()
  },[])
  const seturl = ()=>{
    let a = ''
    if(isfake){
      a = userId!==0?`${baseUrl}/sys/user/avatar/${userId}.jpg`:`${baseUrl}/header/${pageId}.jpg`
    }else{
      if(isR){
        a = userId!==0?`${baseUrl}/sys/user/avatar/${userId}.jpg`:`${baseUrl}/header/${pageId}.jpg`
      }else{
        a = `${baseUrl}/header/${pageId}/${fanId}.jpg`
      }
    }
    setAvatar(a)
  }
  return (
    <AtAvatar
    className={`avatar ${isR?'ra':'la'}`}
    circle
    image={avatar}
    text={props.fan.fanName}
    >
    </AtAvatar>
  )
}

export default forwardRef(userAvatar)
