import React, { useRef } from "react";
// import { AtButton } from 'taro-ui'
import TabBar from "../tabbar";
import { View } from "@tarojs/components";
import "./index.scss";

const Chat = () => {
  const cur:number = 0
  const childref = useRef();
  return (
    <View>
      <TabBar ref={childref} cur={cur} />
    </View>
  );
};

export default Chat;
