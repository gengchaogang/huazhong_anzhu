import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../../../commons/components/DxPanel'

import './ProjectDiscounts.css'
const findtypeName=(arr)=>{
  let name='';
  if(arr){
    arr.map((item,index)=>(
      name+=item.name+'/'
    ))
    return name
  }
  return name
}
export default function ProjectDiscounts({mainData,onpageChange,total,current}){
  const dataSource=JSON.parse(mainData);
  console.log(dataSource,'dataSource');
  const saleTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      },{
        title: '优惠名称',
        dataIndex: 'name',
      },{
        title: '优惠金额（元）',
        dataIndex: 'originalPrice',
      },{
        title:'所需金额（元）',
        dataIndex:'price'
      },{
        title:'活动有效期（天）',
        dataIndex:'validDate',
      },{
        title:'适用类型',
        dataIndex:'applyType',
        render:(text,record)=>{
          if(record.houseType=='1'){
            console.log(record.discounts,'record.discounts');
            return <span>{findtypeName(record.discounts)}</span>
          }else if(record.houseType!=='1'){
            return <span>{record.areaFrom+'~'+record.areaTo}</span>
          }
        }
      },{
        title:'团购锁定房源（天）',
        dataIndex:'holdDays',
      },{
        title:'创建时间',
        dataIndex:'createTime',
      }
    ],
  }
  const tableData=[];
  dataSource.map((item,index)=>{
    tableData.push({
      key:index+1,
      applyType:item.applyType,
      areaFrom:item.areaFrom,
      areaTo:item.areaTo,
      beRefunded:item.beRefunded,
      beSaled:item.beSaled,
      beUsed:item.beUsed,
      createTime:item.createTime,
      holdDays:item.holdDays,
      houseType:item.houseType,
      discounts:item.discounts,
      name:item.name,
      originalPrice:item.originalPrice,
      price:item.price,
      serialNumber:item.serialNumber,
      validDate:item.validDate,
    })
  })
  const pagination={
    showQuickJumper:false,
    current:current,
    total:total,
    pageSize:10,
    onChange:(page)=>{
      onpageChange(page-1)
    },
  }
  return(
    <DxPanel title='房源优惠'>
      <Table {...saleTableProps} dataSource={tableData} pagination={pagination}/>
    </DxPanel>
  )
}
