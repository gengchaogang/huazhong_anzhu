import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'

import './OfficeRentDetailOne.css'


export default function OfficeRentDetailBroker({brokerPromotion}){
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'经纪人',
      render:(text,record)=><div className='broker'>
        <span className='outFilesLogo' style={{backgroundImage:`URL(${record.brokerLogo||''})`}}></span>
        <span>{record.brokerName}</span>
      </div>
    },
    {
      title:'联系方式',
      dataIndex:'brokerPhone',
    },
    {
      title:'租金',
      dataIndex:'tradingCommissions',
    },
    {
      title:'合作速销',
      dataIndex:'promotionMode',
    },
    {
      title:'核心卖点',
      dataIndex:'coreSellingPoint',
    },
  ];
  const dataSource=[];
  if(brokerPromotion.length!=0){
    brokerPromotion.map((item,index)=>(
      dataSource.push({
        key:index,
        number:index+1,
        brokerPhone:item.brokerPhone,
        brokerId:item.brokerId,
        brokerName:item.brokerName,
        brokerLogo:item.brokerLogo,
        tradingCommissions:item.tradingCommissions,
        promotionMode:item.promotionMode,
        coreSellingPoint:item.coreSellingPoint,
      })
    ))
  }
  return(
    <DxPanel title='代理经纪人'>
      <Table columns={columns} dataSource={dataSource}/>
    </DxPanel>
  )
}
