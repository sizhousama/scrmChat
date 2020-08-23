import React, { useRef, useState, useEffect } from "react";
import { useDidHide, useDidShow, useReady } from '@tarojs/taro'
import TabBar from "../tabbar";
import Header from "@/components/header";
import ChatFan from "@/components/chatFan";
import { View } from "@tarojs/components";
import { getRecentContacts, getAllPage } from '@/api/fan'
import { getUserInfo } from '@/api/info'
import { observer } from 'mobx-react';
import { useFanStore, useUserStore, useWsioStore } from '@/store';
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
  // store
  const { wsio, setWsio } = useWsioStore()
  const { pageIds, setPageIds } = useFanStore()
  const { userInfo, setUserInfo } = useUserStore()
  const [fanlist, setFanList] = useState([])
  const [listParams, setListParams] = useState({
    page: 1,
    pageSize: 15
  })
  // 创建socket连接
  const conSocket = (userId, pageIdsStr) => {
    const query = `userId=${userId}&pageIds=${pageIdsStr}`
    const surl = socketUrl()
    const socket = io(surl + query)
    setWsio(socket)
    initWebSocket(socket)
    console.log(socket)
  }
  useDidHide(() => {

    // wsio.close()

  })
  useDidShow(() => {

  })

  useEffect(() => {

    getinfo()
    getList()
  }, [])
  const initWebSocket = (socket) => {
    socket.on('connect', () => {
      console.log('已连接')
    })
    socket.on('connect_error', () => {
      console.log('连接失败')
    })
    socket.on('disconnect', () => {
      console.log('断开连接')
      socket.emit('connect')
    })
    socket.on('reconnect', () => {
      console.log('重新连接')
      socket.emit('connect')
    })
    socket.on('error', () => {
      console.log('连接错误')
    })
    // socket.on('SEND_MSG', (data) => {
    //   console.log(data)
    // })
  }
  // 用户信息
  const getinfo = async () => {
    await getUserInfo().then(res => {
      const { data } = res
      setUserInfo(data.sysUser)
      getpage(data.sysUser.userId)
    })
  }
  // 主页
  const getpage = async (userId) => {
    await getAllPage().then(res => {
      const { data } = res
      if (data.length === 0) {
        console.log('当前用户没有主页！')
      } else {
        const pageIdsStr = data.map(item => item.pageId).join(',')
        setPageIds(pageIdsStr)
        conSocket(userId, pageIdsStr)
      }
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
