import React, { useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { AtInput, AtForm, AtButton } from 'taro-ui'
import { login } from '@/api/login'
import {Toast,SetStorageSync,SwitchTab} from '@/utils/index'
import CryptoJS from 'crypto-js'
import { observer } from 'mobx-react';
import './index.scss'

const Login = () => {
  const [userName, setUserName] = useState('')
  const [password, setpassword] = useState('')
  const Encrypt = (word:string)=> {
    var key = CryptoJS.enc.Utf8.parse('abcdefgabcdefg12')
    var srcs = CryptoJS.enc.Utf8.parse(word)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.toString()
  }
  const handleLogin = () => {
    const pwd = Encrypt(password)
    const obj = {
      userName,
      password:pwd,
    }
    login(obj).then(res => {
      const {data} = res
      const token = `${data.tokenHead}${data.token}`
      SetStorageSync('Token',token)
      Toast('登录成功','none')  
      setTimeout(()=>{
        SwitchTab('/pages/mine/index')
      },1000)     
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
  return (
    <View className='loginbody'>
      <View className='head'>
        <Image src='https://www.hivescrm.cn/static/img/logo.55b4565b.png' />
      </View>
      <Text className='name'>HIVE SCRM</Text>
      {/* <AtForm className='loginform'> */}
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
          required={true}
          type='password'
          className='input'
          name='passWord'
          placeholder='请输入密码...'
          value={password}
          onChange={inputPassWord}
        />
      </View>
      {/* </AtForm> */}
      <AtButton className='submit' onClick={handleLogin} >立即登录</AtButton>
    </View>
  )
}

export default observer(Login)
