import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'

import './ProjectDiscounts.css'

const saleTableProps={
  columns:[
    {
      title: '序号',
      dataIndex: 'serialNumber',
    },{
      title: '优惠名称',
      dataIndex: 'name',
    },{
      title: '优惠金额',
      dataIndex: 'originalPrice',
    },{
      title:'所需金额',
      dataIndex:'price'
    },{
      title:'活动有效期',
      dataIndex:'validDate',
    },{
      title:'适用类型',
      dataIndex:'applyType',
    },{
      title:'团购锁定房源（天）',
      dataIndex:'holdDays',
    },{
      title:'创建时间',
      dataIndex:'createTime',
    },{
      title:'已出售（个）',
      dataIndex:'beSaled',
    },{
      title:'已使用（个）',
      dataIndex:'beUsed'
    },{
      title:'退款数（个）',
      dataIndex:'beRefunded'
    }
  ],
}


export default function ProjectDiscounts({mainData,onChange,total,current}){
  const dataSource=JSON.parse(mainData);
  console.log('total',total);
  const pagination={
    showQuickJumper:true,
    current,
    total,
    pageSize:10,
    onChange,
  }
  return(
    <DxPanel title='房源优惠'>
      <Table {...saleTableProps} dataSource={dataSource} pagination={pagination}/>
    </DxPanel>
  )
}
