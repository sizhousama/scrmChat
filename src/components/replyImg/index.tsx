import React, { useEffect, useRef, useState, useReducer } from 'react'
import { View, Image} from '@tarojs/components'
import { forwardRef } from 'react'
import {previewImg} from '@/utils/index'
import './index.scss'

const ReplyImg = (props, ref) => {
  const close = (e)=>{
    e.stopPropagation()
    props.handleClick(e)
  }
  const viewimg = (e)=>{
    previewImg(props.url)
    e.stopPropagation()
  }
  return (
    <View className='replyimg' >
      <Image src={props.url} onClick={viewimg}></Image>
      <View className='at-icon at-icon-close-circle' onClick={close}></View>
    </View>
  )
}

export default forwardRef(ReplyImg)
