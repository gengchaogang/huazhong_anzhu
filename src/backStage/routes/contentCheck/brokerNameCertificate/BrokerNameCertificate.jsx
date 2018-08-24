import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Tabs,Button,Modal,Cascader} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
import './BrokerNameCertificate.css'
const TabPane = Tabs.TabPane;
function BrokerNameCertificate({dispatch,brokerNameCertificate}) {
  const {cascaderOptions}=brokerNameCertificate;
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'申请时间',
      dataIndex:'updateTime',
    },
    {
      title:'关系',
      dataIndex:'',
    },
    {
      title:'申请人',
      dataIndex:'',
    },
    {
      title:'角色',
      dataIndex:'',
    },
    {
      title:'申请人所在地区',
      dataIndex:'',
    },
    {
      title:'关系人',
      dataIndex:'',
    },
    {
      title:'角色',
      dataIndex:'',
    },
    {
      title:'关系人所在地区',
      dataIndex:'',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(record,text)=><div>
        <span className='operationColor' onClick={()=>authenticationDetail(record)}>详情</span>
      </div>
    }
  ]
  const dataSource=[
    {
      key:'001',
      number:'1',
    }
  ]
  //搜索
  const formSearch=(data)=>{
    console.log(data,'data');
  }
  //重置
  const resetField=()=>{

  }
  const authenticationDetail=(record)=>{
    dispatch(routerRedux.push({
			pathname: `/contentCheck/brokerNameCertificate/authenticationDetail`,
		}));
  }
  return (
    <div>
      <SearchKeyBox areaSelet={true} onChange={formSearch} resetField={resetField}
        findingsAudit={true}
        cascaderOptions={cascaderOptions}
        placeholder='搜索小区名称'/>
      <Table columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
}

function mapStateToProps({brokerNameCertificate}) {
  return {brokerNameCertificate}
}

export default connect(mapStateToProps)(BrokerNameCertificate);
