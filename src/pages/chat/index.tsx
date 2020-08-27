import React, { useRef, useState, useEffect, useReducer } from "react";
// import { useDidHide, useDidShow, useReady } from '@tarojs/taro'
import TabBar from "../tabbar";
import Header from "@/components/header";
import ChatFan from "@/components/chatFan";
import { AtActivityIndicator } from 'taro-ui'
import { View } from "@tarojs/components";
import { getRecentContacts, getAllPage, upRead } from '@/api/fan'
import { formatChatTime } from '@/utils/time'
import { getUserInfo } from '@/api/info'
import { observer } from 'mobx-react';
import { parseMsg, judgeType, judgeMyType } from '@/utils/parse'
import { useFanStore, useUserStore, useWsioStore } from '@/store';
import { socketUrl } from '@/servers/baseUrl'
import { msgAudio } from '@/utils/index'
import io from 'socket.io-mp-client'
import "./index.scss";
import { useDidShow } from "@tarojs/taro";
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
}
const initState = {
  fanlist: [],
  loading:false
}
const listReducer = (state, action) => {
  switch (action.type) {
    case 'list':
      return {
        ...state,
        fanlist: action.payload.list
      }
    case 'loading':
      return {
        ...state,
        loading: action.payload.loading
      }
    default:
      return state;
  }
}
const Chat = () => {
  const cur: number = 0
  const childref = useRef();
  const listref = useRef([])
  const paramsref = useRef({
    page: 1,
    pageSize: 15
  })
  // store
  const { setWsio } = useWsioStore()
  const { setPageIds, hasNew, setHasNew } = useFanStore()
  const { setUserInfo } = useUserStore()
  const [state, dispatch] = useReducer(listReducer, initState)
  // const [fanlist,setFanList] = useState(listref.current)
  const { fanlist,loading } = state
  // 创建socket连接
  const conSocket = (userId, pageIdsStr) => {
    const query = `userId=${userId}&pageIds=${pageIdsStr}`
    const surl = socketUrl()
    const socket = io(surl + query)
    setWsio(socket)
    initWebSocket(socket)
    console.log(socket)
  }
  useDidShow(() => {
    getList()
  })
  useEffect(() => {
    getinfo()
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
      const fans = listref.current
      let parsedMsg: PM = {
        senderId: '',
        isServe: false,
        text: '',
        recipientId: '',
      }
      parsedMsg = { ...parseMsg(data) }
      console.log(parsedMsg)
      let fan: any = {}
      fan = fans.find(item => {
        return item['fanId'] === parsedMsg.senderId
      })

      const { text, isServe, recipientId, senderId } = parsedMsg
      // 粉丝发来的信息则进行处理
      if (!isServe) {
        // 如果 fan 存在
        if (fan !== undefined) {
          fan.msg = judgeType(parsedMsg)
          fan.read = 0
          fan.timestamp = Date.now()
          fan.formatTime = formatChatTime(fan.timestamp)
        }
        fans.sort((a, b) => b['timestamp'] - a['timestamp'])
        dispatch({
          type: 'list',
          payload: { list: listref.current }
        })
        setHasNew(true)
        msgAudio()
      } else { // 客服发送消息的时候商家同时可以看到
        let serfan: any = {}
        serfan = fans.find(item => {
          return item['fanId'] === parsedMsg.recipientId
        })
        if (serfan && serfan?.msg) {
          // 当前粉丝消息实时显示客服或者商家发送消息
          serfan['msg'] = '你: ' + judgeMyType(parsedMsg)
          serfan['timestamp'] = Date.now()
          serfan.formatTime = formatChatTime(serfan.timestamp)
          fans.sort((a, b) => b['timestamp'] - a['timestamp'])
          dispatch({
            type: 'list',
            payload: { list: listref.current }
          })
        }
      }
    })
    socket.on('CONTACTS_UPDATE',(data)=>{
      typeof data === 'string'?data = JSON.parse(data):''
      data.status === -1?getList():''
      if (data.read !== undefined) {
        let fan:any={}
        // 找到当前fanId 匹配的粉丝 并且 修改状态 表明有状态发生改变
        fan = listref.current.find(item => {
          return item['fanId'] === data.senderId
        })
        fan.read = data.read 
      } else {
        const { senderId, tags } = data
        let fan:any={}
        fan = listref.current.find(item => {
          return item['fanId'] === senderId
        })
        if (fan) {
          if (tags !== '' && tags !== null && tags !== undefined) {
            const parsetags = tags.substr(1,tags.length-2).split(',').slice(-1)
            fan.tagsArr = parsetags
          } else {
            fan.tagsArr = []
          }
        }
      }
      dispatch({
        type: 'list',
        payload: { list: listref.current }
      })
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
    dispatch({type: 'loading',payload: { loading:true }});
    await getRecentContacts(paramsref.current).then(res => {
      const { data } = res
      let list = data
      list.forEach(item => {
        item.tagsArr = []
        item.formatTime = formatChatTime(item.timestamp)
        item.tagsArr = item.tags === '' || item.tags === null ? [] : item.tagsArr = item.tags.split(',').slice(-1)
      })
      listref.current = list
      dispatch({
        type: 'list',
        payload: { list }
      });
      for (let i = 0; i < list.length; i++) {
        if (list[i]['read'] === 0) {
          setHasNew(true)
          return
        }
      }
    }).finally(()=>{
      dispatch({type: 'loading',payload: { loading:false }});
    })
  }
  const clickFan = (fan) => {
    let item: any = {}
    item = listref.current.find(f => { return fan.fanId === f['fanId'] })
    item ? item.read = 1:''
    dispatch({
      type: 'list',
      payload: { list: listref.current }
    });
    const { pageId, fanId, read } = item
    const p = { pageId, fanId, read }
    console.log(p)
    upRead(p)
    for (let i = 0; i < listref.current.length; i++) {
      if (listref.current[i]['read'] === 0) {
        setHasNew(true)
        return
      } else {
        setHasNew(false)
      }
    }
  }

  return (
    <View>
      <Header ref={childref} title='消息' icon='message' />
      <AtActivityIndicator isOpened={loading} mode='center'></AtActivityIndicator>
      <View className='chatfanlist'>
      
        {
          fanlist.map((item: Fan, index) => {
            return (
              <ChatFan
                key={index}
                ref={childref}
                fan={item}
                handleClick={clickFan}
              />
            )
          })
        }
      </View>

      <TabBar ref={childref} cur={cur} has={hasNew} />
    </View>
  );
};

export default observer(Chat);
