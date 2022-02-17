import React, { useRef, useState, useEffect, useCallback } from "react";
import { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from "@tarojs/components";
import { Back } from '@/utils/index'
import Indexes from "@/components/indexes";
import { observer } from 'mobx-react';
import { useNavStore, useUserStore, useFanStore } from '@/store';
import "./index.scss";

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
  const [tags, setTags] = useState<any[]>([])
  const { navH } = useNavStore();
  const { allTags } = useUserStore()
  const { searchForm, setSearchForm } = useFanStore()
  const f = getCurrentInstance().router?.params.f || ''
  
  const initTags = useCallback(() => {
    let arr = allTags
    const ids = searchForm[f] || []
    arr.forEach(group => {
      group.items.forEach((tag: any) => {
        if (ids.length > 0) {
          ids.forEach(id => {
            if (tag.id === id) {
              tag.act = true
            }
          })
        } else {
          tag.act = false
        }
      })
    })
    ids.length === 0 ? setTags(allTags) : setTags(arr.slice())
  },[allTags, f, searchForm])

  const toggleSelect = (e) => {
    const fi = e.currentTarget.dataset.fidx
    const i = e.currentTarget.dataset.idx
    let arr = tags
    arr[fi].items[i].act = !arr[fi].items[i].act
    let tagids = searchForm[f]
    if (arr[fi].items[i].act) {
      tagids = [...tagids, arr[fi].items[i].id]
    } else {
      tagids = tagids.filter((item: any) => item !== arr[fi].items[i].id)
    }
    searchForm[f] = tagids
    setSearchForm(searchForm)
    setTags(arr.slice())
  }

  useEffect(() => {
    initTags()
  }, [initTags])

  return (
    <View>
      <View className='topbox'>
        <View className='tagtemp'>
          <View className='no-data'>{searchForm[f].length> 0 ? `已选择${searchForm[f].length}个标签` : '请选择标签'}</View>
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
        <Indexes ref={childref} top={navH} st={108} />
      </View>

    </View>
  );
};

export default observer(Tags);
