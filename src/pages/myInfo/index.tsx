import React, { useRef, useState, useEffect } from "react";
import NavBar from "@/components/navBar";
import { View, Image } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useNavStore, useUserStore } from '@/store';
import { previewImg } from '@/utils/index'
import { getBaseUrl } from '@/servers/baseUrl'
import Taro from "@tarojs/taro";
// import Taro from "@tarojs/taro";
import "./index.scss";

const MyInfo = () => {
  const childref = useRef();
  const { navH } = useNavStore();
  const { userInfo } = useUserStore()
  const style = {
    marginTop: navH + 10 + 'px'
  }
  const upHead = async () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])
        // const baseurl = getBaseUrl()
        // Taro.uploadFile({
        //   url: `${baseurl}/scrm-seller/utils/uploadFileAvatarByUrl`,
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData:{
        //     'url':tempFilePaths[0]
        //   },
        //   header: {
        //     'Authorization': Taro.getStorageSync('Token'),
        //   },
        //   success(res) {
        //   }
        // })
      }
    })
  }
  const viewImg = (e) => {
    e.stopPropagation()
    previewImg(userInfo.avatar)
  }

  return (
    <View>
      <NavBar title='编辑个人信息' btn={<View className='navbtn'>保存</View>} />
      <View style={style}>
        <View className='listitem head'>
          <View className='left'>头像：</View>
          <View className='right' onClick={upHead}>
            <Image src={userInfo.avatar} onClick={viewImg}></Image>
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
        <View className='listitem'>
          <View className='left'>昵称：</View>
          <View className='right'>{userInfo.username}</View>
        </View>
        {/* <View className='listitem'>
          <View className='left'>性别：</View>
          <View className='right'>女</View>
        </View> */}
        <View className='listitem'>
          <View className='left'>邮箱：</View>
          <View className='right'>{userInfo.email}</View>
        </View>
      </View>
    </View>
  );
};

export default observer(MyInfo);
