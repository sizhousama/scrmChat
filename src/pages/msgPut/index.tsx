import React, { useRef, useState, useEffect, useReducer, useCallback } from "react";
import { View, Text } from "@tarojs/components";
import { observer } from 'mobx-react';
import { useUserStore } from '@/store';
import { AtActivityIndicator } from 'taro-ui'
import "./index.scss";

const initState = {
  pages: []
}
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'list':
      return {
        ...state,
        pages: action.payload.list
      }
    default:
      return state
  }
}
const MsgPut = () => {
  const listref = useRef<any[]>([])
  const { userInfo } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(stateReducer, initState)
  const { pages } = state


  return (
    <View>
      
    </View>
  );
};

export default observer(MsgPut);
