import React, { useRef, useState, useReducer } from 'react'
import { View } from '@tarojs/components'
import { useReachBottom, useDidShow } from "@tarojs/taro"
import { observer } from 'mobx-react'
import { Base64 } from 'js-base64'
import Header from "@/components/header"
import Fan from "@/components/fan"
import { getMessengerFans } from '@/api/messenger/fan'
import { getWaFans } from '@/api/wa/fan'
import { getInsFans } from '@/api/ins/fan'
import { useFanStore, useUserStore } from '@/store'
import { isNeedAddH,DecryptData, getSysInfo } from '@/utils/index'
import { AtActivityIndicator } from 'taro-ui'
import { formatChatTime } from '@/utils/time'
import TabBar from "../tabbar"
import './index.scss'

const initState = {
  fans: [],
}
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'list':
      return {
        ...state,
        fans: action.payload.list
      }
    default:
      return state
  }
}
const Users = () => {
  const cur: number = 1
  const needH = isNeedAddH()
  const childref = useRef();
  const { hasNew, searchForm } = useFanStore()
  const { type } = useUserStore()
  const listref = useRef<any[]>([])
  const [state, dispatch] = useReducer(stateReducer, initState)
  const [loading, setLoading] = useState(false)
  const [moreloading, setMoredLoading] = useState(false)
  const [hasmore, setHasMore] = useState(false)
  const barHeight = getSysInfo().statusBarHeight
  const parmref = useRef({
    current: 1,
    size: 10
  })
  const { fans } = state

  useDidShow(() => {
    search()
    getfans()
  })

  const search = () => {
    const form = {}
    for(let key in searchForm){
      if(typeof searchForm[key] === 'object'){
        form[key] = searchForm[key].slice()
      }else{
        form[key] = searchForm[key]
      }
    }
    parmref.current = { current: 1,size: 10, ...form }
  }

  const getFans = (data) => {
    switch(type){
        case 'messenger': return getMessengerFans(data)
        case 'whatsapp': return getWaFans(data)
        case 'ins': return getInsFans(data)
        default: return getMessengerFans(data)
    }
  }

  const getfans = async () => {
    setLoading(true)

    await getFans(parmref.current).then(res => {
      try {
        const { data } = res
        const rawdata = type === 'messenger' ? JSON.parse(DecryptData(Base64.decode(data), 871481901)) : data
        rawdata.total > parmref.current.size ? setHasMore(true) : setHasMore(false)
        listref.current = rawdata.records
        listref.current.forEach(item => {
          if (item.lastSendMsgTime) {
            item.lasttime = formatChatTime(new Date(item.lastSendMsgTime.replace(/-/g,"/")))
          } else {
            item.lasttime = ''
          }
        })
        dispatch({ type: 'list', payload: { list: listref.current } })
        setLoading(false)
      } catch (e) {
        console.log(e)
      }
    })
  }
  const getmorefans = async () => {
    setMoredLoading(true)
    await getFans(parmref.current).then(res => {
      const { data } = res
      const rawdata = type === 'messenger' ? JSON.parse(DecryptData(Base64.decode(data), 871481901)) : data
      rawdata.records.forEach(item => {
        if (item.lastSendMsgTime) {
          item.lasttime = formatChatTime(new Date(item.lastSendMsgTime.replace(/-/g,"/")))
        } else {
          item.lasttime = ''
        }
      })
      listref.current = [...listref.current, ...rawdata.records]
      dispatch({ type: 'list', payload: { list: listref.current } })
      rawdata.total > listref.current.length ? setHasMore(true) : setHasMore(false)
      setMoredLoading(false)
    })
  }
  useReachBottom(() => {
    if (hasmore) {
      parmref.current.current++
      getmorefans()
    }
  })
  return (
    <View style={{marginTop:barHeight+88+'px'}}>
      <AtActivityIndicator isOpened={loading} mode='center'></AtActivityIndicator>
      <Header ref={childref} title='粉丝列表' from='user' />
      <View className='fanlist' >
        {
          fans.map((fan: any, index) => {
            return (
              <Fan key={index} ref={childref} fan={fan} />
            )
          })
        }
        {
          moreloading ?
            <View className='more'>
              <AtActivityIndicator isOpened={moreloading} mode='center' color='#999'></AtActivityIndicator>
            </View> : ''
        }
        <View className={`botblock ${needH ? 'needh' : ''}`} ></View>
      </View>
      <TabBar ref={childref} cur={cur} has={hasNew} />
    </View>
  )
}

export default observer(Users)
