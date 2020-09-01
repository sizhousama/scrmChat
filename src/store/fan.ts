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
  adId:string
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
  adId:''
}

export class FanStore {
  @observable fan:Fan = fan
  @observable pageIds:string = ''
  @observable hasNew = false
  @observable fanSearchKey = ''

  @action.bound setFan(data) {
    this.fan = data;
  }
  @action.bound setPageIds(data) {
    this.pageIds = data;
  }
  @action.bound setHasNew(data) {
    this.hasNew = data;
  }
  @action.bound setFanSearchKey(data) {
    this.fanSearchKey = data;
  }
}

export const STORE_FAN = 'fanStore';