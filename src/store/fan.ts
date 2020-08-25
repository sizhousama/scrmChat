import { observable,action } from 'mobx'

interface Fan {
  pageId:string,
  senderId:string,
  fanId:string
}
const fan = {
  pageId:'',
  senderId:'',
  fanId:''
}

export class FanStore {
  @observable fan:Fan = fan
  @observable pageIds:string = ''
  @observable hasNew = false

  @action.bound setFan(data) {
    this.fan = data;
  }
  @action.bound setPageIds(data) {
    this.pageIds = data;
  }
  @action.bound setHasNew(data) {
    this.hasNew = data;
  }
}

export const STORE_FAN = 'fanStore';