import React, { useRef, useState, useEffect, useReducer } from "react";
import ChatHeader from "@/components/chatHeader";
import UserAvatar from '@/components/userAvatar';
import Emoji from '@/components/emoji'
import Tools from '@/components/chatTools'
import QuickReply from '@/components/quickReply'
import ChatOrder from '@/components/chatOrder'
// 消息体组件
import TextMsg from '@/components/msgView/textMsg';
import ImgMsg from '@/components/msgView/imgMsg';
import SwiperMsg from '@/components/msgView/genericMsg';
import FileMsg from '@/components/msgView/fileMsg';
import NotifyMsg from '@/components/msgView/notifyMsg';
import MediaMsg from '@/components/msgView/mediaMsg';
import ButtonMsg from '@/components/msgView/buttonMsg';
import { View, Text, ScrollView } from "@tarojs/components";
import { AtInput, AtIcon, AtActivityIndicator } from 'taro-ui'
import { getSysInfo, genUuid, setInput, chooseImg, getsuffix,getFileType,chooseMsgFile } from '@/utils/index'
import { formatMsgStatus } from '@/utils/filter'
import { getHistoryMsg } from '@/api/chat'
import { observer } from 'mobx-react';
import { useFanStore, useWsioStore, useUserStore } from '@/store';
import { parseMsg } from '@/utils/parse'
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
  const cursorref = useRef(0)
  const barHeight = getSysInfo().statusBarHeight
  const { fan } = useFanStore()
  const { userInfo } = useUserStore()
  const { wsio } = useWsioStore()
  const [pos, setPos] = useState(0)
  const [message, setMessage] = useState('')
  const [showemoji, setShowEmoji] = useState(false)
  const [showtools, setShowTools] = useState(false)
  const [showreply, setShowReply] = useState(false)
  const [showorder, setShowOrder] = useState(false)
  const [state, dispatch] = useReducer(listReducer, initState)
  const { historyList, fakes } = state
  const [curMsg, setCurMsg] = useState('')
  const [loading, setLoading] = useState(false) //加载更多...
  const [initLoading, setInitLoading] = useState(false)
  const [hasmore, setHasmore] = useState(false) //是否有更多历史记录
  const [hisPar, setHisPar] = useState({
    page: 1,
    pageSize: 15,
    pageId: fan.pageId,
    senderId: fan.fanId,
    userId: 0
  })//历史记录参数
  let diffHeight = barHeight + 178 //176 + 2 2px为border高度
  let keybordHeight = 0 //键盘高度
  const msgViewStyle = {
    width: '100%',
    height: `calc(100vh - ${diffHeight}px)`
  }

  useEffect(() => {
    initSocket()
    historymsg()
  }, [])
  // socket事件
  const initSocket = () => {
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
      console.log(messageItem)
      const { userId, isServe = true, senderId: newMsgSenderId, recipientId: newMsgRecipientId } = messageItem
      const { fanId: fanSenderId, pageId: fanPageId } = fan
      const message = fakeref.current.find(item => {
        if (item['mid']) {
          return item['mid'] === messageItem.mid
        } else {
          return undefined
        }
      })
      

      if (!message) {
        if (((isServe && newMsgSenderId === fanPageId) && (newMsgRecipientId === fanSenderId)) || ((!isServe && newMsgSenderId === fanSenderId) && (newMsgRecipientId === fanPageId))) {
          console.log('当前信息不存在，并且聊天对象正确')
          messageItem.status = 1
          messageItem.uuid = genUuid()
          messageItem.userId = userId
          messageItem.fake = true
          fakeref.current = [...fakeref.current, messageItem]
          dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
          tobottom()
        }
      }
    })

    wsio.on('SEND_MSG_RESPONSE', (data) => {
      const { msg = '', status, uuid = '', mid = '' } = data
      // 收到的状态为3的时候，比状态时间戳小的信息全部改为已读
      if (status === 3) {
        const watermark = data.watermark
        fakeref.current.forEach(item => {
          if (item.timestamp <= watermark) {
            item.status = 3
          }
        })
      } else {
        console.log(uuid)
        console.log(fakeref.current)
        const sendText = fakeref.current.find(item => item.uuid === uuid)
        // 找到uuid 相同的信息 改变发送信息的状态
        console.log(sendText)
        if (sendText) {
          // sendText.loading = false
          sendText.status = status
          sendText.errorText = msg
          sendText.mid = mid
        }
      }
      dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
    })
  }
  const historymsg = async () => {
    setInitLoading(true)
    await getHistoryMsg(hisPar).then(res => {
      const { data } = res
      const hm = data.length > 0
      setHasmore(hm)
      let isbreak = false // 判断返回的数据
      let hisarr = hisref.current
      data.forEach(item => {
        if (isbreak || item.msg === null) return
        if (item.fanId !== hisPar.senderId) {
          isbreak = true
          return
        }
        const { delivery, read, userName, userId } = item

        const parsedItem = JSON.parse(item.msg)
        let regroupItem: RI = { ...parseMsg(parsedItem) }
        regroupItem.userId = userId
        regroupItem.userName = userName
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
      })

      if (!isbreak) {
        hisarr.reverse()
        dispatch({ type: 'his', payload: { his: hisarr } })
        // setHistory(hisarr.slice())
        tobottom()
        setInitLoading(false)
      }
    })
  }
  const morehistorymsg = async () => {
    if (!hasmore) {
      return
    }
    let params = hisPar
    params.page++
    setHisPar(params)
    setLoading(true)
    await getHistoryMsg(hisPar).then(res => {
      const { data } = res
      const hm = data.length > 0
      setHasmore(hm)
      let hisarr = hisref.current
      const len = data.length
      data.forEach(item => {
        if (item.msg === null) return
        const { delivery, read, userName, userId } = item
        const parsedItem = JSON.parse(item.msg)
        let regroupItem: RI = { ...parseMsg(parsedItem) }
        regroupItem.userId = userId
        regroupItem.userName = userName
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
      setLoading(false)
      const id = `msg${hisref.current[len].uuid}`
      setCurMsg(id)
    })
  }
  const tobottom = () => {
    const arr = [...hisref.current, ...fakeref.current]
    const cur = `msg${arr[arr.length - 1].uuid}`
    setCurMsg(cur)
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
    const { fanId, pageId } = fan
    // 发送参数 当前登录用户userId,聊天对象的senderId,pageId
    const socketParams = {
      uuid: uuid,
      userId: userInfo.userId,
      userName: userInfo.username,
      senderId: fanId,
      pageId: pageId,
      msg: msg,
    }
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
      fake: true
      // isTimeVisible: (Date.now() - this.lastVisibleTime > 300000) // 是否显示时间戳
    }
    fakeref.current = [...fakeref.current, fakeText]

    dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
    setMessage('')
    wsio.emit('SEND_MSG', socketParams)
    tobottom()
    // 关闭表情，工具
    closeModal()
  }
  const sendImg = async () => {
    setShowTools(false)
    const url = '/scrm-seller/utils/uploadFile'
    await chooseImg(url, 3).then(res => {
      res?sendFileSocket(res):console.log('error')
    })
  }
  const sendFile = async() => {
    const url = '/scrm-seller/utils/uploadRawFile'
    await chooseMsgFile(url,3).then(res=>{
      res?sendFileSocket(res):console.log('error')
    })
  }
  const sendFileSocket=(list)=>{
    const { fanId, pageId } = fan
    list.forEach(item => {
      const uuid = genUuid()
      const url = item.url?item.url:item
      const name = item.name?item.name:item
      const elements = { payload: { url }, name }
      let originType = getsuffix(url)
      const type = getFileType(originType) === 'video' || getFileType(originType) === 'radio' 
      ?'media':getFileType(originType)
      originType = type==='media'?getFileType(getsuffix(url)):getsuffix(url)
      const socketParams = {
        uuid: uuid,
        userId: userInfo.userId,
        senderId: fanId,
        pageId: pageId,
        files: [url]
      }
      const fakeText = {
        uuid: uuid,
        mid: '',
        type, // 定义的类型，例如文件被定义为 file，mp3 4 会被定义为 media
        originType, // 原始类型，例如 mp4,mp3
        elements: [elements], // 渲染dom结构，目前只有图片类型有
        filename: name, // 文件类型的 文件名
        mediaUrl:url,
        imgUrl: url, // 文件类型的 文件url
        fileUrl:url,
        loading: true,
        isServe: true,
        timestamp: Date.now(),
        text: '',
        status: 0, // 发送状态 0:发送中 1:发送成功 2:已送达 3:已读 -1:发送失败
        errorText: '', // 错误提示信息
        userId: userInfo.userId,
        // isTimeVisible: (Date.now() - this.lastVisibleTime > 300000) // 是否显示时间戳
      }
      
      fakeref.current = [...fakeref.current, fakeText]
      dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })  
      wsio.emit('SEND_MSG', socketParams)
      tobottom()
    })
  }

  // 输入时
  const inputMsg = (v, e) => {
    setMessage(v)
  }
  // 聚焦时
  const msgInputFocus = (v, e) => {
    keybordHeight = e.detail.height
    diffHeight += keybordHeight //软键盘高度改变，scroll高度改变
  }
  // 失焦时
  const msgInputBlur = (v, e) => {
    keybordHeight = e.detail.height
    diffHeight -= keybordHeight //软键盘高度改变，scroll高度改变
    cursorref.current = e.detail.cursor
  }
  // 动态组件
  const msgComponent = (item, idx) => {
    switch (item.type) {
      case 'text':
        return <TextMsg ref={childref} msgItem={item}></TextMsg>
      case 'image':
        return <ImgMsg ref={childref} msgItem={item}></ImgMsg>
      case 'postback':
        return <TextMsg ref={childref} msgItem={item}></TextMsg>
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
  const setemoji = (emoji) => {
    const result = setInput('msgInput', emoji, cursorref.current)
    setMessage(result)
    setPos(cursorref.current + emoji.length)
  }
  const setReply = (reply) => {
    const text = reply.content
    const result = setInput('msgInput', text, cursorref.current)
    setMessage(result)
    setPos(cursorref.current + text.length)
    setShowReply(false)
  }
  // 选择工具
  const clickTool = (id) => {
    if (id === 0) {
      setShowReply(true)
    }
    if (id === 1) {
      setShowTools(false)
      sendImg()
    }
    if (id === 2) {
      sendFile()
    }
    if (id === 3) {
      setShowOrder(true)
    }
  }
  // 关闭所有对话框
  const closeModal = () => {
    setShowEmoji(false)
    setShowTools(false)
    setShowReply(false)
    setShowOrder(false)
  }
  // 点击表情icon
  const clickEmojiIcon = () => {
    setShowEmoji(!showemoji)
    setShowTools(false)
    setShowReply(false)
    setShowOrder(false)
  }
  // 点击工具icon
  const clickToolsiIcon = () => {
    showorder || showreply ?
      setShowTools(true) :
      setShowTools(!showtools)
    setShowEmoji(false)
    setShowReply(false)
    setShowOrder(false)
  }
  return (
    <View className='live-chat' >
      <ChatHeader ref={childref} fan={fan}></ChatHeader>
      <ScrollView
        scrollY
        className='msgview'
        style={msgViewStyle}
        scrollIntoView={curMsg}
        upperThreshold={20}
        onScrollToUpper={morehistorymsg}
        onClick={closeModal}>
        <AtActivityIndicator isOpened={initLoading} size={36} mode='center'></AtActivityIndicator>
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
              <View className={`history ${msgitem.isServe ? 'reverse' : ''}`} key={msgidx} id={`msg${msgitem.uuid}`}>
                <View className={`history-content ${msgitem.isServe ? 'reverse' : ''}`}>
                  <UserAvatar ref={childref} msgItem={msgitem} fan={fan}></UserAvatar>
                  {msgComponent(msgitem, msgidx)}
                  {
                    msgitem.isServe ?
                      <Text className='msgstatus'>{formatMsgStatus(msgitem.status)}</Text>
                      : ''
                  }
                </View>
              </View>
            )
          })
        }
        {/* 假消息 */}
        {
          fakes.map((fakeitem, fakeidx) => {
            return (
              <View className={`history ${fakeitem.isServe ? 'reverse' : ''}`} key={fakeidx} id={`msg${fakeitem.uuid}`}>
                <View className={`history-content ${fakeitem.isServe ? 'reverse' : ''}`}>
                  <UserAvatar ref={childref} msgItem={fakeitem} fan={fan}></UserAvatar>
                  {msgComponent(fakeitem, fakeidx)}
                  {
                    fakeitem.isServe && fakeitem.status !== -1 ?
                      <Text className='msgstatus'>{formatMsgStatus(fakeitem.status)}</Text>
                      : ''
                  }
                </View>
              </View>
            )
          })
        }
      </ScrollView>

      <View className='fooler' style={{ height: '44px', bottom: keybordHeight + 'px' }}>
        {/* 左边工具栏 */}
        <View className='left'>
          <View className='emoj' onClick={clickEmojiIcon}>
            <AtIcon prefixClass='icon' value='smile' color='#666' className='alicon'></AtIcon>
            {showemoji ? <Emoji ref={childref} msg={message} handleClick={setemoji}></Emoji> : ''}
          </View>
          <View className='more' onClick={clickToolsiIcon}>
            <AtIcon prefixClass='icon' value='add-circle' color='#666' className='alicon'></AtIcon>
            {showtools ? <Tools ref={childref} handleClick={clickTool}></Tools> : ''}
            {showreply ? <QuickReply ref={childref} pageId={fan.pageId} handleClick={setReply}></QuickReply> : ''}
            {showorder ? <ChatOrder ref={childref} ></ChatOrder> : ''}
          </View>
        </View>
        {/* 输入发送消息 */}
        <AtInput
          name='msgInput'
          className='msginput'
          value={message}
          onChange={inputMsg}
          onFocus={msgInputFocus}
          onBlur={msgInputBlur}
          selectionStart={pos}
          selectionEnd={pos}
        />
        {/* 发送按钮 */}
        <View className='searchbtn send' onClick={sendMsg}>
          发送
        </View>
      </View>
    </View>
  );
};

export default observer(LiveChat);
