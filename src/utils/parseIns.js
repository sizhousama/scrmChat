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

 import { hasProperty } from '@/utils/index'

 let msgItem = {}
 
 export function parseInsMsg(waMsg) {
   msgItem = {}
   if (typeof waMsg === 'string') {
     waMsg = JSON.parse(waMsg)
   }
   // 如果有error字段，则代表为错误提示
   if (hasProperty(waMsg, 'status')) {
     return parseError(waMsg)
   }
   const { entry, uuid, userId } = waMsg
   const { messaging = [], standby = [], id, instagramAccountId } = entry[0]
   const { message, recipient, timestamp, sender } = messaging[0] || standby[0]
   const isServe = id === sender.id
   msgItem.isServe = isServe
   if (!isServe) {
     msgItem.instagramAccountUserId = id
     msgItem.instagramAccountId = instagramAccountId
     msgItem.instagramUserId = sender.id
     msgItem.recipient = recipient.id
     msgItem.sender = sender.id
     if (JSON.stringify(message) !== '{}') {
       const { mid } = message
       msgItem.timestamp = timestamp
       msgItem.mid = mid
       regroupMsg(message)
       console.groupEnd('单条源数据解析完毕')
       return msgItem
     }
   } else {
     // const { entry } = waMsg
     // const { messaging, id, instagramAccountId } = entry[0]
     // const { message, timestamp, sender } = messaging[0]
     msgItem.uuid = uuid
     msgItem.mid = message.mid
     msgItem.userId = userId
     msgItem.timestamp = timestamp
     msgItem.sender = sender.id
     msgItem.recipient = recipient.id
     msgItem.instagramUserId = recipient.id
     msgItem.instagramAccountId = instagramAccountId
     msgItem.instagramAccountUserId = id
     msgItem.translateText = message.translateText
     regroupMsg(message)
     console.groupEnd('单条源数据解析完毕')
     return msgItem
   }
 }
 
 // 重组数据
 export function regroupMsg(message) {
   if (hasProperty(message, 'attachments')) {
     const { attachments, is_deleted } = message
     const { type } = attachments[0]
     if (type === 'image') {
       parseImgMsg(message)
     } else if (type === 'voice') {
       parseVoiceMsg(message)
     } else if (type === 'video') {
       parseVideoMsg(message)
     } else if (type === 'media') {
       parseImgMsg(message)
     } else if (type === 'audio') {
       parseAudioMsg(message)
     } else if (type === 'sticker') {
       parseStickerMsg(message.sticker)
     } else if (type === 'link') {
       parseTextMsg(message)
     } else if (type === 'story_mention') {
       console.log('快拍回复')
     }
     if (message.reply_to) {
       console.log('快拍提及')
     }
     if (is_deleted) {
       parseWithdraw(message)
     }
   } else {
     // 没有类型统一按文本类型处理
     parseTextMsg(message)
   }
 }
 
 /**
  * @description 解析纯文本信息
  * @params {originMsg,} 源数据，目标数据
  */
 export function parseTextMsg(originMsg) {
   // 处理纯文本信息
   msgItem.type = 'text'
   msgItem.text = originMsg.text
   msgItem.translateText = originMsg.translateText
 }
 /**
  * @description 解析纯图片信息
  * @params {originMsg,} 源数据，目标数据
  */
 export function parseImgMsg(originMsg) {
   const { attachments } = originMsg
   const { type, payload } = attachments[0]
   msgItem.type = type
   msgItem.imgUrl = payload.url
   msgItem.elements = attachments
 }
 // 解析错误信息
 export function parseError(originMsg) {
   // 错误信息默认当text文本处理
   const { status, uuid, data, msg, senderId } = originMsg
   const { code } = data
   msgItem.instagramUserId = senderId.id
   msgItem.timestamp = ''
   msgItem.uuid = uuid
   msgItem.type = 'text'
   msgItem.status = status
   msgItem.isServe = true // 错误信息默认为主页发送
   msgItem.errorMsg = msg
   msgItem.code = code
   return msgItem
 }
 // 解析媒体文件：音频和视频
 export function parseVoiceMsg(originMsg) {
   const { attachments } = originMsg
   const { type, payload } = attachments[0]
   msgItem.type = 'media'
   msgItem.originType = type
   msgItem.mediaUrl = payload.url
 }
 export function parseAudioMsg(originMsg) {
   const { attachments } = originMsg
   const { type, payload } = attachments[0]
   msgItem.type = 'media'
   msgItem.originType = type
   msgItem.mediaUrl = payload.url
 }
 export function parseVideoMsg(originMsg) {
   const { attachments } = originMsg
   const { type, payload } = attachments[0]
   msgItem.type = 'media'
   msgItem.originType = type
   msgItem.mediaUrl = payload.url
 }
 
 // 撤回消息
 export function parseWithdraw(originMsg) {
   msgItem.type = 'withdraw'
   msgItem.mid = originMsg.mid
 }
 
 // 贴图
 export function parseStickerMsg(originMsg) {
   msgItem.type = 'sticker'
   msgItem.code = originMsg.sha256
 }
 
 // 生成uuid 参数发消息带上
 export function createUuid() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
     var r = (Math.random() * 16) | 0
     var v = c === 'x' ? r : (r & 0x3) | 0x8
     return v.toString(16)
   })
 }
 
 /**
  *
  * @param {解析后的消息} parsedMsg
  * @return 返回用户的最后信息展示
  */
 export function judgeInsType(parsedMsg, isServe) {
   const { type, text = '' } = parsedMsg
   let lastMsg = ''
   switch (type) {
     case 'text':
       lastMsg = isServe ? `你：${text}` : text
       break
     case 'image':
       lastMsg = isServe ? '你：发了一张图片' : '发来了一张图片'
       break
     case 'media':
       lastMsg = isServe ? '你：发了一个媒体文件' : '发来了一个媒体'
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
   const { name } = file
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
 