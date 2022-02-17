import React, { useState, useEffect, useRef,forwardRef, useCallback } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import { AtList, AtListItem, AtIcon } from 'taro-ui'
import { Back, getSysInfo, Toast,NavTo } from '@/utils/index'
import {getServices} from '@/api/utils'
import {upMessengerFanService} from '@/api/messenger/fan'
import {upWaFanService} from '@/api/wa/fan'
import { upInsFanService } from '@/api/ins/fan'
import { useUserStore } from '@/store'
import './index.scss'



const ChatHeader = (props, ref) => {
  const listref = useRef<any>([])
  const [services, setServices] = useState<any[]>([])
  const [selectSer, setSelectSer] = useState(props.fan.serviceName?props.fan.serviceName:'未分配')
  const [curser,setCurser] = useState(0)
  const barHeight = getSysInfo().statusBarHeight
  const { type } = useUserStore()
  const blockStyle:any = {
    width: "100%",
    height: barHeight + 44 + 'px',
    background: "#fff",
    position: 'relative'
  }

  const upFanService = (data) => {
    switch(type){
      case 'messenger': return upMessengerFanService(data)
      case 'whatsapp': return upWaFanService(data)
      case 'ins': return upInsFanService(data)
      default: return upMessengerFanService(data)
    }
  }
  
  const getlist = useCallback(async()=>{
    await getServices().then(res=>{
      const {data} = res
      let arr:any[] = []
      data.forEach((item,index) => {
        arr = [...arr,item.username]
        if(props.fan.serviceName===item.username){
          setCurser(index)
        }
      });
      listref.current = data
      setServices(arr)
    })
  },[props.fan.serviceName])

  const onChange = (e) => {
    let service = {
      username:'',
      avatar:'',
      userId:null
    }
    setCurser(e.detail.value)
    setSelectSer(services[e.detail.value])
    listref.current.forEach(item=>{
      if(item.username===services[e.detail.value]){
        service = item
      }
    })
    const { pageId, fanId, whatsappUserId, whatsappAccountId, instagramAccountId, instagramUserId } = props.fan
    const { username, avatar, userId } = service
    const params = {
      pageId,
      fanId,
      whatsappUserList: [{ whatsappUserId, whatsappAccountId }],
      instagramUserList: [{ instagramUserId, instagramAccountId }],
      serviceId: userId,
      serviceName: username,
      serviceAvatar: avatar
    }
    upFanService(params).then(()=>{
      Toast('分配客服成功！','none')
    })
  }

  const gofaninfo = ()=>{
    props.handleClick()
    NavTo('/pages/fanInfo/index')
  }

  const fanName = () => {
    if(type === 'messenger') return <Text className='name break'>{props.fan.fanName}</Text>
    if(type === 'whatsapp') return <Text className='name break'>{props.fan.whatsappUserName}</Text>
    if(type === 'ins') return <Text className='name break'>{props.fan.instagramUserName}</Text>
  }

  useEffect(() => {
    getlist()
  }, [getlist])

  return (
    <View>
      <View style={blockStyle}>
        <View className='back-icon' onClick={Back}>
          <View className='at-icon at-icon-chevron-left'></View>
        </View>
        <View className='bottom'>会话</View>
      </View>
      <View className='chatinfo' style={{ height: '44px' }}>
        <View className='left'>
          {fanName()}
          <Picker className='picker' mode='selector' value={curser} range={services} onChange={onChange}>
              <AtList>
                <AtListItem extraText={selectSer} />
              </AtList>
            </Picker>
        </View>
        <View className='right' onClick={gofaninfo}>
          <AtIcon prefixClass='icon' value='mine' color='#333' size='16' className='alicon'></AtIcon>
        </View>
      </View>
    </View>
  )
}

export default forwardRef(ChatHeader)
