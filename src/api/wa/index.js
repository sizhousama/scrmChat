import HTTPREQUEST from "../../servers/http"

export const getWaHistoryMsg = (data) => {
  return HTTPREQUEST.post('/scrm-socket/whatsapp/messenging/history', data)
}

export const getWaReplys = (params) => {
  return HTTPREQUEST.get('/scrm-whatsapp-message/whatsappQuickReply/whatsappQuickReplys', params)
}

export const getWaFlows = (params) => {
  return HTTPREQUEST.get('/scrm-whatsapp-message/whatsappFlows/queryWhatsAppFlowsByPage', params)
}

export const getWaMsgTemps = (params) => {
  return HTTPREQUEST.get(`/scrm-whatsapp-message/whatsappAccount/templates/${params.whatsappAccountId}/${params.name}`)
}

export const sendWaFlow = (params) => {
  return HTTPREQUEST.get(`/scrm-whatsapp-message/whatsappUser/sendFlow/${params.whatsappAccountId}/${params.whatsappUserId}/${params.flowId}`)
}

export const sendWaReply = (params) => {
  return HTTPREQUEST.get(`/scrm-whatsapp-message/whatsappUser/sendQuickReply/${params.whatsappAccountId}/${params.whatsappUserId}/${params.id}`)
}
