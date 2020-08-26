import React, { useEffect, useRef, useContext } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { forwardRef } from 'react'
import './index.scss'
const Tools = (props, ref) => {
  const tools = [
    'at-icon at-icon-message',
    'at-icon at-icon-image',
    'at-icon at-icon-folder',
    'at-icon at-icon-file-new',
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
              <View className={tool}></View>
            </View>
          )
        })
      }
    </View>
  )
}

export default forwardRef(Tools)
