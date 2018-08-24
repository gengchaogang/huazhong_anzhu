import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Table,Modal,Checkbox,Input } from 'antd';
import SearchInput from '../../../../../commons/View/SearchInput'
import DxPanel from '../../../../../commons/components/DxPanel'
import './LookRecord.css'
import textPic from '../../../../assets/yay.jpg'
import JumpButton from './JumpButton'

function LookRecord({dispatch }) {
  const goBack=()=>{
      dispatch(routerRedux.goBack());
  }
  const lookRecordTable=[
    {
      title: '序号',
      dataIndex: 'number',
      key:'number',
    },
    {
      title: '约看时间',
      dataIndex: 'aboutTime',
      key:'aboutTime',
    },
    {
      title: '带看时间',
      dataIndex: 'watchTime',
      key:'watchTime',
    },
    {
      title: '经纪人',
      dataIndex: 'booker',
      key:'booker',
    },
    {
      title: '联系电话',
      dataIndex: 'bookerContactNumber',
      key:'bookerContactNumber',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key:'customer',
    },
    {
      title: '联系电话',
      dataIndex: 'customerContactPhone',
      key:'customerContactPhone',
    },
    {
      title: '代理经纪人',
      dataIndex: 'agentBroker',
      key:'agentBroker',
    },
    {
      title: '联系电话',
      dataIndex: 'agentBookerContactNumber',
      key:'agentBookerContactNumber',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key:'state',
    },
  ]
  const lookRecordTableData=[
    {
      key:'1',
      number:'1',
      aboutTime:'2016-12-12 12：22：23',
      watchTime:'2016-12-12 12：22：23',
      booker:'王小明',
      bookerContactNumber:'15100000000',
      customer:'王小明',
      customerContactPhone:'151****0000',
      agentBroker:'王小明',
      agentBookerContactNumber:'15100000000',
      state:'已带看',
    },
    {
      key:'2',
      number:'2',
      aboutTime:'2016-12-12 12：22：23',
      watchTime:'2016-12-12 12：22：23',
      booker:'王小明',
      bookerContactNumber:'15100000000',
      customer:'王小明',
      customerContactPhone:'151****0000',
      agentBroker:'王小明',
      agentBookerContactNumber:'15100000000',
      state:'未带看',
    },
    {
      key:'3',
      number:'3',
      aboutTime:'2016-12-12 12：22：23',
      watchTime:'2016-12-12 12：22：23',
      booker:'王小明',
      bookerContactNumber:'15100000000',
      customer:'王小明',
      customerContactPhone:'151****0000',
      agentBroker:'王小明',
      agentBookerContactNumber:'15100000000',
      state:'房源经纪人执行“爽约”',
    },
  ]
  return (
    <div>
      <JumpButton/>
      <div>
        <Button>全部</Button>
        <Button>已带看</Button>
        <Button>未带看</Button>
        <Button>爽约</Button>
      </div>
      <Table dataSource={lookRecordTableData} columns={lookRecordTable}/>
    </div>
  );
}

function mapStateToProps({ lookRecord }) {
  return { lookRecord }
}

export default connect(mapStateToProps)(LookRecord);
