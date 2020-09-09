import React, { useEffect, useRef, useState, useReducer } from 'react'
import { View, Image } from '@tarojs/components'
import { forwardRef } from 'react'
import { previewImg } from '@/utils/index'
import './index.scss'

const ReplyImg = (props, ref) => {
  const imgs = props.imgs
  const close = (e) => {
    e.stopPropagation()
    const i = e.currentTarget.dataset.idx
    props.handleClick(i)
  }
  const viewimg = (e) => {
    const url = e.currentTarget.dataset.url
    previewImg(url)
    e.stopPropagation()
  }
  return (
    <View className='replyimg' >
      {
        imgs.map((img, i) => {
          return (
            <View className='imgbox' key={i}>
              <Image src={img} onClick={viewimg} data-url={img}></Image>
              <View className='icon icon-close' onClick={close} data-idx={i}></View>
            </View>
          )
        })
      }

    </View>
  )
}

export default forwardRef(ReplyImg)
