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
  fanKey:string,
  fanPage:string
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
  fanKey:'',
  fanPage:''
}


export class FanStore {
  @observable fan:Fan = fan
  @observable pages:any[] = []
  @observable hasNew = false
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
  @action.bound setSFfanKey(data) {
    this.searchForm.fanKey = data;
  }
  @action.bound setSFfanPage(data) {
    this.searchForm.fanPage = data;
  }
  
}

export const STORE_FAN = 'fanStore';