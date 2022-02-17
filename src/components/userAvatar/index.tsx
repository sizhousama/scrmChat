import React, { useState, forwardRef } from 'react'
import { View, Image } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { NavTo } from '@/utils/index'
import { imgUrl } from '@/servers/baseUrl'
import { useUserStore } from '@/store'
import './index.scss'


const UserAvatar = (props, ref) => {
  const { type } = useUserStore()
  const [error, setError] = useState(false)
  const isR = props.msgItem.isServe
  const userId = props.msgItem.userId
  
  const baseUrl = imgUrl()
  
  const avatar = () =>{
    if(type === 'whatsapp'){
      return isR
      ? userId !== 0
        ? `${baseUrl}/sys/user/avatar/${userId}.jpg?v=${props.redom}`
        : props.accountHead
      : `${baseUrl}/whatsapp/header/${props.fan.whatsappAccountUserId}/${props.fan.whatsappUserId}.jpg`
    }
    if(type === 'ins'){
      return isR
      ? userId !== 0
        ? `${baseUrl}/sys/user/avatar/${userId}.jpg?v=${props.redom}`
        : `${baseUrl}/instagram/header/${props.fan.instagramAccountUserId}.jpg`
      : `${baseUrl}/instagram/header/${props.fan.instagramAccountUserId}/${props.fan.instagramUserId}.jpg`
    }
    return isR
    ? userId !== 0
      ? `${baseUrl}/sys/user/avatar/${userId}.jpg?v=${props.redom}`
      : `${baseUrl}/header/${props.fan.pageId}.jpg`
    : `${baseUrl}/header/${props.fan.pageId}/${props.fan.fanId}.jpg`
  }

  const name = () => {
    switch(type){
      case 'messenger': return props.fan.pageName
      case 'whatsapp': return props.fan.whatsappUserName
      case 'ins': return props.fan.instagramUserName
      default: return props.fan.pageName
    }
  }

  const clickAva = () => {
    !isR && NavTo('/pages/fanInfo/index')
  }

  return (
    <View>
      {
        error
        ? <AtAvatar className={`avatar ${isR ? 'ra' : 'la'}`} text={name()}></AtAvatar>
        : <Image className={`avatar ${isR ? 'ra' : 'la'}`} src={avatar()} onClick={clickAva} onError={()=>setError(true)}></Image>
      }
    </View>
  )
}

export default forwardRef(UserAvatar)
