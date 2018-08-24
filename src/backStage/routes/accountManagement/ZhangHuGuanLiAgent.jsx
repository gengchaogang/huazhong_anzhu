import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table, Button,Input,Form,Cascader,Select}from 'antd'
import './ZhangHuGuanLiAgent.css';
import SearchKeyBox from '../../components/searchKeyBox/SearchKeyBox'
import DxPanel from '../../../commons/components/DxPanel'
const FormItem=Form.Item;
const Option=Select.Option;
function ZhangHuGuanLiAgent({dispatch,zhangHuGuanLiAgent,form}) {
  const {getFieldDecorator}=form;
  const {cascaderArr,dataSource,total,pageNo,
    areaPath,keyword,operatorType,loading,
  }=zhangHuGuanLiAgent;
  const formSearch=()=>{
    form.validateFields((err,values)=>{
      let areaPath='';
      if(!!values.areaPath){
        areaPath='/'+values.areaPath.join('/');
      }
      dispatch({type:'zhangHuGuanLiAgent/initialSuccess',payload:{loading:true}})
      dispatch({
        type:'zhangHuGuanLiAgent/findAccountsOperator',
        payload:{
          areaPath:areaPath,
          keyword:values.keyword,
          operatorType:values.operatorType,
        }
      })
    })
  }
  const resetClick=()=>{
    form.resetFields();
  }
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'代理商类型',
      dataIndex:'operatorType',
    },
    {
      title:'地区',
      dataIndex:'areaPath',
    },
    {
      title:'帐号',
      dataIndex:'loginName',
    },
    {
      title:'企业名称',
      dataIndex:'name',
    },
    {
      title:'账户余额(元)',
      dataIndex:'amount',
    },
    {
      title:'账户状态',
      dataIndex:'status',
    },
    {
      title:'操作',
      render:(text,recoder)=><span className='watchDetails' onClick={()=>{watchDetails(recoder.key)}}>查看</span>
    },
  ]
  //查看详情
  const watchDetails=(key)=>{
    dispatch(routerRedux.push({
			pathname: `/accountManagement/zhangHuGuanLiAgent/accountAgentDetail`,
      state:{
        id:key,
      }
		}));
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({type:'zhangHuGuanLiAgent/initialSuccess',payload:{loading:true}})
      dispatch({
        type:'zhangHuGuanLiAgent/findAccountsOperator',
        payload:{
          areaPath:areaPath,
          keyword:keyword,
          pageNo:page-1,
          operatorType:operatorType,
        }
      })
    }
  }
	return(
		<div>
      <Form inline style={{margin:'20px 0'}}>
        <FormItem
					label="关键字"
				>
					{getFieldDecorator('keyword', {
					})(
						<Input placeholder='搜索帐号或名称'/>
					)}
				</FormItem>
        <FormItem
					label="地区"
				>
					{getFieldDecorator('areaPath', {
					})(
						<Cascader placeholder='河北省 / 保定市' options={cascaderArr} changeOnSelect={true}/>
					)}
				</FormItem>
        <FormItem
					label='代理商类型'
				>
					{getFieldDecorator('operatorType', {
					})(
						<Select style={{width:'159px'}}>
              <Option value='省级代理商' key='省级代理商'>省级代理商</Option>
              <Option value='市级代理商' key='市级代理商'>市级代理商</Option>
              <Option value='区级代理商' key='区级代理商'>区级代理商</Option>
            </Select>
					)}
				</FormItem>
        <Button type="primary" style={{margin:'0 6px 0 0'}} onClick={formSearch}>搜索</Button>
        <Button type='ghost' onClick={resetClick}>重置</Button>
      </Form>
      <Table columns={columns} dataSource={dataSource}
        pagination={pagination} loading={loading}
      />
		</div>
	)
}


ZhangHuGuanLiAgent.propTypes = {

};
function mapStateToProps({zhangHuGuanLiAgent }) {
	return { zhangHuGuanLiAgent }
}

export default connect(mapStateToProps)(Form.create()(ZhangHuGuanLiAgent))
