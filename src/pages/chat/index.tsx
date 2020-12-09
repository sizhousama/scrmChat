import React, { useRef, useState, useEffect, useReducer } from "react";
import TabBar from "../tabbar";
import Header from "@/components/header";
import ChatFan from "@/components/chatFan";
import { AtActivityIndicator } from 'taro-ui'
import { View } from "@tarojs/components";
import { getFan, getRecentContacts, getAllPage, upRead,getAllTag } from '@/api/fan'
import { formatChatTime } from '@/utils/time'
import { getUserInfo } from '@/api/info'
import { observer } from 'mobx-react';
import { parseMsg, judgeType, judgeMyType } from '@/utils/parse'
import { useFanStore, useUserStore, useWsioStore } from '@/store';
import { socketUrl } from '@/servers/baseUrl'
import { msgAudio, vibrateS, isNeedAddH, SetStorageSync, redirectTo,toIndexes } from '@/utils/index'
import io from 'socket.io-mp-client'
import "./index.scss";
import Taro, { useDidShow, useReachBottom, useShareAppMessage,usePullDownRefresh } from "@tarojs/taro";
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
interface SF {
  page:number,
  pageSize:number,
  fanName:string,
  pageIds:string,
  tagsId:number[],
  operatorType:string,
}
const initState = {
  fanlist: [],
  loading: false,
  moreloading: false,
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
    case 'moreloading':
      return {
        ...state,
        moreloading: action.payload.ml
      }
    default:
      return state;
  }
}
const Chat = () => {
  const cur: number = 0
  const childref = useRef();
  const listref = useRef<any[]>([])
  const needAddH = isNeedAddH()
  const [state, dispatch] = useReducer(listReducer, initState)
  const [hasmore, setHasMore] = useState(false)
  // store
  const { setWsio } = useWsioStore()
  const { setPages, hasNew, setHasNew, searchForm } = useFanStore()
  const { userInfo, setUserInfo, role, setRole,setAllTags } = useUserStore()
  const { fanlist, loading,moreloading } = state
  // 请求参数
  const paramsref = useRef<SF>({
    page: 1,
    pageSize: 10,
    fanName: '',
    pageIds:'',
    tagsId:[],
    operatorType:'and'
  })
  // 创建socket连接
  const conSocket = (userId, pageIdsStr) => {
    const query = `userId=${userId}&pageIds=${pageIdsStr}`
    const surl = socketUrl()
    const socket = io(surl + query)
    setWsio(socket)
    initWebSocket(socket)
  }
  useEffect(()=>{
    getTags()
  },[])
  const getTags = async () => {
    await getAllTag().then(res => {
      const { data } = res
      data.forEach(e => {
        e.act=false
      });
      const arr = toIndexes(data, 'tag')
      setAllTags(arr.slice())
    })
  }
  usePullDownRefresh(() => {
    getList()
  })

  useShareAppMessage((res:any) => {
    return {
      title: 'HiveScrm',
      path: '/pages/chat/index'
    }
  })
  useDidShow(() => {
    role === null?getinfo():''
    search()
    getList()
  })
  const search = () => {
    const {chatKey,chatPage,chatTagList,operatorType} = searchForm
    paramsref.current.fanName = chatKey
    paramsref.current.pageIds = chatPage
    paramsref.current.tagsId = chatTagList
    // paramsref.current.operatorType = operatorType
  }
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
      let fan: any = {}
      fan = fans.find(item => {
        return item['fanId'] === parsedMsg.senderId
      })

      const { isServe, recipientId, senderId } = parsedMsg
      
      // 粉丝发来的信息则进行处理
      if (!isServe) {
        const params = { pageId: recipientId, fanId: senderId }
        // 如果 fan 存在
        if (fan !== undefined) {
          fan.msg = judgeType(parsedMsg)
          fan.read = 0
          fan.timestamp = Date.now()
          fan.formatTime = formatChatTime(fan.timestamp)
          fans.sort((a, b) => b['timestamp'] - a['timestamp'])
          dispatch({
            type: 'list',
            payload: { list: listref.current }
          })
          setHasNew(true)
        } else {
          getfan(params)
        }
        msgAudio()
        // vibrateS()

      } else { // 客服发送消息的时候商家同时可以看到
        const params = { pageId: senderId, fanId: recipientId }
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
        } else {
          getfan(params)
        }
      }
    })
    socket.on('CONTACTS_UPDATE', (data) => {
      typeof data === 'string' ? data = JSON.parse(data) : ''
      data.status === -1 ? getList() : ''
      if (data.read !== undefined && data.read !== '') {
        let fan: any = {}
        // 找到当前fanId 匹配的粉丝 并且 修改状态 表明有状态发生改变
        fan = listref.current.find(item => {
          return item.fanId === data.senderId
        })
        fan.read = data.read
      } else {
        const { senderId, tags } = data
        let fan: any = {}
        fan = listref.current.find(item => {
          return item.fanId === senderId
        })
        if (fan) {
          if (tags !== '' && tags !== null && tags !== undefined) {
            const parsetags = tags.substr(1, tags.length - 2).split(',').slice(0,2)
            fan.tagsArr = parsetags.filter(item=>item!=='')
          } else {
            fan.tagsArr = []
          }
        }
      }
      const nohasnew = listref.current.every(item => {
        return item.read === 1
      })
      if (nohasnew) { setHasNew(false) }
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
      if (data.role === 7) {
        Taro.showModal({
          title: '提示',
          content: '该账号暂无浏览权限！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              SetStorageSync('Token', '')
              redirectTo('/pages/login/index')
            }
          }
        })
      } else {
        setUserInfo(data.sysUser)
        setRole(data.role)
        getpage(data.sysUser.userId)
      }
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
        setPages(data)
        conSocket(userId, pageIdsStr)
      }
    })
  }
  // 聊天会话列表
  const getList = async () => {
    paramsref.current.page = 1
    dispatch({ type: 'loading', payload: { loading: true } });
    await getRecentContacts(paramsref.current).then(res => {
      const { data } = res
      data.length > 0 ? setHasMore(true) : setHasMore(false)
      let list = data
      list.forEach(item => {
        item.tagsArr = []
        item.formatTime = formatChatTime(item.timestamp)
        item.tagsArr = item.tags === '' || item.tags === null ? [] : item.tagsArr = item.tags.split(',').slice(0,2)
        item.tagsArr = item.tagsArr.filter(item=>item!=='')
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
    })
    dispatch({ type: 'loading', payload: { loading: false } });
  }
  // 更多聊天会话列表
  const getMoreList = async () => {
    dispatch({ type: 'moreloading', payload: { ml: true } });
    await getRecentContacts(paramsref.current).then(res => {
      const { data } = res
      data.length > 0 ? setHasMore(true) : setHasMore(false)
      let list = data
      list.forEach(item => {
        item.tagsArr = []
        item.formatTime = formatChatTime(item.timestamp)
        item.tagsArr = item.tags === '' || item.tags === null ? [] : item.tagsArr = item.tags.split(',').slice(0,2)
        item.tagsArr = item.tagsArr.filter(item=>item!=='')
      })
      listref.current = [...listref.current, ...list]
      dispatch({ type: 'list', payload: { list: listref.current } });
      for (let i = 0; i < list.length; i++) {
        if (list[i]['read'] === 0) {
          setHasNew(true)
          return
        }
      }
      dispatch({ type: 'moreloading', payload: { ml: false } });
    })
  }
  // 特定粉丝
  const getfan = async (data) => {
    await getFan(data).then(res => {
      const { data } = res
      if (data) {
        data.tagsArr = []
        data.formatTime = formatChatTime(data.timestamp)
        data.tagsArr = data.tags === '' || data.tags === null ? [] : data.tagsArr = data.tags.split(',').slice(0,2)
        data.tagsArr = data.tagsArr.filter(item=>item!=='')
        data.read = 0
        if (searchForm.chatKey !== '') return
        listref.current = [data, ...listref.current]
        dispatch({ type: 'list', payload: { list: listref.current }})
        setHasNew(true)
      }
    })
  }
  const clickFan = (fan) => {
    let item: any = {}
    item = listref.current.find(f => { return fan.fanId === f['fanId'] })
    item ? item.read = 1 : ''
    dispatch({
      type: 'list',
      payload: { list: listref.current }
    });
    const { pageId, fanId, read } = item
    const p = { pageId, fanId, read }
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

  useReachBottom(() => {
    if (hasmore) {
      paramsref.current.page++
      getMoreList()
    }
  })

  return (
    <View>
      <Header ref={childref} title='消息列表' icon='message' />
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
        {
          moreloading ?
            <View className='moreload'>
              <AtActivityIndicator isOpened={moreloading} mode='center'></AtActivityIndicator>
            </View>
            : ''
        }
        <View className={`botblock ${needAddH ? 'needh' : ''}`} ></View>
      </View>

      <TabBar ref={childref} cur={cur} has={hasNew} />
    </View>
  );
};

export default observer(Chat);
