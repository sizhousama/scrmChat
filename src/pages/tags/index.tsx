import React, { useRef, useState, useEffect } from "react";
import NavBar from "@/components/navBar";
import { View, Text } from "@tarojs/components";
import { Back } from '@/utils/index'
import Indexes from "@/components/indexes";
import { observer } from 'mobx-react';
import { useNavStore, useUserStore, useFanStore } from '@/store';
import "./index.scss";
import { iteratorSymbol } from "mobx/lib/internal";

interface Itag {
  key: string,
  title: string,
  items: any[]
}
interface Ti {
  act: boolean,
  tag: string
}

const Tags = () => {
  const childref = useRef();
  const tagIds = useRef<number[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [trueSelect, setTrueSelect] = useState<string[]>([])
  const [selectTags, setSelectTags] = useState<string[]>([])
  const { navH } = useNavStore();
  const { allTags } = useUserStore()
  const { searchForm, setSFchatTags } = useFanStore()
  const style = {
    marginTop: navH + 10 + 'px'
  }
  useEffect(() => {
    initTags()
  }, [])
  const initTags = () => {
    let arr = allTags
    const ids = searchForm.chatTagList
    let truetags: string[] = []
    let stags: string[] = []
    arr.forEach(group => {
      group.items.forEach((tag: any) => {
        if (ids.length > 0) {
          ids.forEach(id => {
            if (tag.id === id) {
              tag.act = true
              truetags = [...truetags, tag.tag]
              stags = [...stags, tag.tag]
            }
          })
        } else {
          tag.act = false
        }
      })
    })
    if (stags.length > 4) {
      const three = truetags.slice(0, 3)
      const last = truetags.slice(-1)
      const newtags = [...three, '···']
      stags = [...newtags, last[0]]
    }
    setSelectTags(stags.slice())
    setTrueSelect(truetags.slice())
    ids.length === 0 ? setTags(allTags) : setTags(arr.slice())
  }

  const toggleSelect = (e) => {
    const fi = e.currentTarget.dataset.fidx
    const i = e.currentTarget.dataset.idx
    let arr = tags
    arr[fi].items[i].act = !arr[fi].items[i].act
    let stags: string[] = selectTags
    let truetags: string[] = trueSelect
    let tagids: number[] = searchForm.chatTagList
    if (arr[fi].items[i].act) {
      stags = [...stags, arr[fi].items[i].tag]
      truetags = [...truetags, arr[fi].items[i].tag]
      if (stags.length > 4) {
        const three = stags.slice(0, 3)
        const last = stags.slice(-1)
        const newtags = [...three, '···']
        stags = [...newtags, last[0]]
      }
      tagids = [...tagids, arr[fi].items[i].id]
    } else {
      truetags = truetags.filter(item => { return item !== arr[fi].items[i].tag })
      if (truetags.length > 4) {
        const three = truetags.slice(0, 3)
        const last = truetags.slice(-1)
        const newtags = [...three, '···']
        stags = [...newtags, last[0]]
      } else {
        stags = truetags
      }
      tagids = tagids.filter((item: any) => item !== arr[fi].items[i].id)
    }
    setSFchatTags(tagids) //存入搜索条件
    setTrueSelect(truetags.slice())
    setSelectTags(stags.slice())
    setTags(arr.slice())
  }
  const toggleStag = (e) => {
    let arr = tags
    const name = e.currentTarget.dataset.name
    let tag: any = ''
    arr.forEach(group => {
      group.items.forEach((item: any) => {
        if (item.tag === name) {
          item.act = false
          tag = item
        }
      })
    })
    console.log(tag)
    if (tag) {
      let ids: number[] = searchForm.chatTagList
      let stags: string[] = selectTags
      let truetags: string[] = trueSelect
      ids = ids.filter((item: any) => { item !== tag.id })
      console.log(stags)
      stags = stags.filter((item: any) => { item !== tag.tag })
      console.log(stags)
      truetags = truetags.filter((item: any) => { item !== tag.tag })
      setSFchatTags(ids) //存入搜索条件
      setTrueSelect(truetags.slice())
      setSelectTags(stags.slice())
      setTags(arr.slice())
    }
  }
  return (
    <View>
      <NavBar title='标签' />
      <View className='topbox' style={style}>
        <View className='tagtemp'>
          {
            selectTags.map((stag, si) => {
              return <Text key={si} className='tag' >{stag}</Text>
            })
          }
          {selectTags.length > 0 ? <View className='searchbtn' onClick={Back}>确定</View> : <View className='no-data'>请添加标签</View>}
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
                    fl.items.map((t: Ti, i) => {
                      return (
                        <View
                          key={i + 'tag'}
                          className={`tagitem ${t.act ? 'acttag' : ''}`}
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
        <Indexes ref={childref} top={navH + 90} st={108} />
      </View>

    </View>
  );
};

export default observer(Tags);
