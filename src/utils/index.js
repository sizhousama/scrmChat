import Taro from "@tarojs/taro";
import pyfl from 'pyfl'
import {IndexesArr} from "../constant/index"
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
  const arr = JSON.parse(JSON.stringify(IndexesArr))
  list.forEach(o=>{
    const first = pyfl(o[keyword]).substring(0,1)
    if(/[A-Z]/.test(first)){
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