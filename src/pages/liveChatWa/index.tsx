import React, { useRef, useState, useEffect, useReducer, useCallback } from "react";
import ChatHeader from "@/components/chatHeader";
import UserAvatar from '@/components/userAvatar';
import Emoji from '@/components/emoji'
import Tools from '@/components/chatTools'
import QuickReply from '@/components/quickReply'
import SendFlow from '@/components/sendFlow'
import MsgTemp from '@/components/msgTemp'
// 消息体组件
import TextMsg from '@/components/msgView/textMsg';
import ImgMsg from '@/components/msgView/imgMsg';
import FileMsg from '@/components/msgView/fileMsg';
import MediaMsg from '@/components/msgView/mediaMsg';
import OtherMsg from '@/components/msgView/otherMsg';
import { View, Text, ScrollView, Textarea } from "@tarojs/components";
import { AtIcon, AtActivityIndicator } from 'taro-ui'
import { getSysInfo, genUuid, setInput, chooseImg, getsuffix, getFileType, chooseMsgFile, hideKb, isNeedAddH, NavTo ,DecryptData } from '@/utils/index'
import { formatWaMsgStatus } from '@/utils/filter'
import { getWaHistoryMsg, sendWaFlow, sendWaReply } from '@/api/wa'
import { getWaAccount, getWaFanInfo } from '@/api/wa/fan'
import { translateWaMsg } from "@/api/utils";
import { observer } from 'mobx-react';
import { useFanStore, useWsioStore, useUserStore, useOrderStore } from '@/store';
import { parseWaMsg } from '@/utils/parseWa'
import { formatChatTime } from "@/utils/time";
import { useDidShow } from "@tarojs/taro";
import { Base64 } from "js-base64";
import "./index.scss";

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

  const { fan } = useFanStore()
  const { type, userInfo, themeColor, messageCount } = useUserStore()
  const { setTempOrder } = useOrderStore()
  const { wsio } = useWsioStore()
  const [pos, setPos] = useState(0)
  const [message, setMessage] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [showemoji, setShowEmoji] = useState(false)
  const [showtools, setShowTools] = useState(false)
  const [showreply, setShowReply] = useState(false)
  const [showflow, setShowFlow] = useState(false)
  const [showMsgTemp, setShowMsgTemp] = useState(false)
  const [showTagMsg, setShowTagMsg] = useState(false)
  const [state, dispatch] = useReducer(listReducer, initState)
  const { historyList, fakes } = state
  const [curMsg, setCurMsg] = useState('')
  const [loading, setLoading] = useState(false) //加载更多...
  const [initLoading, setInitLoading] = useState(false)
  const [hasmore, setHasmore] = useState(false) //是否有更多历史记录
  const [waAccount, setWaAccount] = useState<any>('')
  const [hisPar, setHisPar] = useState({
    page: 1,
    size: 15,
    whatsappAccountId: fan.whatsappAccountId,
    whatsappUserId: fan.whatsappUserId
  })
  const needH = isNeedAddH()
  const needh = needH ? 32 : 0
  const foolerref = useRef(54)
  const diffHeight = barHeight + foolerref.current + 92  //176 + 2 2px为border高度
  
  const [msgViewStyle, setMsgViewSyle] = useState({
    height: `calc(100vh - ${diffHeight + needh}px)`
  })
  const [inputbot, setInputBot] = useState(0)
  const [foolerpb, setFoolerpb] = useState(needh)

  const getUser = useCallback(async () => {
    const { whatsappAccountId, whatsappUserId } = fan
    const p = { whatsappAccountId, whatsappUserId }
    const { data } = await getWaFanInfo(p)
    const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
    const { lastSendMsgTime } = rawdata
    if (lastSendMsgTime) {
      try {
        const lastSendTime = new Date(lastSendMsgTime.replace(/-/g, "/")).getTime()
        const now = new Date().getTime()
        if (now - lastSendTime > 24 * 60 * 60 * 1000) {
          setShowTagMsg(true)
        }
      } catch (e) {
        setShowTagMsg(true)
      }
    } else { 
      setShowTagMsg(true)
    }
  },[fan])
  
  // socket事件
  const initSocket = useCallback(() => {
    wsio.on('WHATSAPP_SEND_MSG', (data) => {
      const pdata = JSON.parse(data)
      const isServe = !Object.prototype.hasOwnProperty.call(pdata, 'contacts')
      const messageItem:any = { ...parseWaMsg(data, isServe) }
      messageItem.isServe = isServe
      const msg = fakeref.current.find(item => {
        if (item.uuid) {
          return item.uuid === messageItem.uuid
        } else {
          return undefined
        }
      })
      const { whatsappUserId: msguid, whatsappAccountId: msgwauid } = messageItem
      const { whatsappUserId, whatsappAccountId: fpwauid } = fan
      if (!msg && whatsappUserId === msguid && msgwauid === fpwauid) {
        var msgStatus = 'sent'
        if (isServe) {
          messageItem.userName = useUserStore.name
          messageItem.timestamp = Date.now()
          messageItem.fake = true
          if (!Object.prototype.hasOwnProperty.call(messageItem, 'errorMsg')) {
            messageItem.errorMsg = ''
            msgStatus = 'sent'
          } else {
            msgStatus = messageItem.status
          }
        }
        messageItem.status = msgStatus
        if (!Object.prototype.hasOwnProperty.call(messageItem, 'translateText')) {
          messageItem.translateText = null
        }
        fakeref.current = [...fakeref.current, messageItem]
        dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
        tobottom()
      }
    })

    wsio.on('WHATSAPP_SEND_MSG_RESPONSE', (data) => {
      const da = JSON.parse(data)
      const { status, id, uuid, timestamp, errors } = da.statuses[0]
      let code = ''
      let title = ''
      if (Object.prototype.hasOwnProperty.call(da.statuses[0], 'errors')) {
        code = errors[0].code
        title = errors[0].title
      }
      let senditem
      if (uuid !== undefined) {
        senditem = fakeref.current.find((item) => item.uuid === uuid)
      } else {
        senditem = fakeref.current.find((item) => item.mid === id)
      }
      if (status === 'read') {
        fakeref.current.forEach((item) => {
          if (item.timestamp <= timestamp * 1000) {
            item.status = 'read'
          }
        })
      }
      if (senditem) {
        senditem.status = status
        senditem.mid = id
        if (title) senditem.errorMsg = title
        if (code) senditem.code = code
      }
      dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
    })
  },[fan, wsio])
  // 获取历史记录
  const historymsg = useCallback(async () => {
    setInitLoading(true)
    await getWaHistoryMsg(hisPar).then(res => {
      const { data } = res
      const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
      const hm = rawdata.length > 0
      setHasmore(hm)
      let isbreak = false // 判断返回的数据
      let hisarr = hisref.current
      console.log(rawdata)
      rawdata.forEach((item,i) => {
        if (isbreak || item.msg === null) return
        if (item.whatsappUserId !== hisPar.whatsappUserId) {
          isbreak = true
          return
        }
        if(!item.msg) return
        const { userId, translateText, status } = item
        const isServe = item.senderId === item.whatsappAccountUserId
        const parsedItem = JSON.parse(item.msg)
        let regroupItem: any = { ...parseWaMsg(parsedItem, isServe) }
        regroupItem.isServe = isServe
        regroupItem.status = status
        regroupItem.userId = userId
        regroupItem.showTools = false
        regroupItem.uuid = genUuid()
        regroupItem.translateText = translateText
        if (isServe) {
          if (item.error) regroupItem.errorMsg = item.error
          regroupItem.senderId = item.senderId
          regroupItem.timestamp = item.timestamp
          regroupItem.whatsappAccountUserId = item.whatsappAccountUserId
        }
        if (regroupItem && regroupItem.timestamp) {
          if (regroupItem.type !== '') {
            hisarr.push(regroupItem)
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
  // 获取更多历史记录
  const morehistorymsg = async () => {
    if (!hasmore) {
      return
    }
    let params = hisPar
    params.page++
    setHisPar(params)
    setLoading(true)
    await getWaHistoryMsg(hisPar).then(res => {
      const { data } = res
      const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
      const hm = rawdata.length > 0
      setHasmore(hm)
      let hisarr = hisref.current
      const len = rawdata.length
      rawdata.forEach(item => {
        if (!item.msg) return
        const { userId, translateText, status } = item
        const isServe = item.senderId === item.whatsappAccountUserId
        const parsedItem = JSON.parse(item.msg)
        let regroupItem: any = { ...parseWaMsg(parsedItem, isServe) }
        regroupItem.isServe = isServe
        regroupItem.status = status
        regroupItem.userId = userId
        regroupItem.showTools = false
        regroupItem.uuid = genUuid()
        regroupItem.translateText = translateText
        if (isServe) {
          if (item.error) regroupItem.errorMsg = item.error
          regroupItem.senderId = item.senderId
          regroupItem.timestamp = item.timestamp
          regroupItem.whatsappAccountUserId = item.whatsappAccountUserId
        }
        if (regroupItem && regroupItem.timestamp) {
          if (regroupItem.type !== '') {
            hisarr.unshift(regroupItem)
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
    const { whatsappUserId, whatsappAccountId } = fan
    const socketParams = {
      uuid,
      userId: userInfo.userId,
      userName: userInfo.username,
      chatId: fan.chatId ? fan.chatId : '',
      msg,
      whatsappUserId,
      whatsappAccountId
    }
    wsio.emit('WHATSAPP_SEND_MSG', socketParams)
    // 假数据
    // TODO: 目前自制的假消息类型只有text
    const list = [...hisref.current, ...fakeref.current]
    const fakeText = {
      uuid,
      mid: '',
      type: 'text',
      userName: userInfo.username,
      text: msg,
      loading: true,
      isServe: true,
      errorMsg: '',
      timestamp: Date.now(),
      status: '',
      userId: userInfo.userId, // 用来显示假消息头像
      isTimeVisible: Date.now() - list[list.length - 1].timestamp > 300000
    }
    fakeref.current = [...fakeref.current, fakeText]

    dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
    setMessage('')
    foolerref.current = 54

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
    const { whatsappUserId, whatsappAccountId } = fan
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
        whatsappUserId,
        whatsappAccountId,
        files: [url],
        captions: [name]
      }
      const alllist = [...hisref.current, ...fakeref.current]
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
        isTimeVisible: Date.now() - alllist[alllist.length - 1].timestamp > 300000
      }
      fakeref.current = [...fakeref.current, fakeText]
      dispatch({ type: 'fakes', payload: { fakes: fakeref.current } })
      wsio.emit('WHATSAPP_SEND_MSG', socketParams)
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
    const {data} = await translateWaMsg({mid:msg.mid})
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
      case 'image':
        return <ImgMsg ref={childref} msgItem={item} fan={fan}></ImgMsg>
      case 'file':
        return <FileMsg ref={childref} msgItem={item}></FileMsg>
      case 'media':
        return <MediaMsg ref={childref} msgItem={item}></MediaMsg>
      default: return <OtherMsg ref={childref} msgItem={item}></OtherMsg>
    }
  }
  // 插入标签
  const setemoji = (emoji) => {
    const result = setInput('msgInput', emoji, cursorref.current)
    hideKb()//隐藏键盘
    setMessage(result)//input赋值
  }
  // 插入快捷回复
  const setReply = async (reply) => {
    const { whatsappAccountId, whatsappUserId } = fan
    const p = { whatsappAccountId, whatsappUserId , id: reply.id}
    await sendWaReply(p)
    hideKb()
    setShowReply(false)
    setTimeout(() => {
      restPage()
    }, 100);
  }
  //发流程
  const sendFlow = async (flow) => {
    const { whatsappUserId, whatsappAccountId } = fan
    const socketParams = {
      flowId: flow.id,
      whatsappAccountId: whatsappAccountId,
      whatsappUserId: whatsappUserId
    }
    await sendWaFlow(socketParams)
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

  const getAccount = async () =>{
    const { data } = await getWaAccount({id:Number(fan.whatsappAccountId)})
    setWaAccount(data)
    data.bindStatus === 'disabled' ? setDisabled(true) : setDisabled(false)
  }

  const msgContent = () => {
    if(messageCount.whatsAppUserCount >= messageCount.limit){
      return <View className='disabled'>会话数超过限制{messageCount.limit}！</View>
    }
    if(waAccount.status!==1){
      return <View className='disabled'>您的账号不在线，请重新登录账号！</View>
    }
    if(showTagMsg && ![3,5].includes(waAccount.type)){
      return (
        <View className='disabled'>
          超过24小时只能发送消息模板,请在电脑端操作！
          {/* <View className='searchbtn' style={{background:'#22AA88'}} onClick={()=>setShowMsgTemp(true)}>选择模板</View> */}
        </View>
      )
    }
    return (
      <View className='fooler-inner'>
        <View className='left'>
          <View className='emoj' onClick={clickEmojiIcon}>
            <AtIcon prefixClass='icon' value='smile' color='#666' size='26' className='alicon'></AtIcon>
          </View>
          <View className='more' onClick={clickToolsiIcon}>
            <AtIcon prefixClass='icon' value='add-circle' color='#666' size='26' className='alicon'></AtIcon>
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
            disabled={disabled}
          ></Textarea>
        </View>
        {/* 发送按钮 */}
        <View className='right'>
          <View className='searchbtn send' style={{background: themeColor}} onClick={sendMsg}>发送</View>
        </View>
      </View>
    )
  }

  useDidShow(() => {
    getAccount()  
  })

  useEffect(() => {
    initSocket()
    historymsg()
    type === 'whatsapp' && getUser()
  }, [fan, getUser, historymsg, initSocket, type])

  return (
    <View className='live-chat'>
      <ChatHeader ref={childref} fan={fan} handleClick={clickTopUserIcon}></ChatHeader>
      <AtActivityIndicator isOpened={initLoading} size={36} mode='center'></AtActivityIndicator>
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
            :<View className='topblock'></View>
        }
        {/* 历史消息 */}
        {
          historyList.map((msgitem, msgidx) => {
            return (
              <View className='msgitembox' key={msgidx} id={`msg${msgitem.uuid}`}>
                {(msgidx > 0 && (msgitem.timestamp - historyList[msgidx - 1].timestamp) >= 600000) && <View className='timeline'>{formatChatTime(msgitem.timestamp)}</View>}
                <View className={`history ${msgitem.isServe && 'reverse'}`} >
                  <View className={`history-content ${msgitem.isServe && 'reverse'}`}>
                    <UserAvatar ref={childref} msgItem={msgitem} fan={fan} accountHead={waAccount.icon} redom={msgitem.uuid}></UserAvatar>
                    {msgComponent(msgitem, msgidx)}
                    {msgitem.isServe &&
                    (msgitem.errorMsg
                    ?<Text className='msgstatus'>msgitem.errorMsg</Text>
                    :<Text className='msgstatus'>{formatWaMsgStatus(msgitem.status)}</Text>)}
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
                {fakeitem.isTimeVisible && <View className='timeline'>{formatChatTime(fakeitem.timestamp)}</View>}
                <View className={`history ${fakeitem.isServe && 'reverse'}`} >
                  <View className={`history-content ${fakeitem.isServe && 'reverse'}`}>
                    <UserAvatar ref={childref} msgItem={fakeitem} fan={fan} accountHead={waAccount.icon} redom={fakeitem.uuid}></UserAvatar>
                    {msgComponent(fakeitem, fakeidx)}
                    {fakeitem.isServe && fakeitem.status !== -1 && <Text className='msgstatus'>{formatWaMsgStatus(fakeitem.status)}</Text>}
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
      <View className='toolsbox' style={{ height: showtools || showemoji || showMsgTemp || showflow || showreply ? '200px' : 0 }}>
        {showemoji && <Emoji ref={childref} msg={message} handleClick={setemoji}></Emoji>}
        {showtools && <Tools ref={childref} handleClick={clickTool}></Tools>}
        {showflow && <SendFlow ref={childref} handleClick={sendFlow}></SendFlow>}
        {showreply && <QuickReply ref={childref} handleClick={setReply}></QuickReply>}
        {showMsgTemp && <MsgTemp ref={childref} fan={fan}></MsgTemp>}
      </View>
    </View>
  );
};

export default observer(LiveChat);
