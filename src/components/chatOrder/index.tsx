import React, { useEffect, useRef, useReducer, useState } from 'react'
import { View, Image, Text,Picker } from '@tarojs/components'
import { forwardRef } from 'react'
import { AtForm, AtInput,AtList,AtListItem } from 'taro-ui'
import './index.scss'
const initState = {
  goosname: '',
  ordernum: '',
  orderdate: '2018-04-22',
  cashout: 0,
}
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return {
        ...state,
        goosname: action.payload.name
      }
    case 'num':
      return {
        ...state,
        ordernum: action.payload.num
      }
    case 'date':
      return {
        ...state,
        ordertime: action.payload.date
      }
    case 'cash':
      return {
        ...state,
        cashout: action.payload.cash
      }
    default:
      return state;
  }
}
const ChatOrder = (props, ref) => {
  const [state, dispatch] = useReducer(stateReducer, initState)
  const { goosname, ordernum, cashout, orderdate } = state
  const changeOrderNum = (v) => {
    dispatch({ type: 'num', payload: { num: v } })
  }
  const changeGoodsName = (v) => {
    dispatch({ type: 'name', payload: { name: v } })
  }
  const onDateChange = (v) =>{

  }
  return (
    <View className='chatorderbox' onClick={(e) => { e.stopPropagation() }}>
      <View className='orderheader'>录入订单</View>
      <AtForm className='orderform'>
        <view className='label'>商品名称：</view>
        <AtInput
          name='goosName'
          className='cominput orderinput'
          type='text'
          placeholder='请输入商品名称'
          value={goosname}
          onChange={changeGoodsName}
        />
        <view className='label'>订单号：</view>
        <AtInput
          name='orderNum'
          className='cominput orderinput'
          type='text'
          placeholder='请输入订单号'
          value={ordernum}
          onChange={changeOrderNum}
        />
        <view className='label'>订单时间：</view>
        <Picker value='' mode='date' onChange={onDateChange} className='orderpicker'>
          <AtList>
            <AtListItem title='请选择日期' extraText={orderdate} />
          </AtList>
        </Picker>
        <view className='label'>返款状态：</view>
        <Picker value='' mode='date' onChange={onDateChange} className='orderpicker'>
          <AtList>
            <AtListItem title='请选择日期' extraText={orderdate} />
          </AtList>
        </Picker>

        <View className='formbtn'>
          <View className='flb'>
            <View className='rest searchbtn'>重置</View>
          </View>
          <View className='frb'>
            <View className='creat searchbtn'>录入</View>
          </View>
        </View>
      </AtForm>
    </View>
  )
}

export default forwardRef(ChatOrder)
