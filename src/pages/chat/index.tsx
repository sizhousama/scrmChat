import React, { useRef, useState, useEffect } from "react";
import TabBar from "../tabbar";
import Header from "@/components/header";
import ChatFan from "@/components/chatFan";
import { View } from "@tarojs/components";
import { getRecentContacts, getAllPage } from '@/api/fan'
import {getUserInfo} from '@/api/info'
import { observer } from 'mobx-react';
import { useFanStore, useUserStore,useWsioStore } from '@/store';
import { socketUrl } from '@/servers/baseUrl'
import io from 'socket.io-mp-client'
// import io from 'weapp.socket.io'
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
  // const [ws, setWs] = useState<any>(undefined)  //socket实例
  const [connect, setConnect] = useState(false) //判断socket是否连接
  const [paged,setPaged] = useState(false)
  const [infoed,setInfoed] = useState(false)
  // store
  const {wsio,setWsio} = useWsioStore()
  const { pageIds, setPageIds } = useFanStore()
  const { userInfo,setUserInfo } = useUserStore()
  const [fanlist, setFanList] = useState([])
  const [listParams, setListParams] = useState({
    page: 1,
    pageSize: 15
  })
  // 创建socket连接
  const conSocket = () => {
    const query = `userId=${userInfo.userId}&pageIds=${pageIds}`
    const surl = socketUrl()
    const socket = io(surl + query)
    setWsio(socket)
    console.log(socket)
    setConnect(true)
  }

  useEffect(() => {
    getList()
    getpage()
    getinfo()
    if(paged&&infoed){
      conSocket()
    }
    if(connect){
      initWebSocket()
    }
  }, [paged,infoed,connect])
  const initWebSocket = () => {
    wsio.on('connect', () => {
      console.log('已连接')
    })
    wsio.on('connect_error', () => {
      console.log('连接失败')
    })
    wsio.on('disconnect', () => {
      wsio.emit('connect')
      console.log('断开连接')
    })
    wsio.on('reconnect', () => {
      wsio.emit('connect')
      console.log('重新连接')
    })
    wsio.on('error', () => {
      console.log('连接错误')
    })
    // ws.on('SEND_MSG', (data) => {
    //   console.log(data)
    // })
  }
  // 用户信息
  const getinfo= async()=>{
    await getUserInfo().then(res=>{
      const {data} = res
      setUserInfo(data.sysUser)
      setInfoed(true)
    })
  }
  // 聊天会话列表
  const getList = async () => {
    await getRecentContacts(listParams).then(res => {
      const { data } = res
      let list = data
      list.forEach(item => {
        item.tagsArr = []
        if (item.tags !== null) {
          item.tagsArr = item.tags.slice(1, -1).split(',').slice(-1)
        }
      })
      setFanList(list)
    })
  }
  // 主页
  const getpage = async () => {
    await getAllPage().then(res => {
      const { data } = res
      if (data.length === 0) {
        console.log('当前用户没有主页！')
      } else {
        const pageIdsStr = data.map(item => item.pageId).join(',')
        setPageIds(pageIdsStr)
        setPaged(true)
      }
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
                fan={item}

              />
            )
          })
        }
      </View>

      <TabBar ref={childref} cur={cur} />
    </View>
  );
};

export default observer(Chat);
