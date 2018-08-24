import React, { Component, PropTypes } from 'react'
import {Timeline}from 'antd'
import PicList from './PicList'
import {
  isNull,
} from '../utils/currencyFunction'
import DxShowMsgForm from './DxShowMsgForm'
import './TimeAxisList.css'

export default function TimeAxisList({listData,className}){
  console.log('listData',listData);
  if(isNull(listData,[]).length===0){
    return(
      <div style={{display:'none'}}>
      </div>
    )
  }else{
    return(
      <div className={`timeAxisList ${isNull(className,'')}`}>
        {
          listData.map((item,index)=><TimeAxisListItem key={`timeAxisListItem_key_${isNull(item.time,'-')}_${index}`} timer={isNull(item.time,'-')} content={renderContent(item)} pics={creatPicArr(isNull(item.pics,[]))} isReject={item.isReject} reason={isNull(item.remarks,'')}/>)
        }
      </div>
    )
  }
}
function TimeAxisListItem({timer,content,pics,isReject,reason}){
  return (
    <div className='timeAxisListItem'>
      <div className={`timeAxisListItem_text ${isReject?'timeAxisListItem_text_red':''}`}>
        <span className='timeAxisListItem_timer'>{`${timer} `}</span>
        <span className='timeAxisListItem_content'>{content}</span>
        <p className='timeAxisListItem_reason'>{reason}</p>
      </div>
      {pics.length!==0 && <PicList picListData={pics}/>}
    </div>
  )
}
function renderContent(obj){
  return `${obj.content}`
}
function creatPicArr(arr){
  let resultArr=[];
  arr.map((item,index)=>{
    if(!!item && item.length!==0){
      resultArr.push({
        src:item,
        title:'',
        id:`key_${index}`,
      })
    }
  });
  return resultArr;
}
