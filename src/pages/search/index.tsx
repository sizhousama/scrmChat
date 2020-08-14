import React, { useRef, useState, useEffect } from "react";
import { AtInput, AtForm,AtList, AtListItem,AtTag } from 'taro-ui'
import NavBar from "@/components/navBar";
import { View,Picker } from "@tarojs/components";
import {NavTo} from "@/utils/index"
import "./index.scss";

const Search = () => {
  const [name, setName] = useState('')
  const [services,setServices] = useState(['1','2','3','4'])
  const [selectSer,setSelectSer] = useState('请选择客服')
  const setname = (v) => {
    setName(v)
  }
  const onChange=(e)=>{
    setSelectSer(services[e.detail.value])
  }
  const settag = (e) =>{
    console.log(e)
    e.active = true
  }
  const navToMoreTag = () =>{
    NavTo('../tags/index')
  }

  return (
    <View>
      <NavBar title='筛选条件' />
      <AtForm className='searchform'>
        <View className='topsearch'>
          <View className='at-icon at-icon-search search-icon'></View>
          <AtInput
            className='sinput tops'
            name='value1'
            type='text'
            placeholder='单行文本'
            placeholderClass='placestyle'
            clear={true}
            value={name}
            onChange={setname}
          />
          <View className='searchbtn'>搜索</View>
        </View>
        <View className='subtitle'>详细筛选：</View>
        <AtInput
          className='sinput'
          title='名称:'
          name='value1'
          type='text'
          placeholder='请输入名称'
          placeholderClass='placestyle'
          value={name}
          onChange={setname}
        />
        <View className='other tagform'>
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
        </View>
        <AtInput
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
        />
        <AtInput
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
        />
        <View className='other tagform'>
          <View className='label'>客服：</View>
          <View className='content'>
            <View className='select'>
              {/* 请选择客服 */}
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
        </View>
        
        <View className='btnbox'>
          <View className='rest'>重置</View>
          <View className='submit'>搜索</View>
        </View>
      </AtForm>
    </View>
  );
};

export default Search;
