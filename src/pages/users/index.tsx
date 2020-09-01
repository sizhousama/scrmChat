import React, { useRef, useEffect, useState, useReducer } from 'react'
import { View, Text } from '@tarojs/components'
import TabBar from "../tabbar";
import Header from "@/components/header";
import Fan from "@/components/fan";
import { getFans } from '@/api/fan'
import { observer } from 'mobx-react';
import { useFanStore } from '@/store';
import { isNeedAddH } from '@/utils/index'
import { AtActivityIndicator } from 'taro-ui'
import { useReachBottom } from "@tarojs/taro";
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
  const { hasNew } = useFanStore()
  const listref = useRef<any[]>([])
  const [state, dispatch] = useReducer(stateReducer, initState)
  const [loading, setLoading] = useState(false)
  const [moreloading, setMoredLoading] = useState(false)
  const [hasmore,setHasMore] = useState(false)
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

  useEffect(() => {
    getfans()
  }, [])
  const getfans = async () => {
    setLoading(true)
    await getFans(parmref.current).then(res => {
      const { data } = res
      data.total>parmref.current.size?setHasMore(true):setHasMore(false)
      listref.current = data.records
      dispatch({ type: 'list', payload: { list: listref.current } })
    }).finally(() => {
      setLoading(false)
    })
  }
  const getmorefans = async () => {
    setMoredLoading(true)
    await getFans(parmref.current).then(res => {
      const { data } = res
      listref.current = [...listref.current,...data.records] 
      dispatch({ type: 'list', payload: { list: listref.current } })
      data.total>listref.current.length?setHasMore(true):setHasMore(false)
    }).finally(() => {
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
      <Header ref={childref} title='粉丝' icon='fanlist' />
      <View className={`fanlist ${needH ? 'needh' : ''}`} >
        {
          fans.map((fan: any, index) => {
            return (
              <Fan key={index} ref={childref} fan={fan} />
            )
          })
        }
        {
          moreloading?
          <View className='more'>
            <AtActivityIndicator isOpened={moreloading} mode='center' color='#999'></AtActivityIndicator>
          </View>:''
        }
      </View>
      <TabBar ref={childref} cur={cur} has={hasNew} />
    </View>
  )
}

export default observer(Users)
