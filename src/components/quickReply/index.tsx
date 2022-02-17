import React, { useEffect, useRef, useState, useReducer, forwardRef, useCallback } from 'react'
import { View, Text, ScrollView} from '@tarojs/components'
import { AtActivityIndicator,AtInput } from 'taro-ui'
import { getMessengerReplys } from '@/api/messenger'
import { getWaReplys } from '@/api/wa'
import { getInsReplys } from '@/api/ins'
import { useUserStore } from '@/store'
import Taro from "@tarojs/taro";
import './index.scss'


const initState = {
  replys: []
}
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'reply':
      return {
        ...state,
        replys: action.payload.reply
      }
    default:
      return state;
  }
}
const QuickReply = (props, ref) => {
  const [key,setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(stateReducer, initState)
  const { type } = useUserStore()
  const { replys } = state
  const paramsref = useRef({
    pageId: props.pageId,
    current: 1,
    size: 999,
    type: 2,
    status: 1,
    title: ''
  })

  const getReplys = useCallback((data) => {
    switch(type){
      case 'messenger': return getMessengerReplys(data)
      case 'whatsapp': return getWaReplys(data)
      case 'ins': return getInsReplys(data)
      default: return getMessengerReplys(data)
    }
  },[type])
 
  const setReply = (e) => {
    const item = e.currentTarget.dataset.item
    Taro.showModal({
      title: '',
      content: `确认发送此快捷回复？`,
      success (res) {
        if (res.confirm) {
          props.handleClick(item)
        } else if (res.cancel) {
          
        }
      }
    })
  }

  const getlist = useCallback(async () => {
    setLoading(true)
    await getReplys(paramsref.current).then(res => {
      const { data } = res
      data.records.forEach(item=>{
        // if(type === 'messenger'){
        //   if(item.imgUrl){
        //     if(item.imgUrl.indexOf(',')>-1){
        //       item.imgs=item.imgUrl.split(',')
        //     }else{
        //       item.imgs=[item.imgUrl]
        //     }
        //   }else{
        //     item.imgs=[]
        //   }
        // }
        // if(type === 'whatsapp'){
        //   if(item.imgUrl)
        // }
      })
      dispatch({ type: 'reply', payload: { reply: data.records } })
      setLoading(false)
    })
  },[getReplys])

  const inputChange = (v)=>{
    paramsref.current.title = v
    setKey(v)
  }

  useEffect(() => {
    getlist()
  }, [getlist])

  return (
    <View className='replybox' onClick={(e)=>e.stopPropagation()}>
      {/* <View className='topheader'>快捷回复</View> */}
      <View className='search'>
        <AtInput
          name='replyInput'
          value={key}
          onChange={inputChange}
          onConfirm={getlist}
          placeholder='请输入名字搜索快捷回复'
        ></AtInput>
      </View>
      <ScrollView scrollY className='replyscroll'>
        <View className='replyinner'>
          <AtActivityIndicator isOpened={loading} size={28} mode='center'></AtActivityIndicator>
          {
            replys.map((item, index) => {
              return (
                <View className='reply' key={index} onClick={setReply} data-item={item}>
                  <View className='leftcontent'>
                    <Text className='title break'>{item.title}</Text>
                    <Text className='desc twoline'>内容：{item.content}</Text>
                  </View>
                </View>
              )
            })
          }
        </View>
      </ScrollView>

    </View>
  )
}

export default forwardRef(QuickReply)
