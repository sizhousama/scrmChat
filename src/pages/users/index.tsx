import React, { useRef, useEffect, useState } from 'react'
import { View,Text } from '@tarojs/components'
import TabBar from "../tabbar";
import Header from "@/components/header";
import Fan from "@/components/fan";
import Indexes from "@/components/indexes";
import { getFans } from '@/api/fan'
import { toIndexes } from '@/utils/index'
import './index.scss'

interface Us {
  title: string,
  items: any[]
}

const Users = () => {
  const cur: number = 1
  const childref = useRef();
  const [fans, setFans] = useState([])
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
    await getFans(listParams).then(res => {
      const { data } = res
      const arr = toIndexes(data.records, 'facebookName')
      setFans(arr)
    })
  }
  return (
    <View>
      <Header ref={childref} title='粉丝' icon='fanlist' />
      <View className='fanlist'>
        {
          fans.map((fl: Us, index) => {
            if (fl.items.length > 0) {
              return (
                <View className='iarr' key={index}>
                  <View id={fl.title} className='ititle'>
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
                          pageId={fan.pageId} />
                      )
                    })
                  }
                </View>
              )
            }

          })
        }
        <Indexes ref={childref} />
      </View>
      <TabBar ref={childref} cur={cur} />
    </View>
  )
}

export default Users
