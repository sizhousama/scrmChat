import Taro from "@tarojs/taro";
import pyfl from 'pyfl'
import {
  IndexesArr
} from "../constant/index"
import {
  getBaseUrl
} from '@/servers/baseUrl'
// 轻提示
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
export const previewImg = (url,arr) => {
  arr?
  Taro.previewImage({
    current: url,
    urls: arr
  })
  :
  Taro.previewImage({
    current: url,
    urls: [url]
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
// 提示音
export const msgAudio = () => {
  const msg = Taro.createInnerAudioContext()
  msg.autoplay = true
  msg.src = 'https://image.hivescrm.cn/image_test/2020/08/25/1598337901984/msg.mp3'
}
// https://image.hivescrm.cn/image_test/2020/08/25/1598337902067/mes2.mp3
// https://image.hivescrm.cn/image_test/2020/08/25/1598337901984/msg.mp3

//上传
export const upload = (url, imgPaths, count, length, list,type) => {
  return new Promise((resolve, reject) => {
    imgPaths.forEach((item,index) => {
      Taro.uploadFile({
        url,
        filePath: type==='img'?item:item.path,
        name: 'file',
        header: {
          'Authorization': Taro.getStorageSync('Token'),
        },
        success(res) {
          const data = JSON.parse(res.data)
          if (data.status !== 1) {
            Toast(data.msg, 'none')
            if (data.status === 401) {
              SetStorageSync("Token", "")
              setTimeout(() => {
                redirectTo('/pages/login/index')
              }, 1500)
            }
          } else {
            if(type==='file'){
              const obj = {name:item.name,url:data.data}
              list = [...list, obj]
            }else{
              list = [...list, data.data]
            } 
          }
        },
        fail(err) {
          console.log(err)
        },
        complete(res) {
          count++
          if (count == length) {
            resolve(list)
          }
        }
      })
    })
  })
}
// 选择图片
export const chooseImg = (url, count) => {
  return new Promise((resolve, reject) => {
    const upUrl = getBaseUrl() + url
    Taro.chooseImage({
      count,
      mediaType:['image', 'video'],
      maxDuration:10,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        const temparr = res.tempFilePaths
        let length = temparr.length; //总共上传的数量
        let count = 0; //第几张，初始化为0
        let imgs = []; //
        //调用上传图片的公共函数
        upload(upUrl, temparr, count, length, imgs,'img').then(res => {
          resolve(res)
        });
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export const chooseMsgFile = (url, count) => {
  return new Promise((resolve, reject) => {
    const upUrl = getBaseUrl() + url
    Taro.chooseMessageFile({
      count,
      type:'all',
      success(res) {
        console.log(res)
        const temparr = res.tempFiles.map(item=>{return {name:item.name,path:item.path}})
        let length = temparr.length; //总共上传的数量
        let count = 0; //第几张，初始化为0
        let files = []; //
        //调用上传图片的公共函数
        upload(upUrl, temparr, count, length, files,'file').then(res => {
          resolve(res)
        });
      },
      fail(err) {
        reject(err)
      }
    })
  })
}



//获取文件后缀
export const getsuffix = (fileName)=>{
  let suffix = '';
  try{
    const flieArr = fileName.split('.');
    suffix = flieArr[flieArr.length - 1];
    console.log(suffix)
  }catch(e){
    console.log(e)
    suffix=''
  }
  
  return suffix.toLocaleLowerCase()
}
// 判断类型
export const getFileType =(origintype)=> {
  // 图片格式
  let result = ''
  const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
  // 进行图片匹配
  result = imglist.find(item => item === origintype);
  if (result) {
    return 'image';
  }
  // // 匹配txt
  // const txtlist = ['txt'];
  // result = txtlist.find(item => item === origintype);
  // if (result) {
  //   return 'txt';
  // }
  // // 匹配 excel
  // const excelist = ['xls', 'xlsx'];
  // result = excelist.find(item => item === origintype);
  // if (result) {
  //   return 'excel';
  // }
  // // 匹配 word
  // const wordlist = ['doc', 'docx'];
  // result = wordlist.find(item => item === origintype);
  // if (result) {
  //   return 'word';
  // }
  // // 匹配 pdf
  // const pdflist = ['pdf'];
  // result = pdflist.find(item => item === origintype);
  // if (result) {
  //   return 'pdf';
  // }
  // // 匹配 ppt
  // const pptlist = ['ppt', 'pptx'];
  // result = pptlist.find(item => item === origintype);
  // if (result) {
  //   return 'ppt';
  // }
  // 匹配 视频
  const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
  result = videolist.find(item => item === origintype);
  if (result) {
    return 'video';
  }
  // 匹配 音频
  const radiolist = ['mp3', 'wav', 'wmv'];
  result = radiolist.find(item => item === origintype);
  if (result) {
    return 'radio';
  }
  // 其他 文件类型
  return 'file';
}

// 判断当前obj对象是否有 key 属性
export const hasProperty = (obj, key) => {
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

// 生成uuid 
export const genUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 插入表情
export const setInput = (id, data, cursor) => {
  var elInput = document.getElementById(id) // 根据id选择器选中对象
  var startPos = cursor // input 第0个字符到选中的字符
  var endPos = cursor // 选中的字符到最后的字符
  if (startPos === undefined || endPos === undefined) return elInput.value + data
  var txt = elInput.value
  // 将表情添加到选中的光标位置
  var result = txt.substring(0, startPos) + data + txt.substring(endPos)
  elInput.value = result // 赋值给input的value
  // 重新定义光标位置
  elInput.focus()
  return result
}
