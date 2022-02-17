import React, { useRef, useState, useEffect, useReducer, useCallback } from "react";
import OrderFormItem from '@/components/orderFormItem'
import { View, Image, Picker, ScrollView } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useFanStore, useOrderStore, useUserStore } from '@/store';
import { previewImg, chooseImg, showL, hideL, Toast, Back ,DecryptData} from '@/utils/index'
import { AtInput, AtList, AtListItem, AtRadio, AtActivityIndicator } from 'taro-ui'
import { orderForm } from '@/constant/index'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { getMessengerFanInfo } from "@/api/messenger/fan";
import { getWaFanInfo } from "@/api/wa/fan";
import { getInsFanInfo } from "@/api/ins/fan";
import { Base64 } from 'js-base64';
import {
  addOrder,
  upOrder,
  getOrderInfo,
  checkHasOrder,
  iMbOrderImg,
  iPcOrderImg,
  getProducts,
  getActByPid,
  getActBySenderId,
  getAllCat
} from '@/api/order'
import "./index.scss";

const initState = {
  id: '',//订单id
  // 商品信息
  keyword: '',
  scalpingProductId: '',//商品Id
  storeName: '', // 店铺名称
  asin: '', // ASIN
  scalpingProductPrice: '', // 商品价格
  storeType: '',
  //订单信息
  orderNumber: '', // 订单编号
  orderImageDate: '', // 订单日期
  amazonOrderStatus: 0,
  orderPrice: '',//订单金额
  orderCommission: '', // 订单佣金
  cashOutPrice: '', // 返款金额
  includedTax: '1', // 是否包含手续费
  orderImgType: '1',//截图类型
  categoryId:'',//订单分组
  orderNote: '', // 订单备注
  orderImage: '', // 订单截图
  //活动信息
  commentWay: '', // 评论方式
  cashOutType: '', // 返款方式
  orderChannelId: 0, // 订单来源
  acticityId: '',
  commentUrl: '', // 评论链接
  commentImage: '', // 评论截图
  // other
  currencyType: '',
  payWay: 1, // 支付方式
  giftCard: '',//礼品码
  paypalAccount: '', // 支付账号
  buyerName: '',
  pageId: '', // 主页来源
  senderId: '', // 粉丝id
  adId: '', // 广告id
  profileUrl: '',
  userMd5: '',
  whatsappAccountId: '',
  instagramAccountId: '',
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
    case 'storeType':
      return {
        ...state,
        storeType: action.payload.storeType
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
    case 'amazonOrderStatus':
      return {
        ...state,
        amazonOrderStatus: action.payload.amazonOrderStatus
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
    case 'categoryId':
      return {
        ...state,
        categoryId: action.payload.categoryId
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
    // 活动信息
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
    case 'acticityId':
      return {
        ...state,
        acticityId: action.payload.acticityId
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
    case 'payWay':
      return {
        ...state,
        payWay: action.payload.payWay
      }
    case 'giftCard':
      return {
        ...state,
        giftCard: action.payload.giftCard
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
    case 'whatsappAccountId':
      return {
        ...state,
        whatsappAccountId: action.payload.whatsappAccountId
      }
    case 'instagramAccountId':
      return {
        ...state,
        instagramAccountId: action.payload.instagramAccountId
      }
    default:
      return state
  }
}
const Order = (props) => {
  const priceref = useRef({
    op: '',
    oc: ''
  })
  const formref = useRef<any[]>(orderForm)

  const [state, dispatch] = useReducer(stateRducer, initState)
  const [products, setProdects] = useState<any[]>([])
  const [forms, setForms] = useState<any[]>(orderForm)
  const [proloading, setProLoading] = useState(false)
  const [orderImg, setOrderImg] = useState('')
  const [comImg, setComImg] = useState('')
  const [showpro, setShowPro] = useState(false)
  const { fan } = useFanStore()
  const { tempOrder } = useOrderStore()
  const { type } = useUserStore()
  const typeRef = useRef('0')
  
  const params = useCallback(() => {
    const { pageId, fanId,userMd5,whatsappAccountId, whatsappUserId, instagramAccountId,instagramUserId } = fan
    switch(type){
      case 'messenger': return { pageId,senderId:fanId,userMd5 }
      case 'whatsapp': return { whatsappAccountId,whatsappUserId }
      case 'ins': return { instagramAccountId,instagramUserId }
      default: return { pageId,senderId:fanId }
    }
  },[fan, type])

  const getFanInfo = useCallback((data) =>{
    switch(type){
      case 'messenger': return getMessengerFanInfo(data)
      case 'whatsapp': return getWaFanInfo(data)
      case 'ins': return getInsFanInfo(data)
      default: return getMessengerFanInfo(data)
    }
  },[type])

  const setFormItemField = (key, field, value) => {
    formref.current.forEach((item=>{
      item.fitems.forEach(item2=>{
        if(item2.key === key){
          item2[field] = value
        }
      })
    }))
    setForms(formref.current.slice())
  }

  const getCatArr = useCallback(() =>{
    getAllCat().then(res=>{
      if(res){
        const {data} = res
        const arr = data.map(item=>{
          const obj = {
            value:item.id,
            label:item.name
          }
          return obj
        })
        setFormItemField('categoryId', 'range', arr)
      }
    })
  },[])

  const orderinfo = useCallback(async (id) => {
    await getOrderInfo(id).then(res => {
      const { data } = res
      dispatch({ type: 'temp', payload: { tempOrder: data } })
      dispatch({ type: 'orderImageDate', payload: { orderImageDate: data.orderImageDate===null?'':data.orderImageDate } })
      dispatch({ type: 'keyword', payload: { keyword: `(${data.scalpingProductId})${data.productTitle}` } })
      dispatch({ type: 'orderPrice', payload: { orderPrice: data.cashOutPrice - data.orderCommission } })
      setComImg(data.commentImage)
      setOrderImg(data.orderImage)
      if (data.payWay === 5) {
        if (data.giftCard !== '' || data.giftCard !== null) {
          setFormItemField('payWay', 'disable', true)
        }
        setFormItemField('giftCard', 'show', true)
        setFormItemField('paypalAccount', 'require', false)
      }
      if(data.cashOutType===12&&data.isCashout===0){
        setFormItemField('cashOutType', 'disable', true)
      }
 
      if (tempOrder !== '') {
        const { cashOutPrice } = tempOrder
        dispatch({ type: 'temp', payload: { tempOrder } })
        dispatch({ type: 'orderCommission', payload: { orderCommission: 0 } })
        dispatch({ type: 'orderPrice', payload: { orderPrice: cashOutPrice } })
      }
      tempOrder.commentImage && setComImg(tempOrder.commentImage)
      tempOrder.orderImage && setOrderImg(tempOrder.orderImage)

      if(data.status === 4){
        formref.current.forEach(item=>{
          item.fitems.forEach(o=>{
            if(o.disable!==undefined){
              o.disable = true
            }
          })
        })
        setForms(formref.current.slice())
      }else{
        formref.current.forEach(item=>{
          item.fitems.forEach(o=>{
            if(o.disable!==undefined){
              o.disable = false
            }
            if(['storeName','cashOutPrice','asin','isCashout'].includes(o.key)){
              o.disable = true
            }
          })
        })
        setForms(formref.current.slice())
      }
    })

    
  },[tempOrder])

  const getAct = useCallback(async () => {
    const { pageId, fanId } = fan
    const p = { pageId, senderId: fanId }
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
  },[fan])

  const channel = useCallback(() => {
    switch(type){
      case 'messenger': return 0
      case 'whatsapp': return 2
      case 'ins': return 4
      default: return 0
    }
  },[type])

  const setDefault = useCallback(() => {
    const { pageId, fanId, fanName, adId, payAccount, userMd5, whatsappAccountId, whatsappUserId, instagramAccountId, instagramUserId } = fan
    dispatch({ type: 'pageId', payload: { pageId: pageId } })
    dispatch({ type: 'senderId', payload: { senderId: fanId } })
    dispatch({ type: 'whatsappAccountId', payload: { whatsappAccountId: whatsappAccountId } })
    dispatch({ type: 'instagramAccountId', payload: { instagramAccountId: instagramAccountId } })
    dispatch({ type: 'buyerName', payload: { buyerName: fanName } })
    dispatch({ type: 'adId', payload: { adId: adId } })
    dispatch({ type: 'paypalAccount', payload: { paypalAccount: payAccount } })
    dispatch({ type: 'userMd5', payload: { userMd5: userMd5 } })
    dispatch({ type: 'orderChannelId', payload: { orderChannelId: channel() } })
    type !== 'messenger' && setFormItemField('orderChannelId', 'disable', true)
    if(type === 'whatsapp'){
      dispatch({ type: 'senderId', payload: { senderId: whatsappUserId } })
    }
    if(type === 'ins'){
      dispatch({ type: 'senderId', payload: { senderId: instagramUserId } })
    }
    setFormItemField('payWay', 'disable', false)
    setFormItemField('giftCard', 'show', false)
    setFormItemField('paypalAccount', 'require', true)
  },[channel, fan, type])

  const setState = (item, v) => {
    const key = item.key
    const payload = {}
    item.type === 'selector'
      ? payload[key] = item.range[v].value
      : payload[key] = v
    dispatch({ type: key, payload })
    if (key === 'keyword' && v.length < 30) {
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
    if (key === 'payWay') {
      if (v === '3') {
        setFormItemField('giftCard', 'show', true)
        setFormItemField('paypalAccount', 'require', false)
      } else {
        setFormItemField('giftCard', 'show', false)
        setFormItemField('paypalAccount', 'require', true)
      }
      setForms(formref.current.slice())
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
      setProLoading(false)
    })

  }

  const autoSet = async (e) => {
    dispatch({ type: 'keyword', payload: { keyword: '' } })
    const item = e.currentTarget.dataset.item
    const { asin, storeName, id, price, currencyType, title, storeType } = item
    dispatch({ type: 'scalpingProductId', payload: { scalpingProductId: id } })
    dispatch({ type: 'asin', payload: { asin: asin } })
    dispatch({ type: 'storeName', payload: { storeName: storeName } })
    dispatch({ type: 'scalpingProductPrice', payload: { scalpingProductPrice: price } })
    dispatch({ type: 'currencyType', payload: { currencyType: currencyType } })
    dispatch({ type: 'storeType', payload: { storeType: storeType } })
    setTimeout(() => {
      dispatch({ type: 'keyword', payload: { keyword: `(${id})${title}` } })
    }, 100);
    await getActByPid({ productId: id }).then(res => {
      if (res.data) {
        dispatch({ type: 'acticityId', payload: { acticityId: res.data.id } })
      }
    })
    setShowPro(false)
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

  const selectorValue = (item): any => {
    for (let i = 0; i < item.range.length; i++) {
      if (item.range[i].value === state[item.key]) {
        return i
      }
    }
  }

  const returnfalse = ()=>{
    return false
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
            onFocus={() => { if (item.key === 'keyword') { setShowPro(true); getpro(''); } }}
            onChange={(v) => { setState(item, v) }}
            holdKeyboard
          />
        )
      case 'date':
        return (
          <Picker
            className='compicker'
            value={state[item.key]}
            mode='date'
            disabled={item.disable}
            onChange={(e) => { setState(item, e.detail.value) }}
          >
            <AtList>
              <AtListItem extraText={state[item.key]} />
            </AtList>
          </Picker>
        )
      case 'selector':
        return (
          <Picker
            className='compicker'
            value={selectorValue(item)}
            mode='selector'
            range={item.range}
            rangeKey='label'
            disabled={item.disable}
            onChange={(e) => { setState(item, e.detail.value) }}
          >
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
                <View className='noimg fx' onClick={item.disable?returnfalse:upImg} data-item={item}>
                  <View className='at-icon at-icon-add'></View>
                </View> :
                <View className='orderimg'>
                  <Image src={item.key === 'orderImage' ? orderImg : comImg} onClick={() => previewImg(state[item.key])}></Image>
                  <View className='icon icon-close' onClick={item.disable?returnfalse:delImg} data-item={item}></View>
                </View>
            }
          </View>
        )
      case 'radio':
        return (
          <View className='comradio'>
            <AtRadio
              options={item.range}
              value={state[item.key]}
              onClick={(v) => { !item.disable && setState(item, v) }}
            />
          </View>
        )
      default:
        return ''
    }
  }

  const submit = async () => {
    const formdata = state
    if (formdata.senderId === '') {
      Toast('用户信息异常，请联系售后！', 'none')
      return
    }
    if (formdata.scalpingProductId === '' || formdata.scalpingProductPrice === '') {
      Toast('请完善商品信息！', 'none')
      return
    }
    if (formdata.commentWay === '' ||
      formdata.cashOutType === '' ||
      formdata.orderChannelId === '') {
      Toast('请完善活动信息！', 'none')
      return
    }
    if (formdata.payWay !== 5 && !formdata.paypalAccount) {
      Toast('请完善买家信息！', 'none')
      return
    }
    const { scalpingProductPrice, cashOutPrice } = formdata
    let checkPrice = true
    if (typeRef.current === '0' && ((cashOutPrice - scalpingProductPrice) / scalpingProductPrice > 0.12)) {
      await Taro.showModal({
        title: '',
        content: '警告！商品金额与订单金额的差异大于12%是否确定创建',
        success(res) { res.confirm ? checkPrice = true : checkPrice = false },
        fail() { checkPrice = false }
      })
    }
    if (checkPrice) {
      const { id, orderNumber, scalpingProductId } = state
      const query = {
        id,
        orderNumber: orderNumber,
        scalpingProductId: scalpingProductId
      }
      await checkHasOrder(query).then(res => {
        if (res.data !== 0) {
          Taro.showModal({
            title: '',
            content: '订单编号和商品ID已经存在于另一个测评订单中，是否继续添加！',
            success(res2) { res2.confirm && setOrder() }
          })
        } else {
          setOrder()
        }
      })
    }
  }

  const setOrder = async () => {
    const fun = typeRef.current === '0' ? addOrder : upOrder
    await fun(state).then(res => {
      if (res) {
        Toast(typeRef.current === '0' ? '创建成功！' : '编辑成功', 'none')
        setTimeout(() => {
          Back()
        }, 1000);
      }
    })
  }

  const initorder = useCallback(() => {
    const router = getCurrentInstance().router
    let p: any = ''
    if (router) {
      Taro.setNavigationBarTitle({title:'创建订单'})
      p = router.params
      typeRef.current = p.type
      if (typeRef.current === '0') {
        if (tempOrder !== '') {
          const { cashOutPrice } = tempOrder
          dispatch({ type: 'temp', payload: { tempOrder } })
          dispatch({ type: 'orderCommission', payload: { orderCommission: 0 } })
          dispatch({ type: 'orderPrice', payload: { orderPrice: cashOutPrice } })
        }
        tempOrder.commentImage && setComImg(tempOrder.commentImage)
        tempOrder.orderImage && setOrderImg(tempOrder.orderImage)
        type === 'messenger' && getAct()
        setDefault()
      } else {
        Taro.setNavigationBarTitle({title:'编辑订单'})
        const id = p.id
        orderinfo(id)
      }
      getFanInfo(params()).then(res=>{
        const {data} = res
        const rawdata = JSON.parse(DecryptData(Base64.decode(data), 871481901))
        console.log(rawdata)
        if(rawdata.orderNumber){
          dispatch({ type: 'orderNumber', payload: { orderNumber: rawdata.orderNumber } })
        }
      })
    }
  },[getAct, getFanInfo, orderinfo, params, setDefault, tempOrder, type])

  useDidShow(()=>{
    getCatArr()
    initorder()
  })

  return (
    <View>
      <View className='order-form' >
        {
          forms.map((section, index) => {
            return (
              <View className='order-section' key={index}>
                <View className='section-title'>{section.title}</View>
                {
                  section.fitems.map((oitem, idx) => {
                    return (
                      oitem.show &&
                        <OrderFormItem
                          key={idx}
                          id={oitem.key}
                          label={oitem.label}
                          type={oitem.type}
                          require={oitem.require}
                          formCont={formTypeFilter(oitem)}
                          products={
                            showpro &&
                              <View className='showpro'>
                                <ScrollView className='proscroll' scrollY onClick={(e) => e.stopPropagation()}>
                                  <View className='probox' >
                                    <AtActivityIndicator isOpened={proloading} mode='center' size={30}></AtActivityIndicator>
                                    {
                                      products.length > 0 ?
                                        products.map((pro, idx2) => {
                                          return (
                                            <View
                                              key={idx2}
                                              className='pro break'
                                              onClick={autoSet}
                                              data-item={pro}
                                            >{`(${pro.id})${pro.title}`}</View>
                                          )
                                        }) : <View className='nodate'>无数据</View>
                                    }
                                  </View>
                                </ScrollView>
                                <View className='closeprobox' onClick={() => setShowPro(false)}>取消</View>
                              </View>
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
          <View className='searchbtn btn' onClick={submit}>提交</View>
        </View>
      </View>
    </View>
  );
};

export default observer(Order);
