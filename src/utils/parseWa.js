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
 
 export function parseWaMsg(waMsg, isServe) {
   msgItem = {}
   if (typeof waMsg === 'string') {
     waMsg = JSON.parse(waMsg)
   }
   // 如果有error字段，则代表为错误提示
   if (hasProperty(waMsg, 'statuses')) {
     return parseWaError(waMsg)
   }
   if (!isServe) {
     const { contacts, messages, whatsappAccountUserId, whatsappAccountId } = waMsg
     // eslint-disable-next-line camelcase
     const { profile, wa_id } = contacts[0]
     msgItem.whatsappAccountUserId = whatsappAccountUserId
     msgItem.whatsappAccountId = whatsappAccountId
     msgItem.whatsappUserName = profile.name
     // eslint-disable-next-line camelcase
     msgItem.whatsappUserId = wa_id
     if (messages[0]) {
       const { from, id, timestamp, type } = messages[0]
       msgItem.senderId = from
       msgItem.timestamp = timestamp * 1000
       msgItem.mid = id
       regroupMsg(messages[0], type, isServe)
       console.groupEnd('单条源数据解析完毕')
       return msgItem
     }
   } else {
     const { type, mid, uuid, to, whatsappAccountUserId, whatsappAccountId, userId } = waMsg
     msgItem.mid = mid
     msgItem.uuid = uuid
     msgItem.userId = userId
     msgItem.whatsappUserId = to
     msgItem.whatsappAccountId = whatsappAccountId
     msgItem.whatsappAccountUserId = whatsappAccountUserId
     regroupMsg(waMsg, type, isServe)
     console.groupEnd('单条源数据解析完毕')
     return msgItem
   }
 }
 
 // 重组数据
 export function regroupMsg(message, type, isServe) {
   if (type === 'text') {
     parseTextMsg(message.text)
   } else if (type === 'image') {
     parseImgMsg(message.image, isServe ? '' : message.scrmUrl, isServe)
   } else if (type === 'voice') {
     parseVoiceMsg(message.voice, isServe ? '' : message.scrmUrl, isServe)
   } else if (type === 'video') {
     parseVideoMsg(message.video, isServe ? '' : message.scrmUrl, isServe)
   } else if (type === 'audio') {
     parseAudioMsg(message.audio, isServe ? '' : message.scrmUrl, isServe)
   } else if (type === 'document') {
     parseFileMsg(message.document, isServe ? '' : message.scrmUrl, isServe)
   } else if (type === 'location') {
     parseLocationMsg(message.location)
   } else if (type === 'sticker') {
     parseStickerMsg(message.sticker)
   } else if (type === 'contacts') {
     parseContactsMsg(message.contacts)
   }
 }
 
 /**
  * @description 解析纯文本信息
  * @params {originMsg,} 源数据，目标数据
  */
 export function parseTextMsg(originMsg) {
   // 处理纯文本信息
   const { body, translateText } = originMsg
   msgItem.type = 'text'
   msgItem.text = body
   msgItem.translateText = translateText
 }
 /**
  * @description 解析纯图片信息
  * @params {originMsg,} 源数据，目标数据
  */
 export function parseImgMsg(originMsg, url, isServe) {
   if (!isServe && !hasProperty(originMsg, 'link')) {
     if (hasProperty(originMsg, 'caption')) {
       msgItem.text = originMsg.caption
     }
   }
   msgItem.type = 'image'
   // 是否是系统发送的，是系统发送的，会有link没参数的情况，caption中直接存储的是base64格式的图片，所以做一个格式处理
   msgItem.imgUrl = isServe ? originMsg.link || 'data:image/png;base64,' + originMsg.caption : url
   msgItem.elements = [
     { payload: { url: isServe ? originMsg.link || 'data:image/png;base64,' + originMsg.caption : url } }
   ]
 }
 // 解析错误信息
 export function parseWaError(originMsg) {
   // 错误信息默认当text文本处理
   const { statuses, whatsappAccountUserId } = originMsg
   const { errors, uuid, status } = statuses[0]
   const { code, title } = errors[0]
   msgItem.whatsappAccountUserId = whatsappAccountUserId
   msgItem.timestamp = ''
   msgItem.uuid = uuid
   msgItem.type = 'text'
   msgItem.status = status
   msgItem.isServe = true // 错误信息默认为主页发送
   msgItem.errorMsg = title
   msgItem.code = code
   return msgItem
 }
 // 解析媒体文件：音频和视频
 export function parseVoiceMsg(originMsg, url, isServe) {
   msgItem.type = 'media'
   msgItem.originType = 'audio'
   msgItem.mediaUrl = isServe ? originMsg.link : url
 }
 export function parseAudioMsg(originMsg, url, isServe) {
   msgItem.type = 'media'
   msgItem.originType = 'audio'
   msgItem.mediaUrl = isServe ? originMsg.link : url
 }
 export function parseVideoMsg(originMsg, url, isServe) {
   msgItem.type = 'media'
   msgItem.originType = 'video'
   msgItem.mediaUrl = isServe ? originMsg.link : url
 }
 // 解析文件类型
 export function parseFileMsg(originMsg, url, isServe) {
   msgItem.type = 'file'
   msgItem.fileUrl = isServe ? originMsg.link : url
   msgItem.filename = originMsg.caption
 }
 // 解析地址类型
 export function parseLocationMsg(originMsg) {
   const { address, latitude, longitude } = originMsg
   msgItem.type = 'location'
   msgItem.address = address
   msgItem.latitude = latitude
   msgItem.longitude = longitude
 }
 // 贴图
 export function parseStickerMsg(originMsg) {
   msgItem.type = 'sticker'
   msgItem.code = originMsg.sha256
 }
 // 会话
 export function parseContactsMsg(originMsg) {
   msgItem.type = 'contacts'
   msgItem.contacts = originMsg
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
 export function judgeWaType(parsedMsg, isServe) {
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
     case 'file':
       lastMsg = isServe ? '你：发了一个文件' : '发来了一个文件'
       break
     case 'location':
       lastMsg = isServe ? '' : '发来了位置'
       break
     case 'sticker':
       lastMsg = isServe ? '' : '发来了一个贴图'
       break
     case 'contacts':
       lastMsg = isServe ? '' : '发来了联系人'
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
 