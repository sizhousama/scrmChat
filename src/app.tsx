import React from 'react'
// import { Provider } from 'mobx-react'
// import counterStore from './store/counter'
import 'taro-ui/dist/style/index.scss'
import { View } from '@tarojs/components'
import './app.scss'

// const store = {
//   counterStore
// }

function App(props) {
  return (
    <View >
      {props.children}
    </View>
  )
}

export default App
