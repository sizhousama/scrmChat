import React, { useRef, useState, useReducer } from "react";
import AddFanTag from '@/components/addFanTag'
import { View, Image, Text } from "@tarojs/components";
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { observer } from 'mobx-react';
import { imgUrl } from "@/servers/baseUrl";
import { useFanStore, useOrderStore, useUserStore } from '@/store';
import { NavTo, Toast, DecryptData } from '@/utils/index'
import { typeCashOut, typeOrderS } from '@/utils/filter'
import { AtActivityIndicator, AtAvatar, AtInput } from 'taro-ui'
import { messengerFanTags, getMessengerFanInfo,updateMessengerFanInfo,addMessengerFanTag,delMessengerFanTag } from '@/api/messenger/fan'
import { waFanTags, getWaFanInfo,updateWaFanInfo,addWaFanTag,delWaFanTag } from '@/api/wa/fan'
import { insFanTags, getInsFanInfo,updateInsFanInfo,addInsFanTag,delInsFanTag } from '@/api/ins/fan'
import { orderList } from '@/api/order'
import { Base64 } from "js-base64";
import "./index.scss";


const initState = {
  fanOrderList: [],
  fanTagsList: []
}
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'orders':
      return {
        ...state,
        fanOrderList: action.payload.orders
      }
    case 'tags':
      return {
        ...state,
        fanTagsList: action.payload.tags
      }
    default:
      return state
  }
}
const FanInfo = () => {
  const childref = useRef();
  const { fan, setFan } = useFanStore()
  const { type, themeColor } = useUserStore()
  const { setTempOrder } = useOrderStore()
  const [amazinfo, setAmazInfo] = useState<any>([])
  const [plink,setPlink] = useState('')
  const [state, dispatch] = useReducer(stateReducer, initState)
  const [pfloading, setPfloading] = useState(false)
  const [orderloading, setOrderLoading] = useState(false)
  const [tagloading, setTagLoading] = useState(false)
  const [more, setMore] = useState(false)
  const [fanDetail, setFanDetail] = useState<any>({})
  const [showadd, setShowadd] = useState(false)
  const [gochat, setGochat] = useState(false)
  const [error, setError] = useState(false)
  const { fanOrderList, fanTagsList } = state

  const tagStyle = () => {
    switch(type){
      case 'messenger': return { background: '#eef1fa', color: themeColor }
      case 'whatsapp': return { background: '#e7f8f4', color: themeColor }
      case 'ins': return { background: '#f8eef5', color: themeColor }
      default: return { background: '#d0dbfc', color: themeColor }
    }
  }

  const params = () => {
    const { pageId, fanId, userMd5,whatsappAccountId, whatsappUserId, instagramAccountId, instagramUserId } = fan
    switch(type){
      case 'messenger': return { pageId,senderId:fanId,userMd5 }
      case 'whatsapp': return { whatsappAccountId,whatsappUserId, senderId:whatsappUserId }
      case 'ins': return { instagramAccountId,instagramUserId, senderId:instagramUserId  }
      default: return { pageId,senderId:fanId,userMd5 }
    }
  }

  const fanTags = (data) =>{
    switch(type){
      case 'messenger': return messengerFanTags(data)
      case 'whatsapp': return waFanTags(data)
      case 'ins': return insFanTags(data)
      default: return messengerFanTags(data)
    }
  }

  const getFanInfo = (data) =>{
    switch(type){
      case 'messenger': return getMessengerFanInfo(data)
      case 'whatsapp': return getWaFanInfo(data)
      case 'ins': return getInsFanInfo(data)
      default: return getMessengerFanInfo(data)
    }
  }

  const updateFanInfo = (data) =>{
    switch(type){
      case 'messenger': return updateMessengerFanInfo(data)
      case 'whatsapp': return updateWaFanInfo(data)
      case 'ins': return updateInsFanInfo(data)
      default: return updateMessengerFanInfo(data)
    }
  }

  const addFanTag = (data) =>{
    switch(type){
      case 'messenger': return addMessengerFanTag(data)
      case 'whatsapp': return addWaFanTag(data)
      case 'ins': return addInsFanTag(data)
      default: return addMessengerFanTag(data)
    }
  }

  const delFanTag = (data) =>{
    switch(type){
      case 'messenger': return delMessengerFanTag(data)
      case 'whatsapp': return delWaFanTag(data)
      case 'ins': return delInsFanTag(data)
      default: return delMessengerFanTag(data)
    }
  }

  const amazonRegdate = (regdate) => {
    const types = {
      'reg_date_less_than_three_months': '三个月以内',
      'reg_date_within_three_to_six_months': '三到六个月',
      'reg_date_within_six_to_twelve_months': '六到十二个月',
      'reg_date_within_twelve_to_eighteen_months': '十二到十八个月',
      'reg_date_more_than_eighteen_months': '十八个月以上'
    }
    return types[regdate]
  }

  const getFanDetail = async () => {
    try{
      const { data } = await getFanInfo(params())
      const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
      setFanDetail(rawdata)
      if (rawdata.amazonProfile) {
        const arr = [
          {
            label: '最早评论时间：',
            value: amazonRegdate(rawdata.regdate)
          },
          {
            label: '介绍：',
            value: rawdata.amazonAbout
          },
          {
            label: 'Review排名：',
            value: rawdata.ranking
          },
          {
            label: 'Helpful Vote数：',
            value: rawdata.validCount
          },
          {
            label: '当前Review总数：',
            value: rawdata.reviewCount
          },
        ]
        setAmazInfo(arr)  
      }
    } finally {
      setPfloading(false)
    }
  }

  const getOrders = async () => {
    setOrderLoading(true)
    await orderList(params()).then(res => {
      const { data } = res
      dispatch({ type: 'orders', payload: { orders: data.records } })
      setOrderLoading(false)
    })
  }

  const getTags = async () => {
    setTagLoading(true)
    await fanTags(params()).then(res => {
      const { data } = res
      dispatch({ type: 'tags', payload: { tags: data || [] } })
      setTagLoading(false)
    })
  }


  const handleOrder = (e) => {
    setTempOrder('')
    NavTo(`/pages/order/index?type=${e.currentTarget.dataset.type}&id=${e.currentTarget.dataset.id}`)
  }

  const addtag = (tag) => {
    let tagForm: any = {}
    if(type === 'messenger') {
      tagForm = {
        pageId: fanDetail.pageId,
        senderIds: [fanDetail.senderId],
        tagIds: [tag.id],
        tagName: tag.tag
      }
    }
    if(type === 'whatsapp'){
      tagForm = {
        tagsList: [{id: tag.id, tag: tag.tag}],
        whatsappUserList:[params()]
      }
    }
    if(type === 'ins'){
      tagForm = {
        tagsList: [{id: tag.id, tag: tag.tag}],
        instagramUserList:[params()]
      }
    }
    addFanTag(tagForm).then(res => {
      if (res) {
        setShowadd(false)
        Toast('添加成功！', 'none')
        getTags()
      }
    })
  }

  const deltag = (e) => {
    const item = e.currentTarget.dataset.item
    Taro.showModal({
      title: '',
      content: `确认删除标签'${item.tag}'？`,
      success(res) {
        if (res.confirm) {
          let tagForm: any = {}
          if(type === 'messenger') {
            tagForm = {
              pageId: fanDetail.pageId,
              senderIds: [fanDetail.senderId],
              tagIds: [item.id]
            }
          }
          if(type === 'whatsapp'){
            tagForm = {
              tagsList: [{id: item.id, tag: item.tag}],
              whatsappUserList:[params()]
            }
          }
          if(type === 'ins'){
            tagForm = {
              tagsList: [{id: item.id, tag: item.tag}],
              instagramUserList:[params()]
            }
          }
          delFanTag(tagForm).then(() => {
            Toast('删除成功！', 'none')
            getTags()
          })
        }
      }
    })
  }

  const upInfo = async () => {
    setPfloading(true)
    await updateFanInfo({ ...params(), amazonProfile: plink })
    getFanDetail()
  }

  const fanHeader = () => {
    if(type === 'messenger') return <Image src={`${imgUrl()}/header/${fanDetail.pageId}/${fanDetail.senderId}.jpg`}></Image>
    if(type === 'whatsapp') return <AtAvatar size='large' text={fanDetail.username}></AtAvatar>
    if(type === 'ins') return (
      !error
      ? <Image
          src={`${imgUrl()}/instagram/header/${fanDetail.instagramAccountId}/${fanDetail.instagramUserId}.jpg`}
          onError={()=>setError(true)}
      ></Image>
      : <AtAvatar circle text={fanDetail.username}></AtAvatar>
    )
  }

  const fanInfo = () => {
    if(type === 'messenger'){
      return (
        <View className='info'>
          <View className='name'>
           <Text className='fanname break'>{fanDetail.facebookName}</Text>
            {
              fanDetail.gender === 'male' ?
                <View className='icon icon-male'></View>
                : <View className='icon icon-female'></View>
            }
          </View>
          <Text className='pid break'>主页：{fanDetail.pageName}</Text>
          <Text className='pid break'>用户Id：{fanDetail.senderId}</Text>
        </View>
      )
    }
    if(type === 'whatsapp'){ 
      return (
        <View className='info'>
          <View className='name'>
            <Text className='fanname break'>{fanDetail.username}</Text>
          </View>
          <Text className='pid break'>手机：{fanDetail.whatsappUserIdShow}</Text>
        </View>
      )
    }
    if(type === 'ins'){ 
      return (
        <View className='info'>
          <View className='name'>
            <Text className='fanname break'>{fanDetail.username}</Text>
          </View>
          <Text className='pid break'>主页：{fanDetail.instagramAccountName}</Text>
        </View>
      )
    }
  }

  const goChat = () => {
    if(type === 'messenger'){
      const {facebookName,pageName,pageId,senderId,userMd5} = fanDetail
      const obj:any = {fanName:facebookName,pageName,pageId,fanId:senderId,senderId,userMd5}
      setFan(obj)
      NavTo('/pages/liveChat/index')
    }
    if(type === 'whatsapp'){
      const {username,whatsappAccountUserId,whatsappAccountId,whatsappUserId} = fanDetail
      const obj:any = {whatsappUserName:username,whatsappAccountUserId,whatsappAccountId,whatsappUserId}
      setFan(obj)
      NavTo('/pages/liveChatWa/index')
    }
    if(type === 'ins'){
      const {username,instagramAccountUserId,instagramAccountId,instagramUserId} = fanDetail
      const obj:any = {instagramUserName:username,instagramAccountUserId,instagramAccountId,instagramUserId}
      setFan(obj)
      NavTo('/pages/liveChatIns/index')
    }  
  }

  useDidShow(() => {
    const router = getCurrentInstance().router
    if(router?.params.from === 'user'){
      setGochat(true)
    }
    getFanDetail()
    getTags()
    getOrders()
  })


  return (
    <View>
      <View className='faninfobox'>
        <View className='sec-title'>个人信息：</View>
        <View className='faninfo'>
          <View className='avatar'>
            {fanHeader()}
          </View>
          {fanInfo()}
        </View>
        {
          gochat && 
          <View className='gochat' onClick={goChat}>
            <View className='icon icon-msg'></View>
            <View>发起聊天</View>
          </View>
        }
        <View className='sec-title fx'>
          <View className='fx1'>亚马逊信息：</View>
            <View className='sec-icon fx1' >
          </View>
        </View>
        <View className='amazinfo'>
          {
            amazinfo.length > 0 ?
              <View className='infobox'>
                {
                  amazinfo.map((item, index) => {
                    return (
                      <View className='fx h_88 bb_e' key={index}>
                        <View className='fx1'>{item.label}</View>
                        <View className='fx2'>
                          <Text className='content break'>{item.value}</Text>
                        </View>
                      </View>
                    )
                  })
                }
              </View>
              : <View className='nodata'>
                {
                  pfloading ?
                    <AtActivityIndicator mode='center' isOpened={pfloading}></AtActivityIndicator>
                    :
                    <AtInput
                      name='profileInput'
                      value={plink}
                      onChange={(v:any)=>setPlink(v)}
                      onConfirm={upInfo}
                      placeholder='请输Amazing Profile链接'
                    ></AtInput>
                }
              </View>
          }
        </View>
        <View className='sec-title fx'>
          <View className=' fx1'>标签信息：</View>
          <View className='sec-icon fx1' onClick={() => {setShowadd(true);setPfloading(true)}}>
            <View className='at-icon at-icon-add-circle'></View>
          </View>
        </View>
        <View className='taglist'>
          {
            fanTagsList.length > 0 ?
              fanTagsList.map((item, index) => {
                return (
                  <Text key={index} className='tag' onClick={deltag} data-item={item} style={tagStyle()}>
                    {item.tag}
                  </Text>
                )
              })
              : <View className='nodata'>
                {
                  tagloading ?
                    <AtActivityIndicator mode='center' isOpened={tagloading}></AtActivityIndicator>
                    : '暂无标签信息'
                }
              </View>
          }
        </View>
        <View className='sec-title fx'>
          <View className=' fx1'>订单信息：</View>
          <View className='sec-icon fx1' onClick={handleOrder} data-type='0' data-id=''>
            <View className='at-icon at-icon-add-circle'></View>
          </View>
        </View>
        <View className={`orderlist ${!more && fanOrderList.length > 3 ? 'seemore' : ''}`}>
          {
            fanOrderList.length > 0 ?
              fanOrderList.map((item, index) => {
                return (
                  <View key={index} className='order' onClick={handleOrder} data-type='1' data-id={item.id}>
                    <View className='top'>
                      <View className='left'>
                        <Text className='name break'>{item.scalpingProductName}</Text>
                      </View>
                      <View className='right'>
                        <Text >{item.orderImageDate}</Text>
                      </View>
                    </View>
                    <View className='bot'>
                      <View className='left'>
                        <Text className='status'>{typeOrderS(item.status)} {typeCashOut(item.isCashout)}</Text>
                      </View>
                      <View className='right'>
                        <Text className='ordernum'>{item.orderNumber}</Text>
                      </View>
                    </View>
                  </View>
                )
              })
              : <View className='nodata'>
                {
                  orderloading ?
                    <AtActivityIndicator mode='center' isOpened={orderloading}></AtActivityIndicator>
                    : '暂无订单数据'
                }
              </View>
          }
        </View>
        {
          fanOrderList.length > 3 && <View className='checkmore' onClick={()=>setMore(!more)}>{more ? '收起' : '查看更多'}</View>
        }
        { showadd && <AddFanTag close={() => {setShowadd(false);setPfloading(false)}} add={addtag}></AddFanTag> }
      </View>
    </View>
  );
};

export default observer(FanInfo);

