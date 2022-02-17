import Taro from '@tarojs/taro'
import qs from 'qs'
import {getBaseUrl} from './baseUrl'
import interceptors from './interceptors'

interceptors.forEach(interceptorItem => Taro.addInterceptor(interceptorItem))

class httpRequest {
  
  baseOptions(params, method = "GET") {
    let { url, data } = params;
    const BASE_URL = getBaseUrl(url);
    let contentType = "application/json";
    contentType = params.contentType || contentType;
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

  get(url, data = "") {
    const d = qs.stringify(data, { arrayFormat: 'repeat' })
    let option = { url: url + `?${d}`, data: '' }
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
