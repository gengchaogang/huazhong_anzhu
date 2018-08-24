import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'

import './NewHouseImg.css'


export default function NewHouseDiscountArr({discountArr,discounttotal,discountpageNo,discountArrChange}){
  const columns=[
    {
      title:'序号',
      dataIndex:'number'
    },
    {
      title:'优惠名称',
      dataIndex:'name'
    },
    {
      title:'优惠金额',
      dataIndex:'originalPrice'
    },
    {
      title:'所需金额',
      dataIndex:'price'
    },
    {
      title:'活动有效期',
      dataIndex:'validDate'
    },
    {
      title:'适用类型',
      render:(text,record)=><div>
        <div>{record.areaFrom}㎡~{record.areaTo}㎡</div>
        <div>{record.houseType}</div>
      </div>
    },
    {
      title:'团购锁定房源（天）',
      dataIndex:'holdDays'
    },
    {
      title:'创建时间',
      dataIndex:'createDatetime'
    },
  ];
  const pagination={
    current:discountpageNo,
    total:discounttotal,
    onChange:(page) => {
      discountArrChange(page)
    }
  }
  return(
    <DxPanel title='电商优惠'>
      <Table columns={columns} dataSource={discountArr} pagination={pagination}/>
    </DxPanel>
  )
}
