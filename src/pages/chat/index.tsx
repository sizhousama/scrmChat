import React, { useRef, useState, useEffect, useReducer } from "react";
// import { useDidHide, useDidShow, useReady } from '@tarojs/taro'
import TabBar from "../tabbar";
import Header from "@/components/header";
import ChatFan from "@/components/chatFan";
import { View } from "@tarojs/components";
import { getRecentContacts, getAllPage,upRead } from '@/api/fan'
import { formatChatTime } from '@/utils/time'
import { getUserInfo } from '@/api/info'
import { observer } from 'mobx-react';
import { parseMsg, judgeType,judgeMyType } from '@/utils/parse'
import { useFanStore, useUserStore, useWsioStore } from '@/store';
import { socketUrl } from '@/servers/baseUrl'
import { msgAudio } from '@/utils/index'
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
    default:
      return state;
  }
}
const Chat = () => {
  const cur: number = 0
  const childref = useRef();
  const listref = useRef([])
  // store
  const { setWsio } = useWsioStore()
  const { setPageIds,hasNew,setHasNew } = useFanStore()
  const { setUserInfo } = useUserStore()
  const [state, dispatch] = useReducer(listReducer, initState)
  // const [fanlist,setFanList] = useState(listref.current)
  const { fanlist} = state
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
      const fans = listref.current
      let parsedMsg: PM = {
        senderId: '',
        isServe: false,
        text: '',
        recipientId: '',
      }
      parsedMsg = { ...parseMsg(data) }
      console.log(parsedMsg)
      let fan:any = {
        fanId: '',
        msg: '',
        read: 0,
        timestamp: 0
      }
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
          payload: { list:listref.current }
        })
        setHasNew(true)
        msgAudio()
      } else { // 客服发送消息的时候商家同时可以看到
        let serfan:any={
          pageId:'',
          senderId:'',
          recipientId:'',
          msg:''
        }
        serfan = fans.find(item => {
          return item['fanId'] === parsedMsg.recipientId 
        })
        // 当前粉丝消息实时显示客服或者商家发送消息
        if (serfan['msg'] !== undefined) {
          serfan['msg'] = '你: ' + judgeMyType(parsedMsg)
          serfan['timestamp'] = Date.now()
          serfan.formatTime = formatChatTime(serfan.timestamp)
        }
        fans.sort((a, b) => b['timestamp'] - a['timestamp'])
        dispatch({
          type: 'list',
          payload: { list:listref.current }
        })
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
        item.tagsArr= item.tags===''||item.tags===null?[]:item.tagsArr=item.tags.split(',').slice(-1)
      })
      listref.current = list
      dispatch({
        type: 'list',
        payload: { list }
      });
      for(let i=0;i<list.length;i++){
        if(list[i]['read']===0){
          setHasNew(true)
          return
        }
      }
    })
  }
  const clickFan=(fan)=>{
    let item:any={}
    item = listref.current.find(f=>{return fan.fanId === f['fanId']})
    if(item){
      item.read = 1
    }
    
    dispatch({
      type: 'list',
      payload: { list:listref.current }
    });
    
    const {pageId,fanId,read} = item
    const p = {pageId,fanId,read}
    console.log(p)
    upRead(p)
    for(let i=0;i<listref.current.length;i++){
      if(listref.current[i]['read']===0){
        setHasNew(true)
        return
      }else{
        setHasNew(false)
      }
    }
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
