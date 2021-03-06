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
  const paramsref = useRef({
    pageId: props.pageId,
    current: 1,
    size: 999,
    type: 2,
    title: ''
  })
  useEffect(() => {
    getlist()
  }, [])
  const setReply = (e) => {
    props.handleClick(e.currentTarget.dataset.item)
  }
  const getlist = async () => {
    setLoading(true)
    await getReplys(paramsref.current).then(res => {
      const { data } = res
      data.records.forEach(item=>{
        if(item.imgUrl!==null&&item.imgUrl!==''){
          if(item.imgUrl.indexOf(',')>-1){
            item.imgs=item.imgUrl.split(',')
          }else{
            item.imgs=[item.imgUrl]
          }
        }else{
          item.imgs=[]
        }
      })
      console.log(data.records)
      dispatch({ type: 'reply', payload: { reply: data.records } })
      setLoading(false)
    })
  }
  const inputChange = (v)=>{
    paramsref.current.title = v
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
                    <Text className='title break'>{item.title}</Text>
                    <Text className='desc twoline'>{item.content}</Text>
                  </View>
                  <View className='opt'>
                    {
                      item.imgUrl?<Image src={item.imgs[0]}></Image>:''
                    } 
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
