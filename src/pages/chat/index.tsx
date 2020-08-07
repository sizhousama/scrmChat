import React, { useRef } from "react";
// import { AtButton } from 'taro-ui'
import TabBar from "../tabbar";
import Header from "../../components/header";
import ChatFan from "../../components/chatFan";
import { View } from "@tarojs/components";
import "./index.scss";

const Chat = () => {
  const cur:number = 0
  const childref = useRef();
  return (
    <View>
      <Header ref={childref} title='消息' icon='message' />
      <ChatFan ref={childref}></ChatFan>
      <TabBar ref={childref} cur={cur} />
    </View>
  );
};

export default Chat;
