import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'

import './HousesSalesTable.css'

const saleTableProps={
  columns:[
    {
      title: '序号',
      dataIndex: 'serialNumber',
    },{
      title: '区域',
      dataIndex: 'area',
    },{
      title: '单元',
      dataIndex: 'unit',
    },{
      title:'楼梯类型',
      dataIndex:'stairType'
    },{
      title:"装修状况",
      dataIndex:'decoration',
    },{
      title:'楼层',
      dataIndex:"floor"
    },{
      title:'总楼层',
      dataIndex:'totalFloor',
    },{
      title:'房号',
      dataIndex:'roomNumber',
    },{
      title:'楼号',
      dataIndex:'buildingNumber',
    },{
      title:'房源类型',
      dataIndex:'housingType'
    },{
      title:'建筑面积 (㎡)',
      dataIndex:'floorArea'
    },{
      title:'销售单价 (元)',
      dataIndex:'price'
    },{
      title:'销售总价 (元)',
      dataIndex:'totalPrice'
    },{
      title:'户型',
      dataIndex:'houseTypeName'
    },{
      title:'销售状态',
      dataIndex:'status'
    }
  ],
}


export default function HousesSalesTable({mainData,onChange,total,current}){
  const dataSource=JSON.parse(mainData);
  const pagination={
    showQuickJumper:true,
    current,
    total,
    pageSize:10,
    onChange,
  }
  return(
    <DxPanel title='项目销控表'>
      <Table {...saleTableProps} dataSource={dataSource} pagination={pagination}/>
    </DxPanel>
  )
}
