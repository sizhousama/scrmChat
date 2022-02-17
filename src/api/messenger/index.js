import HTTPREQUEST from "../../servers/http"

export const getMessengerHistoryMsg = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/history', data)
}

export const getMessengerReplys = (params) => {
  return HTTPREQUEST.get('/scrm-automatic/msgResponseMutation/queryMsgResponseMutationByPage', params)
}

export const getMessengerFlows = (params) => {
  return HTTPREQUEST.get('/scrm-automatic/sop2/querySop2ByPage', params)
}

export const sendMessengerReply = (params) => {
  return HTTPREQUEST.get(`/scrm-message/pageUserData/sendQuickReply/${params.pageId}/${params.senderId}/${params.id}`)
}
