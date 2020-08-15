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
  const [tags, setTags] = useState<any[]>([])
  const [trueSelect,setTrueSelect] = useState<string[]>([])
  const [selectTags,setSelectTags] = useState<string[]>([])
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
    let stags:string[] = selectTags
    let truetags:string[] = trueSelect
    if(arr[fi].items[i].act){
      stags = [...stags,arr[fi].items[i].tag]
      truetags = [...truetags,arr[fi].items[i].tag]
      if(stags.length>4){
        const three = stags.slice(0,3)
        const last = stags.slice(-1)
        const newtags = [...three,'···']
        stags = [...newtags,last[0]]
      }
    }else{
      truetags = truetags.filter(item=>{return item!==arr[fi].items[i].tag})
      if(truetags.length>4){
        const three = truetags.slice(0,3)
        const last = truetags.slice(-1)
        const newtags = [...three,'···']
        stags = [...newtags,last[0]]
      }else{
        stags = truetags
      }
    }
    setTrueSelect(truetags.slice())
    setSelectTags(stags.slice())
    setTags(arr.slice())
  } 
  return (
    <View>
      <NavBar title='标签' />
      <View className='topbox' style={style}>
        <View className='tagtemp'>
          {
            selectTags.map((stag,si)=>{
            return <Text key={si} className='tag'>{stag}</Text>
            })
          }
          {selectTags.length>0?<View className='searchbtn'>搜索</View>:<View className='no-data'>请添加标签</View>}  
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
        <Indexes ref={childref} top={navH+90} st={108} />
      </View>

    </View>
  );
};

export default observer(Tags);
