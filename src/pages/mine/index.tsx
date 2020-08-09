import React, { useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import TabBar from "../tabbar";
import mine_w from '@/assets/images/mine_white.png'
import './index.scss'

const Mine = () => {
  const cur: number = 2
  const childref = useRef();
  return (
    <View className='minebody'>
      <View className='topbox'>
        <View className='navbox'>
          <Image src={mine_w} />
          <Text>个人信息</Text>
        </View>
        <View className='userbox'>
          <View className='left'>
            <Image src='1' />
          </View>
          <View className='right'>
            <View className='top'>
              <View className='name'>哈哈哈</View>
              <View className='edit'>
                <View className='at-icon at-icon-edit'></View>
              </View>
            </View>
            <View className='bot'>公司：12312321312</View>
          </View>
        </View>
      </View>
      <View className='botbox'>
        <View className='itembox'>
          <View className='at-icon at-icon-home'></View>
          <View>已绑定主页：</View>
          <View className='cont'>1232131123123</View>
        </View>
        <View className='itembox'>
          <View className='at-icon at-icon-mail'></View>
          <View>已绑定邮箱：</View>
          <View className='cont'>1232131123123</View>
        </View>
        <View className='at-row btnbox'>
          <View className='at-col left'>
            <View className='repass'>修改密码</View>
          </View>
          <View className='at-col right'>
            <View className='logout'>退出登录</View>
          </View>
        </View>
      </View>
      <TabBar ref={childref} cur={cur} />
    </View>
  )
}

export default Mine
