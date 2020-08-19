import React, { useEffect, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { forwardRef } from 'react'
import Taro from "@tarojs/taro";
import './index.scss'
import { fail } from 'mobx/lib/internal';


const FileMsg = (props, ref) => {
  const openfile = () => {
    Taro.downloadFile({
      url: props.msgItem.fileUrl,
      success: function (res) {
        const filePath = res.tempFilePath
        Taro.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function(){
            Taro.saveFile({
              tempFilePath: filePath,
              success (res) {
                // const savedFilePath = res.savedFilePath
                // console.log()
                console.log('保存成功')
              }
            })
          }
        })
      }
    })
  }
  return (
    <View className='file-msg' onClick={openfile}>
      <View className='title'>
        {props.msgItem.filename}
      </View>
      <View className='icon'>
        <View className='at-icon at-icon-file-generic'></View>
      </View>
    </View>
  )
}

export default forwardRef(FileMsg)
