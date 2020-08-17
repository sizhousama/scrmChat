import React, { useRef,useEffect } from 'react'
import { View, Image, Text } from '@tarojs/components'
import TabBar from "../tabbar";
import mine_w from '@/assets/images/mine_white.png'
import {NavTo,redirectTo,SetStorageSync} from '@/utils/index'
import {getUserInfo} from '@/api/info'
import { observer } from 'mobx-react';
import { useUserStore } from '@/store';
import './index.scss'

const Mine = () => {
  const cur: number = 2
  const childref = useRef();
  const {userInfo,setUserInfo} = useUserStore()
  const editinfo =()=>{
    NavTo('../myInfo/index')
  }
  const editPass = () =>{
    NavTo('../rePassword/index')
  }
  useEffect(()=>{
    getinfo()
  },[])
  const getinfo= async()=>{
    await getUserInfo().then(res=>{
      const {data} = res
      setUserInfo(data.sysUser)
    })
  }
  const logout =()=>{
    SetStorageSync('Token','')
    redirectTo('/pages/login/index')  
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
            <Image src={userInfo.avatar} />
          </View>
          <View className='right'>
            <View className='top'>
              <View className='name'>{userInfo.username}</View>
              <View className='edit' onClick={editinfo}>
                <View className='at-icon at-icon-edit'></View>
              </View>
            </View>
            <View className='bot'>公司：{userInfo.companyName}</View>
          </View>
        </View>
      </View>
      <View className='botbox'>
        <View className='itembox'>
          <View className='at-icon at-icon-home'></View>
          <View>已绑定主页：</View>
          <View className='cont'>{userInfo.pageId}</View>
        </View>
        <View className='itembox'>
          <View className='at-icon at-icon-mail'></View>
          <View>已绑定邮箱：</View>
          <View className='cont'>{userInfo.email}</View>
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
      <TabBar ref={childref} cur={cur} />
    </View>
  )
}

export default observer(Mine)
