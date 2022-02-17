import React, { useEffect, useRef, useState, useReducer , forwardRef } from 'react'
import { View, Image, Text, ScrollView, RichText } from '@tarojs/components'
import { AtCheckbox,AtButton  } from 'taro-ui'
import {previewImg} from '@/utils/index'
import { observer } from 'mobx-react';
import { useFanStore} from '@/store';
import './index.scss'

const TimeOutMsg = (props, ref) => {
  const {setShowMsg} = useFanStore()
  const [selected,setSelected] = useState<boolean[]>([])
  const img = "https://image.hivescrm.cn/image/2020/12/01/1347d3fb-0857-434d-8430-210acd5686ee.png"
  const options = [{
    value: false,
    label: '不再提示'
  }]
  const changeTips = (v) =>{
    setShowMsg(v.length>0?false:true)
    setSelected(v)
  }
  const clickKnow = ()=>{
    props.close()
  }
  return (
    <View className='mask'>
      <View className='timeout-msg-box' onClick={(e) => e.stopPropagation()}>
        <View className='topheader'>FB Messenger 24小时外发消息限制政策说明</View>
        <ScrollView scrollY className='timeout-msg-box-scroll'>
          <View className='timeout-msg-box-scroll-inner'>
            <View className='title'>基本规则</View>
            <View className='oneSec'>
              <View className='line'>1. 在最后一次互动之后，企业有24小时向用户发送消息。此24小时消息传递窗口内的消息可以发送任何消息包括促销内容。</View>
              <View className='line'>2. 超过24小时发送消息必须使用三个消息标签之一进行标记</View>
              <View className='oneSec'>
                <View className='line'>a. CONFIRMED_EVENT_UPDATE（活动更新）：有关用户已订阅事件的提醒或更新，例如卖演唱会门票提示用户演唱会多久开始。</View>
                <View className='line'>b. POST_PURCHASE_UPDATE （订单信息更新）：交易确认，物流状态，订单更改。</View>
                <View className='line'>c. ACCOUNT_UPDATE （账号更新）：申请状态的更改（例如，信用卡，工作），通知账号可疑活动，例如账号到期提醒、账号有异常操作提醒。</View>
              </View>
              <View className='line' style={{color:'red'}}>3. 除了标签，您还可以向明确选择接收一次性通知（OTN）的用户发送一条消息。一次性通知（OTN）允许您在24小时后发送任何消息包括促销内容。</View>
            </View>
            <View className='title'>对于Hivescrm平台的客户</View>
            <View className='oneSec'>
              <View className='line'>1. 在用户的最后一次互动之后超过24小时发送的任何消息，都必须符合消息标签使用说明。</View>
              <View className='line'>2. 如果希望对用户进行二次营销，可以24小时消息传递窗口内发送一次性通知（OTN）订阅邀请，超过24小时后选择对应订阅的主题发送消息。</View>
              <View className='line'>3. 违反政策，使用发送与消息标签不相匹配的内容，会收到Facebook的处罚，最严重的可导致主页被永久禁言。</View>
              <View className='line'><Image src={img} onClick={()=>previewImg(img)} mode='widthFix'></Image></View>
            </View>
            <View className='title'>对于在Facebook主页收件箱的客户</View>
            <View className='oneSec'>
              <View className='line'>1. 在用户的最后一次互动之后超过24小时发送的任何消息，必须控制发送频率，尽可能不要和数日未回复消息的用户主动发消息。（这么做只是降低被封主页或者被FB账号的风险，不能保证完全避免）</View>
            </View>

            <View className='footer'>
              <View className='footer-left'>
                <AtCheckbox 
                  options={options}
                  selectedList={selected}
                  onChange={changeTips}
                ></AtCheckbox>
              </View>
              <View className='footer-right'>
                <AtButton 
                  type='primary' 
                  size='small' 
                  full={false} 
                  circle
                  onClick={clickKnow}
                >我知道了</AtButton>
              </View>
            </View>
            
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default observer(forwardRef(TimeOutMsg))
