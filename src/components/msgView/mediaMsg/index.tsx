import React, { useState,useEffect, useRef } from 'react'
import { View, Text, Video, Audio } from '@tarojs/components'
import { forwardRef } from 'react'
import Taro from "@tarojs/taro";
import './index.scss'


const MediaMsg = (props, ref) => {
  const isV = props.msgItem.originType === 'video' ? true : false
  const url = props.msgItem.mediaUrl
  const [playing,SetPlaying] = useState(false)
  const myaudio = Taro.createInnerAudioContext()

  const createAudio = ()=>{
    myaudio.autoplay = false
    myaudio.src = url
    myaudio.onPlay(() => {
      console.log('播放中')
    })
    myaudio.onPause(() => {
      console.log('暂停')
    })
    myaudio.onStop(() => {
      console.log('停止')
    })
    myaudio.onEnded(() => {
      console.log('结束')
      SetPlaying(false)
    })

    myaudio.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
  const play = ()=>{
    myaudio.play()
    SetPlaying(true)
  }
  const pause = ()=>{
    myaudio.pause()
    SetPlaying(false)
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
            <View className='action'>
              {
                playing
                ?
                <View className='at-icon at-icon-pause' onClick={pause}></View>
                :
                <View className='at-icon at-icon-play' onClick={play}></View>
              }
            </View>
            <View className='progress'>

            </View>
            <View className='time'>
            </View>
            {createAudio()}
          </View>
      }
    </View>
  )
}

export default forwardRef(MediaMsg)
