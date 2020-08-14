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