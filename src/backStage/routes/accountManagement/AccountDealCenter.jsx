import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table, Input, Button,Form,Select,Cascader}from 'antd'
import './AccountDealCenter.css';
import SearchKeyBox from '../../components/searchKeyBox/SearchKeyBox'
import DxPanel from '../../../commons/components/DxPanel'
const FormItem=Form.Item;
const Option=Select.Option;
function AccountDealCenter({dispatch,accountDealCenter,form}) {
  const {getFieldDecorator}=form;
  const {
    cascaderArr,
    dataSource,
    total,
    pageNo,
    areaPath,
    keyword,
    status,
    loading,
  }=accountDealCenter;
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'帐号',
      dataIndex:'loginName',
    },
    {
      title:'交易中心名称',
      dataIndex:'name',
    },
    {
      title:'城市',
      dataIndex:'areaPath',
    },
    {
      title:'归属代理商',
      dataIndex:'tradingCenterOperatorName',
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
      render:(text,recoder)=><span className='watchDetails' onClick={()=>{accountDealCenterDetail(recoder.key)}}>详情</span>
    },
  ]
  const accountDealCenterDetail=(key)=>{
    dispatch(routerRedux.push({
			pathname: `/accountManagement/accountDealCenter/accountDealCenterDetail`,
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
      dispatch({type:'accountDealCenter/initialSuccess',payload:{loading:true}})
      dispatch({
        type:'accountDealCenter/findAccounts',
        payload:{
          areaPath:areaPath,
          keyword:keyword,
          pageNo:page-1,
          status:status,
        }
      })
    }
  }
  const formSearch=()=>{
    form.validateFields((err,values)=>{
      let areaPath='';
      if(values.areaPath){
        areaPath='/'+values.areaPath.join('/')
      }
      dispatch({type:'accountDealCenter/initialSuccess',
        payload:{loading:true}
      })
      dispatch({
        type:'accountDealCenter/findAccounts',
        payload:{
          areaPath:areaPath,
          keyword:values.keyword,
          status:values.status,
          pageNo:0,
        }
      })
    })
  }
  const resetClick=()=>{
    form.resetFields();
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
					label="状态"
				>
					{getFieldDecorator('status', {
					})(
						<Select style={{width:'158px'}}>
              <Option value='正常' key='正常'>正常</Option>
              <Option value='冻结' key='冻结'>冻结</Option>
            </Select>
					)}
				</FormItem>
        <Button type="primary" style={{margin:'0 6px 0 0'}} onClick={formSearch}>搜索</Button>
        <Button type='ghost' onClick={resetClick}>重置</Button>
      </Form>
      <Table
        columns={columns} loading={loading} dataSource={dataSource}
        pagination={pagination}
      />
		</div>
	)
}


AccountDealCenter.propTypes = {

};
function mapStateToProps({accountDealCenter }) {
	return { accountDealCenter }
}

export default connect(mapStateToProps)(Form.create()(AccountDealCenter))
