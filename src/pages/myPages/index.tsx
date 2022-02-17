import React, { useRef, useState, useEffect, useReducer, useCallback } from "react";
import { View, Text } from "@tarojs/components";
import { getUserPages } from '@/api/info'
import { observer } from 'mobx-react';
import { useNavStore, useUserStore } from '@/store';
import { AtActivityIndicator } from 'taro-ui'
import { pageFormatda } from '@/utils/time'
import "./index.scss";

const initState = {
  pages: []
}
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'list':
      return {
        ...state,
        pages: action.payload.list
      }
    default:
      return state
  }
}
const MyPages = () => {
  const listref = useRef<any[]>([])
  const { navH } = useNavStore();
  const { userInfo } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(stateReducer, initState)
  const { pages } = state
  
  const getpage = useCallback(async () => {
    const p = {
      current: 1,
      size: 99,
      userId: userInfo.userId
    }
    setLoading(true)
    await getUserPages(p).then(res => {
      const { data } = res
      listref.current = data.records
      const nowDate = (new Date()).getTime()
      listref.current.forEach(item => {
        item.open = false
        item.startDate = pageFormatda(item.createTime)
        const endDate = new Date(item.expireTime)
        const year = endDate.getFullYear()
        const month = endDate.getMonth() + 1
        const date = endDate.getDate()
        item.endDate = [year, month, date].join('/')
        const overday = pageFormatda(nowDate, item.expireTime)
        item.overday = overday
        item.isovertime = false
        if (overday <= 3) { item.isovertime = true }
      })
      dispatch({ type: 'list', payload: { list: listref.current } })
      setLoading(false)
    })
  },[userInfo.userId])

  useEffect(() => {
    getpage()
  }, [getpage])

  return (
    <View>
      <AtActivityIndicator isOpened={loading} mode='center'></AtActivityIndicator>
      <View className='pagebody'>
        <View className='fx accthead'>
          <View className='fx1'>主页Id</View>
          <View className='fx1'>主页名称</View>
          <View className='fx1'>授权账号</View>
        </View>
        {
          pages.map((item, index) => {
            return (
              <View className='pagebox' key={index}>
                <View className='fx1'>{item.pageId}</View>
                <View className='fx1'>
                  <Text className='pname break'>{item.pageName}</Text>
                </View>
                <View className='fx1'>{item.facebookName}</View>
              </View>
            )
          })
        }
      </View>
    </View>
  );
};

export default observer(MyPages);
