import React, { forwardRef } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { imgUrl } from '@/servers/baseUrl'
import { NavTo } from '@/utils/index'
import { observer } from 'mobx-react';
import { useFanStore } from '@/store';
import './index.scss'

const OrderFormItem = (props, ref) => {
  return (
    <View className={`order-form-item fx ${props.type === 'img' ? 'addH' : ''}`} >
      {props.id==='keyword'?props.products:''}
      <View className='label fx1'>
        {props.require ? <Text style='color:red'>*</Text> : ''}{props.label}
      </View>
      <View className='content fx1'>
        {props.formCont}
      </View>
      <View className='ricon fx'>
        <View className='at-icon at-icon-chevron-right'></View>
      </View>
    </View>
  )
}

export default observer(forwardRef(OrderFormItem))
