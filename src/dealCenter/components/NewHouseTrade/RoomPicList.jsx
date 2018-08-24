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
      <div className='dx_roomPic_item_pic' style={{backgroundImage:`URL(${imgSrc})`}}></div>
      <div className='dx_roomPic_item_content'>
        <div className='dx_roomPic_item_content_tips'>
          <span className='dx_roomPic_item_content_name'>{name}</span>
          {tips.map(item=><Tag className='dx_roomPic_item_content_tips_tag' key={`tags_${item}`}>{item}</Tag>)}
        </div>
        <p className='dx_roomPic_item_content_msg'>
          <span className='dx_roomPic_item_content_msg_item'>{`居室：${room}`}</span>
          <span className='dx_roomPic_item_content_msg_item'>{`建筑面积：${floorArea}`}</span>
          <span className='dx_roomPic_item_content_msg_item'>{`套内面积：${innerArea}`}</span>
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
  return(
    <div className='roomPicList'>
      {JSON.parse(listData).map(item=><RoomPic key={`roomPic${item.id}`} {...item}/>)}
    </div>
  )
}
