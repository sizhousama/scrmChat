export const IndexesArr = [{
    title: 'A',
    key: 'A',
    items: []
  },
  {
    title: 'B',
    key: 'B',
    items: []
  },
  {
    title: 'C',
    key: 'C',
    items: []
  },
  {
    title: 'D',
    key: 'D',
    items: []
  },
  {
    title: 'E',
    key: 'E',
    items: []
  },
  {
    title: 'F',
    key: 'F',
    items: []
  },
  {
    title: 'G',
    key: 'G',
    items: []
  },
  {
    title: 'H',
    key: 'H',
    items: []
  },
  {
    title: 'I',
    key: 'I',
    items: []
  },
  {
    title: 'J',
    key: 'J',
    items: []
  },
  {
    title: 'K',
    key: 'K',
    items: []
  },
  {
    title: 'L',
    key: 'L',
    items: []
  },
  {
    title: 'M',
    key: 'M',
    items: []
  },
  {
    title: 'N',
    key: 'N',
    items: []
  },
  {
    title: 'O',
    key: 'O',
    items: []
  },
  {
    title: 'P',
    key: 'P',
    items: []
  },
  {
    title: 'Q',
    key: 'Q',
    items: []
  },
  {
    title: 'R',
    key: 'R',
    items: []
  },
  {
    title: 'S',
    key: 'S',
    items: []
  },
  {
    title: 'T',
    key: 'T',
    items: []
  },
  {
    title: 'U',
    key: 'U',
    items: []
  },
  {
    title: 'V',
    key: 'V',
    items: []
  },
  {
    title: 'W',
    key: 'W',
    items: []
  },
  {
    title: 'X',
    key: 'X',
    items: []
  },
  {
    title: 'Y',
    key: 'Y',
    items: []
  },
  {
    title: 'Z',
    key: 'Z',
    items: []
  },
  {
    title: '#',
    key: 'other',
    items: []
  },
]
// 表情
export const Emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😌', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '😘', '😗',
  '😙', '😚', '😋', '😜', '😝', '😛', '🤑', '🤗', '🤓', '😎', '🤡', '🤠', '😏', '😒', '😞', '😔', '😟', '😕',
  '🙁', '🙁', '☹️', '😣', '😖', '😫', '😩', '😤', '😠', '😡', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲',
  '😵', '😳', '😱', '😨', '😰', '😢', '😥', '🤤', '😭', '😓', '😪', '😴', '🙄', '🤔', '🤥', '😬', '🤐', '🤢',
  '🤧', '😷', '🤒', '🤕', '😈', '👿', '👹', '👺', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸',
  '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👐', '🙌', '👏', '🙏', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜',
  '🤞', '✌', '🤘', '👌', '👈', '👉', '👆', '👇', '☝', '✋', '🤚', '🖐', '🖖', '👋', '🤙', '💪', '🖕', '✍', '🤳',
  '💅', '💍', '💄', '💋', '👄', '👅', '👂', '👃', '👣', '👁', '👀', '🗣', '👤', '👥'
]
// 返款状态
export const cashOutStatus = [{
    value: 0,
    label: '已返款'
  },
  {
    value: 1,
    label: '未返款'
  },
  {
    value: 2,
    label: '已返部分'
  },
  {
    value: 3,
    label: '付款失败'
  }
]
export const cashOuts = ['已返款', '未返款', '已返部分', '付款失败']

// 订单表单
export const orderForm = [{
    title: '商品信息',
    fitems: [{
        key: 'keyword',
        label: '商品ID：',
        type: 'input',
        otherType: 'text',
        ph:'请输入ID或名称搜索',
        disable:false,
        require:true,
        range:[],
        show:true
      },
      {
        key: 'storeName',
        label: '店铺名称：',
        type: 'input',
        otherType: 'text',
        ph:'店铺名称',
        disable:true,
        require:true,
        range:[],
        show:true
      },
      {
        key: 'asin',
        label: 'ASIN：',
        type: 'input',
        otherType: 'text',
        ph:'asin',
        disable:true,
        require:true,
        range:[],
        show:true
      },
      {
        key: 'scalpingProductPrice',
        label: '商品价格：',
        type: 'input',
        otherType: 'digit',
        ph:'请输入',
        disable:false,
        require:true,
        range:[],
        show:true
      }
    ]
  },
  {
    title: '订单信息',
    fitems: [
      {
        key: 'orderNumber',
        label: '订单编号：',
        type: 'input',
        otherType: 'text',
        ph:'请输入',
        disable:false,
        require:false,
        range:[],
        show:true
      },
      {
        key: 'orderImageDate',
        label: '订单日期：',
        type: 'date',
        disable:false,
        require:false,
        range:[],
        show:true,
      },
      {
        key: 'orderPrice',
        label: '订单金额：',
        type: 'input',
        otherType: 'digit',
        ph:'请输入',
        disable:false,
        require:false,
        range:[],
        show:true
      },
      {
        key: 'orderCommission',
        label: '额外费用：',
        type: 'input',
        otherType: 'digit',
        ph:'请输入',
        disable:false,
        require:false,
        range:[],
        show:true
      },
      {
        key: 'cashOutPrice',
        label: '返款金额：',
        type: 'input',
        otherType: 'digit',
        ph:'订单金额 + 佣金',
        disable:true,
        require:false,
        range:[],
        show:true
      },
      {
        key: 'includedTax',
        label: 'Paypal手续费：',
        type: 'radio',
        range:[
          {label:'包含',value:'1'},
          {label:'不包含',value:'0'}
        ],
        require:false,
        show:true,
        disable:false
      },
      {
        key: 'orderImgType',
        label: '截图类型：',
        type: 'radio',
        range:[
          {label:'手机',value:'1'},
          {label:'电脑',value:'2'}
        ],
        require:false,
        show:true,
        disable:false
      },
      {
        key: 'categoryId',
        label: '订单分组：',
        type: 'selector',
        require:false,
        disable:false,
        range:[],
        show:true,
      },
      {
        key: 'orderNote',
        label: '订单备注：',
        type: 'input',
        otherType: 'text',
        ph:'请输入',
        disable:false,
        require:false,
        range:[],
        show:true
      },
      {
        key: 'orderImage',
        label: '订单截图：',
        type: 'img',
        disable:false,
        require:false,
        range:[],
        show:true,
      },
    ]
  },
  {
    title: '测评信息',
    fitems: [
      {
        key: 'commentWay',
        label: '评论方式：',
        type: 'selector',
        require:true,
        disable:false,
        range: [{
            value: 0,
            label: '文字留评'
          },
          {
            value: 1,
            label: '免评'
          },
          {
            value: 2,
            label: '图片留评'
          },
          {
            value: 3,
            label: '视频留评'
          },
          {
            value: 4,
            label: '星级评价'
          },
          {
            value: 5,
            label: 'feedback'
          }
        ],
        show:true,
      },
      {
        key: 'cashOutType',
        label: '返款方式：',
        type: 'selector',
        disable:false,
        require:true,
        range:[
        { value: 12, label: '人工返款' },
        { value: 10, label: '评前返' },
        { value: 11, label: '评前半返' },
        { value: 9, label: '评后全返' },
        { value: 13, label: '发货后全返' },
        { value: 6, label: '发货返一半，评后返一半' },
        { value: 8, label: '收货返一半，评后返一半' },
        { value: 4, label: '下单返一半，评后返一半' }],
        show:true,
      },
      {
        key: 'isCashout',
        label: '返款状态：',
        type: 'selector',
        disable:true,
        require:false,
        range:cashOutStatus,
        show:true,
      },
      {
        key: 'orderChannelId',
        label: '订单来源：',
        type: 'selector',
        require:true,
        range:[
        { value: 0, label: 'FB' },
        { value: 1, label: '非FB' }],
        show:true,
        disable:false
      },
      {
        key: 'amazonOrderStatus',
        label: '亚马逊订单状态：',
        type: 'selector',
        require:false,
        disable:false,
        range:[
        { value: 0, label: '无记录' },
        { value: 1, label: '未完成' },
        { value: 2, label: '退货' },
        { value: 3, label: '已发货' },
        { value: 4, label: '其他' },
        { value: 5, label: '已取消' }],
        show:true,
      },
      {
        key: 'commentUrl',
        label: '评论链接：',
        type: 'input',
        otherType: 'text',
        ph:'请输入',
        disable:false,
        require:false,
        range:[],
        show:true
      },
      {
        key: 'commentImage',
        label: '评论截图：',
        type: 'img',
        disable:false,
        require:false,
        range:[],
        show:true,
      }
    ]
  },
  {
    title:'买家信息',  
    fitems:[
      {
        key: 'payWay',
        label: '收款方式：',
        type: 'selector',
        require:true,
        disable:false,
        range:[
          { value: 1, label: 'PayPal' },
          { value: 3, label: 'Alipay(支付宝)' },
          { value: 4, label: 'WeChat(微信)' },
          { value: 5, label: '礼品卡' }],
        show:true,
      },
      {
        key: 'giftCard',
        label: '礼品码：',
        type: 'input',
        otherType: 'text',
        ph:'请输入',
        disable:false,
        require:false,
        range:[],
        show:false
      },
      {
        key: 'paypalAccount',
        label: '收款账号：',
        type: 'input',
        otherType: 'text',
        ph:'请输入',
        disable:false,
        require:true,
        range:[],
        show:true
      },
    ]
  }

]
