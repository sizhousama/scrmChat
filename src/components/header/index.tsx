import React, { forwardRef } from 'react'
import { View } from '@tarojs/components'
import { getSysInfo, NavTo } from '@/utils/index'
import { useFanStore } from '@/store'
import Taro from "@tarojs/taro";
import './index.scss'


const Header = (props, ref) => {
  const { setSearchFrom } = useFanStore()
  const barHeight = getSysInfo().statusBarHeight
  const blockStyle:any = {
    width: "100%",
    height: barHeight + 44 + 'px',
    background: "#fff",
    position: 'relative'
  }

  const search = () => {
    setSearchFrom(props.from)
    NavTo('/pages/search/index')
  }

  return (
    <View className='list-header'>
      <View style={blockStyle}>
        <View className='back-icon' onClick={()=>Taro.reLaunch({url:'/pages/platform/index'})}>
          <View className='at-icon at-icon-menu'></View>
        </View>
        <View className='bottom'>{props.title}</View>
      </View>
      <View className='search-box' style={{ height: '44px' }}>
        <View className='input' onClick={search}>
          <View className='at-icon at-icon-search'></View>
          <View className='search-text'>搜索</View>
        </View>
      </View>
    </View>
  )
}

export default forwardRef(Header)
