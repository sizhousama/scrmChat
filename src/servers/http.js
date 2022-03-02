import Taro from '@tarojs/taro'
import qs from 'qs'
import {getBaseUrl} from './baseUrl'
import interceptors from './interceptors'

import SignUtil from './sign'

const ignoreSignWhiteList = [
  '/scrm-admin/user/login',
  '/scrm-admin/user/loginByWeiXin',
  '/scrm-admin/user/loginByPhone'
]

interceptors.forEach(interceptorItem => Taro.addInterceptor(interceptorItem))

class httpRequest {
  
  baseOptions(reqParams, method = "GET") {
    let { url, params, data } = reqParams;
    const BASE_URL = getBaseUrl(url);
    let contentType = "application/json";
    contentType = reqParams.contentType || contentType;
    if (!ignoreSignWhiteList.includes(url || '')) {
      const signParam = SignUtil.sign(url || '', params, data)
      params = params ? params : {}
      params['sign'] = signParam
    }
    const d = qs.stringify(params, { arrayFormat: 'repeat' })
    url = url + '?' + d
    const option = {
      url: BASE_URL + url,
      data: data,
      method: method,
      header: {
        'Accept': 'application/json, text/plain, */*',
        'content-type': contentType,
        'Authorization': Taro.getStorageSync('Token'),
        'flag':'miniProgram'
      }
    };
    return Taro.request(option);
  }

  get(url, params = "") {
    let option = { url, params }
    return this.baseOptions(option);
  }

  post(url, data, contentType) {
    let params = { url, data, contentType };
    return this.baseOptions(params, "POST");
  }

  put(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option, "PUT");
  }

  delete(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option, "DELETE");
  }

}

export default new httpRequest()
