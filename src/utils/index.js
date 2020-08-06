import Taro from "@tarojs/taro";

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

