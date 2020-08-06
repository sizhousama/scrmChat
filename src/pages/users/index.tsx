import React,{useRef} from 'react'
// import { AtButton } from 'taro-ui'
import { View } from '@tarojs/components'
import TabBar from "../tabbar";
import './index.scss'

function Users() {
  const cur:number = 1
  const childref = useRef();
  return (
   <View>
     <TabBar ref={childref} cur={cur} />
   </View>
  )
}

export default Users
