import React, {useState, useEffect, useRef } from 'react'
import { View, Image } from '@tarojs/components'
import {previewImg} from '@/utils/index'
import { forwardRef } from 'react'
import './index.scss'

const ImgMsg = (props, ref) => {
  const img = props.msgItem.imgUrl
  const [style,setStyle] = useState({})
  const imgload = (e)=>{
    const w = e.detail.width; //获取图片真实宽度
    const h = e.detail.height; //获取图片真实高度
    const ratio = Number((w/h).toFixed(1))
    let width = 0
    let height = 0 
    if (ratio < 0.4 ){
      width = 204; 
      height = 510;
    }else if(ratio >= 0.4 && ratio <= 0.5){
      width = 204;
      height = 204/ratio;
    } else if(ratio > 0.5 && ratio < 1) {
      width = 405 * ratio;
      height = 405;
    } else if(ratio >= 1 && ratio < 1/0.5) {
      height = 405 * (1/ratio);
      width = 405;
    } else if (ratio >= 1/0.5 && ratio < 1/0.4) {
      height = 204;
      width = 204 / (1/ratio);
    } else if (ratio >= 1/0.4) {
      height = 204; 
      width = 510;
    }
    height /= 3;
    width /= 3;
    width = parseInt(String(width))
    height = parseInt(String(height))
    
    const style = {
      width:width+'px',
      height:'auto'
    }
    setStyle(style)
  }
  const viewimg = ()=>{
    previewImg(img)
  }
  return (
    <View className='img-msg' onClick={viewimg}>
      <Image 
      onLoad={imgload} 
      src={img} 
      mode='widthFix'
      style={style}
      ></Image>
    </View>
  )
}

export default forwardRef(ImgMsg)
