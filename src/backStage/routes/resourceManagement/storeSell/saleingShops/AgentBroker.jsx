import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Table,Modal,Checkbox,Input } from 'antd';
import SearchInput from '../../../../../commons/View/SearchInput'
import DxPanel from '../../../../../commons/components/DxPanel'
import './AgentBroker.css'
import textPic from '../../../../assets/yay.jpg'
import JumpButton from './JumpButton'

function AgentBroker({dispatch }) {
  const goBack=()=>{
      dispatch(routerRedux.goBack());
  }
  const agentBrokerTable=[
    {
      title: '序号',
      dataIndex: 'number',
      key:'number',
    },
    {
      title: '经纪人',
      dataIndex: 'agentBroker',
      key:'agentBroker',
    },
    {
      title: '联系方式',
      dataIndex: 'contactInformation',
      key:'contactInformation',
    },
    {
      title: '总价',
      dataIndex: 'total',
      key:'total',
    },
    {
      title: '合作速销',
      dataIndex: 'speedPin',
      key:'speedPin',
    },
    {
      title: '核心卖点',
      dataIndex: 'coreSellingPoint',
      key:'coreSellingPoint',
    },
  ];
  const agentBrokerTableData=[
    {
      key:'1',
      number:1,
      agentBroker:'黄林峰',
      contactInformation:'151000000000',
      total:'300万',
      speedPin:'房源 4：6 客源（4000元：6000元）',
      coreSellingPoint:'船舶大院公房社区 田字格户型 明厨明卫 中间楼层采光好！'
    },
    {
      key:'2',
      number:2,
      agentBroker:'黄林峰',
      contactInformation:'151000000000',
      total:'300万',
      speedPin:'房源 4：6 客源（4000元：6000元）',
      coreSellingPoint:'船舶大院公房社区 田字格户型 明厨明卫 中间楼层采光好！'
    },
  ]
  return (
    <div>
      <JumpButton/>
      <Table dataSource={agentBrokerTableData} columns={agentBrokerTable}/>
    </div>
  );
}

function mapStateToProps({ agentBroker }) {
  return { agentBroker }
}

export default connect(mapStateToProps)(AgentBroker);
