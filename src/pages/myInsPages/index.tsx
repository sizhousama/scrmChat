import React, { useRef, useState, useEffect, useCallback } from "react";
import { View } from "@tarojs/components";
import { observer } from 'mobx-react';
import { AtActivityIndicator, AtIcon } from 'taro-ui'
import { getInsPages } from '@/api/info'
import "./index.scss";


const MyAccounts = () => {
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState([])

  const statusFiter = (v) => {
    switch(v){
      case 0: return '未绑定'
      case 1: return '已绑定'
      default: break
    }
  }

  
  const getAccounts = useCallback(async () => {
    setLoading(true)
    const { data } = await getInsPages({current: 1,size: 10})
    setAccounts(data.records)
    setLoading(false)
  },[])

  useEffect(()=>{
    getAccounts()
  },[getAccounts])

  return (
    <View>
      <AtActivityIndicator isOpened={loading} mode='center'></AtActivityIndicator>
      {
        accounts.map((item:any, idx) => {
          return (
            <View className='account' key={idx}>
              <View className='account-title'>
                <AtIcon prefixClass='icon' value='page' color='#666' size='14' className='alicon'></AtIcon>
                主页名称：{item.pageName}</View>
              <View className='account-box'>
                <View className='account-box-item'>主页ID：{item.name}</View>
                <View className='account-box-item'>授权账号：{item.facebookName}</View>
                <View className='account-box-item'>Instagram账号：{item.username}</View>
                <View className='account-box-item'>客服：{item.serviceName}</View>
                <View className='account-box-item'>状态：{statusFiter(item.status)}</View>
              </View>
            </View>
          )
        })
      }
      
    </View>
  );
};

export default observer(MyAccounts);
