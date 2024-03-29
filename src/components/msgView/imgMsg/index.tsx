import React, { useState, forwardRef, useCallback } from 'react'
import { View, Image,Text, Button, ScrollView } from '@tarojs/components'
import { previewImg, showL, hideL, NavTo } from '@/utils/index'
import {typeOrderS} from '@/utils/filter'
import Taro from '@tarojs/taro'
import { observer } from 'mobx-react';
import { useOrderStore, useUserStore } from '@/store';
import { iPcOrderImg, iMbOrderImg, orderList } from '@/api/order'
import { AtModal, AtModalContent, AtModalAction } from "taro-ui"
import './index.scss'


const ImgMsg = (props, ref) => {
  const img = props.msgItem.imgUrl
  const isR = props.msgItem.isServe
  const [style, setStyle] = useState({})
  const [showorder, setShowOrder] = useState(false)
  const [showCreate, setshowCreate] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const {setTempOrder} = useOrderStore()
  const {type} = useUserStore()

  const params = useCallback(() => {
    const { pageId, fanId,userMd5,whatsappAccountId, whatsappUserId, instagramAccountId,instagramUserId } = props.fan
    switch(type){
      case 'messenger': return { pageId,senderId:fanId,userMd5 }
      case 'whatsapp': return { whatsappAccountId,whatsappUserId }
      case 'ins': return { instagramAccountId,instagramUserId }
      default: return { pageId,senderId:fanId,userMd5 }
    }
  },[props.fan, type])

  const imgload = (e) => {
    const w = e.detail.width; //获取图片真实宽度
    const h = e.detail.height; //获取图片真实高度
    const ratio = Number((w / h).toFixed(1))
    let width = 0
    let height = 0
    if (ratio < 0.4) {
      width = 204;
      height = 510;
    } else if (ratio >= 0.4 && ratio <= 0.5) {
      width = 204;
      height = 204 / ratio;
    } else if (ratio > 0.5 && ratio < 1) {
      width = 405 * ratio;
      height = 405;
    } else if (ratio >= 1 && ratio < 1 / 0.5) {
      height = 405 * (1 / ratio);
      width = 405;
    } else if (ratio >= 1 / 0.5 && ratio < 1 / 0.4) {
      height = 204;
      width = 204 / (1 / ratio);
    } else if (ratio >= 1 / 0.4) {
      height = 204;
      width = 510;
    }
    height /= 3;
    width /= 3;
    width = parseInt(String(width))
    height = parseInt(String(height))

    setStyle({
      width: width + 'px',
      height: 'auto'
    })
  }

  const viewimg = () => {
    previewImg(img)
  }

  const longPress = () => {
    if (!isR) {
      Taro.showActionSheet({
        itemList: ['识别手机订单截图', '识别电脑订单截图', '更新评论截图'],
        success(res) {
          getorder()
          identifyImg(res.tapIndex)
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }
  }

  const getorder = async () => {
    await orderList(params()).then(res => {
      const { data } = res
      setOrders(data.records)
    })
  }

  const identifyImg = async (idx) => {
    const fun = idx === 0 ? iMbOrderImg : iPcOrderImg
    let obj = {}
    if (idx === 0 || idx === 1) {
      setshowCreate(true)
      showL('识别中')
      await fun({ imageUrl: img }).then(res => {
        const {id,amount,date,productPrice} = res.data
        obj={
          orderNumber:id!==null?id.slice(0,20):'',
          scalpingProductPrice:productPrice!==null?productPrice:'',
          cashOutPrice:amount!==null?amount:'',
          orderImageDate:date!==null?date:'',
        }
        setTempOrder(obj)

        
        obj['orderImage'] = img
        setTempOrder(obj)
        setShowOrder(true);
        hideL()
      })
    } else {
      setshowCreate(false)
      setTempOrder({commentImage:img})
      setShowOrder(true)
    }
  }
  const chooseorder = (e)=>{
    const id = e.currentTarget.dataset.id
    NavTo(`/pages/order/index?type=1&id=${id}`)
  }
  const createOrder =()=>{
    NavTo('/pages/order/index?type=0')
  }
  return (
    <View className='imgmsgbox'>
      <View className='img-msg' onClick={viewimg} onLongPress={longPress}>
        <Image
          onLoad={imgload}
          src={img}
          mode='widthFix'
          style={style}
        ></Image>
      </View>
      <AtModal isOpened={showorder} closeOnClickOverlay>
        <AtModalContent>
          <ScrollView className='order-scroll' scrollY>
            {
              orders.length > 0 ?
                <View className='orderbox'>
                  <View className='orderhead fx'>
                    <View className='fx2'>产品名称</View>
                    <View className='fx1'>订单状态</View>
                  </View>
                  {
                    orders.map((o, i) => {
                      return (
                        <View key={i} className='order fx' onClick={chooseorder} data-id={o.id}>
                          <View className='fx2'>
                            <Text className='title twoline'>{o.scalpingProductName}</Text>
                          </View>
                          <View className='fx1'>{typeOrderS(o.status)}</View>
                        </View>
                      )
                    })
                  }
                </View>
                : <View className='nodate'>暂无订单数据</View>
            }
          </ScrollView>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setShowOrder(false)}>取消</Button>
          {
            showCreate?<Button onClick={createOrder}>创建</Button>:''
          }
        </AtModalAction>
      </AtModal>
    </View>
  )
}

export default observer(forwardRef(ImgMsg))
