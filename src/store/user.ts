import { observable,action } from 'mobx'

interface UI {
  avatar:string,
  companyName:string,
  email:string,
  phone:string,
  username:string,
  pageId:any,
  userId:number
}
const userinfo = {
  avatar:'',
  companyName:'',
  email:'',
  phone:'',
  username:'',
  pageId:'',
  userId:0
}
export class UserStore {
  @observable userInfo:UI = userinfo
  @observable role = null

  @action.bound setAvatar(url) {
    this.userInfo.avatar = url;
  }
  @action.bound setUserInfo(data) {
    this.userInfo = data;
  }
  @action.bound setRole(data) {
    this.role = data;
  }
}

export const STORE_USERINFO = 'userInfoStore';