import Taro from "@tarojs/taro";
import pyfl from 'pyfl'
export const Toast = (title,icon) =>{
  icon = icon || 'success'
  Taro.showToast({
    title,
    icon,
    mask:true,
    duration:1500
  })
}

export const SetStorageSync = (key,data) =>{
  Taro.setStorageSync(key,data)
}

export const SwitchTab = (url) =>{
  Taro.switchTab({url})
}




// 处理数据方法
// 将列表处理成atindexes需要的数据结构
export const toIndexes = (list,keyword) =>{
  
  
}