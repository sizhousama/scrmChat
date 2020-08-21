import { observable,action } from 'mobx'

interface WS {
  on?:any,
  emit?:any
}

export class WsioStore {
  @observable wsio:WS = {}

  @action.bound setWsio(data) {
    this.wsio = data;
  }

}

export const STORE_WSIO = 'wsioStore';