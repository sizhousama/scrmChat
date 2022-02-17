import React, { forwardRef, useEffect, useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { getWaMsgTemps } from '@/api/wa'
import './index.scss'

const MsgTemp = (props, ref) => {
  const [temps, setTemps] = useState([])

  const setemoji = (e)=>{
    props.handleClick(e.currentTarget.dataset.item)
    e.stopPropagation()
  }

  const getTemps = async () => {
    const {whatsappAccountId} = props.fan
    const p = {whatsappAccountId, name: ''}
    const { data } = await getWaMsgTemps(p)
    setTemps(data)
  }

  useEffect(()=>{
    getTemps()
  })

  return (
    <View className='msg-temp'>
      <ScrollView scrollY className='scroll-box'>
        <View className='scroll-box-inner'>
          {temps.map((temp:any,idx)=>{
            return (
              <View className='template' key={idx}>
                <View>{temp.name}</View>
                <View>{temp.content}</View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default forwardRef(MsgTemp)
