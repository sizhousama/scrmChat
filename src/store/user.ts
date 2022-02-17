import { observable,action } from 'mobx'

interface UI {
  avatar:string,
  companyName:string,
  email:string,
  phone:string,
  username:string,
  pageId:any,
  userId:number,
  wxMiniInfo:any
}
const userinfo = {
  avatar:'',
  companyName:'',
  email:'',
  phone:'',
  username:'',
  pageId:'',
  userId:0,
  wxMiniInfo:''
}
export class UserStore {
  @observable userInfo:UI = userinfo
  @observable role = null
  @observable allTags:any[] = []
  @observable type = 'messenger'
  @observable themeColor = '#5880F4'
  @observable messageCount:any = {}

  @action.bound setAvatar(url) {
    this.userInfo.avatar = url;
  }
  @action.bound setWxInfo(data) {
    this.userInfo.wxMiniInfo = data;
  }
  @action.bound setUserInfo(data) {
    this.userInfo = data;
  }
  @action.bound setRole(data) {
    this.role = data;
  }
  @action.bound setAllTags(data) {
    this.allTags = data;
  }
  @action.bound setType(data) {
    this.type = data;
  }
  @action.bound setColor(data) {
    this.themeColor = data;
  }
  @action.bound setMessageCount(data) {
    this.messageCount = data;
  }
}

export const STORE_USERINFO = 'userInfoStore';