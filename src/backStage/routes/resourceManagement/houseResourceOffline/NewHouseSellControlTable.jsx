import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'

import './NewHouseImg.css'


export default function NewHouseSellControlTable({sellControlTableArr,sellControltotal,sellControlpageNo,sellControlChange}){
  const column=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'区域',
      dataIndex:'area',
    },
    {
      title:'单元',
      dataIndex:'unit',
    },
    {
      title:'楼梯类型',
      dataIndex:'stairType',
    },
    {
      title:'楼层',
      dataIndex:'totalFloor',
      render:(text,record)=><div>{record.floor}/{record.totalFloor}</div>
    },
    {
      title:'房号',
      dataIndex:'roomNumber',
    },
    {
      title:'房屋属性',
      dataIndex:'housingType',
    },
    {
      title:'建筑面积（㎡）',
      dataIndex:'floorArea',
    },
    {
      title:'销售单价（元）',
      dataIndex:'price',
    },
    {
      title:'销售总价（万）',
      dataIndex:'totalPrice',
    },
    {
      title:'户型',
      dataIndex:'houseTypeName',
    },
    {
      title:'销售状态',
      dataIndex:'state',
    },
  ];
  const pagination={
    current:sellControlpageNo,
    total:sellControltotal,
    onChange:(page) => {
      sellControlChange(page)
    }
  }
  return(
    <DxPanel title='项目销控表'>
      <Table columns={column} dataSource={sellControlTableArr}
        pagination={pagination}
      />
    </DxPanel>
  )
}
