import HTTPREQUEST from "../../servers/http"

// 粉丝
export const getWaFans = (params) => {
  return HTTPREQUEST.get('/scrm-whatsapp-message/whatsappUser/whatsappUsers', params)
}
// 特定粉丝
export const getWaFan = (params) => {
  return HTTPREQUEST.get(`/scrm-socket/whatsapp/messenging/contacts/${params.whatsappAccountId}/${params.whatsappUserId}`)
}
//粉丝详情
export const getWaFanInfo = (params) => {
  return HTTPREQUEST.get(`/scrm-whatsapp-message/whatsappUser/${params.whatsappAccountId}/${params.whatsappUserId}`)
}
//更新粉丝
export const updateWaFanInfo = (data) => {
  return HTTPREQUEST.put(`/scrm-whatsapp-message/whatsappUser/update`,data)
}
// 聊天粉丝
export const getWaRecentContacts = (data) => {
  return HTTPREQUEST.post('/scrm-socket/whatsapp/messenging/contacts/list', data)
}

// 更新状态
export const upWaRead = (data) => {
  return HTTPREQUEST.post('/scrm-socket/whatsapp/messenging/contacts/updateReadStatus',data)
}

// 更新分配客服
export const upWaFanService = (data) => {
  return HTTPREQUEST.post('/scrm-whatsapp-message/whatsappUser/batchUpdateService',data)
}

// 粉丝标签
export const waFanTags = (params) => {
  return HTTPREQUEST.get(`/scrm-whatsapp-message/whatsappUser/getTagsByWhatsAppUser/${params.whatsappAccountId}/${params.whatsappUserId}`)
}

// 添加粉丝标签
export const addWaFanTag = (data) => {
  return HTTPREQUEST.post('/scrm-whatsapp-message/whatsappUser/addTagsToWhatsApp',data)
}

// 删除标签
export const delWaFanTag = (data) => {
  return HTTPREQUEST.post('/scrm-whatsapp-message/whatsappUser/delTagsToWhatsApp',data)
}

export const getWaAccount = (params) => {
  return HTTPREQUEST.get(`/scrm-whatsapp-message/whatsappAccount/${params.id}`)
}
