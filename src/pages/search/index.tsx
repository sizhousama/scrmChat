import React, { useRef, useState, useEffect } from "react";
import { AtInput, AtForm } from 'taro-ui'
import NavBar from "@/components/navBar";
import { View } from "@tarojs/components";
import "./index.scss";

const Search = () => {
  const [name, setName] = useState('')
  const setname = (v) => {
    setName(v)
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
        <View>
          
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
      </AtForm>
    </View>
  );
};

export default Search;
