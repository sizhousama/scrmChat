import Taro from "@tarojs/taro";
import pyfl from 'pyfl'
import {IndexesArr} from "../constant/index"
export const Toast = (title,icon,dur) =>{
  icon = icon || 'success'
  dur = dur || 1500
  Taro.showToast({
    title,
    icon,
    mask:true,
    duration:dur
  })
}
// 导航
export const NavTo = (url) =>{
  Taro.navigateTo({
    url
  })
}
// 返回上一页
export const Back = () =>{
  Taro.navigateBack()
}

// 获取系统信息
export const getSysInfo = () =>{
  let info = {}
  Taro.getSystemInfo({
    success(res){
      info = res
    }
  })
  return info
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
  const arr = JSON.parse(JSON.stringify(IndexesArr))
  list.forEach(o=>{
    let first = pyfl(o[keyword]).substring(0,1)
    if(/[a-zA-Z]/.test(first)){
      first = first.toUpperCase()
      arr.forEach(i=>{
        if(i.title === first){
          i.items.push(o)
        }
      })
    }else{
      arr[26].items.push(o)
    }
  })
  console.log(arr)
  return arr
}