import React, { useEffect, useRef } from 'react'
import { View, Text, Video, Audio } from '@tarojs/components'
import { forwardRef } from 'react'
import Taro from "@tarojs/taro";
import './index.scss'


const MediaMsg = (props, ref) => {
  const isV = props.msgItem.originType === 'video' ? true : false
  const url = props.msgItem.mediaUrl
  const createAudio = ()=>{
    const innerAudioContext = Taro.createInnerAudioContext('')
    innerAudioContext.autoplay = true
    innerAudioContext.src = url
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
  
  return (
    <View className='media-msg' >
      {
        isV ?
          <View className='video'>
            <Video className='media' src={url}></Video>
          </View>
          :
          <View className='audio'>
            {/* <Audio className='media' poster="" name="1231" author="12312" src={url} ></Audio> */}
            {createAudio()}
          </View>
      }
    </View>
  )
}

export default forwardRef(MediaMsg)
