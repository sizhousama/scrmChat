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

export const formatWaMsgStatus = (val) => {
  switch (val) {
    case '': return '发送中'
    case 'sent': return '发送成功'
    case 'delivered': return '已送达'
    case 'read': return '已读'
    case 'failed': return '发送失败'
    default: return '发送中'
  }
}
// 订单状态
export const typeOrderS =(val) =>{
  switch (val) {
    case 0: return '新建'
    case 1: return '已提交订单号截图未评论'
    case 2: return '已评论'
    case 3: return '申请付款'
    case 4: return '订单完成'
    case 5: return '退单'
    case 6: return '已支付一半未评论'
    case 7: return '付款失败'
    case 8: return '人工返款'
    case 9: return '未提交订单已付款'
    case 10: return '未提交订单已付款一半'
    default: return '新建'
  }
}

// 返款状态
// 返款状态filter
export function typeCashOut(val) {
  switch (val) {
    case 0: return '已返款'
    case 1: return '未返款'
    case 2: return '部分返款'
    case 3: return '返款失败'
    default: ''
  }
}