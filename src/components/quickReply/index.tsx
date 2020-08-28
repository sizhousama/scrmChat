import React, { useEffect, useRef, useState, useReducer } from 'react'
import { View, Image, Text, ScrollView} from '@tarojs/components'
import { AtTabBar,AtActivityIndicator,AtInput } from 'taro-ui'
import { forwardRef } from 'react'
import { getReplys } from '@/api/chat'
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
  const { replys } = state
  const params = {
    pageId: props.pageId,
    current: 1,
    size: 999,
    type: 2,
    title: ''
  }
  useEffect(() => {
    getlist()
  }, [])
  const setReply = (e) => {
    props.handleClick(e.currentTarget.dataset.item)
  }
  const getlist = async () => {
    setLoading(true)
    await getReplys(params).then(res => {
      const { data } = res
      dispatch({ type: 'reply', payload: { reply: data.records } })
      setLoading(false)
    })
  }
  const inputChange = (v)=>{
    params.title = v
    setKey(v)
  }
  return (
    <View className='replybox' onClick={(e)=>e.stopPropagation()}>
      <View className='topheader'>快捷回复</View>
      <View className='search'>
        <AtInput
        name='replyInput'
        value={key}
        onChange={inputChange}
        onConfirm={getlist}
        placeholder='请输入搜索类容'
        ></AtInput>
      </View>
      <ScrollView scrollY className='replyscroll'>
        <View className='replyinner'>
          <AtActivityIndicator isOpened={loading} size={28} mode='center'></AtActivityIndicator>
          {
            replys.map((item, index) => {
              return (
                <View className='reply' onClick={setReply} data-item={item}>
                  <View className='leftcontent'>
                    <Text className='title'>{item.title}</Text>
                    <Text className='desc twoline'>{item.content}</Text>
                  </View>
                  <View className='opt'></View>
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
