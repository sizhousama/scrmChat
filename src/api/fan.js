import HTTPREQUEST from "../servers/http"

// 粉丝
export const getFans = (params) => {
  return HTTPREQUEST.get('/scrm-message/pageUserData/pageUserDatas', params)
}
// 特定粉丝
export const getFan = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/getContacts', data)
}
//粉丝详情
export const getFanInfo = (params) => {
  return HTTPREQUEST.get(`/scrm-message/pageUserData/get/${params.pageId}/${params.fanId}`)
}
//更新粉丝
export const updateFanInfo = (data) => {
  return HTTPREQUEST.put(`/scrm-message/pageUserData/update/${data.pageId}/${data.fanId}`,data)
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

// 获取标签
export const getAllTagNew = (params) => {
  return HTTPREQUEST.get('/scrm-message/tags/getTagsListNew', params)
}

// 添加粉丝标签
export const addFanTag = (params) => {
  return HTTPREQUEST.post('/scrm-message/tags/addTagIds',params)
}

// 删除标签
export const delFanTag = (params) => {
  return HTTPREQUEST.post('/scrm-message/tags/delTagIds',params)
}