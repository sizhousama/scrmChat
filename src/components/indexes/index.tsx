import React, { useEffect, useRef, useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { forwardRef } from 'react'
import {IndexesArr} from '@/constant/index'
import {Toast} from '@/utils/index'
import Taro from "@tarojs/taro";

const Header = (props, ref) => {
  const list = IndexesArr
  const [cur,setCur] = useState('')
  const clickIndex=(e)=>{
    const key = e.currentTarget.dataset.key
    setCur(key)
    const id = '#'+ key
    const query = Taro.createSelectorQuery()
    query.select(id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if(!res[0]){
        return false
      }
      Taro.pageScrollTo({
        scrollTop: res[0].top + res[1].scrollTop - 44,
        duration: 200
      })
      Toast(key,'none',500)
    })
  }
  return (
    <View className='indexes'>
      {
        list.map((item, index) => {
          return (
            <View
            key={index}
            className={`indexitem ${cur===item.title?'act':''}`}
            onClick={clickIndex}
            data-key={item.title}
            >{item.title}</View>
          )
        })
      }
    </View>
  )
}

export default forwardRef(Header)
