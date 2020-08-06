import HTTPREQUEST from "../servers/http"

export const login = (data) => {
  return HTTPREQUEST.post('/scrm-admin/user/login', data)
}