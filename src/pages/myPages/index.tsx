import React, { useRef, useState, useEffect, useReducer } from "react";
import NavBar from "@/components/navBar";
import { View, Image, Text } from "@tarojs/components";
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
  const style = { marginTop: navH + 10 + 'px' }
  const [state, dispatch] = useReducer(stateReducer, initState)
  const { pages } = state
  useEffect(() => {
    getpage()
  }, [])
  const getpage = async () => {
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
    }).finally(() => {
      setLoading(false)
    })
  }
  const openAcc = (e) => {
    const i = e.currentTarget.dataset.key
    listref.current[i].open = !listref.current[i].open
    dispatch({ type: 'list', payload: { list: listref.current } })
  }

  return (
    <View>
      <NavBar title='授权主页' />
      <AtActivityIndicator isOpened={loading} mode='center'></AtActivityIndicator>
      <View style={style}>
        {
          pages.map((item, index) => {
            return (
              <View className='accbox' key={index} onClick={openAcc} data-key={index}>
                <View className='accordion'>
                  <View className='left'>{item.facebookEmail}</View>
                  <View className='mid'>
                    {
                      item.expireTime - new Date().getTime() > 0 ?
                        <Text>剩余<Text className={`stime ${item.isovertime ? 'warn' : ''}`}>{item.overday}</Text>天</Text> : ''
                    }
                    {
                      item.expireTime - new Date().getTime() > 0 ?
                        <Text>{item.endDate}</Text> :
                        <Text style={{ color: 'red' }}>授权已过期</Text>
                    }
                  </View>
                  <View className='right'>
                    {
                      item.open ?
                        <View className='at-icon at-icon-chevron-up'></View>
                        : <View className='at-icon at-icon-chevron-down'></View>
                    }
                  </View>
                </View>
                <View className={`accbody ${item.open ? 'opend' : ''}`}>
                  <View className='fx accthead'>
                    <View className='fx1'>主页Id</View>
                    <View className='fx1'>主页名称</View>
                    <View className='fx1'>国家</View>
                  </View>
                  {
                    item.pageConfigs ?
                      item.pageConfigs.map((p, i) => {
                        return (
                          <View key={i} className='pagebox'>
                            <View className='fx1'>{p.pageId}</View>
                            <View className='fx1'>
                              <Text className='pname break'>{p.pageName}</Text>
                            </View>
                            <View className='fx1'>{p.country}</View>
                          </View>
                        )
                      }) : ''
                  }
                </View>
              </View>

            )
          })
        }
      </View>
    </View>
  );
};

export default observer(MyPages);
