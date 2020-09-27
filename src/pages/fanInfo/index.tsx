import React, { useRef, useState, useEffect, useReducer } from "react";
import NavBar from "@/components/navBar";
import AddFanTag from '@/components/addFanTag'
import { View, Image, Text } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useNavStore, useFanStore, useOrderStore } from '@/store';
import { previewImg, NavTo, Toast } from '@/utils/index'
import { typeCashOut, typeOrderS } from '@/utils/filter'
import { AtActivityIndicator, AtInput } from 'taro-ui'
import Taro from '@tarojs/taro'
import { fanOrders, fanTags, getFanInfo,updateFanInfo, addFanTag, delFanTag } from '@/api/fan'
import "./index.scss";
import { imgUrl } from "@/servers/baseUrl";
import { useDidShow } from "@tarojs/taro";
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
  const { navH } = useNavStore();
  const { fan, setFan } = useFanStore()
  const { setTempOrder } = useOrderStore()
  const [fanInfo, setFanInfo] = useState<any>({})
  const [amazinfo, setAmazInfo] = useState<any>([])
  const [plink,setPlink] = useState('')
  const [state, dispatch] = useReducer(stateReducer, initState)
  const [pfloading, setPfloading] = useState(false)
  const [orderloading, setOrderLoading] = useState(false)
  const [tagloading, setTagLoading] = useState(false)
  const [more, setMore] = useState(false)
  const [gender, setGen] = useState('')
  const [showadd, setShowadd] = useState(false)
  const { fanOrderList, fanTagsList } = state
  const avatar = `${imgUrl()}/header/${fan.pageId}/${fan.fanId}.jpg`
  const style = {
    marginTop: navH + 'px'
  }
  useDidShow(() => {
    getorders()
  })
  useEffect(() => {
    getfandetail()
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
    const { pageId, fanId } = fan
    const p = { pageId, fanId }
    await getFanInfo(p).then(res => {
      setGen(res.data.gender)
      // setFanInfo(res.data)
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
  const getorders = async () => {
    setOrderLoading(true)
    await fanOrders({ senderId: fan.fanId, userMd5: fan.userMd5 }).then(res => {
      const { data } = res
      dispatch({ type: 'orders', payload: { orders: data.records } })
      setOrderLoading(false)
    })
  }
  const gettags = async () => {
    setTagLoading(true)
    const p = {
      senderId: fan.fanId,
      pageId: fan.pageId
    }
    await fanTags(p).then(res => {
      const { data } = res
      !data ? dispatch({ type: 'tags', payload: { tags: [] } })
        : dispatch({ type: 'tags', payload: { tags: data } })

      setTagLoading(false)
    })
  }
  const viewHead = () => {
    previewImg(avatar)
  }
  const seemore = () => {
    setMore(!more)
  }
  const handleOrder = (e) => {
    const type = e.currentTarget.dataset.type
    const id = e.currentTarget.dataset.id
    setTempOrder('')
    NavTo(`/pages/order/index?type=${type}&id=${id}`)
  }
  const addtag = (tag) => {
    const tagForm: any = {
      pageId: fan.pageId,
      senderIds: [fan.fanId],
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
            senderIds: [fan.fanId],
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
    const { pageId, fanId } = fan
    const p = { pageId, fanId,amazonProfile:plink }
    setPfloading(true)
    updateFanInfo(p).then(res=>{
      if(res){
        getfandetail()
      }
    })
  }
  return (
    <View>
      <NavBar title='粉丝详情' />
      <View style={style} className='faninfobox'>
        <View className='sec-title'>个人信息：</View>
        <View className='faninfo'>
          <View className='avatar'>
            <Image src={avatar} onClick={viewHead}></Image>
          </View>
          <View className='info'>
            <View className='name'>
              <Text className='fanname break'>{fan.fanName}</Text>
              {
                gender === 'male' ?
                  <View className='icon icon-male'></View>
                  : <View className='icon icon-female'></View>
              }
            </View>
            <Text className='pid break'>主页：{fan.pageName}</Text>
            <Text className='adid break'>用户Id：{fan.fanId}</Text>
          </View>
        </View>
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
          <View className='sec-icon fx1' onClick={handleOrder} data-type='0' data-id=''>
            <View className='at-icon at-icon-file-new'></View>
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
