import React, { useEffect, useRef, useReducer, useState } from 'react'
import { View, Image, Text,Picker } from '@tarojs/components'
import { forwardRef } from 'react'
import { AtForm, AtInput,AtList,AtListItem } from 'taro-ui'
import {cashOutStatus,cashOuts} from '@/constant/index'
import './index.scss'
const initState = {
  goosname: '',
  ordernum: '',
  orderdate: new Date().toLocaleDateString().replace(/\//g,'-'),
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
        orderdate: action.payload.date
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
  const [curcashout,setCurCashOut] = useState('已返款')
  const { goosname, ordernum, cashout, orderdate } = state
 
  const changeOrderNum = (v) => {
    dispatch({ type: 'num', payload: { num: v } })
  }
  const changeGoodsName = (v) => {
    dispatch({ type: 'name', payload: { name: v } })
  }
  const onDateChange = (e) =>{
    dispatch({type:'date',payload:{date:e.detail.value}})
  }
  const onCashOutChange = (e) =>{
    setCurCashOut(cashOuts[e.detail.value])
    dispatch({type:'cash',payload:{cash:e.detail.value}})
  }
  const restForm = ()=>{
    dispatch({ type: 'name', payload: { num: '' } })
    dispatch({ type: 'num', payload: { num: '' } })
    dispatch({type:'date',payload:{date:new Date().toLocaleDateString().replace(/\//g,'-')}})
    setCurCashOut('已返款')
    dispatch({type:'cash',payload:{cash:0}})
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
        <Picker value={orderdate} mode='date' onChange={onDateChange} className='orderpicker'>
          <AtList>
            <AtListItem title='请选择日期' extraText={orderdate} />
          </AtList>
        </Picker>
        <view className='label'>返款状态：</view>
        <Picker mode='selector' value={cashout} onChange={onCashOutChange} range={cashOuts} className='orderpicker'>
          <AtList>
            <AtListItem title='请选择日期' extraText={curcashout} />
          </AtList>
        </Picker>

        <View className='formbtn'>
          <View className='flb'>
            <View className='rest searchbtn' onClick={restForm}>重置</View>
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
