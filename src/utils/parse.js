/**
 * @description 解析后的数据结构
 * {
 *   attachments: 包含elements字段
 *   elements: 需要渲染的dom模板
 *   mid: 唯一标识符mid postback类型没有mid
 *   imgUrl: 图片链接
 *   isServe: 是否为客服
 *   recipientId: 接受人id
 *   senderId: 发送人id
 *   text: 文本信息
 *   timestamp: 时间戳
 *   type: 消息类型: 文本text 纯图片image 按钮模板button 轮播图模板 generic
 * }
 */

import {
  hasProperty
} from '@/utils/index'
let msgItem = {}

export function parseMsg(fbMsg) {
  msgItem = {}
  if (typeof fbMsg === 'string') {
    fbMsg = JSON.parse(fbMsg)
  }
  // 如果有error字段，则代表为错误提示
  if (hasProperty(fbMsg, 'error')) {
    return parseError(fbMsg)
  }
  const {
    entry,
    userId,
    userName
  } = fbMsg
  msgItem.userId = userId
  msgItem.userName = userName
  if (entry[0].messaging) {
    const {
      messaging,
      id
    } = entry[0]
    const {
      message,
      recipient,
      sender,
      timestamp
    } = messaging[0]

    msgItem.senderId = sender.id
    msgItem.recipientId = recipient.id
    msgItem.timestamp = timestamp
    msgItem.isServe = id === sender.id // 如果id 与sender.id 相同则代表当前为主页发的
    // 如果有postback字段 代表则为按钮触发事件
    if (!hasProperty(messaging[0], 'postback')) {
      // 解析
      // mid 唯一标识
      // postback 目前没有
      msgItem.mid = message.mid
      regroupMsg(message)
      console.groupEnd('单条源数据解析完毕')
      return msgItem
    } else {
      const {
        title
      } = messaging[0].postback
      msgItem.type = 'postback'
      msgItem.text = title
      return msgItem
    }
  } else {
    const {
      standby,
      id
    } = entry[0]
    const {
      message,
      recipient,
      sender,
      timestamp
    } = standby[0]

    msgItem.senderId = sender.id
    msgItem.recipientId = recipient.id
    msgItem.timestamp = timestamp
    msgItem.isServe = id === sender.id // 如果id 与sender.id 相同则代表当前为主页发的
    // 如果有postback字段 代表则为按钮触发事件
    if (!hasProperty(standby[0], 'postback')) {
      // 解析
      // mid 唯一标识
      // postback 目前没有
      msgItem.mid = message.mid
      regroupMsg(message)
      console.groupEnd('单条源数据解析完毕')
      return msgItem
    } else {
      const {
        title
      } = standby[0].postback
      msgItem.type = 'postback'
      msgItem.text = title
      return msgItem
    }
  }
}

// 重组数据
export function regroupMsg(message) {
  // image 和 generic 类型消息 有 attachments 字段
  if (hasProperty(message, 'attachments')) {
    const {
      attachments
    } = message
    const {
      type
    } = attachments[0]
    if (type === 'image') {
      // 图片处理
      parseImgMsg(message)
    } else if (type === 'fallback') {
      parseFallBack(message)
    } else if (type === 'audio' || type === 'video') {
      // 处理媒体文件
      parseMediaMsg(message)
    } else if (type === 'file') {
      // 处理文件类型
      parseFileMsg(message)
    } else {
      const {
        payload = {}
      } = attachments[0]
      const {
        template_type = ''
      } = payload
      if (template_type === 'button') {
        parseBtnMsg(message)
      } else if (hasProperty(payload, 'elements') && !hasProperty(payload.elements[0], 'image_url')) {
        parseNotify(message)
      } else {
        parseGeneMsg(message)
      }
    }
  } else {
    parseTextMsg(message)
  }
}

/**
 * @description 解析纯文本信息
 * @params {originMsg,} 源数据，目标数据
 */
export function parseTextMsg(originMsg) {
  // 处理纯文本信息
  // 将源数据的text 字段给目标对象
  const {
    text
  } = originMsg
  msgItem.type = 'text'
  msgItem.text = text
  // 判断是否有profile链接(profile检测使用)
  if (hasProperty(originMsg, 'nlp')) {
    msgItem.amazonProfile = originMsg.nlp.amazonProfile
  }
}

/**
 * @description 解析纯图片信息
 * @params {originMsg,} 源数据，目标数据
 */
export function parseImgMsg(originMsg) {
  const {
    attachments,
    text = ''
  } = originMsg
  const {
    type,
    payload
  } = attachments[0]
  msgItem.type = type
  msgItem.text = text
  msgItem.imgUrl = payload.url
  msgItem.elements = attachments
}

/**
 * @description 需要注意的是 facebook 传来的消息中 按钮模板和轮播图模板的type 同为 template，所以用payload中的template_type 字段来区分
 * @description 解析纯按钮消息
 */
export function parseBtnMsg(originMsg) {
  // 如果没有attachment 字段或 type 字段不为 template(模板) 则直接退出
  const {
    attachments,
    text
  } = originMsg
  const {
    payload = {}
  } = attachments[0]
  const {
    template_type = '', buttons = []
  } = payload
  msgItem.text = text
  msgItem.type = template_type // 按钮模板和轮播图模板的 type 字段 由payload 中的template_type 决定
  msgItem.attachments = attachments
  msgItem.elements = buttons // 渲染数据
}
/**
 * @description 解析generic模板信息
 * @param {*} originMsg
 * @param {*}
 */
export function parseGeneMsg(originMsg) {
  // 如果没有attachments 字段或 type 字段不为 template(模板类型) 则直接退出
  const {
    attachments,
    text
  } = originMsg
  const {
    payload = {}
  } = attachments[0]
  const {
    template_type = '', elements
  } = payload
  msgItem.text = text
  msgItem.type = template_type // 按钮模板和轮播图模板的 type 字段 由payload 中的template_type 决定
  msgItem.attachments = attachments
  msgItem.elements = elements // 渲染数据
}

/**
 * @description 解决点击按钮后的postback数据
 */
export function parsePostBack(originMsg) {
  const {
    title
  } = originMsg
  // postback类型消息 从text改为 postback 用postback组件渲染
  msgItem.type = 'postback'
  msgItem.text = title
}
/**
 * @description 解析 fallback 类型信息
 */
export function parseFallBack(originMsg) {
  const { text, attachments } = originMsg
  msgItem.type = 'fallback'
  if (text) {
    msgItem.text = text
  } else {
    msgItem.text = attachments[0].payload.url
  }
}
/**
 * @description 处理 generic 中出现的 notify信息
 */
export function parseNotify(originMsg) {
  const {
    attachments,
    text
  } = originMsg
  const {
    payload = {}
  } = attachments[0]
  const {
    elements
  } = payload
  msgItem.text = text
  msgItem.type = 'notify' // 按钮模板和轮播图模板的 type 字段 由payload 中的template_type 决定
  msgItem.attachments = attachments
  msgItem.elements = elements // 渲染数据
}

// 解析错误信息
export function parseError(originMsg) {
  // 错误信息默认当text文本处理
  const {
    error,
    msg
  } = originMsg
  const {
    type
  } = error
  const {
    pageId,
    senderId
  } = msg
  msgItem.senderId = pageId
  msgItem.recipientId = senderId
  msgItem.timestamp = ''
  msgItem.type = 'text'
  msgItem.text = msg.msg
  msgItem.isServe = true // 错误信息默认为主页发送
  msgItem.errorMsg = type
  return msgItem
}

// 解析媒体文件：音频和视频
export function parseMediaMsg(originMsg) {
  const {
    attachments
  } = originMsg
  const {
    type,
    payload
  } = attachments[0]
  msgItem.type = 'media'
  msgItem.originType = type
  msgItem.mediaUrl = payload.url
  msgItem.elements = attachments
}

// 解析文件类型
export function parseFileMsg(originMsg) {
  const {
    attachments
  } = originMsg
  const {
    type,
    payload
  } = attachments[0]
  const {
    url = ''
  } = payload
  msgItem.type = type
  msgItem.fileUrl = url
  msgItem.filename = url.slice(url.lastIndexOf('/') + 1, url.length)
  msgItem.elements = attachments
}

// 生成uuid 参数发消息带上
export function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 *
 * @param {解析后的消息} parsedMsg
 * @return 返回用户的最后信息展示
 */
export function judgeType(parsedMsg) {
  const {
    type,
    text = ''
  } = parsedMsg
  let lastMsg = ''
  switch (type) {
    case 'text':
      lastMsg = text;
      break
    case 'postback':
      lastMsg = text;
      break
    case 'image':
      lastMsg = '发来了图片';
      break
    case 'generic':
      lastMsg = '发来了轮播图';
      break
    case 'button':
      lastMsg = '发来了按钮模板';
      break
    default:
      return text
  }
  return lastMsg
}

/**
 *
 * @param {解析后的消息} parsedMsg
 * @return 返回用户的最后信息展示
 */
export function judgeMyType(parsedMsg) {
  const {
    type,
    text = ''
  } = parsedMsg
  let lastMsg = ''
  switch (type) {
    case 'text':
      lastMsg = text;
      break
    case 'postback':
      lastMsg = text;
      break
    case 'image':
      lastMsg = '发送了一张图片';
      break
    case 'generic':
      lastMsg = '发送了轮播图';
      break
    case 'button':
      lastMsg = '发送了按钮模板';
      break
    default:
      return text
  }
  return lastMsg
}

/**
 * @description 根据文件的类型 分配对应的渲染 msg-view 类型
 */
export function tellFileType(file) {
  const {
    name
  } = file
  const fileType = {
    type: '',
    originType: ''
  }

  const imgFiles = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
  const videoFiles = ['mp4', 'avi', 'webm']
  const audioFiles = ['mp3']

  // 解析出文件的类型
  const originType = name.slice(name.lastIndexOf('.') + 1, name.length).toLowerCase()

  if (imgFiles.includes(originType)) {
    // 图片
    fileType.type = 'image'
    fileType.originType = originType
  } else if (videoFiles.includes(originType)) {
    // 视频
    fileType.type = 'media'
    fileType.originType = 'video'
  } else if (audioFiles.includes(originType)) {
    // 音频
    fileType.type = 'media'
    fileType.originType = 'audio'
  } else {
    // 其他按文件处理
    fileType.type = 'file'
    fileType.originType = 'file'
  }

  return fileType
}
