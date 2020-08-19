import HTTPREQUEST from "../servers/http"

export const getHistoryMsg = (data) => {
  return HTTPREQUEST.post('/scrm-message/messenging/history', data)
}