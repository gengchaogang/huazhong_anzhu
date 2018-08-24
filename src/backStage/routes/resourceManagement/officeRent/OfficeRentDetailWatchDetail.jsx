import React from 'react'
import {Table,Radio} from 'antd'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import DxPanel from '../../../../commons/components/DxPanel'
import './OfficeRentDetailOne.css'
export default function OfficeRentDetailWatchDetail({guideArr,total,pageNo,pageChange,radioChange}){
  const columns=[
    {
      title:'序号',
      dataIndex:'number'
    },
    {
      title:'约看时间',
      dataIndex:'appointmentTime'
    },
    {
      title:'带看时间',
      dataIndex:'guideTime'
    },
    {
      title:'经纪人',
      dataIndex:'customerBrokerName'
    },
    {
      title:'联系电话',
      dataIndex:'customerBrokerPhone'
    },
    {
      title:'客户',
      dataIndex:'customerName'
    },
    {
      title:'联系电话',
      dataIndex:'customerPhone'
    },
    {
      title:'代理经纪人',
      dataIndex:'houseBrokerName'
    },
    {
      title:'联系电话',
      dataIndex:'houseBrokerPhone'
    },
    {
      title:'状态',
      dataIndex:'status'
    },
  ]
  const pagination={
    total:total,
    current:pageNo,
    onChange:(page)=>{
      pageChange(page)
    }
  }
  const onChanges=(e)=>{
    radioChange(e.target.value)
  }
  return(
    <div className='projectDetails_projectCertificates'>
      <DxPanel title='带看记录'>
        <div className='buttonRadio'>
          <RadioGroup onChange={onChanges} defaultValue="全部">
            <RadioButton value="全部">全部</RadioButton>
            <RadioButton value="已带看">已带看</RadioButton>
            <RadioButton value="未带看">未带看</RadioButton>
            <RadioButton value="带看失败">爽约</RadioButton>
          </RadioGroup>
        </div>
        <Table
          dataSource={guideArr} columns={columns} pagination={pagination }
        />
      </DxPanel>
    </div>
  )
}
