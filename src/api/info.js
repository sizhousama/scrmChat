import HTTPREQUEST from "../servers/http"
// 获取用户信息
export const getUserInfo = () => {
  return HTTPREQUEST.get('/scrm-admin/user/info')
}
// 获取会话数量
export const getMessageNumber = (params) => {
  return HTTPREQUEST.get(`/scrm-report/sellerUsageSummary/getAllUserCount`)
}
// 获取用户主页信息
export const getUserPages = (params) => {
  return HTTPREQUEST.get('/scrm-message/pageConfig/getPageListForProfile',params)
}
// 授权账号
export const getWaAccounts = (params) =>{
  return HTTPREQUEST.get('/scrm-whatsapp-message/whatsappAccount/whatsappAccounts',params)
}
// inszhuye
export const getInsPages = (params) =>{
  return HTTPREQUEST.get('/scrm-instagram-message/instagramAccount/getPageListForProfile',params)
}
// 检查密码
export const checkPass = (data) => {
  return HTTPREQUEST.post('/scrm-admin/user/checkPassWord',data)
}
// 修改密码
export const rePassOrAva = (data) => {
  return HTTPREQUEST.post('/scrm-admin/user/editPasswordOrAvatar',data)
}
// 清除token
export const removeToken = () => {
  return HTTPREQUEST.get('/scrm-admin/user/removeToken')
}

