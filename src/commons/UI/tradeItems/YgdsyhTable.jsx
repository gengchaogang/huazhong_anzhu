import React from 'react'
import DxPanel from '../../components/DxPanel'
import './YgdsyhTable.css'
import { Table } from 'antd';
// key
// pic
// details
// number
// payAway
// paySerialNumber
// payCustomer
// customerPhone
// payTime
// payCash
// payStatus
const columns=[
  {
    title: '优惠信息',
    dataIndex: 'pic',
    key: 'pic',
    render:(text)=><span className="yhxxWord">{text}</span>
  },
  {
    title: '适用类型',
    dataIndex: 'details',
    key: 'details',
  },
  {
    title: '订单编号',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '支付方式',
    dataIndex: 'payAway',
    key: 'payAway',
  },
  {
    title: '支付流水号',
    dataIndex: 'paySerialNumber',
    key: 'paySerialNumber',
  },
  {
    title: '支付客户',
    dataIndex: 'payCustomer',
    key: 'payCustomer',
  },
  {
    title: '客户电话',
    dataIndex: 'customerPhone',
    key: 'customerPhone',
  },
  {
    title: '支付时间',
    dataIndex: 'payTime',
    key: 'payTime',
  },
  {
    title: '支付金额',
    dataIndex: 'payCash',
    key: 'payCash',
  },
  {
    title: '支付状态',
    dataIndex: 'payStatus',
    key: 'payStatus',
  },
];
function YgdsyhTable({tableData,title,footer,header}){
  return (
    <DxPanel title={!!title?title:'已购电商优惠'}>
      <div>
        {!!header && <div>{header}</div>}
        <Table dataSource={tableData} columns={columns}
          pagination={false}
        />
        {!!footer && <div>{footer}</div>}
      </div>
    </DxPanel>
  );
}

export default YgdsyhTable;
