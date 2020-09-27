import React, { useRef, useState, useEffect, useReducer } from "react";
import NavBar from "@/components/navBar";
import AddFanTag from '@/components/addFanTag'
import { View, Image, Text } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useNavStore, useFanStore } from '@/store';
import { previewImg, NavTo, Toast } from '@/utils/index'
import { typeCashOut, typeOrderS } from '@/utils/filter'
import { fanOrders, fanTags, addFanTag,getFanInfo,updateFanInfo, delFanTag } from '@/api/fan'
import { AtActivityIndicator,AtInput } from 'taro-ui'
import Taro from '@tarojs/taro'
import "./index.scss";
import { imgUrl } from "@/servers/baseUrl";

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
  const { navH } = useNavStore();
  const { fan, setFan } = useFanStore()
  const [orderloading, setOrderLoading] = useState(false)
  const [tagloading, setTagLoading] = useState(false)
  const [more, setMore] = useState(false)
  const [showadd, setShowadd] = useState(false)
  const [amazinfo, setAmazInfo] = useState<any>([])
  const [plink,setPlink] = useState('')
  const [pfloading, setPfloading] = useState(false)
  const [state, dispatch] = useReducer(stateReducer, initState)
  const { fanOrderList, fanTagsList } = state
  const avatar = `${imgUrl()}/header/${fan.pageId}/${fan.senderId}.jpg`
  const style = {
    marginTop: navH - 2 + 'px'
  }
  useEffect(() => {
    console.log(fan)
    getfandetail()
    getorders()
    gettags()
  }, [])
  const amazonRegdate = (regdate) => {
    const type = {
      'reg_date_less_than_three_months': '三个月以内',
      'reg_date_within_three_to_six_months': '三到六个月',
      'reg_date_within_six_to_twelve_months': '六到十二个月',
      'reg_date_within_twelve_to_eighteen_months': '十二到十八个月',
      'reg_date_more_than_eighteen_months': '十八个月以上'
    }
    return type[regdate]
  }
  const getfandetail = async () => {
    const { pageId, senderId } = fan
    const p = { pageId, fanId:senderId }
    await getFanInfo(p).then(res => {
      if (res.data.amazonProfile) {
        const arr = [
          {
            label: '最早评论时间：',
            value: amazonRegdate(res.data.regdate)
          },
          {
            label: '介绍：',
            value: res.data.amazonAbout
          },
          {
            label: 'Review排名：',
            value: res.data.ranking
          },
          {
            label: 'Helpful Vote数：',
            value: res.data.validCount
          },
          {
            label: '当前Review总数：',
            value: res.data.reviewCount
          },
        ]
        setAmazInfo(arr)  
      }
      setPfloading(false)
    })
  }
  const viewHead = () => {
    previewImg(avatar)
  }
  const goChat = () => {
    const obj = {
      facebookName: fan.facebookName,
      pageId: fan.pageId,
      fanId: fan.senderId,
      senderId: fan.senderId,
      gender: fan.gender,
      adId: fan.adId,
      pageName: fan.pageName,
      fanName: fan.facebookName,
      phone: fan.phone
    }
    setFan(obj)
    NavTo('/pages/liveChat/index')
  }
  const getorders = async () => {
    setOrderLoading(true)
    await fanOrders({ senderId: fan.senderId, userMd5: fan.userMd5 }).then(res => {
      const { data } = res
      dispatch({ type: 'orders', payload: { orders: data.records } })

      setOrderLoading(false)
    })
  }
  const gettags = async () => {
    setTagLoading(true)
    const p = {
      senderId: fan.senderId,
      pageId: fan.pageId
    }
    await fanTags(p).then(res => {
      const { data } = res
      !data ? dispatch({ type: 'tags', payload: { tags: [] } })
        : dispatch({ type: 'tags', payload: { tags: data } })

      setTagLoading(false)
    })
  }
  const seemore = () => {
    setMore(!more)
  }
  const addtag = (tag) => {
    const tagForm: any = {
      pageId: fan.pageId,
      senderIds: [fan.senderId],
      tagIds: [],
      tagName: tag.tag
    }
    tag.id !== null ? tagForm.tagIds.push(tag.id) : ''
    addFanTag(tagForm).then(res => {
      if (res) {
        setShowadd(false)
        Toast('添加成功！', 'none')
        gettags()
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
          const tagForm: any = {
            pageId: fan.pageId,
            senderIds: [fan.senderId],
            tagIds: [item.id],
          }
          delFanTag(tagForm).then(res => {
            Toast('删除成功！', 'none')
            gettags()
          })
        }
      }
    })
  }
  const inputChange=(v)=>{
    setPlink(v)
  }
  const upInfo = ()=>{
    const { pageId, senderId } = fan
    const p = { pageId, fanId:senderId,amazonProfile:plink }
    setPfloading(true)
    updateFanInfo(p).then(res=>{
      if(res){
        getfandetail()
      }
    })
  }
  return (
    <View className='fanbody'>
      <NavBar title='粉丝信息' />
      <View className='faninfo' style={style}>
        <View className='avatar'>
          <Image src={avatar} onClick={viewHead}></Image>
        </View>
        <View className='info'>
          <View className='name'>
            <Text className='fanname break'>{fan.facebookName}</Text>
            {
              fan.gender === 'male' ?
                <View className='icon icon-male'></View>
                : <View className='icon icon-female'></View>
            }
          </View>
          <Text className='pid break'>主页：{fan.pageName}</Text>
          <Text className='phone break'>Paypal：{fan.payAccount}</Text>
        </View>
      </View>
      <View className='btn' onClick={goChat}>
        <View className='icon icon-msg'></View>
        <View>发起聊天</View>
      </View>
      <View className='faninfobox'>
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
                      <View className='fx h_100 bb_e' key={index}>
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
                      onChange={inputChange}
                      onConfirm={upInfo}
                      placeholder='请输Amazing Profile链接'
                    ></AtInput>
                }
              </View>
          }
        </View>
        <View className='sec-title fx'>
          <View className=' fx1'>订单信息：</View>
          <View className='sec-icon fx1'>
            {/* <View className='at-icon at-icon-file-new'></View> */}
          </View>
        </View>
        <View className={`orderlist ${!more && fanOrderList.length > 3 ? 'seemore' : ''}`}>
          {
            fanOrderList.length > 0 ?
              fanOrderList.map((item, index) => {
                return (
                  <View key={index} className='order'>
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
          fanOrderList.length > 3 ?
            <View className='checkmore' onClick={seemore}>{more ? '收起' : '查看更多'}</View>
            : ''
        }
        <View className='sec-title fx'>
          <View className=' fx1'>标签信息：</View>
          <View className='sec-icon fx1' onClick={() => {setShowadd(true);setPfloading(true)}}>
            <View className='at-icon at-icon-add'></View>
          </View>
        </View>
        <View className='taglist'>
          {
            fanTagsList.length > 0 ?
              fanTagsList.map((item, index) => {
                return (
                  <Text key={index} className='tag' onClick={deltag} data-item={item} >
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
        {
          showadd ? <AddFanTag close={() => {setShowadd(false);setPfloading(false)}} add={addtag}></AddFanTag> : ''
        }
      </View>
    </View>
  );
};

export default observer(FanInfo);
