import React, { forwardRef} from 'react'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'

const ListItem = (props, ref) => {
  return (
    <View className='list-item' onClick={props.onClick}>
      <View className='base'>
      {
        props.icon && <AtIcon prefixClass='icon' value={props.icon.value} color={props.icon.color} size={props.icon.size} className='alicon'></AtIcon>
      }
      <Text>{props.title}</Text>
      </View>
      <View className='extra'>
        {props.extra}
        <View className='at-icon at-icon-chevron-right'></View>
      </View>
    </View>
  )
}

export default forwardRef(ListItem)
