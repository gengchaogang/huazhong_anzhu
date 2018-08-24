import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Tabs,Button,Modal,Cascader} from 'antd';
const FromItem=Form.Item;
import DxPanel from '../../../../commons/components/DxPanel'
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
import './AdvisorRegister.css'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
function AdvisorRegister({dispatch,form,advisorRegister}) {
  const {pendingAudit,total,pageNo,keyword,fullPath,
    loginFailed,auditStatus,loading,cascaderOptions}=advisorRegister;
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  //搜索
  const formSearch=(data)=>{
    let fullPath='';
    if(data.city){
      fullPath='/'+data.city.join('/')
    }
    dispatch({
      type:'advisorRegister/formSearch',
      payload:{
        keyword:data.keyword,
        fullPath:fullPath,
        auditStatus:auditStatus,
      }
    })
  }
  //重置
  const resetField=()=>{
    dispatch({
      type:'advisorRegister/resetField',
      payload:{
        pageNo:0,
        keyword:'',
        fullPath:'',
        auditStatus:auditStatus,
      }
    })
  }
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'注册时间',
      dataIndex:'createDateTime',
    },
    {
      title:'帐号',
      dataIndex:'loginName',
    },
    {
      title:'企业名称',
      dataIndex:'companyName',
    },
    {
      title:'地区',
      dataIndex:'fullPath',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><span onClick={()=>{detailClick(record.key)}} className='operationColor'>详情</span>
    }
  ]
  const columnsFailed=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'审核时间',
      dataIndex:'auditTime',
    },
    {
      title:'帐号',
      dataIndex:'loginName',
    },
    {
      title:'企业名称',
      dataIndex:'companyName',
    },
    {
      title:'地区',
      dataIndex:'fullPath',
    },
    {
      title:'失败原因',
      dataIndex:'reasons',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><span onClick={()=>{detailClick(record.key)}} className='operationColor'>详情</span>
    }
  ]
  const detailClick=(value)=>{
    dispatch(routerRedux.push({
			pathname: `/contentCheck/advisorRegister/advisorRegisterDetail`,
      state:{
        id:value,
      }
		}));
  }
  //tabs的状态改变的回调
  const callback=(key)=>{
    dispatch({type:'advisorRegister/initailSuccess',payload:{loading:true}})
    dispatch({
      type:'advisorRegister/changeAuditStatus',
      payload:{
        auditStatus:key,
        keyword:keyword,
        pageNo:0,
        fullPath:fullPath,
      }
    })
  }
  const pagination={
		total:total,
		showTotal:total => `共 ${total} 项`,
		current:pageNo,
		onChange:(page)=>{
			dispatch({type:'advisorRegister/initailSuccess',
				payload:{loading:true}
			})
			dispatch({
				type:'advisorRegister/pageOnchange',
				payload:{
					pageNo:page-1,
          keyword:keyword,
          fullPath:fullPath,
          auditStatus:auditStatus,
				}
			})
		}
	};
  return (
    <div>
      <SearchKeyBox areaSelet={true} onChange={formSearch} resetField={resetField}
        cascaderOptions={cascaderOptions}
        placeholder='搜索帐号或企业名称'/>
      <Tabs defaultActiveKey='待审核' onChange={callback} type='card'>
        <TabPane tab="待审核" key="待审核">
          <Table columns={columns} dataSource={pendingAudit}
            pagination={pagination}
            loading={loading}
          />
        </TabPane>
        <TabPane tab="注册失败" key="审核失败">
          <Table columns={columnsFailed} dataSource={loginFailed}
            pagination={pagination}
            loading={loading}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

function mapStateToProps({advisorRegister}) {
  return {advisorRegister}
}

export default connect(mapStateToProps)(Form.create()(AdvisorRegister));
