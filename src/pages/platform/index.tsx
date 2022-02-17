import React ,{ forwardRef, useState }from 'react'
import { AtIcon } from 'taro-ui'
import { View } from '@tarojs/components'
import { useUserStore } from '@/store'
import { Toast } from '@/utils/index'
import Taro from "@tarojs/taro";
import './index.scss'



const Platform = (props, ref) => {
  const {type, setType, setColor} = useUserStore()
  const [cur, setCur] = useState(type)
  
  const platforms = [
    {label: 'Messenger', value: 'messenger', color: '#5880F4' },
    {label: 'WhatsApp', value: 'whatsapp', color: '#22AA88' },
    {label: 'Instagram', value: 'ins', color: '#dd7f9f' }
  ]

  const changeType = (item) => {
    setCur(item.value)
    setType(item.value)
    setColor(item.color)
    Toast('切换成功！', 'none')
    Taro.switchTab({url: '/pages/chat/index'})
  }

  return (
    <View>
      {
        platforms.map((item,index) => {
          return (
            <View className={cur === item.value ? 'platform act' : 'platform'} style={cur === item.value ? {background: item.color} : ''} key={index} onClick={() => changeType(item)}>
              <AtIcon prefixClass='icon' value={item.value} color={cur === item.value ? '#fff' : item.color} size='20' className='alicon'></AtIcon>
              <View >{item.label}</View>
              {
                cur === item.value && <View className='at-icon at-icon-check-circle'></View>
              }
            </View>
          )
        })
      }
    </View>
  )
}

export default forwardRef(Platform)
