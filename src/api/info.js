import HTTPREQUEST from "../servers/http"
// 获取用户信息
export const getUserInfo = () => {
  return HTTPREQUEST.get('/scrm-admin/user/info')
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

// 上传头像
export const uploadAva = (data) => {
  return HTTPREQUEST.post('/scrm-seller/utils/uploadFileAvatarByUrl',data)
}