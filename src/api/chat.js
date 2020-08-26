import HTTPREQUEST from "../servers/http"

// 历史消息
export const getHistoryMsg = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/history', data)
}
// 客服
export const getServices = () => {
  return HTTPREQUEST.get('/scrm-admin/user/getServiceList')
}
// 快捷回复
export const getReplys = (params) => {
  return HTTPREQUEST.get('/scrm-automatic/msgResponseMutation/queryMsgResponseMutationByPage', params)
}
