import React, { useEffect, useRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { useState, forwardRef } from 'react'
// import Taro from '@tarojs/taro'
import { AtAvatar, AtBadge } from 'taro-ui'
import {toIndexes} from '../../utils/index'

const ChatFan = (props, ref) => {
  // const childref = useRef()
  const [fanlist, setFanList] = useState([1, 2, 3,4,5,6,7,8,9,0,0,2,2,2])
  return (
    <View className='chatfanlist'>
      {
        fanlist.map((item, index) => {
          return (
            <View key={index} className='fanbox'>
              <View className='left'>
                <AtBadge value={10} maxValue={99}>
                  <Image className='head' src='https://www.hivescrm.cn/static/img/logo.55b4565b.png'></Image>
                </AtBadge>
              </View>
              <View className='right'>
                <View className='top'>
                  <Text className='name'>委会云</Text>
                  <Text className='page break'>apple11111111</Text>
                  <View className='tagbox'>
                  <Text className='tag break'>111111111</Text>
                  <Text className='tag break'>哈积分卡积分卡就是</Text>
                  </View>
                </View>
                <View className='bot'>
                  <Text className='newmsg break'>哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</Text>
                  <Text className='date'>2020/05/05</Text>
                </View>
              </View>
            </View>
          )
        })

      }
    </View>
  )
}

export default forwardRef(ChatFan)
