import React, { useRef, useState, useEffect, useReducer } from "react";
// import { useDidHide, useDidShow, useReady } from '@tarojs/taro'
import TabBar from "../tabbar";
import Header from "@/components/header";
import ChatFan from "@/components/chatFan";
import { View } from "@tarojs/components";
import { getRecentContacts, getAllPage } from '@/api/fan'
import { formatChatTime } from '@/utils/time'
import { getUserInfo } from '@/api/info'
import { observer } from 'mobx-react';
import { parseMsg, judgeType } from '@/utils/parse'
import { useFanStore, useUserStore, useWsioStore } from '@/store';
import { socketUrl } from '@/servers/baseUrl'
import { vibrate } from '@/utils/index'
import io from 'socket.io-mp-client'
import "./index.scss";
interface Fan {
  fanId: string,
  pageId: string,
  fanName: string,
  pageName: string,
  msg: string,
  tagsArr: any[]
}
interface PM {
  senderId?: string,
  isServe?: boolean,
  text?: string
  recipientId?: string,
  pageId?:string
}
const initState = {
  fanlist: []
}
const listReducer = (state, action) => {
  switch (action.type) {
    case 'list':
      return {
        ...state,
        fanlist: action.payload.list
      }
    case 'params':
      return {
        ...state,
      }
    default:
      return state;
  }
}
const Chat = () => {
  const cur: number = 0
  const childref = useRef();
  // store
  const { setWsio } = useWsioStore()
  const { setPageIds } = useFanStore()
  const { setUserInfo } = useUserStore()
  const [state, dispatch] = useReducer(listReducer, initState)
  const { fanlist } = state
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
    socket.on('SEND_MSG', (data) => {
      
      let parsedMsg: PM = {
        senderId: '',
        isServe: false,
        text: '',
        recipientId: '',
      }
      parsedMsg = { ...parseMsg(data) }
      console.log(parsedMsg)
      // let fan = {
      //   fanId: '',
      //   msg: '',
      //   read: 0,
      //   timestamp: 0
      // }
      const fan = fanlist.find(fan => {
        return fan.fanId === parsedMsg.senderId
      })
      console.log(fan)
      const { text, isServe, recipientId, senderId } = parsedMsg
      // 粉丝发来的信息则进行处理
      if (!isServe) {
        // 如果 fan 存在
        // console.log(fan)
        if (fan !== undefined) {
          fan.msg = judgeType(parsedMsg)
          fan.read = 0
          fan.timestamp = Date.now()
        }
        vibrate()
      } else { // 客服发送消息的时候商家同时可以看到
        const item = fanlist.find(item => {
          return (item.pageId === parsedMsg.senderId && item.senderId === parsedMsg.recipientId)
          ||(item.pageId === parsedMsg.senderId && item.recipientId === parsedMsg.recipientId)
        })
        // 当前粉丝消息实时显示客服或者商家发送消息
        if (item.msg !== undefined) {
          item.msg = '你: ' + text
        }
      }
    })
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
        item.formatTime = formatChatTime(item.timestamp)
        if (item.tags !== null) {
          item.tagsArr = item.tags.slice(1, -1).split(',').slice(-1)
        }
      })
      dispatch({
        type: 'list',
        payload: { list }
      });
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
