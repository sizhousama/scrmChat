import HTTPREQUEST from "../../servers/http"

// 粉丝
export const getInsFans = (params) => {
  return HTTPREQUEST.get('/scrm-instagram-message/instagramUser/instagramUsers', params)
}
// 特定粉丝
export const getInsFan = (params) => {
  return HTTPREQUEST.get(`/scrm-instagram-message/instagramUser/${params.instagramAccountId}/${params.instagramUserId}`)
}
//粉丝详情
export const getInsFanInfo = (params) => {
  return HTTPREQUEST.get(`/scrm-instagram-message/instagramUser/${params.instagramAccountId}/${params.instagramUserId}`)
}
//更新粉丝
export const updateInsFanInfo = (data) => {
  return HTTPREQUEST.put(`/scrm-instagram-message/instagramUser/update`,data)
}
// 聊天粉丝
export const getInsRecentContacts = (data) => {
  return HTTPREQUEST.post('/scrm-socket/instagram/messenging/contacts/list', data)
}
// 更新状态
export const upInsRead = (data) => {
  return HTTPREQUEST.post('/scrm-socket/instagram/messenging/contacts/updateReadStatus',data)
}
// 更新分配客服
export const upInsFanService = (data) => {
  return HTTPREQUEST.post('/scrm-instagram-message/instagramUser/batchUpdateService',data)
}
// 粉丝标签
export const insFanTags = (params) => {
  return HTTPREQUEST.get(`/scrm-instagram-message/instagramUser/getTagsByInstagramUser/${params.instagramAccountId}/${params.instagramUserId}`)
}
// 添加粉丝标签
export const addInsFanTag = (data) => {
  return HTTPREQUEST.post('/scrm-instagram-message/instagramUser/addTagsToInstagram',data)
}
// 删除标签
export const delInsFanTag = (data) => {
  return HTTPREQUEST.post('/scrm-instagram-message/instagramUser/delTagsToInstagram',data)
}