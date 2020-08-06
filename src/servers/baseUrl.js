const getBaseUrl = (url) => {
  let BASE_URL = '';
  if (process.env.NODE_ENV === 'development') {
    //开发环境 - 根据请求不同返回不同的BASE_URL
    BASE_URL = 'https://back.hivemarket.top'
  } else {
    // 生产环境
    BASE_URL = 'https://back.hivescrm.cn'
  }
  return BASE_URL
}

export default getBaseUrl;
