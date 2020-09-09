import React, { useRef, useState, useEffect, useReducer } from "react";
import NavBar from "@/components/navBar";
import { View, Image, Text } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useNavStore, useFanStore } from '@/store';
import { previewImg, NavTo } from '@/utils/index'

import "./index.scss";
import { imgUrl } from "@/servers/baseUrl";

const FanInfo = () => {
  const { navH } = useNavStore();
  const { fan,setFan } = useFanStore()
  const avatar = `${imgUrl()}/header/${fan.pageId}/${fan.senderId}.jpg`
  const style = {
    marginTop: navH - 2+ 'px'
  }
  useEffect(() => {
    console.log(fan)
  }, [])

  const viewHead = ()=>{
    previewImg(avatar)
  }
  const goChat = ()=>{
    const obj = {
      facebookName:fan.facebookName,
      pageId:fan.pageId,
      fanId:fan.senderId,
      senderId:fan.senderId,
      gender:fan.gender,
      adId:fan.adId,
      pageName:fan.pageName,
      fanName:fan.facebookName,
      phone:fan.phone
    }
    setFan(obj)
    NavTo('/pages/liveChat/index')
  }
  return (
    <View className='fanbody'>
      <NavBar title='' />
      <View className='faninfo' style={style}>
        <View className='avatar'>
          <Image src={avatar} onClick={viewHead}></Image>
        </View>
        <View className='info'>
          <View className='name'>
            {fan.facebookName}
            {
              fan.gender==='male'?
              <View className='icon icon-male'></View>
              :<View className='icon icon-female'></View>
            }      
          </View> 
          <Text className='pid'>主页：{fan.pageName}</Text>
          <Text className='phone'>Paypal：{fan.payAccount}</Text>
        </View>
      </View>
      <View className='btn' onClick={goChat}>
        <View className='icon icon-msg'></View>
        <View>发消息</View>
      </View>
    </View>
  );
};

export default observer(FanInfo);
