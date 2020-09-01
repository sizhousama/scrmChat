import React, { useEffect, useRef, useContext } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { forwardRef } from 'react'
import './index.scss'
const Tools = (props, ref) => {
  const tools = [
    {
      icon: 'at-icon at-icon-message',
      name: '快捷回复'
    },
    {
      icon: 'at-icon at-icon-image',
      name: '图片'
    },
    {
      icon: 'at-icon at-icon-folder',
      name: '文件'
    },
    {
      icon: 'at-icon at-icon-file-new',
      name: '订单'
    },
    {
      icon: 'icon icon-flow',
      name: '流程'
    }
  ]
  const clicktool = (e) => {
    props.handleClick(e.currentTarget.dataset.id)
    e.stopPropagation()
  }
  return (
    <View className='toolbox'>
      {
        tools.map((tool, idx) => {
          return (
            <View className='tool' onClick={clicktool} data-id={idx} key={idx}>
              <View className='icon'>
                <View className={tool.icon}></View>
              </View>
              <Text className='label'>{tool.name}</Text>
            </View>
          )
        })
      }
    </View>
  )
}

export default forwardRef(Tools)
