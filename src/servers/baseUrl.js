// 请求地址

const urlObj = {
  'development':{
    baseUrl: 'https://back.hivescrm3.top',
    imgUrl: 'https://image.hivescrm.cn/image_test',
    // baseUrl: 'https://back.hivescrm.cn',
    // imgUrl: 'https://image.hivescrm.cn/image',
  },
  'production':{
    baseUrl: 'https://back.hivescrm.cn',
    imgUrl: 'https://image.hivescrm.cn/image',
    // baseUrl: 'https://back.hivescrm3.top',
    // imgUrl: 'https://image.hivescrm.cn/image_test',
  }
}

export const getBaseUrl = () => {
  return urlObj[process.env.NODE_ENV].baseUrl
}
// 图片地址
export const imgUrl = () => {
  return urlObj[process.env.NODE_ENV].imgUrl
}

// socket地址
export const socketUrl = () => {
  return `${urlObj[process.env.NODE_ENV].baseUrl}?`
}