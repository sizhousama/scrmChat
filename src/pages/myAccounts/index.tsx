import React, { useRef, useState, useEffect, useCallback } from "react";
import { View } from "@tarojs/components";
import { observer } from 'mobx-react';
import { AtActivityIndicator, AtIcon } from 'taro-ui'
import { getWaAccounts } from '@/api/info'
import "./index.scss";


const MyAccounts = () => {
  const listref = useRef<any[]>([])
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState([])

  const typeFiter = (v) => {
    switch(v){
      case 1: return '包月'
      case 2: return '按量'
      case 3: return '个人号'
      case 4: return 'Twilio'
      case 5: return 'HiveSCRM'
      default: break
    }
  }

  const statusFiter = (v) => {
    switch(v){
      case 0: return '空闲'
      case 1: return '在线'
      case 2: return '登录异常'
      case 3: return '手机掉线'
      default: break
    }
  }

  
  const getAccounts = useCallback(async () => {
    setLoading(true)
    const { data } = await getWaAccounts({current: 1,size: 10})
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
                席位名称：{item.seatName}</View>
              <View className='account-box'>
                <View className='account-box-item'>WhatsApp账号名称：{item.name}</View>
                <View className='account-box-item'>WhatsApp手机号：{item.whatsappUserId}</View>
                <View className='account-box-item'>类型：{typeFiter(item.type)}</View>
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
