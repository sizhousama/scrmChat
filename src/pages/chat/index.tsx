import React, { useRef, useState, useEffect } from "react";
// import { AtButton } from 'taro-ui'
import TabBar from "../tabbar";
import Header from "@/components/header";
import ChatFan from "@/components/chatFan";
import { View } from "@tarojs/components";
import { getRecentContacts } from '@/api/fan'
import "./index.scss";

interface Fan {
  fanId: string,
  pageId: string,
  fanName: string,
  pageName: string,
  msg: string,
  tagsArr: any[]
}
const Chat = () => {
  const cur: number = 0
  const childref = useRef();
  const [fanlist, setFanList] = useState([])
  const [listParams, setListParams] = useState({
    page: 1,
    pageSize: 15,
    fanName: "",
    pageIds: ""
  })
  useEffect(() => {
    getList() 
  }, [])
  const getList = async () => {
    await getRecentContacts(listParams).then(res => {
      const { data } = res
      let list = data
      list.forEach(item => {
        item.tagsArr = []
        if (item.tags !== null) {
          item.tagsArr = item.tags.slice(1, -1).split(',').slice(-2)
        }
      })
      setFanList(list)
    })
    
  }
  return (
    <View>
      <Header ref={childref} title='消息' icon='message' />
      <View className='chatfanlist'>
        {
          fanlist.map((item: Fan, index) => {
            return (
              <ChatFan
                key={index}
                ref={childref}
                fanId={item.fanId}
                pageId={item.pageId}
                fanName={item.fanName}
                pageName={item.pageName}
                msg={item.msg}
                tagsArr={item.tagsArr}
              />
            )
          })
        }
      </View>

      <TabBar ref={childref} cur={cur} />
    </View>
  );
};

export default Chat;
