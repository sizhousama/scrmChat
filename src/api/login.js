import HTTPREQUEST from "../servers/http"

export const login = (data) => {
  return HTTPREQUEST.post('/scrm-admin/user/login', data)
}

export const bindWeChat = (data) => {
  return HTTPREQUEST.get('/scrm-admin/user/weiXinBinding', data)
}

export const getCaptcha = (data) => {
  return HTTPREQUEST.get('/scrm-admin/user/captcha', data)
}