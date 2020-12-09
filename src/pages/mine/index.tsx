import React, { useRef, useEffect } from 'react'
import { View, Image, Text } from '@tarojs/components'
import TabBar from "../tabbar";
import mine_w from '@/assets/images/mine_white.png'
import { NavTo, redirectTo, SetStorageSync, Toast, Back } from '@/utils/index'
import { observer } from 'mobx-react';
import { AtButton } from 'taro-ui'
import { useUserStore, useFanStore } from '@/store';
import { bindWeCaht } from '@/api/login'
import Taro from '@tarojs/taro'
import './index.scss'

const Mine = () => {
  const cur: number = 2
  const childref = useRef();
  const { userInfo, role, setRole, setWxInfo } = useUserStore()
  const { hasNew } = useFanStore()
  const editinfo = () => {
    NavTo('../myInfo/index')
  }
  const editPass = () => {
    NavTo('../rePassword/index')
  }
  const logout = () => {
    SetStorageSync('Token', '')
    setRole(null)
    redirectTo('/pages/login/index')
  }
  const openPage = () => {
    NavTo('../myPages/index')
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
                userId:''
              }
              bindWeCaht(obj).then(res => {
                try {
                  if (res) {
                    Toast(type === 2 ? '绑定成功！' : '解绑成功！', 'none')
                    type === 2 ? setWxInfo(info.userInfo.nickName) : setWxInfo('')
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
    <View className='minebody'>
      <View className='topbox'>
        <View className='navbox'>
          <Image src={mine_w} />
          <Text>个人信息</Text>
        </View>
        <View className='userbox'>
          <View className='left'>
            <Image src={`${userInfo.avatar}?${Math.random()}`} />
          </View>
          <View className='right'>
            <View className='top'>
              <View className='name'>
                <Text className='break'>{userInfo.username}</Text>
              </View>
              <View className='edit' onClick={editinfo}>
                <View className='at-icon at-icon-edit'></View>
              </View>
            </View>
            <View className='bot'>
              <Text className='break'>公司：{userInfo.companyName}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className='botbox'>
        {
          role !== 4 ?
            <View className='itembox' onClick={openPage}>
              <View className='at-icon at-icon-home'></View>
              <View>已绑定主页</View>
              <View className='cont'>点击查看主页信息</View>
            </View> : ''
        }
        <View className='itembox'>
          <View className='at-icon at-icon-mail'></View>
          <View>已绑定邮箱</View>
          <View className='cont'>{userInfo.email}</View>
        </View>
        <View className='itembox'>
          <View className='icon icon-wechat'></View>
          <View>{userInfo.wxMiniInfo ? '已' : "未"}绑定微信</View>
          <View className='cont'>{userInfo.wxMiniInfo ? userInfo.wxMiniInfo : "请绑定微信"}</View>
          <View className='bind'>
            {
              userInfo.wxMiniInfo ?
                <View onClick={unbind} className='unbind'>解绑</View>
                :
                <AtButton className='bindbtn' openType='getUserInfo' onGetUserInfo={() => getUserInfo(2)}>
                  绑定
                </AtButton>
            }
          </View>
        </View>
        <View className='at-row btnbox'>
          <View className='at-col left'>
            <View className='repass' onClick={editPass}>修改密码</View>
          </View>
          <View className='at-col right'>
            <View className='logout' onClick={logout}>退出登录</View>
          </View>
        </View>
      </View>
      <TabBar ref={childref} cur={cur} has={hasNew} />
    </View>
  )
}

export default observer(Mine)
