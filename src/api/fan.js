import HTTPREQUEST from "../servers/http"

// 粉丝
export const getFans = (params) => {
  return HTTPREQUEST.get('/scrm-message/pageUserData/pageUserDatas', params)
}
// 聊天粉丝
export const getRecentContacts = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/recentContacts', data)
}

// 获取标签
export const getAllTag = (params) => {
  return HTTPREQUEST.get('/scrm-message/tags/getAllTagsByUserId', params)
}

// 获取用户主页
export const getAllPage = () => {
  return HTTPREQUEST.get('/scrm-message/pageConfig/getAllPageBySellerId')
}

// 更新状态
export const upRead = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/contacts/updateReadStatus',data)
}

// 更新分配客服
export const upFanService = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/contacts/updateService',data)
}

// 粉丝订单
export const fanOrders = (params) => {
  return HTTPREQUEST.get('/scrm-seller/scalpingOrder/scalpingOrders',params)
}

// 粉丝标签
export const fanTags = (params) => {
  return HTTPREQUEST.get('/scrm-message/tags/getFanTagsBySenderId',params)
}