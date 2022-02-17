import React, { forwardRef } from 'react'
import { View, Text } from '@tarojs/components'
import { observer } from 'mobx-react';
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
    </View>
  )
}

export default observer(forwardRef(OrderFormItem))
