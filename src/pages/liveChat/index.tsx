import React, { useRef, useState, useEffect, useReducer, useCallback } from "react";
import { useDidShow } from "@tarojs/taro";
import ChatHeader from "@/components/chatHeader";
import UserAvatar from '@/components/userAvatar';
import Emoji from '@/components/emoji'
import Tools from '@/components/chatTools'
import QuickReply from '@/components/quickReply'
import SendFlow from '@/components/sendFlow'
import TimeOutMsg from '@/components/timeoutMsg'
// 消息体组件
import TextMsg from '@/components/msgView/textMsg';
import FallBackMsg from '@/components/msgView/fallBackMsg'
import ImgMsg from '@/components/msgView/imgMsg';
import SwiperMsg from '@/components/msgView/genericMsg';
import FileMsg from '@/components/msgView/fileMsg';
import NotifyMsg from '@/components/msgView/notifyMsg';
import MediaMsg from '@/components/msgView/mediaMsg';
import ButtonMsg from '@/components/msgView/buttonMsg';
import { View, Text, ScrollView, Textarea } from "@tarojs/components";
import { AtIcon, AtActivityIndicator } from 'taro-ui'
import { getSysInfo, genUuid, setInput, chooseImg, getsuffix, getFileType, chooseMsgFile, hideKb, isNeedAddH, NavTo ,DecryptData } from '@/utils/index'
import { formatMsgStatus } from '@/utils/filter'
import { getMessengerHistoryMsg, sendMessengerReply } from '@/api/messenger'
import { getMessengerFanInfo } from '@/api/messenger/fan'
import { translateMsg } from '@/api/utils'
import { observer } from 'mobx-react';
import { useFanStore, useWsioStore, useUserStore, useOrderStore } from '@/store';
import { parseMsg } from '@/utils/parse'
import { Base64 } from 'js-base64';
import { formatChatTime } from "@/utils/time";
import "./index.scss";

interface RI {
  timestamp?: string | number,
  status?: number,
  type?: string,
  userId?: number,
  userName?: string,
  uuid?: string
}
interface MI {
  isServe?: boolean,
  senderId?: string,
  recipientId?: string,
  mid?: string,
  status?: number,
  uuid?: string,
  userId?: number,
  fake?: boolean
}
// reducer
const initState = {
  historyList: [],
  fakes: []
}
const listReducer = (state, action) => {
  switch (action.type) {
    case 'his':
      return {
        ...state,
        historyList: action.payload.his
      }
    case 'fakes':
      return {
        ...state,
        fakes: action.payload.fakes
      }
    default:
      return state;
  }
}
const LiveChat = () => {
  const childref = useRef()
  const hisref = useRef<any[]>([])
  const fakeref = useRef<any[]>([])
  const kbref = useRef(0)
  const cursorref = useRef(0)
  const barHeight = getSysInfo().statusBarHeight

  const { fan, setMd5, setPayAccount,showMsg } = useFanStore()
  const { type, userInfo, themeColor, messageCount } = useUserStore()
  const { setTempOrder } = useOrderStore()
  const { wsio } = useWsioStore()
  const [pos, setPos] = useState(0)
  const [message, setMessage] = useState('')
  const [showemoji, setShowEmoji] = useState(false)
  const [showtools, setShowTools] = useState(false)
  const [showreply, setShowReply] = useState(false)
  const [showflow, setShowFlow] = useState(false)
  const [showTagMsg, setShowTagMsg] = useState(false)
  const [state, dispatch] = useReducer(listReducer, initState)
  const { historyList, fakes } = state
  const [curMsg, setCurMsg] = useState('')
  const [loading, setLoading] = useState(false) //加载更多...
  const [initLoading, setInitLoading] = useState(false)
  const [hasmore, setHasmore] = useState(false) //是否有更多历史记录
  const [showMsgTools, setShowMsgTools] = useState(false)
  const [replyImg, setReplyImg] = useState<string[]>([])
  const [hisPar, setHisPar] = useState({
    page: 1,
    pageSize: 15,
    pageId: fan.pageId,
    senderId: fan.fanId
  })//历史记录参数
  const needH = isNeedAddH()
  const needh = needH ? 32 : 0
  const foolerref = useRef(54)
  const diffHeight = barHeight + foolerref.current + 92  //176 + 2 2px为border高度
  
  const [msgViewStyle, setMsgViewSyle] = useState({
    height: `calc(100vh - ${diffHeight + needh}px)`
  })
  const [inputbot, setInputBot] = useState(0)
  const [foolerpb, setFoolerpb] = useState(needh)
  const [showTimeOut, setShowTimeOut] = useState(false)
  
  //判断是否显示标签消息
  const getUser = useCallback(async () => {
    const { pageId, fanId } = fan
    const p = { pageId, senderId:fanId }
    const { data } = await getMessengerFanInfo(p)
    const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
    const { lastSendMsgTime, userMd5, payAccount } = rawdata
    setMd5(userMd5)
    setPayAccount(payAccount)
    if (lastSendMsgTime) {
      try {
        const lastSendTime = new Date(lastSendMsgTime.replace(/-/g, "/")).getTime()
        const now = new Date().getTime()
        if (now - lastSendTime > 24 * 60 * 60 * 1000) {
          setShowTagMsg(true)
          showMsg && setShowTimeOut(true)
        }
      } catch (e) {
        setShowTagMsg(true)
        showMsg && setShowTimeOut(true)
      }
    } else { 
      setShowTagMsg(true)
      showMsg && setShowTimeOut(true)
    }
  },[fan, setMd5, setPayAccount, showMsg])
  // socket事件
  const initSocket = useCallback(() => {
    wsio.on('SEND_MSG', (data) => {
      let messageItem: MI = {
        isServe: false,
        senderId: '',
        recipientId: '',
        mid: '',
        status: 0,
        uuid: '',
        userId: 0
      }
      messageItem = { ...parseMsg(data) }
      const { userId, isServe = true, senderId: newMsgSenderId, recipientId: newMsgRecipientId } = messageItem
      const { fanId: fanSenderId, pageId: fanPageId } = fan
      // debugger
      const msg = fakeref.current.find(item => {
        if (item['mid']) {
          return item['mid'] === messageItem.mid
        } else {
          return undefined
        }
      })

      if (!msg) {
        if (((isServe && newMsgSenderId === fanPageId) && (newMsgRecipientId === fanSenderId)) || ((!isServe && newMsgSenderId === fanSenderId) && (newMsgRecipientId === fanPageId))) {
          messageItem.status = 1
          messageItem.uuid = genUuid()
          messageItem.userId = userId
          messageItem.fake = true
          fakeref.current = [...fakeref.current, messageItem]
          dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
          tobottom()
        }
      }
      if (!isServe) {
        // vibrateS()
      }
    })

    wsio.on('SEND_MSG_RESPONSE', (data) => {
      const { msg = '', status, uuid = '', mid = '', senderId } = data
      // 收到的状态为3的时候，比状态时间戳小的信息全部改为已读
      if (mid !== '') {
        const sendText = fakeref.current.find(item => item.uuid === uuid)
        if (sendText) {
          sendText.status = status
          sendText.errorText = msg
          sendText.mid = mid
        }
      } else {
        if (senderId === fan.fanId) {
          const watermark = data.watermark
          fakeref.current.forEach(item => {
            if (item.timestamp <= watermark) {
              item.status = status
            }
          })
        }
      }
      dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
    })
  },[fan, wsio])
  // 获取历史记录
  const historymsg = useCallback(async () => {
    setInitLoading(true)
    await getMessengerHistoryMsg(hisPar).then(res => {
      const { data } = res
      const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
      const hm = rawdata.length > 0
      setHasmore(hm)
      let isbreak = false // 判断返回的数据
      let hisarr = hisref.current
      rawdata.forEach((item,i) => {
        if (isbreak || item.msg === null) return
        if (item.fanId !== hisPar.senderId) {
          isbreak = true
          return
        }
        
        const { delivery, read, userName, userId, translateText } = item
        if(item.msg){
        const parsedItem = JSON.parse(item.msg)
        let regroupItem: any = { ...parseMsg(parsedItem) }
        regroupItem.userId = userId
        regroupItem.userName = userName
        regroupItem.translateText = translateText
        regroupItem.showTools = false
        regroupItem.uuid = genUuid()
        if (regroupItem && regroupItem.timestamp) {
          if (regroupItem.type !== '') {
            hisarr.push(regroupItem)
            // 未送达
            if (delivery === 0 && read === 0) {
              // 暂时修改为 已送达
              regroupItem.status = 2
            }
            // 已送达
            if (delivery === 1 && read === 0) {
              regroupItem.status = 2
            }
            // 已读
            if (read === 1) {
              regroupItem.status = 3
            }
          }
        }
        }
      })

      if (!isbreak) {
        hisarr.reverse()
        dispatch({ type: 'his', payload: { his: hisarr } })
        tobottom()
      }
      setInitLoading(false)
    })
  },[hisPar])

  useEffect(() => {
    initSocket()
    historymsg()
    type === 'messenger' && getUser()
  }, [fan, getUser, historymsg, initSocket, type])
  // 获取更多历史记录
  const morehistorymsg = async () => {
    if (!hasmore) {
      return
    }
    let params = hisPar
    params.page++
    setHisPar(params)
    setLoading(true)
    await getMessengerHistoryMsg(hisPar).then(res => {
      const { data } = res
      const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
      const hm = rawdata.length > 0
      setHasmore(hm)
      let hisarr = hisref.current
      const len = rawdata.length
      rawdata.forEach(item => {
        if (item.msg === null) return
        const { delivery, read, userName, userId, translateText } = item
        const parsedItem = JSON.parse(item.msg)
        let regroupItem: any = { ...parseMsg(parsedItem) }
        regroupItem.userId = userId
        regroupItem.userName = userName
        regroupItem.translateText = translateText
        regroupItem.showTools = false
        regroupItem.uuid = genUuid()
        if (regroupItem && regroupItem.timestamp) {
          if (regroupItem.type !== '') {
            if (hasmore)
              hisarr.unshift(regroupItem)
            if (delivery === 0 && read === 0) {
              regroupItem.status = 2
            }
            if (delivery === 1 && read === 0) {
              regroupItem.status = 2
            }
            if (read === 1) {
              regroupItem.status = 3
            }
          }
        }
      })
      dispatch({ type: 'his', payload: { his: hisarr } })
      const id = `msg${hisref.current[len].uuid}`
      setCurMsg(id)
      setLoading(false)
    })
  }
  // 滚动到底部
  const tobottom = () => {
    const arr = [...hisref.current, ...fakeref.current]
    if (arr.length > 0) {
      const cur = `msg${arr[arr.length - 1].uuid}`
      setCurMsg(cur)
    }
  }
  //发送文本消息
  const sendMsg = () => {
    // 创建uuid
    const uuid = genUuid()
    let msg = message
    msg = msg.trim()
    if (msg === '') {
      console.log('提交信息不通过')
      closeModal()
      return
    }
    if (replyImg.length > 0) {
      sendFileSocket(replyImg)
      setReplyImg([])
    }
    const { fanId, pageId } = fan
    // 发送参数 当前登录用户userId,聊天对象的senderId,pageId
    const socketParams = {
      uuid: uuid,
      userId: userInfo.userId,
      userName: userInfo.username,
      senderId: fanId,
      pageId: pageId,
      msg: msg,
      tag: showTagMsg ? 'ACCOUNT_UPDATE' : ''
    }
    console.log(socketParams)
    // 假数据
    // TODO: 目前自制的假消息类型只有text
    const fakeText = {
      uuid: uuid,
      mid: '',
      type: 'text',
      userName: userInfo.username,
      text: msg,
      loading: true,
      isServe: true,
      timestamp: Date.now(),
      status: 0, // 发送状态 0:发送中 1:发送成功 2:已送达 3:已读 -1:发送失败
      errorText: '', // 错误提示信息
      userId: userInfo.userId, // 用来显示假消息头像
      fake: true,
      isTimeVisible: hisref.current.length > 0 ? (Date.now() - hisref.current[hisref.current.length - 1].timestamp > 600000) : false // 是否显示时间戳
    }
    fakeref.current = [...fakeref.current, fakeText]

    dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
    setMessage('')
    foolerref.current = 54

    wsio.emit('SEND_MSG', socketParams)

    tobottom()
    // 关闭所有
    setTimeout(() => {
      setShowEmoji(false)
      setShowTools(false)
      setShowReply(false)
      setShowFlow(false)
    }, 10);
  }
  // 发送图片
  const sendImg = async () => {
    const url = '/scrm-seller/utils/uploadFile'
    await chooseImg(url, 3).then(res => {
      res ? sendFileSocket(res) : console.log('error')
    })
  }
  // 发送文件
  const sendFile = async () => {
    const url = '/scrm-seller/utils/uploadRawFile'
    await chooseMsgFile(url, 3).then(res => {
      res ? sendFileSocket(res) : console.log('error')
    })
  }
  // 发送触发socket
  const sendFileSocket = (list) => {
    const { fanId, pageId } = fan
    list.forEach(item => {
      const uuid = genUuid()
      const url = item.url ? item.url : item
      const name = item.name ? item.name : item
      const elements = { payload: { url }, name }
      let originType = getsuffix(url)
      const t = getFileType(originType) === 'video' || getFileType(originType) === 'radio'
        ? 'media' : getFileType(originType)
      originType = t === 'media' ? getFileType(getsuffix(url)) : getsuffix(url)
      const socketParams = {
        uuid: uuid,
        userId: userInfo.userId,
        senderId: fanId,
        pageId: pageId,
        files: [url],
        tag: showTagMsg ? 'ACCOUNT_UPDATE' : ''
      }
      const fakeText = {
        uuid: uuid,
        mid: '',
        type: t, // 定义的类型，例如文件被定义为 file，mp3 4 会被定义为 media
        originType, // 原始类型，例如 mp4,mp3
        elements: [elements], // 渲染dom结构，目前只有图片类型有
        filename: name, // 文件类型的 文件名
        mediaUrl: url,
        imgUrl: url, // 文件类型的 文件url
        fileUrl: url,
        loading: true,
        isServe: true,
        timestamp: Date.now(),
        text: '',
        status: 0, // 发送状态 0:发送中 1:发送成功 2:已送达 3:已读 -1:发送失败
        errorText: '', // 错误提示信息
        userId: userInfo.userId,
        isTimeVisible: (Date.now() - hisref.current[hisref.current.length - 1].timestamp > 600000) // 是否显示时间戳
      }
      fakeref.current = [...fakeref.current, fakeText]
      dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
      wsio.emit('SEND_MSG', socketParams)
      tobottom()
    })
  }
  // 设置scrollview样式
  const setstyle = (h) => {
    setMsgViewSyle({
      height: `calc(100vh - ${h}px)`
    })
  }
  // 输入时
  const inputMsg = (e) => {
    setMessage(e.detail.value)
  }
  // 聚焦时
  const msgInputFocus = (e) => {
    setCurMsg('')
    setFoolerpb(0)
    const h = e.detail.height
    const dif = diffHeight
    kbref.current = h
    setstyle(dif + h)
    setTimeout(() => {
      tobottom()
    }, 0);
  }
  // 失焦时
  const msgInputBlur = (e) => {
    if (showtools || showemoji) {
      setFoolerpb(0) //IPX底部bottom
      const dif = diffHeight
      setstyle(dif + 200)
      tobottom()
    } else {
      if (kbref.current === 0) {
        setFoolerpb(needh)
        setstyle(diffHeight + needh)
      }
      tobottom()
    }
  }
  // 键盘高度改变时
  const kbChange = (e) => {
    kbref.current = e.detail.height
  }
  const openTools = (msg) => {
    msg.showTools = true
    console.log(msg)
    hisref.current.forEach(item =>{
      if(msg.mid !== item.mid){
        item.showTools = false
      }
    })
    fakeref.current.forEach(item =>{
      if(msg.mid !== item.mid){
        item.showTools = false
      }
    })
    dispatch({ type: 'his', payload: { his: hisref.current } })
    dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
  }
  const translateText = async (msg) => {
    const {data} = await translateMsg({mid:msg.mid})
    hisref.current.forEach(item =>{
      if(msg.mid === item.mid){
        item.translateText = data
      }
    })
    fakeref.current.forEach(item =>{
      if(msg.mid === item.mid){
        item.translateText = data
      }
    })
    dispatch({ type: 'his', payload: { his: hisref.current } })
    dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
  }
  // 动态组件
  const msgComponent = (item, idx) => {
    switch (item.type) {
      case 'text':
        return <TextMsg ref={childref} msgItem={item} show={item.showTools} open={() => openTools(item)} translate={() => translateText(item)}></TextMsg>
      case 'fallback':
        return <FallBackMsg ref={childref} msgItem={item}></FallBackMsg>
      case 'image':
        return <ImgMsg ref={childref} msgItem={item} fan={fan}></ImgMsg>
      case 'postback':
        return <TextMsg ref={childref} msgItem={item} show={item.showTools} open={() => openTools(item)} translate={() => translateText(item)}></TextMsg>
      case 'generic':
        return <SwiperMsg ref={childref} msgItem={item}></SwiperMsg>
      case 'file':
        return <FileMsg ref={childref} msgItem={item}></FileMsg>
      case 'notify':
        return <NotifyMsg ref={childref} msgItem={item} i={idx}></NotifyMsg>
      case 'media':
        return <MediaMsg ref={childref} msgItem={item}></MediaMsg>
      case 'button':
        return <ButtonMsg ref={childref} msgItem={item}></ButtonMsg>
      default: break
    }
  }
  // 插入标签
  const setemoji = (emoji) => {
    const result = setInput('msgInput', emoji, cursorref.current)
    hideKb()//隐藏键盘
    setMessage(result)//input赋值
  }
  // 插入快捷回复
  const setReply = async(reply) => {
    const {pageId, fanId} = fan
    const p = {pageId, senderId:fanId, id: reply.id}
    await sendMessengerReply(p)
    hideKb()
    setShowReply(false)
    setTimeout(() => {
      restPage()
    }, 100);
  }
  //发流程
  const sendFlow = (flow) => {
    const socketParams = {
      uuid: genUuid(),
      userId: userInfo.userId,
      userName: userInfo.username,
      senderId: fan.fanId,
      pageId: fan.pageId,
      msg: message,
      flowId: flow.id
    }
    wsio.emit('SEND_MSG', socketParams)
    hideKb()
    setShowFlow(false)
    setTimeout(() => {
      restPage()
    }, 100);
  }
  // 选择工具
  const clickTool = (id) => {
    restPage()
    if (id === 0) {
      sendImg()
    }
    if (id === 1) {
      sendFile()
    }
    if (id === 2) {
      setstyle(diffHeight + 200)
      setShowFlow(true)
    }
    if (id === 3) {
      setstyle(diffHeight + 200)
      setShowReply(true)
    }
    if (id === 4) {
      setTempOrder('')
      NavTo(`/pages/order/index?type=0`)
    }
  }
  // 重置页面
  const restPage = () => {
    setFoolerpb(needh)
    setstyle(diffHeight + needh)
    setShowEmoji(false)
    setShowTools(false)
  }
  // 关闭所有对话框
  const closeModal = () => {
    hideKb()
    restPage()
    setShowReply(false)
    setShowFlow(false)
    hisref.current.forEach(item => {item.showTools = false})
    dispatch({ type: 'his', payload: { his: hisref.current } })
    fakeref.current.forEach(item => {item.showTools = false})
    dispatch({ type: 'fake', payload: { fake: fakeref.current } })
  }
  // 点击表情icon
  const clickEmojiIcon = () => {
    setFoolerpb(0)
    setCurMsg('')
    !showemoji && setstyle(diffHeight + 200)
    hideKb()
    setShowEmoji(true)
    setShowTools(false)
    setShowReply(false)
    setShowFlow(false)
    setTimeout(() => {
      tobottom()
    }, 0);

  }
  // 点击工具icon
  const clickToolsiIcon = () => {
    setFoolerpb(0)
    setCurMsg('')
    !showtools && setstyle(diffHeight + 200)
    hideKb()
    setShowTools(true)
    setShowEmoji(false)
    setShowReply(false)
    setShowFlow(false)
    setTimeout(() => {
      tobottom()
    }, 0);
  }
  const clickTopUserIcon = () => {
    closeModal()
  }
  const lineChange = (e)=>{
    const line = e.detail.lineCount
    if(line===1||line===2){
      foolerref.current = 54
    }
    if(line>=3){
      foolerref.current = 60
    }
  }

  const msgContent = () => {
    if(messageCount.msgUserCount >= messageCount.limit){
      return <View className='disabled'>会话数超过限制{messageCount.limit}！</View>
    }
    return (
      <View className='fooler-inner'>
        <View className='left'>
          <View className='emoj' onClick={clickEmojiIcon}>
            <AtIcon prefixClass='icon' value='smile' color='#666' size='28' className='alicon'></AtIcon>
          </View>
          <View className='more' onClick={clickToolsiIcon}>
            <AtIcon prefixClass='icon' value='add-circle' color='#666' size='28' className='alicon'></AtIcon>
          </View>
        </View>
        <View className='msginput'>
          <Textarea
            id='msgInput'
            adjustPosition={false}
            value={message}
            onInput={inputMsg}
            onFocus={msgInputFocus}
            onBlur={msgInputBlur}
            selectionStart={pos}
            selectionEnd={pos}
            maxlength={2000}
            onConfirm={sendMsg}
            holdKeyboard
            onKeyboardHeightChange={kbChange}
            autoHeight
            onLineChange={lineChange}
            showConfirmBar={false}
          ></Textarea>
        </View>
        <View className='right'>
          <View className='searchbtn send' style={{background: themeColor}} onClick={sendMsg}>发送</View>
        </View>
      </View>
    )
  }

  return (
    <View className='live-chat' >
      <ChatHeader ref={childref} fan={fan} handleClick={clickTopUserIcon}></ChatHeader>
      <AtActivityIndicator isOpened={initLoading} size={36} mode='center'></AtActivityIndicator>
      {showTimeOut&&<TimeOutMsg close={()=>setShowTimeOut(false)}></TimeOutMsg>}
      <ScrollView
        scrollY
        className='msgview'
        style={msgViewStyle}
        scrollIntoView={curMsg}
        upperThreshold={10}
        onScrollToUpper={morehistorymsg}
        onClick={closeModal}
      >
        {
          loading ?
            <View className='more'>
              <AtActivityIndicator isOpened={loading} size={28} mode='center' color='#ccc'></AtActivityIndicator>
            </View>
            :
            <View className='topblock'></View>
        }
        {/* 历史消息 */}
        {
          historyList.map((msgitem, msgidx) => {
            return (
              <View className='msgitembox' key={msgidx} id={`msg${msgitem.uuid}`}>
                {
                  msgidx > 0 && (msgitem.timestamp - historyList[msgidx - 1].timestamp) >= 600000 ?
                    <View className='timeline'>{formatChatTime(msgitem.timestamp)}</View>
                    : ''
                }
                <View className={`history ${msgitem.isServe ? 'reverse' : ''}`} >
                  <View className={`history-content ${msgitem.isServe ? 'reverse' : ''}`}>
                    <UserAvatar ref={childref} msgItem={msgitem} fan={fan} redom={msgitem.uuid}></UserAvatar>
                    {msgComponent(msgitem, msgidx)}
                    {
                      msgitem.isServe ?
                        <Text className='msgstatus'>{formatMsgStatus(msgitem.status)}</Text>
                        : ''
                    }
                  </View>
                </View>
              </View>
            )
          })
        }
        {/* 假消息 */}
        {
          fakes.map((fakeitem, fakeidx) => {
            return (
              <View className='msgitembox' key={fakeidx} id={`msg${fakeitem.uuid}`}>
                {
                  fakeitem.isTimeVisible ?
                    <View className='timeline'>{formatChatTime(fakeitem.timestamp)}</View>
                    : ''
                }
                <View className={`history ${fakeitem.isServe ? 'reverse' : ''}`} >
                  <View className={`history-content ${fakeitem.isServe ? 'reverse' : ''}`}>
                    <UserAvatar ref={childref} msgItem={fakeitem} fan={fan} redom={fakeitem.uuid}></UserAvatar>
                    {msgComponent(fakeitem, fakeidx)}
                    {
                      fakeitem.isServe && fakeitem.status !== -1 ?
                        <Text className='msgstatus'>{formatMsgStatus(fakeitem.status)}</Text>
                        : ''
                    }
                  </View>
                </View>
              </View>
            )
          })
        }
      </ScrollView>

      <View id='fooler' className='fooler' style={{ minHeight: '54px', bottom: inputbot + 'px', paddingBottom: foolerpb + 'px' }}>
        {msgContent()}
      </View>
      <View className='toolsbox' style={{ height: showtools || showemoji || showreply || showflow ? '200px' : 0 }}>
        {showemoji && <Emoji ref={childref} msg={message} handleClick={setemoji}></Emoji>}
        {showtools && <Tools ref={childref} handleClick={clickTool}></Tools>}
        {showreply && <QuickReply ref={childref} pageId={fan.pageId} handleClick={setReply}></QuickReply>}
        {showflow && <SendFlow ref={childref} handleClick={sendFlow}></SendFlow>}
      </View>
    </View>
  );
};

export default observer(LiveChat);
