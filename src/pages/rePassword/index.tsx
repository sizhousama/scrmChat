import React, { useState, useEffect } from "react";
import NavBar from "@/components/navBar";
import { View } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useNavStore, useUserStore } from '@/store';
import { checkPass, rePassOrAva,removeToken } from '@/api/info';
import { AtInput } from 'taro-ui'
import { Toast,redirectTo } from '@/utils/index'
// import CryptoJS from 'crypto-js'
import "./index.scss";

const RePassWord = () => {
  const [originPass, setOriginPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [renewPass, setRenewPass] = useState('')
  // mobx
  const { navH } = useNavStore();
  const { userInfo } = useUserStore()
  const style = {
    marginTop: navH + 10 + 'px'
  }
  // 加密
  // const Encrypt = (word: string) => {
  //   var key = CryptoJS.enc.Utf8.parse('abcdefgabcdefg12')
  //   var srcs = CryptoJS.enc.Utf8.parse(word)
  //   var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  //   return encrypted.toString()
  // }
  const changeOriginPass = (v) => {
    setOriginPass(v)
  }
  const changeNewPass = (v) => {
    setNewPass(v)
  }
  const changeRenewPass = (v) => {
    setRenewPass(v)
  }

  const save = async () => {
    console.log(originPass, newPass, renewPass)
    if (newPass.length < 6 || newPass.length > 20 || renewPass.length < 6 || renewPass.length > 20) {
      Toast('长度在6~20个字符之间！', 'none')
      return false
    }
    if (newPass !== renewPass) {
      Toast('两次密码不一致！', 'none')
      return false
    }
    await checkPass({ password: originPass }).then(res => {
      repass()
    })
  }
  const repass = async () => {
    const data = {
      password: newPass,
      userId: userInfo.userId
    }
    await rePassOrAva(data).then(res => {
      Toast('修改成功!', 'none')
      removeToken()
      setTimeout(()=>{
        redirectTo('/pages/login/index')
      },1000)
    })
  }

  return (
    <View>
      <NavBar title='修改密码' btn={<View className='navbtn' onClick={save}>保存</View>} />
      <View style={style}>
        <View className='listitem'>
          <View className='left'>原密码：</View>
          <View className='right'>
            <AtInput
              name='origin'
              className='pinput'
              type='password'
              value={originPass}
              onChange={changeOriginPass}
            ></AtInput>
          </View>
        </View>
        <View className='listitem'>
          <View className='left'>新密码：</View>
          <View className='right'>
            <AtInput
              name='new'
              className='pinput'
              type='password'
              value={newPass}
              onChange={changeNewPass}
            ></AtInput>
          </View>
        </View>
        <View className='listitem'>
          <View className='left'>确认新密码：</View>
          <View className='right'>
            <AtInput
              name='renew'
              className='pinput'
              type='password'
              value={renewPass}
              onChange={changeRenewPass}
            ></AtInput>
          </View>
        </View>
      </View>
    </View>
  );
};

export default observer(RePassWord);
