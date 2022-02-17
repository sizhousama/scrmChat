import React, { useEffect, useRef, useState, useReducer, forwardRef, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtActivityIndicator, AtInput } from 'taro-ui'
import { getMessengerFlows } from '@/api/messenger'
import { getWaFlows } from '@/api/wa'
import Taro from "@tarojs/taro";
import { useUserStore } from '@/store'
import './index.scss'


const initState = {
  flows: []
}
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'flows':
      return {
        ...state,
        flows: action.payload.flows
      }
    default:
      return state;
  }
}
const SendFlow = (props, ref) => {
  const { type } = useUserStore()
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(stateReducer, initState)
  const { flows } = state
  const parmref = useRef({
    current: 1,
    size: 999,
    name: ''
  })

  const getFlows = useCallback((data) => {
    switch(type){
      case 'messenger': return getMessengerFlows(data)
      case 'whatsapp': return getWaFlows(data)
      default: return getMessengerFlows(data)
    }
  },[type])
  
  const setflow = (e) => {
    const flow = e.currentTarget.dataset.item
    Taro.showModal({
      title: '',
      content: `确认发送流程'${flow.name}'？`,
      success (res) {
        if (res.confirm) {
          props.handleClick(flow)
        } else if (res.cancel) {
          
        }
      }
    })
  }

  const getlist = useCallback(async () => {
    setLoading(true)
    await getFlows(parmref.current).then(res => {
      const { data } = res
      dispatch({ type: 'flows', payload: { flows: data.records } })
      setLoading(false)
    })
  },[getFlows])

  const inputChange = (v) => {
    parmref.current.name = v
    setKey(v)
  }

  useEffect(() => {
    getlist()
  }, [getlist])

  return (
    <View className='flowbox' onClick={(e) => e.stopPropagation()}>
      {/* <View className='topheader'>流程</View> */}
      <View className='search'>
        <AtInput
          name='flowInput'
          value={key}
          onChange={inputChange}
          onConfirm={getlist}
          placeholder='搜索流程名称'
        ></AtInput>
      </View>
      <ScrollView scrollY className='flowscroll'>
        <View className='inner'>
          <AtActivityIndicator isOpened={loading} size={28} mode='center'></AtActivityIndicator>
          {
            flows.map((item, index) => {
              return (
                <View key={index} className='fx flow' onClick={setflow} data-item={item} >
                  <Text className='name'>{item.name}</Text>
                </View>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default forwardRef(SendFlow)
