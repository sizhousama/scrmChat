import React, { useRef, useState, useEffect } from "react";
import { AtTag } from 'taro-ui'
import NavBar from "@/components/navBar";
import { View, Text } from "@tarojs/components";
import Indexes from "@/components/indexes";
import { toIndexes } from '@/utils/index'
import { getAllTag } from '@/api/fan'
import { observer } from 'mobx-react';
import { useNavStore } from '@/store';
import "./index.scss";

interface Itag {
  key: string,
  title: string,
  items: any[]
}
interface Ti{
  act:boolean,
  tag:string
}

const Tags = () => {
  const childref = useRef();
  const [tags, setTags] = useState([])
  const [selectTags,setSelectTags] = useState([])
  const { navH } = useNavStore();
  const style = {
    marginTop: navH + 10 + 'px'
  }
  useEffect(() => {
    getTags()
  }, [])
  const getTags = async () => {
    await getAllTag().then(res => {
      const { data } = res
      data.forEach(e => {
        e.act=false
      });
      const arr = toIndexes(data, 'tag')
      setTags(arr)
    })
  }
  const toggleSelect = (e) =>{
    const fi = e.currentTarget.dataset.fidx
    const i = e.currentTarget.dataset.idx
    let arr = tags
    arr[fi].items[i].act = !arr[fi].items[i].act
    setTags(arr.slice())
  } 
  return (
    <View>
      <NavBar title='标签' />
      <View className='topbox' style={style}>
        <View className='tagtemp'>
          <Text className='tag'>1111</Text>
          <Text className='tag'>11111111111</Text>
          <Text className='tag'>1111</Text>
          <Text className='tag'>1111</Text>
          <Text className='tag'>111111</Text>
          <Text className='tag'>11111111</Text>
          <Text className='tag'>11111</Text>
          <Text className='tag'>11</Text>
          <Text className='tag'>11111111111</Text>
          <Text className='tag'>11111</Text>

          <View className='searchbtn'>搜索</View>
        </View>
      </View>
      <View className='taglist'>
        {
          tags.map((fl: Itag, idx) => {
            if (fl.items.length > 0) {
              return (
                <View key={idx + 'fl'}>
                  <View id={fl.key} className='fltitle'>
                    <Text>{fl.title}</Text>
                  </View>
                  {
                    fl.items.map((t:Ti, i) => {
                      return (
                        <View 
                        key={i + 'tag'} 
                        className={`tagitem ${t.act?'acttag':''}`}
                        onClick={toggleSelect}
                        data-fidx={idx}
                        data-idx={i}
                        >
                          <Text>{t.tag}</Text>
                        </View>
                      )
                    })
                  }
                </View>
              )
            }
          })
        }
        <Indexes ref={childref} top={navH} />
      </View>

    </View>
  );
};

export default observer(Tags);
