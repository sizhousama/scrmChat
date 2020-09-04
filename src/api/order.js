import HTTPREQUEST from "../servers/http"

// 添加订单
export const addOrder = (data) => {
  return HTTPREQUEST.post('/scrm-seller/scalpingOrder', data)
}
// 订单信息
export const getOrderInfo = (params) => {
  return HTTPREQUEST.get(`/scrm-seller/scalpingOrder/${params}`)
}
// senderId获取活动信息
export const getActBySenderId = (params) => {
  return HTTPREQUEST.get(`/scrm-seller/appraisalActivity/getActivityBySenderId`,params)
}
// 更新订单
export const upOrder = (data) => {
  return HTTPREQUEST.put(`/scrm-seller/scalpingOrder/${data.id}`)
}
// 检查重复
export const checkHasOrder = (params) => {
  return HTTPREQUEST.get(`/scrm-seller/scalpingOrder/getOrderCountByOrderNumber`,params)
}
// 识别手机截图
export const iMbOrderImg = (params) => {
  return HTTPREQUEST.get(`/scrm-seller/media/identifyOrderInformation`,params)
}
// 识别电脑截图
export const iPcOrderImg = (params) => {
  return HTTPREQUEST.get(`/scrm-seller/media/identifyPcOrderInformation`,params)
}

// 商品
export const getProducts = (params) => {
  return HTTPREQUEST.get(`/scrm-seller/scalpingProduct/scalpingProducts`,params)
}

// 商品Id获取活动
export const getActByPid = (params) => {
  return HTTPREQUEST.get(`/scrm-seller/appraisalActivity/getActivityByProductId`,params)
}





