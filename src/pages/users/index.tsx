import React, { useRef, useEffect, useState } from 'react'
import { View,Text } from '@tarojs/components'
import TabBar from "../tabbar";
import Header from "@/components/header";
import Fan from "@/components/fan";
import Indexes from "@/components/indexes";
import { getFans } from '@/api/fan'
import { toIndexes } from '@/utils/index'
import { observer } from 'mobx-react';
import { useFanStore } from '@/store';
import {isNeedAddH} from '@/utils/index'
import { AtActivityIndicator } from 'taro-ui'
import './index.scss'

interface Us {
  key:string,
  title: string,
  items: any[]
}

const Users = () => {
  const cur: number = 1
  const needH = isNeedAddH()
  const childref = useRef();
  const {hasNew} = useFanStore()
  const [fans, setFans] = useState([])
  const [loading,setLoading] = useState(false)
  const [listParams, setListParams] = useState({
    current: 1,
    size: 999999,
    userStatus: '',
    tags: '',
    facebookName: '',
    pageId: '',
    fanGrades: 0
  })
  useEffect(() => {
    getfans()
  }, [])
  const getfans = async () => {
    setLoading(true)
    await getFans(listParams).then(res => {
      const { data } = res
      const arr = toIndexes(data.records, 'facebookName')
      setFans(arr)
    }).finally(()=>{
      setLoading(false)
    })
  }
  return (
    <View>
      <AtActivityIndicator isOpened={loading} mode='center'></AtActivityIndicator>
      <Header ref={childref} title='粉丝' icon='fanlist' />
      <View className={`fanlist ${needH?'needh':''}`} >
        {
          fans.map((fl: Us, index) => {
            if (fl.items.length > 0) {
              return (
                <View className='iarr' key={index}>
                  <View id={fl.key} className='ititle'>
                    <Text className='text'>{fl.title}</Text>
                  </View>
                  {
                    fl.items.map((fan, i) => {
                      return (
                        <Fan
                          key={`f_${i}`}
                          ref={childref}
                          name={fan.facebookName}
                          senderId={fan.senderId}
                          pageId={fan.pageId}
                          pageName={fan.pageName} />
                      )
                    })
                  }
                </View>
              )
            }
          })
        }
        <Indexes ref={childref} st={44} />
      </View>
      <TabBar ref={childref} cur={cur} has={hasNew} />
    </View>
  )
}

export default observer(Users)
