import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, Picker } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { Back, getSysInfo, Toast,NavTo } from '@/utils/index'
import {getServices} from '@/api/chat'
import {upFanService} from '@/api/fan'
import livechat from '@/assets/images/livechat.png'
import user from '@/assets/images/mine.png'
import './index.scss'
import { forwardRef } from 'react'

const ChatHeader = (props, ref) => {
  const listref = useRef<any>([])
  const [services, setServices] = useState<any[]>([])
  const [selectSer, setSelectSer] = useState(props.fan.serviceName?props.fan.serviceName:'未分配')
  const [curser,setCurser] = useState(0)
  const barHeight = getSysInfo().statusBarHeight
  const blockStyle = {
    width: "100%",
    height: barHeight + 44 + 'px',
    background: "#fff"
  }
  useEffect(() => {
    getlist()
  }, [])
  const getlist = async()=>{
    await getServices().then(res=>{
      const {data} = res
      let arr:any[] = ['未分配']
      data.forEach((item,index) => {
        arr = [...arr,item.username]
        if(props.fan.serviceName===item.username){
          setCurser(index+1)
        }
      });
      listref.current = data
      setServices(arr)
    })
  }
  const onChange = (e) => {
    let service = {
      username:'',
      avatar:'',
      userId:null
    }
    setServices(e.detail.value)
    setSelectSer(services[e.detail.value])
    listref.current.forEach(item=>{
      if(item.username===services[e.detail.value]){
        service = item
      }
    })
    const { pageId, fanId } = props.fan
    const { username, avatar, userId } = service
    const params = {
      pageId,
      fanId,
      serviceId: userId,
      serviceName: username,
      serviceAvatar: avatar
    }
    upFanService(params).then(res=>{
      Toast('分配客服成功！','none')
    })
  }
  const gofaninfo = ()=>{
    NavTo('/pages/fanInfo/index')
  }
  return (
    <View>
      <View style={blockStyle}></View>
      <View className='chatinfo' style={{ height: '44px' }}>
        <View className='icon'>
          <Image src={livechat}></Image>
        </View>
        <View className='left'>
          <Text className='name'>{props.fan.fanName}</Text>
          <Text className='pageid'>主页ID：{props.fan.pageId}</Text>
        </View>
        <View className='right' onClick={gofaninfo}>
          <Image src={user}></Image>
        </View>
      </View>
      <View className='navbar' style={{ height: '44px' }}>
        <View className='left' onClick={Back}>
          <View className='at-icon at-icon-chevron-left'></View>
        </View>
        <View className='right'>
          <View className='serselect'>
            <View className='at-icon at-icon-chevron-down'></View>
            <Picker className='picker' mode='selector' value={curser} range={services} onChange={onChange}>
              <AtList>
                <AtListItem extraText={selectSer} />
              </AtList>
            </Picker>
          </View>
        </View>
      </View>
    </View>
  )
}

export default forwardRef(ChatHeader)
