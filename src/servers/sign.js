import md5 from 'js-md5'

const MD5_SALT = 'f8e36468842037a2059b8394291c9b30'

export default class SignUtil {
  static sign(url, params, data) {
    console.debug('request url', url, 'params:', params, 'data:', data)

    // 1.处理url格式, 去除网关中定义的服务名称那一节
    const urlParam = url.substring(url.indexOf('/', 1))

    // 2.处理params格式
    const queryParam = SignUtil.objectToQueryString(params)

    // 3.处理body格式
    let bodyParam = ''
    if (data) {
      if (data instanceof Object) {
        bodyParam = JSON.stringify(data)
      } else {
        bodyParam = data
      }
    }
    const sign = Array.of(MD5_SALT, urlParam, queryParam, bodyParam)
      .filter((item) => item)
      .join('#')
    console.debug('sign raw', sign)
    return md5(sign)
  }

  /**
   * 将object转换成key=value格式, 字段排序: key按升序处理
   *
   * @param object
   * @param separator 多个值之间分隔的分隔符
   * @returns e.g  a=1#b=2#c=3
   */
  static objectToQueryString(object, separator = '#') {
    let queryString = ''
    Object.keys(object || {})
      .sort()
      // sign字段不参与签名, 字段值为undefined的不参与签名
      .filter((key) => key !== 'sign' && object[key] !== undefined)
      // 字段值是对象的不参与签名
      .filter((key) => Object.prototype.toString.call(object[key]) !== '[object Object]')
      // 值类型为数组的且长度为0的不参与签名
      .filter((key) => !Array.isArray(object[key]) || (Array.isArray(object[key]) && object[key].length > 0))
      .forEach((key) => {
        let paramValue
        if (Array.isArray(object[key])) {
          paramValue = object[key].sort().join(',')
        } else {
          paramValue = object[key] !== null ? object[key] : ''
        }
        if (queryString) {
          queryString += separator
        }
        queryString = `${queryString}${key}=${paramValue}`
      })
    return queryString
  }
}
