import React, { useRef, useEffect, useState, useReducer } from 'react'
import { View, Text } from '@tarojs/components'
import TabBar from "../tabbar";
import Header from "@/components/header";
import Fan from "@/components/fan";
import { getFans } from '@/api/fan'
import { observer } from 'mobx-react';
import { useFanStore } from '@/store';
import { isNeedAddH,DecryptData } from '@/utils/index'
import { AtActivityIndicator } from 'taro-ui'
import { useReachBottom, useDidShow } from "@tarojs/taro";
import { formatChatTime } from '@/utils/time'
import { Base64 } from 'js-base64';
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
  const listref = useRef<any[]>([])
  const [state, dispatch] = useReducer(stateReducer, initState)
  const [loading, setLoading] = useState(false)
  const [moreloading, setMoredLoading] = useState(false)
  const [hasmore, setHasMore] = useState(false)
  const parmref = useRef({
    current: 1,
    size: 10,
    userStatus: '',
    tags: '',
    facebookName: '',
    pageId: '',
    fanGrades: 0
  })
  const { fans } = state

  useDidShow(() => {
    search()
    getfans()
  })
  const search = () => {
    parmref.current.facebookName = searchForm.fanKey
    parmref.current.pageId = searchForm.fanPage
    parmref.current.current = 1
  }
  const getfans = async () => {
    setLoading(true)

    await getFans(parmref.current).then(res => {
      try {
        const { data } = res
        const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
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
      const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
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
    <View>
      <AtActivityIndicator isOpened={loading} mode='center'></AtActivityIndicator>
      <Header ref={childref} title='粉丝列表' icon='fanlist' />
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
