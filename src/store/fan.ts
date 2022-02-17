import { observable,action } from 'mobx'

interface Fan {
  pageId:string
  senderId:string
  fanId:string
  chatId: string
  fanName:string
  pageName:string
  facebookName:string
  phone:string
  gender:string
  adId:string
  userMd5:string
  payAccount:string
  whatsappAccountId:string|number
  whatsappUserId: string
  whatsappUserName: string
  instagramAccountId: string
  instagramUserId: string
  instagramUserName: string
}
const fan = {
  pageId:'',
  senderId:'',
  fanId:'',
  chatId: '',
  fanName:'',
  pageName:'',
  facebookName:'',
  phone:'',
  gender:'',
  adId:'',
  userMd5:'',
  payAccount:'',
  whatsappAccountId:'',
  whatsappUserId: '',
  whatsappUserName: '',
  instagramAccountId:'',
  instagramUserId: '',
  instagramUserName: ''
}
export class FanStore {
  @observable fan:Fan = fan
  @observable pages:any[] = []
  @observable waAccounts:any[] = []
  @observable insAccounts:any[] = []
  @observable services:any[] = []
  @observable hasNew = false
  @observable showMsg = true
  // 搜索key
  @observable searchForm:any = {
    tagArr: [],
    tagsId: [],
    tagsIdList: []
  }
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
  @action.bound setWaAccounts(data) {
    this.waAccounts = data;
  }
  @action.bound setInsAccounts(data) {
    this.insAccounts = data;
  }
  @action.bound setServices(data) {
    this.services = data;
  }
  @action.bound setHasNew(data) {
    this.hasNew = data;
  }
  @action.bound setSearchFrom(data) {
    this.searchFrom = data;
  }
  @action.bound setSearchForm(data) {
    this.searchForm = data;
  }
  @action.bound setShowMsg(data) {
    this.showMsg = data;
  }
}

export const STORE_FAN = 'fanStore';