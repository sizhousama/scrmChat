import Taro from "@tarojs/taro";
import pyfl from 'pyfl'
import {
  IndexesArr
} from "../constant/index"
import {
  getBaseUrl
} from '@/servers/baseUrl'


export const Toast = (title, icon, dur) => {
  icon = icon || 'success'
  dur = dur || 1500
  Taro.showToast({
    title,
    icon,
    mask: true,
    duration: dur
  })
}
// 导航
export const NavTo = (url) => {
  Taro.navigateTo({
    url
  })
}
// 返回上一页
export const Back = () => {
  Taro.navigateBack()
}

// 获取系统信息
export const getSysInfo = () => {
  let info = {}
  Taro.getSystemInfo({
    success(res) {
      info = res
    }
  })
  return info
}
// 预览
export const previewImg = (url) => {
  Taro.previewImage({
    current:url,
    urls:[url]
  })
}
// 同步缓存
export const SetStorageSync = (key, data) => {
  Taro.setStorageSync(key, data)
}
// 切换tab
export const SwitchTab = (url) => {
  Taro.switchTab({
    url
  })
}
// 重定向
export const redirectTo = (url) => {
  Taro.redirectTo({
    url,
  })
}

// 判断当前obj对象是否有 key 属性
export const hasProperty = (obj, key) =>{
  return obj.hasOwnProperty(key)
}

// 处理数据方法
// 将列表处理成atindexes需要的数据结构
export const toIndexes = (list, keyword) => {
  const arr = JSON.parse(JSON.stringify(IndexesArr))
  list.forEach(o => {
    let first = pyfl(o[keyword]).substring(0, 1)
    if (/[a-zA-Z]/.test(first)) {
      first = first.toUpperCase()
      arr.forEach(i => {
        if (i.title === first) {
          i.items.push(o)
        }
      })
    } else {
      arr[26].items.push(o)
    }
  })
  console.log(arr)
  return arr
}
