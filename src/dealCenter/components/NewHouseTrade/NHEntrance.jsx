import React from 'react'
import {Row,Col}from 'antd'
import './NHEntrance.css'

function NHEntranceItem({
  title,
  path,
  clickCallBack,
  className,
}){
  return(
    <div className={`nh_entrance_item`}>
      <div className={`nh_entrance_item_content`} onClick={()=>clickCallBack(path)}>
        <b className={`nh_entrance_item_pic ${className} centerPic`}></b>
        <span className='nh_entrance_item_title'>{title}</span>
      </div>
    </div>
  )
}
export default function NHEntrance({list,clickCallBack}){
  return(
    <div className='nh_entrance'>
      {renderItem(list,clickCallBack)}
    </div>
  )
}
function renderItem(list,clickCallBack){
  if(!!list){
    const basicList=[];
    list.map((item,index)=>{
      if(index===list.length-1){
        basicList.push(item);
      }else{
        basicList.push(item);
        basicList.push({path:null});
      }
    });
    return <Row>{basicList.map((item,index)=>{
        if(!!item.path){
          return <Col span={4} key={`key_${index}`}><NHEntranceItem {...item} clickCallBack={clickCallBack} className={judgeClassName(item.title)}/></Col>
        }else{
          return <Col span={1} key={`key_${index}`}><div className='nh_entrance_border'><b></b></div></Col>
        }
      })}</Row>
  }else{
    return <div style={{display:'none'}}></div>
  }
}
function judgeClassName(title){
  switch (title) {
    case '录客户':
      return 'nh_entrance_customer'
    case '录团购':
      return 'nh_entrance_groupBuy'
    case '录成交':
      return 'nh_entrance_commit'
    case '项目详情':
      return 'nh_entrance_proInfo'
    case '房源销控':
      return 'nh_entrance_houses'
    default:
      return 'nh_entrance_customer'
  }
}
