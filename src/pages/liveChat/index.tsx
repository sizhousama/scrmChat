import React, { useRef, useState, useEffect, useReducer } from "react";
import ChatHeader from "@/components/chatHeader";
import UserAvatar from '@/components/userAvatar';
import Emoji from '@/components/emoji'
import Tools from '@/components/chatTools'
import QuickReply from '@/components/quickReply'
import ReplyImg from '@/components/replyImg'
import SendFlow from '@/components/sendFlow'
// 消息体组件
import TextMsg from '@/components/msgView/textMsg';
import FallBackMsg from '@/components/msgView/fallBackMsg'
import ImgMsg from '@/components/msgView/imgMsg';
import SwiperMsg from '@/components/msgView/genericMsg';
import FileMsg from '@/components/msgView/fileMsg';
import NotifyMsg from '@/components/msgView/notifyMsg';
import MediaMsg from '@/components/msgView/mediaMsg';
import ButtonMsg from '@/components/msgView/buttonMsg';
import { View, Text, ScrollView, Input } from "@tarojs/components";
import { AtIcon, AtActivityIndicator } from 'taro-ui'
import { getSysInfo, genUuid, setInput, chooseImg, getsuffix, getFileType, chooseMsgFile, hideKb, isNeedAddH, NavTo } from '@/utils/index'
import { formatMsgStatus } from '@/utils/filter'
import { getHistoryMsg } from '@/api/chat'
import { getFanInfo } from '@/api/fan'
import { observer } from 'mobx-react';
import { useFanStore, useWsioStore, useUserStore, useOrderStore } from '@/store';
import { parseMsg } from '@/utils/parse'
import { vibrateS } from '@/utils/index'
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

  const { fan, setMd5, setPayAccount } = useFanStore()
  const { userInfo } = useUserStore()
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
  const [replyImg, setReplyImg] = useState<string[]>([])
  const [hisPar, setHisPar] = useState({
    page: 1,
    pageSize: 15,
    pageId: fan.pageId,
    senderId: fan.fanId,
    userId: 0
  })//历史记录参数
  const needH = isNeedAddH()
  const needh = needH ? 32 : 0
  const diffHeight = barHeight + 190  //176 + 2 2px为border高度

  const [msgViewStyle, setMsgViewSyle] = useState({
    height: `calc(100vh - ${diffHeight + needh}px)`
  })
  const [inputbot, setInputBot] = useState(0)
  const [isFocus, setIsFocus] = useState(false)
  const [foolerpb, setFoolerpb] = useState(needh)
  // const [keyboardH, setKeyBoardH] = useState(0)

  useEffect(() => {
    console.log(fan)
    initSocket()
    historymsg()
    tagMsg()
  }, [])
  //判断是否显示标签消息
  const tagMsg = async () => {
    const { pageId, fanId } = fan
    const p = { pageId, fanId }

    await getFanInfo(p).then(res => {
      const { lastSendMsgTime, userMd5, payAccount } = res.data
      setMd5(userMd5)
      setPayAccount(payAccount)
      if (lastSendMsgTime != undefined && lastSendMsgTime !== '') {
        try {
          const lastSendTime = new Date(lastSendMsgTime).getTime()
          const now = new Date().getTime()
          if (now - lastSendTime > 24 * 60 * 60 * 1000) {
            setShowTagMsg(true)
          }
        } catch (e) {
          setShowTagMsg(true)
        }
      } else { setShowTagMsg(true) }
    })
  }
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
      const { userId, isServe = true, senderId: newMsgSenderId, recipientId: newMsgRecipientId } = messageItem
      const { fanId: fanSenderId, pageId: fanPageId } = fan
      // debugger
      const message = fakeref.current.find(item => {
        if (item['mid']) {
          return item['mid'] === messageItem.mid
        } else {
          return undefined
        }
      })

      if (!message) {
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
        vibrateS()
      }
    })

    wsio.on('SEND_MSG_RESPONSE', (data) => {
      const { msg = '', status, uuid = '', mid = '', senderId } = data
      // 收到的状态为3的时候，比状态时间戳小的信息全部改为已读
      console.log(data)
      if (mid !== '') {
        const sendText = fakeref.current.find(item => item.uuid === uuid)
        if (sendText) {
          sendText.status = status
          sendText.errorText = msg
          sendText.mid = mid
        }
      }else{
        if (senderId === fan.fanId && status === 3) {
          const watermark = data.watermark
          fakeref.current.forEach(item => {
            if (item.timestamp <= watermark) {
              item.status = 3
            }
          })
        }
      }
      dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
    })
  }
  // 获取历史记录
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
        tobottom()
      }
    }).finally(() => {
      setInitLoading(false)
    })
  }
  // 获取更多历史记录
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
      const id = `msg${hisref.current[len].uuid}`
      setCurMsg(id)
    }).finally(() => {
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

    wsio.emit('SEND_MSG', socketParams)
    tobottom()
    setIsFocus(true)
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
      const type = getFileType(originType) === 'video' || getFileType(originType) === 'radio'
        ? 'media' : getFileType(originType)
      originType = type === 'media' ? getFileType(getsuffix(url)) : getsuffix(url)
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
        type, // 定义的类型，例如文件被定义为 file，mp3 4 会被定义为 media
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
  // 动态组件
  const msgComponent = (item, idx) => {
    switch (item.type) {
      case 'text':
        return <TextMsg ref={childref} msgItem={item}></TextMsg>
      case 'fallback':
        return <FallBackMsg ref={childref} msgItem={item}></FallBackMsg>
      case 'image':
        return <ImgMsg ref={childref} msgItem={item} fan={fan}></ImgMsg>
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
  // 插入标签
  const setemoji = (emoji) => {
    const result = setInput('msgInput', emoji, cursorref.current)
    hideKb()//隐藏键盘
    setMessage(result)//input赋值
  }
  // 插入快捷回复
  const setReply = (reply) => {
    const text = reply.content
    const result = setInput('msgInput', text, cursorref.current)
    reply.imgs.length > 0 ? setReplyImg(reply.imgs) : ''
    setMessage(result)
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
  //关闭快捷回复图片
  const closeReplyImg = (i) => {
    const arr = replyImg.slice(0, i).concat(replyImg.slice(i + 1, replyImg.length))
    console.log(arr)
    setReplyImg(arr)
    if (arr.length === 0) {
      setTimeout(() => {
        restPage()
      }, 100);
    }
  }
  // 选择工具
  const clickTool = (id) => {
    restPage()
    if (id === 0) {
      setShowReply(true)
    }
    if (id === 1) {
      sendImg()
    }
    if (id === 2) {
      sendFile()
    }
    if (id === 3) {
      setTempOrder('')
      NavTo(`/pages/order/index?type=0`)
    }
    if (id === 4) {
      setShowFlow(true)
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
  }
  // 点击表情icon
  const clickEmojiIcon = () => {
    setFoolerpb(0)
    setCurMsg('')
    !showemoji ? setstyle(diffHeight + 200) : ''
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
    !showtools ? setstyle(diffHeight + 200) : ''
    hideKb()
    setShowTools(true)
    setShowEmoji(false)
    setShowReply(false)
    setShowFlow(false)
    setTimeout(() => {
      tobottom()
    }, 0);
  }
  return (
    <View className='live-chat' >
      <ChatHeader ref={childref} fan={fan}></ChatHeader>
      <AtActivityIndicator isOpened={initLoading} size={36} mode='center'></AtActivityIndicator>
      <ScrollView
        scrollY
        className='msgview'
        style={msgViewStyle}
        scrollIntoView={curMsg}
        upperThreshold={20}
        onScrollToUpper={morehistorymsg}
        onClick={closeModal}>
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

      <View className={`fooler`} style={{ height: '54px', bottom: inputbot + 'px', paddingBottom: foolerpb + 'px' }}>
        {/* 左边工具栏 */}
        <View className='left'>
          <View className='emoj' onClick={clickEmojiIcon}>
            <AtIcon prefixClass='icon' value='smile' color='#666' size='28' className='alicon'></AtIcon>
          </View>
          <View className='more' onClick={clickToolsiIcon}>
            <AtIcon prefixClass='icon' value='add-circle' color='#666' size='28' className='alicon'></AtIcon>
            {showreply ? <QuickReply ref={childref} pageId={fan.pageId} handleClick={setReply}></QuickReply> : ''}
            {showflow ? <SendFlow ref={childref} handleClick={sendFlow}></SendFlow> : ''}
            {replyImg.length > 0 ? <ReplyImg ref={childref} imgs={replyImg} handleClick={closeReplyImg}></ReplyImg> : ''}
          </View>
        </View>
        {/* 输入发送消息 */}
        <Input
          id='msgInput'
          className='msginput'
          adjustPosition={false}
          value={message}
          onInput={inputMsg}
          onFocus={msgInputFocus}
          onBlur={msgInputBlur}
          selectionStart={pos}
          selectionEnd={pos}
          maxlength={2000}
          confirmType='send'
          onConfirm={sendMsg}
          confirmHold={true}
          holdKeyboard={true}
          onKeyboardHeightChange={kbChange}
        ></Input>
        {/* 发送按钮 */}
        <View className='searchbtn send' onClick={sendMsg}>
          发送
        </View>
      </View>
      <View className={`toolsbox`} style={{ height: showtools || showemoji ? '200px' : 0 }}>
        {showemoji ? <Emoji ref={childref} msg={message} handleClick={setemoji}></Emoji> : ''}
        {showtools ? <Tools ref={childref} handleClick={clickTool}></Tools> : ''}
      </View>
    </View>
  );
};

export default observer(LiveChat);
