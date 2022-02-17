import HTTPREQUEST from "../../servers/http"

// 历史消息
export const getInsHistoryMsg = (data) => {
  return HTTPREQUEST.post('/scrm-socket/instagram/messenging/history', data)
}
// 快捷回复
export const getInsReplys = (params) => {
  return HTTPREQUEST.get('/scrm-instagram-message/instagramQuickReply/InstagramQuickReplys', params)
}
// 流程
export const getInsFlows = (params) => {
  return HTTPREQUEST.get('/scrm-instagram-message/instagramFlows/queryInstagramFlowsByPage', params)
}

export const sendInsFlow = (params) => {
  return HTTPREQUEST.get(`/scrm-instagram-message/instagramUser/sendFlow/${params.instagramAccountId}/${params.instagramUserId}/${params.flowId}`)
}

export const sendInsReply = (params) => {
  return HTTPREQUEST.get(`/scrm-instagram-message/instagramUser/sendQuickReply/${params.instagramAccountId}/${params.instagramUserId}/${params.id}`)
}
