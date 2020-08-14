import { observable } from 'mobx'
import {getSysInfo} from '@/utils/index'

const h = getSysInfo().statusBarHeight + 88

export class NavStore {
  @observable navH:number = h
}

export const STORE_NAVH = 'navStore';