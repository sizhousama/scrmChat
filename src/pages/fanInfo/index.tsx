import React, { useRef, useState, useEffect, useReducer } from "react";
import NavBar from "@/components/navBar";
import { View, Image, Text } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useNavStore, useFanStore } from '@/store';
import { previewImg } from '@/utils/index'
import { typeCashOut, typeOrderS } from '@/utils/filter'
import { AtActivityIndicator } from 'taro-ui'
import { fanOrders, fanTags } from '@/api/fan'
import "./index.scss";
import { imgUrl } from "@/servers/baseUrl";
const initState = {
  fanOrderList: [],
  fanTagsList: []
}
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'orders':
      return {
        ...state,
        fanOrderList: action.payload.orders
      }
    case 'tags':
      return {
        ...state,
        fanTagsList: action.payload.tags
      }
    default:
      return state
  }
}
const FanInfo = () => {
  const childref = useRef();
  const { navH } = useNavStore();
  const { fan } = useFanStore()
  const [state, dispatch] = useReducer(stateReducer, initState)
  const [orderloading, setOrderLoading] = useState(false)
  const [tagloading, setTagLoading] = useState(false)
  const [more,setMore] = useState(false)
  const { fanOrderList, fanTagsList } = state
  const avatar = `${imgUrl()}/header/${fan.pageId}/${fan.fanId}.jpg`
  const style = {
    marginTop: navH + 'px'
  }
  useEffect(() => {
    getorders()
    gettags()
  }, [])
  const getorders = async () => {
    setOrderLoading(true)
    await fanOrders({ senderId: fan.senderId }).then(res => {
      const { data } = res
      dispatch({ type: 'orders', payload: { orders: data.records } })
    }).finally(() => {
      setOrderLoading(false)
    })
  }
  const gettags = async () => {
    setTagLoading(true)
    const p = {
      senderId: fan.senderId,
      pageId: fan.pageId
    }
    await fanTags(p).then(res => {
      const { data } = res
      !data?dispatch({ type: 'tags', payload: { tags: [] } })
      :dispatch({ type: 'tags', payload: { tags: data } })
    }).finally(() => {
      setTagLoading(false)
    })
  }
  const viewHead = () => {
    previewImg(avatar)
  }

  const seemore = ()=>{
    setMore(!more)
  }

  return (
    <View>
      <NavBar title='粉丝详情' />
      <View style={style} className='faninfobox'>
        <View className='sec-title'>个人信息：</View>
        <View className='faninfo'>
          <View className='avatar'>
            <Image src={avatar} onClick={viewHead}></Image>
          </View>
          <View className='info'>
            <Text className='name'>{fan.fanName}</Text>
            <Text className='pid'>主页ID：{fan.pageId}</Text>
          </View>
        </View>
        <View className='sec-title'>订单信息：</View>
        <View className={`orderlist ${!more&&fanOrderList.length>3?'seemore':''}`}>
          {
            fanOrderList.length > 0 ?
              fanOrderList.map((item, index) => {
                return (
                  <View key={index} className='order'>
                    <View className='top'>
                      <View className='left'>
                        <Text className='name break'>{item.scalpingProductName}</Text>
                      </View>
                      <View className='right'>
                        <Text >{item.orderImageDate}</Text>
                      </View>
                    </View>
                    <View className='bot'>
                      <View className='left'>
                        <Text className='status'>{typeOrderS(item.status)} {typeCashOut(item.isCashout)}</Text>
                      </View>
                      <View className='right'>
                        <Text className='ordernum'>{item.orderNumber}</Text>
                      </View>
                    </View>
                  </View>
                )
              })
              : <View className='nodata'>
                {
                  orderloading ?
                    <AtActivityIndicator mode='center' isOpened={orderloading}></AtActivityIndicator>
                    : '暂无订单数据'
                }
              </View>
          }
        </View>
        {
          fanOrderList.length>3?
          <View className='checkmore' onClick={seemore}>{more?'收起':'查看更多'}</View>
          :''
        }
        <View className='sec-title'>标签：</View>
        <View className='taglist'>
          {
            fanTagsList.length > 0 ?
              fanTagsList.map((item, index) => {
                return (
                  <Text key={index} className='tag'>{item.tag}</Text>
                )
              })
              : <View className='nodata'>
                {
                  tagloading ?
                    <AtActivityIndicator mode='center' isOpened={tagloading}></AtActivityIndicator>
                    : '暂无标签信息'
                }
              </View>
          }
        </View>
      </View>
    </View>
  );
};

export default observer(FanInfo);