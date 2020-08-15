import React, { useRef, useState, useEffect } from "react";
import NavBar from "@/components/navBar";
import { View, Image } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useNavStore } from '@/store';
import {UpLoad} from '@/utils/index'
// import Taro from "@tarojs/taro";
import "./index.scss";

const MyInfo = () => {
  const childref = useRef();
  const { navH } = useNavStore();
  const style = {
    marginTop: navH + 10 + 'px'
  }
  const upHead = ()=>{
    UpLoad()
  }

  return (
    <View>
      <NavBar title='编辑个人信息' btn={<View className='navbtn'>保存</View>} />
      <View style={style}>
        <View className='listitem head'>
          <View className='left'>头像：</View>
          <View className='right' onClick={upHead}>
            <Image src=''></Image>
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
        <View className='listitem'>
          <View className='left'>昵称：</View>
          <View className='right'>1231</View>
        </View>
        <View className='listitem'>
          <View className='left'>性别：</View>
          <View className='right'>女</View>
        </View>
        <View className='listitem'>
          <View className='left'>邮箱：</View>
          <View className='right'>123123</View>
        </View>
      </View>
    </View>
  );
};

export default observer(MyInfo);
