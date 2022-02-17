import HTTPREQUEST from "../../servers/http"

// 粉丝
export const getMessengerFans = (params) => {
  return HTTPREQUEST.get('/scrm-message/pageUserData/pageUserDatas', params)
}
// 特定粉丝
export const getMessengerFan = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/getContacts', data)
}
//粉丝详情
export const getMessengerFanInfo = (params) => {
  return HTTPREQUEST.get(`/scrm-message/pageUserData/get/${params.pageId}/${params.senderId}`)
}
//更新粉丝
export const updateMessengerFanInfo = (data) => {
  return HTTPREQUEST.put(`/scrm-message/pageUserData/update/${data.pageId}/${data.senderId}`,data)
}
// 聊天粉丝
export const getMessengerRecentContacts = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/recentContacts', data)
}

// 获取标签
export const getAllTag = (params) => {
  return HTTPREQUEST.get('/scrm-message/tags/getAllTagsByUserId', params)
}


// 更新状态
export const upMessengerRead = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/contacts/updateReadStatus',data)
}

// 更新分配客服
export const upMessengerFanService = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/contacts/updateService',data)
}

// 粉丝订单
export const messengerFanOrders = (params) => {
  return HTTPREQUEST.get('/scrm-seller/scalpingOrder/scalpingOrders',params)
}

// 粉丝标签
export const messengerFanTags = (params) => {
  return HTTPREQUEST.get('/scrm-message/tags/getFanTagsBySenderId',params)
}

// 获取标签
export const getAllTagNew = (params) => {
  return HTTPREQUEST.get('/scrm-message/tags/getTagsListNew', params)
}

// 添加粉丝标签
export const addMessengerFanTag = (params) => {
  return HTTPREQUEST.post('/scrm-message/tags/addTagIds',params)
}

// 删除标签
export const delMessengerFanTag = (params) => {
  return HTTPREQUEST.post('/scrm-message/tags/delTagIds',params)
}