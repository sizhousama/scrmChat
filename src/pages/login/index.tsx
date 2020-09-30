import React, { useState } from 'react'
import wechat from '@/assets/images/wechat.png'
import { View, Image, Text } from '@tarojs/components'
import { AtInput, AtForm, AtButton } from 'taro-ui'
import { login } from '@/api/login'
import { Toast, SetStorageSync, SwitchTab } from '@/utils/index'
import CryptoJS from 'crypto-js'
import { observer } from 'mobx-react';
import Taro from '@tarojs/taro'
import './index.scss'

const Login = () => {
  const [userName, setUserName] = useState('')
  const [password, setpassword] = useState('')
  const [ptype, setPtype] = useState<any>('password')
  const Encrypt = (word: string) => {
    var key = CryptoJS.enc.Utf8.parse('abcdefgabcdefg12')
    var srcs = CryptoJS.enc.Utf8.parse(word)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.toString()
  }
  const handleLogin = () => {
    const pwd = Encrypt(password)
    const obj = {
      userName,
      password: pwd,
    }
    login(obj).then(res => {
      const { data } = res
      const token = `${data.tokenHead}${data.token}`
      SetStorageSync('Token', token)
      Toast('登录成功', 'none')
      setTimeout(() => {
        SwitchTab('/pages/chat/index')
      }, 1000)
    }).catch(err => {
      console.log(err)
    })
  }
  const inputUserName = (v) => {
    setUserName(v)
  }
  const inputPassWord = (v) => {
    setpassword(v)
  }
  const seePass = () => {
    if (ptype === 'text') {
      setPtype('password')
    } else {
      setPtype('text')
    }
  }
  const getUserInfo = (v) => {
    // Taro.checkSession({
    //   success(res) {
    //     console.log(res)
    //   },
    //   fail(err) {
    //     console.log(err)
    //     //重新登录
    //   }
    // })
    // Taro.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       console.log(1)
    //     } else {
    //       //重新授权
    //     }
    //   }
    // })
    Taro.getUserInfo({
      success: function(res) {
        console.log(res)
      }
    })
    // Taro.login({
    //   success: function (res) {
    //     if (res.code) {
    //       console.log(res)
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
  }
  return (
    <View className='loginbody'>
      <View className='head'>
        <Image src='https://www.hivescrm.cn/static/img/logo.55b4565b.png' />
      </View>
      <Text className='name'>HIVE SCRM</Text>
      <View className='username'>
        <AtInput
          required={true}
          className='input'
          name='userName'
          placeholder='请输入账号...'
          value={userName}
          onChange={inputUserName}
        />
      </View>
      <View className='password'>
        <AtInput
          name='userPass'
          required={true}
          type={ptype}
          className='input'
          placeholder='请输入密码...'
          value={password}
          onChange={inputPassWord}
        />
        <View className='eye' onClick={seePass}>
          <View className='at-icon at-icon-eye eye'></View>
        </View>
      </View>
      <AtButton className='submit' onClick={handleLogin} >立即登录</AtButton>
      {/* <View className='other-login'>
        ———&nbsp;&nbsp;&nbsp;其他登录&nbsp;&nbsp;&nbsp;———
      </View> */}
      {/* <View className='login-type'>
        <View className='login-type-item'>
          <View className='login-type-item-top'>
            <AtButton openType='getUserInfo' onGetUserInfo={getUserInfo}>
            <Image style={{width:'22px',height:'22px',marginTop:'5px'}} src={wechat}></Image>
            </AtButton>
          </View>
          <View className='login-type-item-bot'>微信登录</View>
        </View>
      </View> */}
    </View>
  )
}

export default observer(Login)
