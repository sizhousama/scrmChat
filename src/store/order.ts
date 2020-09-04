import { observable,action } from 'mobx'

export class OrderStore {
  @observable tempOrder:any =''

  @action.bound setTempOrder(data) {
    this.tempOrder = data;
  }
}

export const STORE_ORDER = 'orderStore';