import Taro from "@tarojs/taro"
import { pageToLogin } from "./utils"
import { HTTP_STATUS } from './config'
import {Toast,SetStorageSync} from '../utils/index'
const customInterceptor = (chain) => {

  const requestParams = chain.requestParams

  return chain.proceed(requestParams).then(res => {
    if (res.statusCode === HTTP_STATUS.SUCCESS) {
      const {
        data
      } = res
      const {
        msg,
        status
      } = data
      const errdata = data.data
      if (status !== 1) {
        if (errdata) {
          Toast(errdata,'none')
        } else {
          Toast(msg,'none')
        }
        if (status === 401) {
          SetStorageSync("Token", "")
          pageToLogin()
        }
        return Promise.reject(msg || 'Error')
      } else {
        return data
      }
    }else if(res.statusCode === HTTP_STATUS.FORBIDDEN){
      SetStorageSync("Token", "")
      pageToLogin()
      // TODO 根据自身业务修改
      return Promise.reject("没有权限访问");
    }else if(res.statusCode === HTTP_STATUS.AUTHENTICATE){
      SetStorageSync("Token", "")
      pageToLogin()
      return Promise.reject("需要鉴权")
    }else{
      console.log(res)
    }
  })
}

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。
const interceptors = [customInterceptor, Taro.interceptors.logInterceptor]

export default interceptors
