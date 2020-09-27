import React, { useRef, useState, useEffect,useReducer } from "react";
import { AtInput, AtForm, AtList, AtListItem, AtTag } from 'taro-ui'
import NavBar from "@/components/navBar";
import { View, Picker } from "@tarojs/components";
import { NavTo, SwitchTab } from "@/utils/index"
import { observer } from 'mobx-react';
import { useNavStore, useFanStore } from '@/store';
import "./index.scss";
// const initState={
//   pageArr:[],
// }
// const stateReducer=(state,action)=>{

// }
const Search = () => {
  const kref = useRef('')
  const { navH } = useNavStore()
  const style = { marginTop: navH + 'px'}
  // const [state,dispatch] = useReducer(stateReducer,initState)
  const [selectPage,setSelectP] = useState('无')
  const { pages,searchFrom, searchForm,setSFfanKey,setSFfanPage,setSFchatKey,setSFchatPage } = useFanStore()
  const minplace = searchFrom === 'message' ? '粉丝名称/邮箱/分配人/adid/标签' : '粉丝名称'
  
  useEffect(() => {
    if(searchFrom==='message'){
      if(searchForm.chatPage!==''){
        const p = pages.find(item=> item.pageId===searchForm.chatPage)
        setSelectP(p.pageName)
      }else{
        setSelectP('无')
      }
    }else{
      if(searchForm.fanPage!==''){
        const p = pages.find(item=> item.pageId===searchForm.fanPage)
        setSelectP(p.pageName)
      }else{
        setSelectP('无')
      }
    }
  }, [])

  const setkey = (v) => {
    searchFrom==='message'?
    setSFchatKey(v):
    setSFfanKey(v)
  }
  const onChange = (e) => {
    setSelectP(pages[e.detail.value].pageName)
    searchFrom==='message'?
    setSFchatPage(pages[e.detail.value].pageId):
    setSFfanPage(pages[e.detail.value].pageId)
  }
  const settag = (e) => {
    e.active = true
  }
  const navToMoreTag = () => {
    NavTo('../tags/index')
  }
  const search = () => {
    searchFrom==='message'?SwitchTab(`/pages/chat/index`):SwitchTab(`/pages/users/index`)
  }
  const restform = ()=>{
    if(searchFrom==='message'){
      setSFchatKey('')
      setSFchatPage('')
    }else{
      setSFfanKey('')
      setSFfanPage('')
    }
    setSelectP('无')
  }

  return (
    <View>
      <NavBar title='筛选条件' />
      <View style={style}>
        <AtForm className='searchform' >
          <View className='topsearch'>
            <View className='at-icon at-icon-search search-icon'></View>
            <AtInput
              className='sinput tops'
              name='mainSearchInput'
              type='text'
              placeholder={minplace}
              placeholderClass='placestyle'
              clear={true}
              value={searchFrom==='message'?searchForm.chatKey:searchForm.fanKey}
              onChange={setkey}
            />
            {/* <View className='searchbtn' onClick={search}>搜索</View> */}
          </View>
          <View className='subtitle'>详细筛选：</View>
          <View className='other tagform'>
            <View className='label'>主页：</View>
            <View className='content'>
              <View className='select'>
                <View className='at-icon at-icon-chevron-down'></View>
                <Picker value={0} className='picker' mode='selector' range={pages} onChange={onChange} rangeKey='pageName'>
                  <AtList>
                    <AtListItem extraText={selectPage}/>
                  </AtList>
                </Picker>
              </View>
            </View>
          </View>
          {/* <AtInput
            className='sinput'
            title='名称:'
            name='value1'
            type='text'
            placeholder='请输入名称'
            placeholderClass='placestyle'
            value={name}
            onChange={setname}
          /> */}
          {/* <View className='other tagform'>
            <View className='label'>标签：</View>
            <View className='content'>
              <AtTag
                size='normal'
                active={false}
                onClick={settag}
              >标签1111111</AtTag>
              <AtTag
                size='normal'
                active={false}
                onClick={settag}
              >标签1</AtTag>
              <AtTag
                size='normal'
                active={false}
                onClick={settag}
              >标签www</AtTag>
            </View>
          </View>
          <View className='other'>
            <View className='label'></View>
            <View className='more' onClick={navToMoreTag}>查看更多...</View>
          </View> */}
          {/* <AtInput
            className='sinput'
            title='邮箱:'
            name='value2'
            type='text'
            placeholder='请输入邮箱'
            placeholderClass='placestyle'
            value={name}
            onChange={setname}
          />
          <AtInput
            className='sinput'
            title='Adid:'
            name='value3'
            type='text'
            placeholder='请输入Adid'
            placeholderClass='placestyle'
            value={name}
            onChange={setname}
          /> */}
          {/* <AtInput
            className='sinput'
            title='订单号:'
            name='value4'
            type='text'
            placeholder='请输入订单号'
            placeholderClass='placestyle'
            value={name}
            onChange={setname}
          />
          <AtInput
            className='sinput'
            title='profile:'
            name='value5'
            type='text'
            placeholder='请输入profile'
            placeholderClass='placestyle'
            value={name}
            onChange={setname}
          /> */}


          <View className='btnbox'>
            <View className='rest' onClick={restform}>重置</View>
            <View className='submit' onClick={search}>搜索</View>
          </View>
        </AtForm>
      </View>
    </View>
  );
};

export default observer(Search);
