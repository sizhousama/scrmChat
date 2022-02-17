import React, { useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { getSysInfo, NavTo, redirectTo, SetStorageSync, Toast } from '@/utils/index'
import { observer } from 'mobx-react';
import { AtButton } from 'taro-ui'
import { useUserStore, useFanStore } from '@/store';
import { bindWeChat } from '@/api/login'
import Taro, { useDidShow } from '@tarojs/taro'
import ListItem from '@/components/listItem';
import TabBar from "../tabbar";
import './index.scss'

const Mine = () => {
  const cur: number = 2
  const childref = useRef();
  const { userInfo, role, setRole, setWxInfo, type, themeColor } = useUserStore()
  const { hasNew } = useFanStore()
  const barHeight = getSysInfo().statusBarHeight
  const blockStyle:any = {
    width: "100%",
    height: barHeight + 44 + 'px',
    color: '#fff',
    position: 'relative'
  }

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

  const getUserInfo = (t) => {
    Taro.login({
      success: function (res) {
        if (res.code) {
          Taro.getUserInfo({
            success: function (info) {
              console.log(info)
              const obj = {
                code: res.code,
                info: info.userInfo.nickName,
                type:t,
                userId:''
              }
              bindWeChat(obj).then(res2 => {
                try {
                  if (res2) {
                    Toast(t === 2 ? '绑定成功！' : '解绑成功！', 'none')
                    t === 2 ? setWxInfo(info.userInfo.nickName) : setWxInfo('')
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

  const typeFilter = () => {
    switch(type){
      case 'messenger': return 'Messenger平台'
      case 'whatsapp': return 'WhatsApp平台'
      case 'ins': return 'Instagram平台'
      default: return 'Messenger平台'
    }
  }

  const unbind = () => {
    if(userInfo.wxMiniInfo){
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
  }

  useDidShow(()=>{
    console.log(themeColor)
  })

  return (
    <View className='minebody'>
      <View className='topbox'>
        <View style={blockStyle}>
          <View className='back-icon' onClick={()=>NavTo('/pages/platform/index')}>
            <View className='at-icon at-icon-menu'></View>
          </View>
          <View className='bottom'>个人信息</View>
        </View>
        <View className='userbox' onClick={editinfo}>
          <View className='left'>
            <Image src={`${userInfo.avatar}?${Math.random()}`} />
          </View>
          <View className='right'>
            <Text className='top'>{userInfo.username}</Text>
            <Text className='bot'>邮箱：{userInfo.email}</Text>
          </View>
        </View>
      </View>
      {
        (role !== 4 && type === 'messenger') && <ListItem title='已绑定主页' icon={{ size: 20, color: '', value: 'page', }} onClick={()=>NavTo('../myPages/index')}></ListItem>
      }
      {
        type === 'whatsapp' && <ListItem title='已绑定账号' icon={{ size: 20, color: '', value: 'whatsapp', }} onClick={()=>NavTo('../myAccounts/index')}></ListItem>
      }
      {
        type === 'ins' && <ListItem title='已绑定主页' icon={{ size: 20, color: '', value: 'page', }} onClick={()=>NavTo('../myInsPages/index')}></ListItem>
      }
      <ListItem
        title='绑定微信'
        icon={{ size: 20, color: '', value: 'wx', }}
        extra={userInfo.wxMiniInfo?userInfo.wxMiniInfo+' 解绑': (
          <AtButton className='bindbtn' openType='getUserInfo' onGetUserInfo={() => getUserInfo(2)}>绑定</AtButton>
        )}
        onClick={unbind}
      />
      <ListItem title='修改密码' icon={{ size: 20, color: '', value: 'key', }} onClick={editPass}></ListItem>
      <ListItem title='切换平台' icon={{ size: 20, color: '', value: 'yingyong', }} extra={typeFilter()} onClick={()=>NavTo('/pages/platform/index')}></ListItem>
      {/* <ListItem title='消息推送' icon={{ size: 20, color: '', value: 'power', }} ></ListItem> */}
      <View className='at-row btnbox'>
        <View className='at-col'>
          <View className='logout' onClick={logout}>退出登录</View>
        </View>
      </View>
      <TabBar ref={childref} cur={cur} has={hasNew} />
    </View>
  )
}

export default observer(Mine)
