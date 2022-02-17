import React, { useEffect, useRef, useState, useReducer, forwardRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtActivityIndicator, AtInput } from 'taro-ui'
import { getAllTagNew } from '@/api/utils'
import './index.scss'

const initState = {
  tags: []
}
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'tags':
      return {
        ...state,
        tags: action.payload.tags
      }
    default:
      return state;
  }
}
const AddFanTag = (props, ref) => {
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(stateReducer, initState)
  const { tags } = state
  const paramsref = useRef({
    tagName: '',
    size: 20
  })
  useEffect(() => {
    getlist()
  }, [])
  const close = () => {
    props.close()
  }
  const addtag = (e) => {
    props.add(e.currentTarget.dataset.item)
    close()
  }
  const getlist = async () => {
    setLoading(true)
    await getAllTagNew(paramsref.current).then(res => {
      const { data } = res
      dispatch({ type: 'tags', payload: { tags: data } })
    })
    setLoading(false)
  }
  const inputChange = (v) => {
    if(v.length>20) v=v.slice(0,20)
    paramsref.current.tagName = v
    setKey(v)
    getlist()
  }
  return (
    <View className='mask' onClick={close}>
      <View className='tag-box' onClick={(e) => e.stopPropagation()}>
        <View className='topheader'>添加标签</View>
        <View className='tag-search'>
          <AtInput
            name='replyInput'
            value={key}
            onChange={inputChange}
            onConfirm={getlist}
            placeholder='请输入标签'
          ></AtInput>
        </View>
        {
          tags.length > 0 ?
            <ScrollView scrollY className='tagscroll'>
              <View className='taginner'>
                <AtActivityIndicator isOpened={loading} size={28} mode='center'></AtActivityIndicator>
                {
                  tags.map((item, index) => {
                    return (
                      <View className='tag' onClick={addtag} data-item={item} key={index}>
                        <Text className='title break'>{item.tag}</Text>
                      </View>
                    )
                  })
                }
              </View>
            </ScrollView> :
            <View className='notag'>
              <Text>没有找到标签“{key}”</Text>
              <View className='createtag' onClick={addtag} data-item={{tag:key,id:null}}>创建标签“{key}”</View>
            </View>
        }
      </View>
    </View>
  )
}

export default forwardRef(AddFanTag)
