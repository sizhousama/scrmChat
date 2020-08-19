import React, { useRef, useState, useEffect } from "react";
import ChatHeader from "@/components/chatHeader";
import UserAvatar from '@/components/userAvatar';
// 消息体组件
import TextMsg from '@/components/msgView/textMsg';
import ImgMsg from '@/components/msgView/imgMsg';
import SwiperMsg from '@/components/msgView/genericMsg';
import FileMsg from '@/components/msgView/fileMsg';
import NotifyMsg from '@/components/msgView/notifyMsg';
import MediaMsg from '@/components/msgView/mediaMsg';
import ButtonMsg from '@/components/msgView/buttonMsg';
import { View, ScrollView } from "@tarojs/components";
import { AtInput, AtIcon } from 'taro-ui'
import { getSysInfo } from '@/utils/index'
import { getHistoryMsg } from '@/api/chat'

import { parseMsg } from '@/utils/parse'
import "./index.scss";

interface RI {
  timestamp?: string | number,
  status?: number,
  type?: string
}

const LiveChat = () => {
  const childref = useRef()
  const barHeight = getSysInfo().statusBarHeight
  const [historyList, setHistory] = useState<any[]>([])
  const [fakes, setFakes] = useState<any[]>([])
  const [curMsg,setCurMsg] = useState('')
  var diffHeight = barHeight + 178 //176 + 2 2px为border高度
  var keybordHeight = 0 //键盘高度
  const msgViewStyle = {
    width: '100%',
    height: `calc(100vh - ${diffHeight}px)`
  }
  // 历史记录参数
  var hisPar = {
    page: 1,
    pageSize: 30,
    pageId: "102817707970237",
    senderId: "2730472630401161",
  }
  useEffect(() => {
    historymsg()
  }, [])
  const historymsg = async () => {
    await getHistoryMsg(hisPar).then(res => {
      const { data } = res
      let isbreak = false // 判断返回的数据
      let hisarr = historyList
      data.forEach(item => {
        if (isbreak || item.msg === null) return
        if (item.fanId !== hisPar.senderId) {
          isbreak = true
          return
        }
        const { delivery, read, userName } = item
        const parsedItem = JSON.parse(item.msg)
        const regroupItem: RI = { ...parseMsg(parsedItem) }
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
        setHistory(hisarr.slice())
        tobottom()
        console.log(historyList)
      }
    })
  }
  const tobottom = ()=>{
    const arr = [...historyList,...fakes]
    const cur = `msg${arr.length - 1}`
    setCurMsg(cur)
  }
  // 输入时
  const inputMsg = (v, e) => {

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
  }
  // 动态组件
  const msgComponent = (item) =>{
    switch(item.type){
      case 'text' : 
        return <TextMsg ref={childref} msgItem={item}></TextMsg>
      case 'image' : 
        return <ImgMsg ref={childref} msgItem={item}></ImgMsg>
      case 'postback' : 
        return <TextMsg ref={childref} msgItem={item}></TextMsg>
      case 'generic' : 
        return <SwiperMsg ref={childref} msgItem={item}></SwiperMsg>
      case 'file' : 
        return <FileMsg ref={childref} msgItem={item}></FileMsg>
      case 'notify' : 
        return <NotifyMsg ref={childref} msgItem={item}></NotifyMsg>
      case 'media' : 
        return <MediaMsg ref={childref} msgItem={item}></MediaMsg>
      case 'button' : 
        return <ButtonMsg ref={childref} msgItem={item}></ButtonMsg>
      default:break
    }
  }
  return (
    <View className='live-chat'>
      <ChatHeader ref={childref}></ChatHeader>
      <ScrollView scrollY className='msgview' style={msgViewStyle} scrollIntoView={curMsg}>
        <View className='topblock'></View>
        {/* 历史消息 */}
        {
          historyList.map((msgitem, msgidx) => {
            return (
              <View className={`history ${msgitem.isServe?'reverse':''}`} key={msgidx} id={`msg${msgidx}`}>
                <View className={`history-content ${msgitem.isServe?'reverse':''}`}>
                  <UserAvatar ref={childref} msgItem={msgitem}></UserAvatar>
                  {msgComponent(msgitem)}
                </View>
              </View>
            )
          })
        }

      </ScrollView>

      <View className='fooler' style={{ height: '44px', bottom: keybordHeight + 'px' }}>
        {/* 左边工具栏 */}
        <View className='left'>
          <View className='emoj'>
            <AtIcon prefixClass='icon' value='smile' color='#666' className='alicon'></AtIcon>
          </View>
          <View className='more'>
            <AtIcon prefixClass='icon' value='add-circle' color='#666' className='alicon'></AtIcon>
          </View>
        </View>
        {/* 输入发送消息 */}
        <AtInput
          name='msgInput'
          className='msginput'
          onChange={inputMsg}
          onFocus={msgInputFocus}
          onBlur={msgInputBlur}
        />
        {/* 发送按钮 */}
        <View className='searchbtn send'>
          发送
        </View>
      </View>
    </View>
  );
};

export default LiveChat;
