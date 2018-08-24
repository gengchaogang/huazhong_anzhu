import React, { Component, PropTypes } from 'react'
import {Table, Icon, Form, Input, Select, Button,Cascader,filter}from 'antd'
import { routerRedux } from 'dva/router';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import { connect } from 'dva'
import './AdvisorIdIndex.css'
const Option = Select.Option;
const FormItem=Form.Item;
function AdvisorIdIndex({dispatch,form,advisorIdIndex,}) {
	const {getFieldDecorator}=form;
	const {
		submitLoading,
		tableLoading,
		loading,
		totalElements, tableData,pageNo,pageSize,
		selectedCity
	}=advisorIdIndex;
	const toDetailPage=(record)=>{
		dispatch(routerRedux.push({
			pathname:'/idManagement/advisorIdIndex/advisorIdDetail',
			state:{
				id:record.id
			},
		}));
	};
	const handleSubmit=()=> {
		form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			if (err) {
				return;
			}
			var params = {};
			if(values.keyword){
				params.keyword = values.keyword;
			}
			if(values.status){
				params.status = values.status;
			}
			var province = values.province;
			if(province && province.length){
				let areaPath=[];
				selectedCity.datas.filter(function(value){
					province.filter(function(valueArea){
						if(value.code===valueArea){
							areaPath.push(value.label);
						}
					})
				});
				if(areaPath.length>0){
					params.fullPath = "/"+areaPath.join("/");
				}
			}

			dispatch({type: "advisorIdIndex/search", payload: params});
		});
	}
	const handleReset=()=>{
		form.resetFields();
		dispatch({type: "advisorIdIndex/search"});
	};
	const columns=[
		{
			title: '序号',
			dataIndex:'number',
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
			dataIndex:'area',
		},
		{
			title:'注册时间',
			dataIndex:'createDateTime',
		},
		{
			title:'上次登录',
			dataIndex:'lastLoginDateTime',
		},
		{
			title:'状态',
			dataIndex:'status',
		},
		{
			title:'操作',
			dataIndex:'operation',
			render:(text,record)=>{
				return (
					<span className='opration' onClick={()=>{toDetailPage(record)}}>详情</span>
				)
			}
		},
	]

	const pagination={
    total:totalElements,
    current:pageNo,
    // pageSize:pageSize,
    showTotal:(data)=>{
       return `共 ${totalElements} 条`
    },
    onChange:(data)=>{
      dispatch({
				type:'advisorIdIndex/search',
				payload:{
					pageNo:data,
				},
			})
    },
    // onShowSizeChange:(current, pageSize)=>{
    //   console.log(current, pageSize,'current, pageSize');
    // }
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
					{getFieldDecorator('province', {
					})(
						<Cascader options={selectedCity.options} placeholder='河北省 / 保定市' changeOnSelect={true}/>
					)}
				</FormItem>

				<FormItem
					label="状态"
				>
					{getFieldDecorator('status', {
						initialValue:"",
					})(
						<Select
							showSearch
							style={{minWidth:'70px'}}
							optionFilterProp='children'
						>
							<Option key='' value=''>全部</Option>
							<Option key='正常' value='正常'>正常</Option>
							<Option key='冻结' value='冻结'>冻结</Option>
						</Select>
					)}
				</FormItem>
				<FormItem>
					<Button loading={submitLoading} style={{margin:'0 6px 0 0'}}  onClick={handleSubmit} type="primary">搜索</Button>
					<Button onClick={handleReset} type='ghost'>重置</Button>
				</FormItem>
			</Form>
			<Table
				loading={tableLoading}
				columns={columns}
				dataSource={tableData}
				rowKey={record => record.key}
				pagination={pagination}
			/>
			<DxLoadingShadow visible={loading} zIndex={1001}/>
		</div>
	)
}


AdvisorIdIndex.propTypes = {

};
function mapStateToProps({ advisorIdIndex }) {
	return { advisorIdIndex }
}

export default connect(mapStateToProps)(Form.create()(AdvisorIdIndex))
