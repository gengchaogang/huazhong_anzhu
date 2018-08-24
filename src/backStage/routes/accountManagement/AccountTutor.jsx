import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table, Button,Select,Input,Form}from 'antd'
import './AccountTutor.css';
import DxPanel from '../../../commons/components/DxPanel'
import SearchKeyBox from '../../components/searchKeyBox/SearchKeyBox'
const FormItem=Form.Item;
const Option=Select.Option;
function AccountTutor({dispatch,accountTutor,form}) {
	const {getFieldDecorator}=form;
	const {
		dataSource,
		total,
		pageNo,
		status,
		keyword,
		loading,
	}=accountTutor;
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
			title: '导师名称',
			dataIndex:'name',
		},
		{
			title: '企业名称',
			dataIndex:'companyName',
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
			render:(text,recoder)=><div onClick={()=>{accountTutorDetail(recoder.key)}} className='zhangHuDetail'>详情</div>
		},
	];
	const accountTutorDetail=(key)=>{
		dispatch(routerRedux.push({
			pathname:'/accountManagement/accountTutor/accountTutorDetail',
			state:{id:key}
		}));
	}
	const formSearch=()=>{
		form.validateFields((err,values)=>{
			dispatch({
				type:'accountTutor/initialSuccess',
				payload:{loading:true}
			})
			dispatch({
				type:'accountTutor/findAccounts',
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
      dispatch({type:'accountTutor/initialSuccess',payload:{loading:true}})
      dispatch({
        type:'accountTutor/findAccounts',
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


AccountTutor.propTypes = {

};
function mapStateToProps({accountTutor }) {
	return { accountTutor }
}

export default connect(mapStateToProps)(Form.create()(AccountTutor))
