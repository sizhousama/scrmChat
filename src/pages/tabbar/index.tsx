import React ,{ forwardRef }from 'react'
import { AtBadge, AtIcon } from 'taro-ui'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { isNeedAddH } from '@/utils/index'
import { useUserStore } from '@/store'
import './index.scss'


const TabBar = (props, ref) => {
  const needAddH = isNeedAddH()
  const { themeColor } = useUserStore()
  const tabList = [ 
    { title: '', icon: 'chat' },
    { title: '', icon: 'user' },
    { title: '', icon: 'mine' }
  ]

  const handleClick = v => {
    const id = v.currentTarget.dataset.key
    if (id === 0) {
      Taro.switchTab({ url: '../chat/index' })
    }
    if (id === 1) {
      Taro.switchTab({ url: '../users/index' })
    }
    if (id === 2) {
      Taro.switchTab({ url: '../mine/index' })
    }
  }
  return (
    <View className={`tabbar ${needAddH?'needH':''}`}>
      {
        tabList.map((item, index) => {
          return (
            <View
              className='tab'
              key={index}
              onClick={handleClick}
              data-key={index}
            >
              <AtBadge dot={index === 0 && props.has}>
                <AtIcon
                  prefixClass='icon'
                  value={item.icon}
                  color={props.cur === index ? themeColor : '#666'}
                  size='24'
                  className='alicon'
                />
              </AtBadge>
            </View>
          )
        })
      }
    </View>
  )
}

export default forwardRef(TabBar)
