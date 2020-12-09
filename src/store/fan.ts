import { observable,action } from 'mobx'

interface Fan {
  pageId:string,
  senderId:string,
  fanId:string,
  fanName:string,
  pageName:string,
  facebookName:string,
  phone:string,
  gender:string,
  adId:string,
  userMd5:string,
  payAccount:string,
}
interface SF {
  chatKey:string,
  chatPage:string,
  chatTagList:number[],
  fanKey:string,
  fanPage:string,
  operatorType:string
}
const fan = {
  pageId:'',
  senderId:'',
  fanId:'',
  fanName:'',
  pageName:'',
  facebookName:'',
  phone:'',
  gender:'',
  adId:'',
  userMd5:'',
  payAccount:''
}
const sform = {
  chatKey:'',
  chatPage:'',
  chatTagList:[],
  fanKey:'',
  fanPage:'',
  operatorType:'or'
}


export class FanStore {
  @observable fan:Fan = fan
  @observable pages:any[] = []
  @observable hasNew = false
  @observable showMsg = true
  // 搜索key
  @observable searchForm:SF = sform
  @observable searchFrom =  ''
  @action.bound setFan(data) {
    this.fan = data;
  }
  @action.bound setMd5(data) {
    this.fan.userMd5 = data;
  }
  @action.bound setPayAccount(data) {
    this.fan.payAccount = data;
  }
  @action.bound setPages(data) {
    this.pages = data;
  }
  @action.bound setHasNew(data) {
    this.hasNew = data;
  }
  @action.bound setSearchFrom(data) {
    this.searchFrom = data;
  }
  @action.bound setSFchatKey(data) {
    this.searchForm.chatKey = data;
  }
  @action.bound setSFchatPage(data) {
    this.searchForm.chatPage = data;
  }
  @action.bound setSFchatTags(data) {
    this.searchForm.chatTagList = data;
  }
  @action.bound setSFchatOType(data) {
    this.searchForm.operatorType = data;
  }
  @action.bound setSFfanKey(data) {
    this.searchForm.fanKey = data;
  }
  @action.bound setSFfanPage(data) {
    this.searchForm.fanPage = data;
  }
  @action.bound setShowMsg(data) {
    this.showMsg = data;
  }
}

export const STORE_FAN = 'fanStore';