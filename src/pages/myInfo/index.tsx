import React, { useRef, useState } from "react";
import { View, Image } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useUserStore } from '@/store';
import { previewImg, chooseImg } from '@/utils/index'
import { AtActivityIndicator } from 'taro-ui'
import "./index.scss";

const MyInfo = () => {
  const childref = useRef();
  const { userInfo, setAvatar } = useUserStore()
  const [loading, setLoading] = useState(false)
  const upHead = async () => {
    const url = '/scrm-seller/utils/uploadFileAvatarImg'
    setLoading(true)
    await chooseImg(url, 1).then(res => {
      setAvatar('')
      setAvatar(res[0])
      setLoading(false)
    })
  }
  const viewImg = (e) => {
    e.stopPropagation()
    previewImg(`${userInfo.avatar}?${Math.random()}`)
  }

  return (
    <View>
      <View>
        <View className='listitem head'>
          <View className='left'>头像：</View>
          <View className='right' onClick={upHead}>
            <Image src={`${userInfo.avatar}?${Math.random()}`} onClick={viewImg}>
              <AtActivityIndicator isOpened={loading} mode='center'></AtActivityIndicator>
            </Image>
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
        <View className='listitem'>
          <View className='left'>昵称：</View>
          <View className='right'>{userInfo.username}</View>
        </View>
        <View className='listitem'>
          <View className='left'>邮箱：</View>
          <View className='right'>{userInfo.email}</View>
        </View>
      </View>
    </View>
  );
};

export default observer(MyInfo);
