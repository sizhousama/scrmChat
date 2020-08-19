import React, { useEffect, useRef } from 'react'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { forwardRef } from 'react'
import './index.scss'
const SwiperMsg = (props, ref) => {
  const list = props.msgItem.elements
  return (
    <View className='generic-msg'>
      <Swiper
        className='swiper'
        indicatorColor='rgba(0,0,0,.1)'
        indicatorActiveColor='rgba(0,0,0,.5)'
        circular
        indicatorDots
        autoplay>
        {
          list.map((item, index) => {
            return (
              <SwiperItem key={index}>
                <View className='sitem'>
                  <Image
                    className='simg'
                    src={item.image_url}
                    mode='widthFix'
                  ></Image>
                  <Text className='title break'>{item.title}</Text>
                  {
                    item.buttons ?
                      item.buttons.map((btn, idx) => {
                        return (
                          <Text className='btn' key={idx}>{btn.title}</Text>
                        )
                      })
                      : ''
                  }
                </View>


              </SwiperItem>
            )
          })
        }

      </Swiper>
    </View>
  )
}

export default forwardRef(SwiperMsg)
