// 请求地址
export const getBaseUrl = (url) => {
  let BASE_URL = '';
  if (process.env.NODE_ENV === 'development') {
    //开发环境 - 根据请求不同返回不同的BASE_URL
    // BASE_URL = 'https://back.hivescrm.cn'
    BASE_URL = 'https://back.hivemarket.top'
  } else {
    // 生产环境
    // BASE_URL = 'https://back.hivescrm.cn'
    BASE_URL = 'https://back.hivemarket.top'
  }
  return BASE_URL
}
// 图片地址
export const imgUrl = (url) => {
  let IMG_URL = '';
  IMG_URL = process.env.NODE_ENV === 'development' ? 'https://image.hivescrm.cn/image_test':'https://image.hivescrm.cn/image'
  return IMG_URL
}