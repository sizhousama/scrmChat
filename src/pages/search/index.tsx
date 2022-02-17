import React, { useReducer } from "react";
import { AtInput, AtForm, AtList, AtListItem } from 'taro-ui'
import { View, Picker } from "@tarojs/components";
import { NavTo, SwitchTab } from "@/utils/index"
import { observer } from 'mobx-react';
import { useFanStore, useUserStore } from '@/store';
import { useDidShow } from "@tarojs/taro";
import "./index.scss";

const initState = {
  fanName: '',
  username: '',
  pageIds: '',
  facebookName: '',
  whatsappUserId: '',
  whatsappAccountId: '',
  operatorType: 'and',
  tagOperatorType: 'and',
  tagArr: [],
  tagsId: [],
  tagsIdList: [],
  userStatus: '',
  read: '',
  amazonProfile: '',
  email: '',
  serviceId: ''
}

const stateRducer = (state, action) => {
  switch (action.type) {
    case 'fanName':
      return {
        ...state,
        fanName: action.payload.fanName
      }
    case 'username':
      return {
        ...state,
        username: action.payload.username
      }
    case 'pageIds':
      return {
        ...state,
        pageIds: action.payload.pageIds
      }
    case 'facebookName':
      return {
        ...state,
        facebookName: action.payload.facebookName
      }
    case 'whatsappUserId':
      return {
        ...state,
        whatsappUserId: action.payload.whatsappUserId
      }
    case 'whatsappAccountId':
      return {
        ...state,
        whatsappAccountId: action.payload.whatsappAccountId
      }
    case 'tagArr':
      return {
        ...state,
        tagArr: action.payload.tagArr
      }
    case 'tagsId':
      return {
        ...state,
        tagsId: action.payload.tagsId
      }
    case 'tagsIdList':
      return {
        ...state,
        tagsIdList: action.payload.tagsIdList
      }
    case 'userStatus':
      return {
        ...state,
        userStatus: action.payload.userStatus
      }
    case 'read':
      return {
        ...state,
        read: action.payload.read
      }
    case 'amazonProfile':
      return {
        ...state,
        amazonProfile: action.payload.amazonProfile
      }
    case 'email':
      return {
        ...state,
        email: action.payload.email
      }
    case 'serviceId':
      return {
        ...state,
        serviceId: action.payload.serviceId
      }
    default: return state
  }
}

const Search = () => {
  const [state, dispatch] = useReducer(stateRducer, initState)
  const { type } = useUserStore()
  const { pages, insAccounts, waAccounts, services, searchFrom, searchForm, setSearchForm} = useFanStore()

  const userStatusList = [
    { value: 0, label: '新增' },
    { value: 1, label: '跟进中' },
    { value: 2, label: '有机会' },
    { value: 3, label: '已成单' },
    { value: 4, label: '其他' },
    { value: 5, label: '质量不好' },
    { value: 6, label: '时机不对' },
    { value: 7, label: '不同意返款政策' },
    { value: 8, label: '账号原因不能review' },
    { value: 9, label: '想做rating/feedback' },
    { value: 10, label: '商品不感兴趣' }
  ]

  const readStatusList = [
    { value: 0, label: '未读' },
    { value: 1, label: '已读' },
  ]

  const navToMoreTag = () => {
    let f = ''
    if(type === 'messenger'){
      f =  searchFrom === 'msg' ? 'tagsId' : 'tagArr'
    }
    if(type === 'whatsapp') f = 'tagsIdList'
    if(type === 'ins') f = 'tagsIdList'
    NavTo('../tags/index?f=' + f)
  }

  const tagNum = () => {
    switch(type){
      case 'messenger': return searchFrom === 'msg' ? state.tagsId.length : state.tagArr.length
      case 'whatsapp': return state.tagsIdList.length
      case 'ins': return state.tagsIdList.length
    }
  }

  const search = () => {
    const form:any = {}
    for(let key in state){
      if(state[key]!== ''){
        form[key] = state[key]
      }
    }
    console.log(state)
    setSearchForm(form)
    searchFrom === 'msg' ? SwitchTab(`/pages/chat/index`) : SwitchTab(`/pages/users/index`)
  }

  const placeholder = () => {
    switch(type){
      case 'messenger': return searchFrom === 'msg' ? '名称/邮箱/分配人/adid' : 'Fackbook名称'
      case 'whatsapp': return searchFrom === 'msg' ? '用户名/手机号' : '手机号'
      case 'ins': return '用户名'
    }
  }

  const searchValue = () => {
    switch(type){
      case 'messenger': return searchFrom === 'msg' ? state.fanName : state.facebookName
      case 'whatsapp': return searchFrom === 'msg' ? state.username : state.whatsappUserId
      case 'ins': return state.username
    }
  }

  const setState = (list, key, e) => {
    const payload = {}
    payload[key] = list[e.detail.value].value
    dispatch({ type: key, payload })
  }

  const extraText = (list, key): string => {
    const v = list.find(o => o.value === state[key])
    if (!v) return ''
    return v.label
  }

  const selectorValue = (list, key): any => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].value === state[key]) {
        return i
      }
    }
  }

  const setSearchValue = (v) => {
    switch(type){
      case 'messenger': 
        return searchFrom === 'msg' 
        ? dispatch({ type: 'fanName', payload: {fanName:v} })
        : dispatch({ type: 'facebookName', payload: {facebookName:v} })
      case 'whatsapp':
        return searchFrom === 'msg' 
        ? dispatch({ type: 'username', payload: {username:v} })
        : dispatch({ type: 'whatsappUserId', payload: {whatsappUserId:v} })
      case 'ins': return dispatch({ type: 'username', payload: {username:v} })
    }
  }

  const reset = () => {
    for(let key in initState){
      const payload = {}
      payload[key] = initState[key]
      dispatch({ type: key, payload })
    }
    setSearchForm({
      tagArr: [],
      tagsId: [],
      tagsIdList: []
    })
  }

  useDidShow(() => {
    for(let key in searchForm){
      const payload = {}
      payload[key] = searchForm[key]
      dispatch({ type: key, payload })
    }
  })

  return (
    <View>
      <View>
        <AtForm className='searchform' >
          <View className='topsearch'>
            <View className='at-icon at-icon-search search-icon'></View>
            <AtInput
              className='sinput tops'
              name='mainSearchInput'
              type='text'
              placeholder={placeholder()}
              placeholderClass='placestyle'
              clear
              value={searchValue()}
              onChange={(v)=>setSearchValue(v)}
            />
          </View>
          <View className='subtitle'>详细筛选：</View>
          {
            (type === 'whatsapp' && searchFrom === 'user') && 
            (<View className='other tagform'>
              <View className='label'>名称：</View>
              <View className='content'>
                <AtInput
                  className='sinput'
                  name='wanameInput'
                  type='text'
                  value={state.username}
                  onChange={(v) => dispatch({ type: 'username', payload: {username: v} })}
                />
              </View>
            </View>)
          }
          {type === 'messenger' && (
            <View>
              <View className='other tagform'>
                <View className='label'>主页：</View>
                <View className='content'>
                  <View className='select'>
                    <View className='at-icon at-icon-chevron-down'></View>
                    <Picker value={selectorValue(pages, 'pageIds')} className='picker' mode='selector' range={pages} onChange={(e)=>setState(pages,'pageIds', e)} rangeKey='label'>
                      <AtList>
                        <AtListItem extraText={extraText(pages, 'pageIds')} />
                      </AtList>
                    </Picker>
                  </View>
                </View>
              </View>
          </View>
          )}
          {
           (['messenger', 'ins'].includes(type) || searchFrom === 'user') && 
           (<View className='other tagform'>
              <View className='label'>分配人：</View>
              <View className='content'>
                <View className='select'>
                  <View className='at-icon at-icon-chevron-down'></View>
                  <Picker value={selectorValue(services, 'serviceId')} className='picker' mode='selector' range={services} onChange={(e)=>setState(services, 'serviceId', e)} rangeKey='label'>
                    <AtList>
                      <AtListItem extraText={extraText(services, 'serviceId')} />
                    </AtList>
                  </Picker>
                </View>
              </View>
            </View>)
          }
          {type === 'whatsapp' && (<View className='other tagform'>
            <View className='label'>账号：</View>
            <View className='content'>
              <View className='select'>
                <View className='at-icon at-icon-chevron-down'></View>
                <Picker value={selectorValue(waAccounts, 'whatsappAccountId')} className='picker' mode='selector' range={waAccounts} onChange={(e)=>setState(waAccounts, 'whatsappAccountId', e)} rangeKey='label'>
                  <AtList>
                    <AtListItem extraText={extraText(waAccounts, 'whatsappAccountId')} />
                  </AtList>
                </Picker>
              </View>
            </View>
          </View>)}
          {type === 'ins' && (<View className='other tagform'>
            <View className='label'>账号：</View>
            <View className='content'>
              <View className='select'>
                <View className='at-icon at-icon-chevron-down'></View>
                <Picker value={selectorValue(insAccounts, 'instagramAccountId')} className='picker' mode='selector' range={insAccounts} onChange={(e)=>setState(insAccounts, 'instagramAccountId', e)} rangeKey='label'>
                  <AtList>
                    <AtListItem extraText={extraText(insAccounts, 'instagramAccountId')} />
                  </AtList>
                </Picker>
              </View>
            </View>
          </View>)}
          <View className='other tagform'>
            <View className='label'>标签：</View>
            <View className='content'>
              <View className='left'>已选择{tagNum()}个标签</View>
              <View className='right' onClick={navToMoreTag}>选择标签</View>
            </View>
          </View>
          {
            searchFrom === 'msg' &&
            (<View>
                <View className='other tagform'>
                  <View className='label'>用户状态：</View>
                  <View className='content'>
                    <View className='select'>
                      <View className='at-icon at-icon-chevron-down'></View>
                      <Picker value={selectorValue(userStatusList, 'userStatus')} className='picker' mode='selector' range={userStatusList} onChange={(e)=>setState(userStatusList,'userStatus', e)} rangeKey='label'>
                        <AtList>
                          <AtListItem extraText={extraText(userStatusList, 'userStatus')} />
                        </AtList>
                      </Picker>
                    </View>
                  </View>
                </View>
                <View className='other tagform'>
                  <View className='label'>消息状态：</View>
                  <View className='content'>
                    <View className='select'>
                      <View className='at-icon at-icon-chevron-down'></View>
                      <Picker value={selectorValue(readStatusList, 'read')} className='picker' mode='selector' range={readStatusList} onChange={(e)=>setState(readStatusList, 'read', e)} rangeKey='label'>
                        <AtList>
                          <AtListItem extraText={extraText(readStatusList, 'read')} />
                        </AtList>
                      </Picker>
                    </View>
                  </View>
                </View>
              </View>)
          }
          {
            searchFrom === 'user' &&
            (<View>
                <View className='other tagform'>
                  <View className='label'>Profile：</View>
                  <View className='content'>
                  <AtInput
                    className='sinput'
                    name='profileInput'
                    type='text'
                    value={state.amazonProfile}
                    onChange={(v) => dispatch({ type: 'amazonProfile', payload: {amazonProfile: v} })}
                  />
                  </View>
                </View>
                <View className='other tagform'>
                  <View className='label'>邮箱：</View>
                  <View className='content'>
                  <AtInput
                    className='sinput'
                    name='emailInput'
                    type='text'
                    value={state.email}
                    onChange={(v) => dispatch({ type: 'email', payload: {email: v} })}
                  />
                  </View>
                </View>
              </View>)
          }
          <View className='btnbox'>
            <View className='rest' onClick={reset}>重置</View>
            <View className='submit' onClick={search}>搜索</View>
          </View>
        </AtForm>
      </View>
    </View>
  );
};

export default observer(Search);
