export const formatMsgStatus =(val) =>{
  switch (val) {
    case 0: return '发送中'
    case 1: return '发送成功'
    case 2: return '已送达'
    case 3: return '已读'
    case 4: return '未送达'
    case -1: return '发送失败'
    default: return '发送中'
  }
}