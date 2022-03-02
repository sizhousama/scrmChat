import React, { useRef, useState, useEffect, useReducer, useCallback } from "react"
import io from 'socket.io-mp-client'
import { Base64 } from 'js-base64'

import Taro, { useDidShow, useReachBottom, useShareAppMessage,usePullDownRefresh } from "@tarojs/taro"
import { AtActivityIndicator } from 'taro-ui'
import { View } from "@tarojs/components"
import { observer } from 'mobx-react'

import Header from "@/components/header"
import ChatFan from "@/components/chatFan"

import { getMessengerFan, getMessengerRecentContacts, upMessengerRead } from '@/api/messenger/fan'
import { getWaFan, getWaRecentContacts, upWaRead } from '@/api/wa/fan'
import { getInsFan, getInsRecentContacts, upInsRead } from '@/api/ins/fan'
import { getAllTag, getAllPage, getWaAccounts, getServices, getInsAccounts } from '@/api/utils'
import { getUserInfo, getMessageNumber } from '@/api/info'
import { formatChatTime } from '@/utils/time'
import { parseMsg, judgeType, judgeMyType } from '@/utils/parse'
import { parseWaMsg, judgeWaType } from '@/utils/parseWa'
import { useFanStore, useUserStore, useWsioStore } from '@/store'
import { socketUrl } from '@/servers/baseUrl'
import { msgAudio, isNeedAddH, SetStorageSync, redirectTo,toIndexes,DecryptData, getSysInfo } from '@/utils/index'
import { judgeInsType, parseInsMsg } from "@/utils/parseIns"
import TabBar from "../tabbar";
import "./index.scss";


interface Fan {
  fanId: string
  pageId: string
  fanName: string
  pageName: string
  msg: string
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
  const { hasNew, setHasNew, searchForm, setPages, setWaAccounts, setInsAccounts, setServices } = useFanStore()
  const { setUserInfo, role, setRole, setAllTags, type, setMessageCount } = useUserStore()
  const { fanlist, loading, moreloading } = state
  const barHeight = getSysInfo().statusBarHeight
  // 请求参数
  const paramsref = useRef<any>({
    page: 1,
    pageSize: 10,
    current: 1,
    size: 10
  })

  const getFan = (data) => {
    switch(type){
        case 'messenger': return getMessengerFan(data)
        case 'whatsapp': return getWaFan(data)
        case 'ins': return getInsFan(data)
        default: return getMessengerFan(data)
    }
  }
  
  const getRecentContacts = (data) => {
    switch(type){
        case 'messenger': return getMessengerRecentContacts(data)
        case 'whatsapp': return getWaRecentContacts(data)
        case 'ins': return getInsRecentContacts(data)
        default: return getMessengerRecentContacts(data)
    }
  }
  
  const upRead = (data) => {
    switch(type){
        case 'messenger': return upMessengerRead(data)
        case 'whatsapp': return upWaRead(data)
        case 'ins': return upInsRead(data)
        default: return upMessengerRead(data)
    }
  }

  // 创建socket连接
  const conSocket = (userId) => {
    const query = `userId=${userId}`
    const surl = socketUrl()
    const socket = io(surl + query)
    setWsio(socket)
    initWebSocket(socket)
  }
  
  const getTags = useCallback(async () => {
    await getAllTag().then(res => {
      const { data } = res
      data.forEach(e => {
        e.act=false
      });
      const arr = toIndexes(data, 'tag')
      setAllTags(arr.slice())
    })
  },[setAllTags])

  const getAccounts = useCallback(async () => {
    if(type === 'messenger'){
      await getAllPage().then(res => {
        const { data } = res
        setPages(data.map(item=>{return {label:item.pageName,value:item.pageId}}).slice())
      })
    }
    if(type === 'whatsapp'){
      await getWaAccounts().then(res => {
        const { data } = res
        setWaAccounts(data.map(item=>{return {label:item.name,value:item.id}}).slice())
      })
    }
    if(type === 'ins'){
      await getInsAccounts({current:1,size:999}).then(res => {
        const { data } = res
        setInsAccounts(data.records.map(item=>{return {label:item.pageName,value:item.pageId}}).slice())
      })
    }
  },[setInsAccounts, setPages, setWaAccounts, type])


  const getServicesList = useCallback(async () => {
    await getServices().then(res => {
      const { data } = res
      setServices(data.map(item=>{return {label:item.username,value:item.userId}}).slice())
    })
  },[setServices])

  useEffect(()=>{
    getTags()
    getServicesList()
    getAccounts()
  },[getAccounts, getServicesList, getTags, type])

  usePullDownRefresh(() => {
    getList()
  })

  useShareAppMessage(() => {
    return {
      title: 'HiveScrm',
      path: '/pages/chat/index'
    }
  })

  useDidShow(() => {
    role === null && getinfo()
    search()
    getList()
  })

  const search = () => {
    paramsref.current = { page: 1, pageSize: 10, current: 1, size: 10 }
    for(let key in searchForm){
      if(key === 'pageIds'){
        searchForm[key] = [searchForm[key]]
      }
    }
    paramsref.current = {...paramsref.current, ...searchForm}
    console.log(paramsref.current)
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
      if(type !== 'messenger') return
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
          dispatch({type: 'list',payload: { list: listref.current }})
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
          dispatch({type: 'list', payload: { list: listref.current }})
        } else {
          getfan(params)
        }
      }
    })
    socket.on('CONTACTS_UPDATE', (data) => {
      if(type !== 'messenger') return
      if(typeof data === 'string') data = JSON.parse(data)
      data.status === -1 && getList()
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
          if (tags) {
            const parsetags = tags.substr(1, tags.length - 2).split(',').slice(0,1)
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
      dispatch({type: 'list',payload: { list: listref.current }})
    })
    socket.on('WHATSAPP_SEND_MSG', (data) => {
      if(type !== 'whatsapp') return
      const fans = listref.current
      const pdata = JSON.parse(data)
      const isServe = !Object.prototype.hasOwnProperty.call(pdata, 'contacts')
      const parsedMsg:any = { ...parseWaMsg(data, isServe) }
      parsedMsg.isServe = isServe
      const fan = fans.find((fan1) => {
        return fan1.whatsappUserId === parsedMsg.whatsappUserId && fan1.whatsappAccountId === parsedMsg.whatsappAccountId
      })
      const { whatsappUserId, whatsappAccountId } = parsedMsg
      if (!isServe) {
        if (fan !== undefined) {
          fan.msg = judgeWaType(parsedMsg, false)
          fan.read = 0
          fan.timestamp = Date.now()
          fan.formatTime = formatChatTime(fan.timestamp)
          fans.sort((a, b) => b['timestamp'] - a['timestamp'])
          dispatch({type: 'list',payload: { list: listref.current }})
          setHasNew(true)
        } else {
          const params = {
            whatsappAccountId,
            whatsappUserId
          }
          getFan(params)
        }
      } else {
        if (fan) {
          fan.msg = judgeWaType(parsedMsg, true)
          fan.timestamp = Date.now()
          fans.sort((a, b) => b['timestamp'] - a['timestamp'])
          dispatch({type: 'list', payload: { list: listref.current }})
        } else {
          const params = {
            whatsappAccountId,
            whatsappUserId
          }
          getFan(params)
        }
      }
      dispatch({type: 'list', payload: { list: listref.current }})
    })
    socket.on('WHATSAPP_CONTACTS_UPDATE', (data) => {
      if(type !== 'whatsapp') return
      const fans = listref.current
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }
      if (data.read !== undefined) {
        const fan = fans.find((fan1) => {
          return fan1.whatsappUserId === data.whatsappUserId
        })
        fan.read = data.read
      } else {
        const { whatsappAccountId, whatsappUserId } = data
        const fan = fans.find((fan2) => {
          return fan2.whatsappUserId === whatsappUserId && fan2.whatsappAccountId === whatsappAccountId
        })
        fan && (fan.tagsArr = data.tagIds ? data.tagIds.split(',').slice(0,1).filter(item=>item!=='') : [])
      }
      dispatch({type: 'list',payload: { list: listref.current }})
      const nohasnew = listref.current.every(item => {
        return item.read === 1
      })
      nohasnew && setHasNew(false)
    })
    socket.on('INSTAGRAM_SEND_MSG', (data) => {
      if(type !== 'ins') return
      const fans = listref.current
      const parsedMsg:any = { ...parseInsMsg(data) }
      const isServe = parsedMsg.isServe
      const fan = fans.find((fan1) => {
        return fan1.instagramUserId === parsedMsg.instagramUserId && fan1.instagramAccountId === parsedMsg.instagramAccountId
      })
      const { instagramUserId, instagramAccountId } = parsedMsg
      if (!isServe) {
        if (fan !== undefined) {
          fan.msg = judgeInsType(parsedMsg, false)
          fan.read = 0
          fan.timestamp = Date.now()
          fan.formatTime = formatChatTime(fan.timestamp)
          fans.sort((a, b) => b['timestamp'] - a['timestamp'])
          dispatch({type: 'list',payload: { list: listref.current }})
          setHasNew(true)
        } else {
          const params = {
            instagramAccountId,
            instagramUserId
          }
          getFan(params)
        }
      } else {
        if (fan) {
          fan.msg = judgeInsType(parsedMsg, true)
          fan.timestamp = Date.now()
          fans.sort((a, b) => b['timestamp'] - a['timestamp'])
          dispatch({type: 'list', payload: { list: listref.current }})
        } else {
          const params = {
            instagramAccountId,
            instagramUserId
          }
          getFan(params)
        }
      }
      dispatch({type: 'list', payload: { list: listref.current }})
    })
    socket.on('INSTAGRAM_CONTACTS_UPDATE', (data) => {
      if(type !== 'ins') return
      const fans = listref.current
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }
      if (data.read !== undefined) {
        const fan = fans.find((fan1) => {
          return fan1.instagramUserId === data.instagramUserId
        })
        fan.read = data.read
      } else {
        const { instagramAccountId, instagramUserId } = data
        const fan = fans.find((fan2) => {
          return fan2.instagramUserId === instagramUserId && fan2.instagramAccountId === instagramAccountId
        })
        fan && (fan.tagsArr = data.tagIds ? data.tagIds.split(',').slice(0,1).filter(item=>item!=='') : [])
      }
      dispatch({type: 'list',payload: { list: listref.current }})
      const nohasnew = listref.current.every(item => {
        return item.read === 1
      })
      nohasnew && setHasNew(false)
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
          success: function (res2) {
            if (res2.confirm) {
              SetStorageSync('Token', '')
              redirectTo('/pages/login/index')
            }
          }
        })
      } else {
        setUserInfo(data.sysUser)
        setRole(data.role)
        conSocket(data.sysUser.userId)
        if(data.sysUser.setMealLevel === 10){
          getMessageCount()
        }
      }
    })
  }
  // 会话数量
  const getMessageCount = async () =>{
    const {data} = await getMessageNumber()
    setMessageCount(data)
  }
  // 聊天会话列表
  const getList = async () => {
    paramsref.current.page = 1
    dispatch({ type: 'loading', payload: { loading: true } });
    await getRecentContacts(paramsref.current).then(res => {
      const { data } = res
      let list:any[] = []
      const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
      console.log(rawdata)
      rawdata.length > 0 ? setHasMore(true) : setHasMore(false)
      list = rawdata
      list.forEach(item => {
        item.tagsArr = []
        item.formatTime = formatChatTime(item.timestamp)
        const tagstr = type ==='messenger' ? item.tags : item.tagNames
        item.tagsArr = !tagstr ? [] : tagstr.split(',').slice(0,1).filter(item2=>item2!=='')
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
      let list:any[] = []
      const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
      rawdata.length > 0 ? setHasMore(true) : setHasMore(false)
      list = rawdata
      list.forEach(item => {
        item.tagsArr = []
        item.formatTime = formatChatTime(item.timestamp)
        const tagstr = type ==='messenger' ? item.tags : item.tagNames
        item.tagsArr = !tagstr ? [] : tagstr.split(',').slice(0,1).filter(item2=>item2!=='')
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
  const getfan = async (d) => {
    await getFan(d).then(res => {
      const { data } = res
      const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
      if (rawdata) {
        rawdata.tagsArr = []
        rawdata.formatTime = formatChatTime(rawdata.timestamp)
        const tagstr = type ==='messenger' ? rawdata.tags : rawdata.tagNames
        rawdata.tagsArr = !tagstr ? [] : tagstr.split(',').slice(0,1).filter(item2=>item2!=='')
        rawdata.read = 0
        if (searchForm.chatKey !== '') return
        listref.current = [rawdata, ...listref.current]
        dispatch({ type: 'list', payload: { list: listref.current }})
        setHasNew(true)
      }
    })
  }
  const clickFan = (fan) => {
    let item: any = {}
    let p:any = {}
    if(type === 'messenger'){
      item = listref.current.find(f => { return fan.fanId === f['fanId'] })
      if(item) item.read = 1
      const { pageId, fanId, read } = item
      p = { pageId, fanId, read }
    }
    if(type === 'whatsapp'){
      item = listref.current.find(f => { return fan.whatsappUserId === f['whatsappUserId'] })
      if(item) item.read = 1
      const { whatsappAccountId, whatsappUserId, read } = item
      p = { whatsappAccountId, whatsappUserId, read }
    }
    if(type === 'ins'){
      item = listref.current.find(f => { return fan.instagramUserId === f['instagramUserId'] })
      if(item) item.read = 1
      const { instagramAccountId, instagramUserId, read } = item
      p = { instagramAccountId, instagramUserId, read }
    }
    dispatch({ type: 'list', payload: { list: listref.current }})
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
  const headerTitle = () => {
    switch(type){
      case 'messenger': return 'Messenger消息'
      case 'whatsapp': return 'WhatsApp消息'
      case 'ins': return 'Instagram消息'
    }
  }
  useReachBottom(() => {
    if (hasmore) {
      type === 'messenger' ? paramsref.current.page++ : paramsref.current.current++
      getMoreList()
    }
  })

  return (
    <View className='chat-list' style={{marginTop:barHeight+88+'px'}}>
      <Header ref={childref} title={headerTitle()} from='msg' />
      <AtActivityIndicator isOpened={loading} mode='center'></AtActivityIndicator>
      <View className='chatfanlist'>
        {
          fanlist.length>0 ? fanlist.map((item: Fan, index) => {
            return (
              <ChatFan
                key={index}
                ref={childref}
                fan={item}
                handleClick={clickFan}
              />
            )
          })
          : <View className='nodata'>暂无数据！</View>
        }
        {
          moreloading &&
            <View className='moreload'>
              <AtActivityIndicator isOpened={moreloading} mode='center'></AtActivityIndicator>
            </View>
        }
        <View className={`botblock ${needAddH ? 'needh' : ''}`} ></View>
      </View>
      <TabBar ref={childref} cur={cur} has={hasNew} />
    </View>
  );
};

export default observer(Chat);
