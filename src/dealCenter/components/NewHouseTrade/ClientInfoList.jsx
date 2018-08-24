import React from 'react'

import './ClientInfoList.css'

function ClientInfo({name,phoneNumber,gender,isSelect,id,doSelect,idNumber}){
  const handleSelect=()=>{
    doSelect(id);
  }
  return(
    <div className={`clientInfo ${!!isSelect?'clientInfo_select':''}`} onClick={handleSelect}>
      {!!isSelect && <span className='clientInfo_select_icon'>选中</span>}
      <div className='clientInfo_msg'>
        <p>{`姓名：${name}`}</p>
        <p>{`性别：${gender}`}</p>
        <p>{`手机号：${phoneNumber}`}</p>
        <p>{`身份证号：${idNumber}`}</p>
      </div>
    </div>
  )
}
export default function ClientInfoList({listData,doSelect}){
  return(
    <div className='clientInfo_list'>
      {listData.map(item=><ClientInfo key={`broker_${item.id}`} {...item} doSelect={doSelect}/>)}
    </div>
  )
}
