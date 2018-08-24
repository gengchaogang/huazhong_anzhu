import React from 'react'
import touxiang from '../../../commons/assets/images/touxiang.png'
import './BrokerInfoList.css'

function BrokerInfo({name,phoneNumber,pic,gender,isSelect,id,doSelect}){
  const handleSelect=()=>{
    doSelect(id);
  }
  const picType = !!pic?pic:'';
  return(
    <div className={`brokerInfo ${!!isSelect?'brokerInfo_select':''}`} onClick={handleSelect}>
      {!!isSelect && <span className='brokerInfo_select_icon'>选中</span>}
      <b className='brokerInfo_pic' style={{backgroundImage:`URL(${picType.length ===0?touxiang:picType})`}}></b>
      <div className='brokerInfo_msg'>
        <p>{`姓名：${name}`}</p>
        <p>{`性别：${gender}`}</p>
        <p>{`联系电话：${phoneNumber}`}</p>
      </div>
    </div>
  )
}
export default function BrokerInfoList({listData,doSelect}){
  return(
    <div className='brokerInfo_list'>
      {listData.map(item=><BrokerInfo key={`broker_${item.id}`} {...item} doSelect={doSelect}/>)}
    </div>
  )
}
