import React,{useRef} from 'react'
import { View } from '@tarojs/components'
import TabBar from "../tabbar";
import './index.scss'

const Mine = () => {
  const cur:number = 2
  const childref = useRef();
  return (
    <View>
      <TabBar ref={childref} cur={cur} />
    </View>
  )
}

export default Mine
