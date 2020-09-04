import React, { useRef, useState, useEffect, useReducer } from "react";
import NavBar from "@/components/navBar";
import OrderFormItem from '@/components/orderFormItem'
import { View, Image, Picker, ScrollView } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useNavStore, useFanStore, useOrderStore } from '@/store';
import { previewImg, chooseImg, showL, hideL, Toast } from '@/utils/index'
import { AtInput, AtList, AtListItem, AtRadio, AtActivityIndicator } from 'taro-ui'
import { orderForm } from '@/constant/index'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import {
  addOrder,
  upOrder,
  getOrderInfo,
  checkHasOrder,
  iMbOrderImg,
  iPcOrderImg,
  getProducts,
  getActByPid,
  getActBySenderId
} from '@/api/order'
import "./index.scss";
import fan from "@/components/fan";
const initState = {
  id: '',//订单id
  // 商品信息
  keyword: '',
  scalpingProductId: '',//商品Id
  storeName: '', // 店铺名称
  asin: '', // ASIN
  scalpingProductPrice: '', // 商品价格
  //订单信息
  orderNumber: '', // 订单编号
  orderImageDate: '', // 订单日期
  orderPrice: '',//订单金额
  orderCommission: '', // 订单佣金
  cashOutPrice: '', // 返款金额
  includedTax: 1, // 是否包含手续费
  orderImgType: 1,//截图类型
  orderNote: '', // 订单备注
  orderImage: '', // 订单截图
  //测评信息
  commentWay: '', // 评论方式
  cashOutType: '', // 返款方式
  orderChannelId: 0, // 订单来源
  amazonOrderStatus: '', // 亚马逊订单状态
  commentUrl: '', // 评论链接
  commentImage: '', // 评论截图
  // other
  currencyType: '',
  payWay: 1, // 支付方式
  paypalAccount: '', // 支付账号
  buyerName: '',
  pageId: '', // 主页来源
  senderId: '', // 粉丝id
  acticityId: '', // 活动ID
  adId: '', // 广告id
  profileUrl: '',
  userMd5: ''
}
const stateRducer = (state, action) => {
  switch (action.type) {
    case 'temp':
      return {
        ...state,
        ...action.payload.tempOrder
      }
    case 'keyword':
      return {
        ...state,
        keyword: action.payload.keyword
      }
    // 商品信息
    case 'scalpingProductId':
      return {
        ...state,
        scalpingProductId: action.payload.scalpingProductId
      }
    case 'storeName':
      return {
        ...state,
        storeName: action.payload.storeName
      }
    case 'asin':
      return {
        ...state,
        asin: action.payload.asin
      }
    case 'scalpingProductPrice':
      return {
        ...state,
        scalpingProductPrice: action.payload.scalpingProductPrice
      }
    // 订单信息
    case 'orderNumber':
      return {
        ...state,
        orderNumber: action.payload.orderNumber
      }
    case 'orderImageDate':
      return {
        ...state,
        orderImageDate: action.payload.orderImageDate
      }
    case 'orderPrice':
      return {
        ...state,
        orderPrice: action.payload.orderPrice
      }
    case 'orderCommission':
      return {
        ...state,
        orderCommission: action.payload.orderCommission
      }
    case 'cashOutPrice':
      return {
        ...state,
        cashOutPrice: action.payload.cashOutPrice
      }
    case 'includedTax':
      return {
        ...state,
        includedTax: action.payload.includedTax
      }
    case 'orderImgType':
      return {
        ...state,
        orderImgType: action.payload.orderImgType
      }
    case 'orderNote':
      return {
        ...state,
        orderNote: action.payload.orderNote
      }
    case 'orderImage':
      return {
        ...state,
        orderImage: action.payload.orderImage
      }
    // 测评信息
    case 'commentWay':
      return {
        ...state,
        commentWay: action.payload.commentWay
      }
    case 'cashOutType':
      return {
        ...state,
        cashOutType: action.payload.cashOutType
      }
    case 'orderChannelId':
      return {
        ...state,
        orderChannelId: action.payload.orderChannelId
      }
    case 'amazonOrderStatus':
      return {
        ...state,
        amazonOrderStatus: action.payload.amazonOrderStatus
      }
    case 'commentUrl':
      return {
        ...state,
        commentUrl: action.payload.commentUrl
      }
    case 'commentImage':
      return {
        ...state,
        commentImage: action.payload.commentImage
      }
    case 'currencyType':
      return {
        ...state,
        currencyType: action.payload.currencyType
      }
    case 'acticityId':
      return {
        ...state,
        acticityId: action.payload.acticityId
      }
    case 'paypalAccount':
      return {
        ...state,
        paypalAccount: action.payload.paypalAccount
      }
    case 'buyerName':
      return {
        ...state,
        buyerName: action.payload.buyerName
      }
    case 'adId':
      return {
        ...state,
        adId: action.payload.adId
      }
    case 'pageId':
      return {
        ...state,
        pageId: action.payload.pageId
      }
    case 'senderId':
      return {
        ...state,
        senderId: action.payload.senderId
      }
    case 'userMd5':
      return {
        ...state,
        userMd5: action.payload.userMd5
      }
    default:
      return state
  }
}
const Order = (props) => {
  const { navH } = useNavStore();
  const style = {
    marginTop: navH + 'px'
  }
  const priceref = useRef({
    op: '',
    oc: ''
  })

  const [state, dispatch] = useReducer(stateRducer, initState)
  const [products, setProdects] = useState<any[]>([])
  const [proloading, setProLoading] = useState(false)
  const [orderImg, setOrderImg] = useState('')
  const [comImg, setComImg] = useState('')
  const [showpro, setShowPro] = useState(false)
  const { fan } = useFanStore()
  const { tempOrder } = useOrderStore()
  let type: string = '0'
  useEffect(() => {
    initorder()
    getAct()
  }, [])
  const initorder = () => {
    const router = getCurrentInstance().router
    let params: any = ''
    if (router) {
      params = router.params
      type = params.type
      if (type === '0') {
        tempOrder !== '' ? dispatch({ type: 'temp', payload: { tempOrder } }) : ''
        tempOrder.commentImage?setComImg(tempOrder.commentImage):''
        tempOrder.orderImage?setOrderImg(tempOrder.orderImage):''
      } else {
        const id = params.id
        tempOrder !== '' ? dispatch({ type: 'temp', payload: { tempOrder } }) : ''
        orderinfo(id)
      }
    }
  }
  const orderinfo = async(id)=>{
    await getOrderInfo(id).then(res=>{
      const {data} = res
      dispatch({ type: 'temp', payload: { tempOrder:data } })
      dispatch({ type: 'keyword', payload: { keyword:`(${data.scalpingProductId})${data.productTitle}` } })
    })
  }
  const getAct = async () => {
    const { pageId, fanId } = fan
    const p = { pageId, senderId:fanId }
    await getActBySenderId(p).then(res => {
      const { data } = res
      if (data) {
        const { productId, asin, id, storeName, price, currencyType, title } = data
        dispatch({ type: 'scalpingProductId', payload: { scalpingProductId: productId } })
        dispatch({ type: 'asin', payload: { asin } })
        dispatch({ type: 'acticityId', payload: { acticityId: id } })
        dispatch({ type: 'storeName', payload: { storeName } })
        dispatch({ type: 'scalpingProductPrice', payload: { scalpingProductPrice: price } })
        dispatch({ type: 'currencyType', payload: { currencyType } })
        dispatch({ type: 'keyword', payload: { keyword: `(${productId})${title}` } })
      }
    })
    dispatch({ type: 'buyerName', payload: { buyerName: fan.fanName } })
    dispatch({ type: 'adId', payload: { adId: fan.adId } })
    dispatch({ type: 'paypalAccount', payload: { paypalAccount: fan.payAccount } })
    dispatch({ type: 'userMd5', payload: { userMd5: fan.userMd5 } })
  }
  const setState = (item, v) => {
    const key = item.key
    const payload = {}
    item.type === 'selector'
      ? payload[key] = item.range[v].value
      : payload[key] = v
    dispatch({ type: key, payload })
    if (key === 'keyword') {
      getpro(v)
    }
    if (key === 'orderPrice') {
      priceref.current.op = v
      const cp = Number(priceref.current.op) + Number(priceref.current.oc)
      dispatch({ type: 'cashOutPrice', payload: { cashOutPrice: cp } })
    }
    if (key === 'orderCommission') {
      priceref.current.oc = v
      const cp = Number(priceref.current.op) + Number(priceref.current.oc)
      dispatch({ type: 'cashOutPrice', payload: { cashOutPrice: cp } })
    }
  }
  const getpro = async (v) => {
    setProLoading(true)
    const query = {
      page: 1,
      length: 20,
      keyword: v,
      descs: 'id'
    }
    await getProducts(query).then(res => {
      const { data } = res
      const { records } = data
      setProdects(records)
    }).finally(() => {
      setProLoading(false)
    })

  }
  const autoSet = async (e) => {
    const item = e.currentTarget.dataset.item
    const { asin, storeName, id, price, currencyType } = item
    dispatch({ type: 'scalpingProductId', payload: { scalpingProductId: id } })
    dispatch({ type: 'asin', payload: { asin: asin } })
    dispatch({ type: 'storeName', payload: { storeName: storeName } })
    dispatch({ type: 'scalpingProductPrice', payload: { scalpingProductPrice: price } })
    dispatch({ type: 'currencyType', payload: { currencyType: currencyType } })
    await getActByPid({ productId: id }).then(res => {
      dispatch({ type: 'acticityId', payload: { acticityId: res.data.id } })
    })
  }
  const finditem = (item): string => {
    const v = item.range.find(o => o.value === state[item.key])
    if (!v) return ''
    return v.label
  }
  const identifyImg = async (img, key) => {
    showL('识别中')
    const idway = state.orderImgType
    const fn = idway === 1 ? iMbOrderImg : iPcOrderImg
    await fn({ imageUrl: img }).then(res => {
      const { data } = res
      const { id, amount, date, productPrice } = data
      dispatch({ type: 'orderNumber', payload: { orderNumber: id.slice(0, 20) } })
      dispatch({ type: 'scalpingProductPrice', payload: { scalpingProductPrice: productPrice } })
      dispatch({ type: 'cashOutPrice', payload: { cashOutPrice: amount } })
      dispatch({ type: 'orderImageDate', payload: { orderImageDate: date } })
    }).finally(() => {
      hideL()
    })
  }
  const upImg = async (e) => {
    const item = e.currentTarget.dataset.item
    const url = '/scrm-seller/utils/uploadFile'
    console.log(item)
    await chooseImg(url, 1).then(res => {
      const payload = {}
      payload[item.key] = res[0]
      dispatch({ type: item.key, payload })
      if (item.key === 'orderImage') {
        setOrderImg(res[0])
        identifyImg(res[0], item.key)
      } else {
        setComImg(res[0])
      }
    })
  }
  const delImg = (e) => {
    e.stopPropagation()
    const item = e.currentTarget.dataset.item
    const payload = {}
    payload[item.key] = ''
    setTimeout(() => {
      dispatch({ type: item.key, payload })
      item.key === 'orderImage' ? setOrderImg('') : setComImg('')
    }, 100);
  }
  const formTypeFilter = (item) => {
    switch (item.type) {
      case 'input':
        return (
          <AtInput
            name={item.key}
            type={item.otherType}
            value={state[item.key]}
            placeholder={item.ph}
            className='cominput orderinput'
            disabled={item.disable}
            onFocus={() => { if (item.key === 'keyword') { setShowPro(true); getpro('') } }}
            onBlur={() => item.key === 'keyword' ? setShowPro(false) : ''}
            onChange={(v) => { setState(item, v) }} />
        )
      case 'date':
        return (
          <Picker
            className='compicker'
            value={state[item.key]}
            mode='date'
            onChange={(e) => { setState(item, e.detail.value) }}>
            <AtList>
              <AtListItem extraText={state[item.key]} />
            </AtList>
          </Picker>
        )
      case 'selector':
        return (
          <Picker
            className='compicker'
            value={state[item.key]}
            mode='selector'
            range={item.range}
            rangeKey='label'
            onChange={(e) => { setState(item, e.detail.value) }}>
            <AtList>
              <AtListItem extraText={finditem(item)} />
            </AtList>
          </Picker>
        )
      case 'img':
        return (
          <View className='imgbox'>
            {
              state[item.key] === '' ?
                <View className='noimg fx' onClick={upImg} data-item={item}>
                  <View className='at-icon at-icon-add'></View>
                </View> :
                <View className='orderimg'>
                  <Image src={item.key === 'orderImage' ? orderImg : comImg} onClick={() => previewImg(state[item.key])}></Image>
                  <View className='icon icon-close' onClick={delImg} data-item={item}></View>
                </View>
            }
          </View>
        )
      case 'radio':
        return (
          <View className='comradio'>
            <AtRadio
              options={item.options}
              value={state[item.key]}
              onClick={(v) => { setState(item, v) }}
            />
          </View>
        )
      default:
        return ''
    }
  }
  const submit = async () => {
    const formdata = state
    if (formdata.scalpingProductId === '' || formdata.scalpingProductPrice === '') {
      Toast('请完善商品信息！', 'none')
      return
    }
    if (formdata.commentWay === '' ||
      formdata.cashOutType === '' ||
      formdata.orderChannelId === '' ||
      formdata.amazonOrderStatus === '') {
      Toast('请完善测评信息！', 'none')
      return
    }
    const { scalpingProductPrice, cashOutPrice } = formdata
    let checkPrice = true
    if (type === 'create' && ((cashOutPrice - scalpingProductPrice) / scalpingProductPrice > 0.12)) {
      await Taro.showModal({
        title: '',
        content: '警告！商品金额与订单金额的差异大于12%是否确定创建',
        success(res) { res.confirm ? checkPrice = true : checkPrice = false },
        fail() { checkPrice = false }
      })
    }
    if (checkPrice) {
      const data = await orderIsExit()
      if (data !== 0) {
        Taro.showModal({
          title: '',
          content: '订单编号和商品ID已经存在于另一个测评订单中，是否继续添加！',
          success(res) { res.confirm ? setOrder() : '' }
        })
      } else {
        setOrder()
      }
    }
  }
  const orderIsExit = async (): Promise<any> => {
    const { id, orderNumber, scalpingProductId } = state
    const query = {
      id,
      orderNumber: orderNumber,
      scalpingProductId: scalpingProductId
    }
    await checkHasOrder(query).then(res => {
      return res.data
    })
  }
  const setOrder = async () => {
    const fun = type === 'create' ? addOrder : upOrder
    await fun(state).then(res => {
      Toast(type === 'create' ? '创建成功！' : '编辑成功', 'none')
    })
  }

  return (
    <View>
      <NavBar title='测评订单' />
      <View className='order-form' style={style}>
        {
          orderForm.map((section, index) => {
            return (
              <View className='order-section' key={index}>
                <View className='section-title'>{section.title}</View>
                {
                  section.fitems.map((oitem, idx) => {
                    return (
                      <OrderFormItem
                        key={idx}
                        id={oitem.key}
                        label={oitem.label}
                        type={oitem.type}
                        require={oitem.require}
                        formCont={formTypeFilter(oitem)}
                        products={
                          showpro ?
                            <ScrollView className='proscroll' scrollY>
                              <View className='probox'>
                                <AtActivityIndicator isOpened={proloading} mode='center' size={30}></AtActivityIndicator>
                                {
                                  products.length > 0 ?
                                    products.map((pro, idx) => {
                                      return (
                                        <View
                                          key={idx}
                                          className='pro break'
                                          onClick={autoSet}
                                          data-item={pro}
                                        >{`(${pro.id})${pro.title}`}</View>
                                      )
                                    }) : <View className='nodate'>无数据</View>
                                }
                              </View>
                            </ScrollView> : ''
                        }
                      ></OrderFormItem>
                    )
                  })
                }
              </View>
            )
          })
        }
        <View className='bot fx'>
          <View className='searchbtn btn' onClick={submit}>保存</View>
        </View>
      </View>
    </View>
  );
};

export default observer(Order);
