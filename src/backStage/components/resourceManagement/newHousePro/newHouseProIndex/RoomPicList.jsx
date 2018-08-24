import React from 'react'
import {Tag}from 'antd'
import './RoomPicList.css'

function RoomPic({
  name,
  imgSrc,
  createTime,
  tips,
  room,
  floorArea,
  innerArea,
  referencePrice,
  referenceTotalPrice,
}){
  return(
    <div className='dx_roomPic_item'>
      <div className='dx_roomPic_item_pic' style={{backgroundImage:`URL(${imgSrc.path})`}}></div>
      <div className='dx_roomPic_item_content'>
        <div className='dx_roomPic_item_content_tips'>
          <span className='dx_roomPic_item_content_name'>{name}</span>
            {/*tips.map((item,index)=><Tag className='dx_roomPic_item_content_tips_tag' key={`tags_${index}`}>{item}</Tag>)*/}
        </div>
        <p className='dx_roomPic_item_content_msg'>
          <span className='dx_roomPic_item_content_msg_item'>{`居室：${room}`}</span>
          <span className='dx_roomPic_item_content_msg_item'>{`建筑面积：${floorArea}`}</span>
          {/*<span className='dx_roomPic_item_content_msg_item'>{`套内面积：${innerArea}`}</span>*/}
        </p>
        <p className='dx_roomPic_item_content_msg'>
          <span className='dx_roomPic_item_content_msg_item'>{`参考均价：${referencePrice}`}</span>
          <span className='dx_roomPic_item_content_msg_item'>{`参考总价：${referenceTotalPrice}`}</span>
        </p>
      </div>
      <div className='dx_roomPic_item_createTime'>{createTime}</div>
    </div>
  )
}
export default function RoomPicList({listData}){
  if(listData){

    console.log('listData',JSON.parse(listData));
  }
  if(listData){
    return(
      <div className='roomPicList'>
        {JSON.parse(listData).map((item,index)=><RoomPic key={`roomPic${index}`} {...item}/>)}
      </div>
    )
  }else{
    return <div></div>
  }
}
