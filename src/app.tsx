import React from 'react'
import { Provider } from 'mobx-react'
import { stores, StoresContext } from './store';
import 'taro-ui/dist/style/index.scss'
import './app.scss'
import './icon.scss'
// cnpm install taro-ui@3.0.0-alpha.3

const App = (props) => {
  return (
    <Provider {...stores}>
      <StoresContext.Provider value={stores}>
        {props.children}
      </StoresContext.Provider>
    </Provider>
  )
}

export default App
