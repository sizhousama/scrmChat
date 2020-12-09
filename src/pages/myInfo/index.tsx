import React, { useRef, useState, useEffect } from "react";
import NavBar from "@/components/navBar";
import { View, Image, Text } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useNavStore, useUserStore } from '@/store';
import { previewImg, chooseImg, Toast, Back } from '@/utils/index'
import { AtActivityIndicator, AtButton } from 'taro-ui'
import { bindWeCaht } from '@/api/login'
import Taro from '@tarojs/taro'
import "./index.scss";

const MyInfo = () => {
  const childref = useRef();
  const { navH } = useNavStore();
  const { userInfo, setAvatar, setWxInfo } = useUserStore()
  const [loading, setLoading] = useState(false)
  const style = {
    marginTop: navH + 10 + 'px'
  }
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
  const getUserInfo = (type) => {
    Taro.login({
      success: function (res) {
        if (res.code) {
          Taro.getUserInfo({
            success: function (info) {
              console.log(info)
              const obj = {
                code: res.code,
                info: info.userInfo.nickName,
                type,
              }
              bindWeCaht(obj).then(res => {
                try {
                  if(res){
                    Toast(type === 2 ? '绑定成功！' : '解绑成功！', 'none')
                    type === 2 ? setWxInfo(info.userInfo.nickName) : setWxInfo('')
                    setTimeout(() => {
                      Back()
                    }, 1000);
                  }
                  
                } catch (err) {
                  console.log(err)
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
  const unbind = () => {
    Taro.showModal({
      title: '',
      content: `是否确认解绑？`,
      success(res) {
        if (res.confirm) {
          getUserInfo(1)
        }
      }
    })
  }

  return (
    <View>
      <NavBar title='编辑个人信息' />
      <View style={style}>
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
        {/* <View className='listitem'>
          <View className='left'>微信：</View>
          <View className='right'>
            {
              userInfo.wxMiniInfo ?
                <View onClick={unbind}>{userInfo.wxMiniInfo}<Text className='unbind'>解绑</Text></View>
                :
                <AtButton className='bindbtn' openType='getUserInfo' onGetUserInfo={() => getUserInfo(2)}>
                  未绑定
                </AtButton>
            }
          </View>
        </View> */}
      </View>
    </View>
  );
};

export default observer(MyInfo);
