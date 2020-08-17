import React, { useRef, useState, useEffect } from "react";
import ChatHeader from "@/components/chatHeader";
import { View } from "@tarojs/components";
import {AtInput} from 'taro-ui'
import "./index.scss";


const Chat = () => {
  const childref = useRef()
  return (
    <View>
      <ChatHeader ref={childref}></ChatHeader>
      <View className='fooler'>
        <View className='left'>
          <View className='emoj'>
            <View className='at-icon at-icon'></View>
          </View>
          <View className='more'>
          <View className='at-icon at-icon-add-circle'></View>
          </View>
        </View>
        <AtInput 
        name='msgInput' 
        className='msginput' 
        />

        <View className='searchbtn send'>
          发送
        </View>
      </View>
    </View>
  );
};

export default Chat;
