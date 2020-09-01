import React, { useRef, useState, useEffect } from "react";
import { AtInput, AtForm, AtList, AtListItem, AtTag } from 'taro-ui'
import NavBar from "@/components/navBar";
import { View, Picker } from "@tarojs/components";
import { NavTo,SwitchTab } from "@/utils/index"
import { observer } from 'mobx-react';
import { useNavStore, useFanStore } from '@/store';
import "./index.scss";

const Search = () => {
  const kref = useRef('')
  const [keyword, setKeyWord] = useState('')
  const { navH } = useNavStore()
  const {fanSearchKey,setFanSearchKey} = useFanStore()
  const style = {
    marginTop: navH + 'px'
  }
  useEffect(()=>{
    if(fanSearchKey!==''){
      setKeyWord(fanSearchKey)
    }
  },[])
  const setkey = (v) => {
    kref.current=v
    setKeyWord(v)
  }
  const onChange = (e) => {
   
  }
  const settag = (e) => {
    e.active = true
  }
  const navToMoreTag = () => {
    NavTo('../tags/index')
  }
  const search= () =>{
    setFanSearchKey(kref.current)
    SwitchTab(`/pages/chat/index`)
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
              placeholder='粉丝名称/邮箱/分配人/adid'
              placeholderClass='placestyle'
              clear={true}
              value={keyword}
              onChange={setkey}
            />
            <View className='searchbtn' onClick={search}>搜索</View>
          </View>
          {/* <View className='subtitle'>详细筛选：</View> */}
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
          {/* <View className='other tagform'>
            <View className='label'>客服：</View>
            <View className='content'>
              <View className='select'>
                <View className='at-icon at-icon-chevron-down'></View>
                <Picker className='picker' mode='selector' range={services} onChange={onChange}>
                  <AtList>
                    <AtListItem
                      extraText={selectSer}
                    />
                  </AtList>
                </Picker>
              </View>
            </View>
          </View> */}

          {/* <View className='btnbox'>
            <View className='rest'>重置</View>
            <View className='submit'>搜索</View>
          </View> */}
        </AtForm>
      </View>
    </View>
  );
};

export default observer(Search);
