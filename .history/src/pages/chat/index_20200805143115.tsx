import React, { useRef } from "react";
// import { AtButton } from 'taro-ui'
import TabBar from "../tabbar";
import { View } from "@tarojs/components";
import "./index.scss";

const Chat = () => {
  const childref = useRef();
  return (
      <TabBar ref={childRef} />
      <View>chat</View>
  );
};

export default Chat;
