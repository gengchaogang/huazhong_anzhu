import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table, Button,Select,Input,Form}from 'antd'
import './ZhangHuGuanLiBroker.css';
import DxPanel from '../../../commons/components/DxPanel'
import SearchKeyBox from '../../components/searchKeyBox/SearchKeyBox'
const FormItem=Form.Item;
const Option=Select.Option;
function ZhangHuGuanLiBroker({dispatch,zhangHuGuanLiBroker,form}) {
	const {getFieldDecorator}=form;
	const {
		dataSource,
		total,
		pageNo,
		status,
		keyword,
		loading,
	}=zhangHuGuanLiBroker;
	const columns=[
		{
			title: '序号',
			dataIndex:'number',
		},
		{
			title: '帐号',
			dataIndex:'loginName',
		},
		{
			title: '姓名',
			dataIndex:'name',
		},
		{
			title: '银行卡（张）',
			dataIndex:'cardNumber',
		},
		{
			title: '累计佣金（元）',
			dataIndex:'totalCommission',
		},
		{
			title: '钱包金额（元）',
			dataIndex:'amount',
		},
		{
			title: '状态',
			dataIndex:'status',
		},
		{
			title: '操作',
			dataIndex:'operation',
			render:(text,recoder)=><div onClick={()=>{zhangHuDetail(recoder.key)}} className='zhangHuDetail'>详情</div>
		},
	];
	const zhangHuDetail=(key)=>{
		dispatch(routerRedux.push({
			pathname:'/accountManagement/zhangHuGuanLiBroker/zhangHuDetail',
			state:{id:key}
		}));
	}
	const formSearch=()=>{
		form.validateFields((err,values)=>{
			dispatch({
				type:'zhangHuGuanLiBroker/initialSuccess',
				payload:{loading:true}
			})
			dispatch({
				type:'zhangHuGuanLiBroker/findAccounts',
				payload:{
					keyword:values.keyword,
					pageNo:0,
					status:values.status,
				}
			})
		})
	}
	const resetClick=()=>{
		form.resetFields();
	}
	//分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({type:'zhangHuGuanLiBroker/initialSuccess',payload:{loading:true}})
      dispatch({
        type:'zhangHuGuanLiBroker/findAccounts',
        payload:{
          keyword:keyword,
          pageNo:page-1,
          status:status,
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
					label='状态'
				>
					{getFieldDecorator('status', {
					})(
						<Select style={{width:'159px'}}>
              <Option value='正常' key='正常'>正常</Option>
              <Option value='冻结' key='冻结'>冻结</Option>
            </Select>
					)}
				</FormItem>
        <Button type="primary" style={{margin:'0 6px 0 0'}} onClick={formSearch}>搜索</Button>
        <Button type='ghost' onClick={resetClick}>重置</Button>
      </Form>
			<Table
				columns={columns} dataSource={dataSource}
				pagination={pagination} loading={loading}
			/>
		</div>
	)
}


ZhangHuGuanLiBroker.propTypes = {

};
function mapStateToProps({zhangHuGuanLiBroker }) {
	return { zhangHuGuanLiBroker }
}

export default connect(mapStateToProps)(Form.create()(ZhangHuGuanLiBroker))
