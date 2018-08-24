import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table, Icon, Button,Cascader,Form,Select,Input,filter}from 'antd'
import './brokerIdIndex.css';
const Option = Select.Option;
const FormItem=Form.Item;
function BrokerIdIndex({dispatch,brokerIdIndex,form}) {
	const {getFieldDecorator}=form;
	const {tableData,selectedCity,totalElements,pageNo,pageSize}=brokerIdIndex;
	const options = selectedCity.options;
	const toDetailPage=(record)=>{
		dispatch(routerRedux.push({
			pathname:'/idManagement/brokerIdIndex/brokerIdDetail',
			state:{
				id:record.id
			},
		}));
	};
	const columns=[
		{
			title: '序号',
			dataIndex:'key',
		}, {
			title: '账号',
			dataIndex:'loginName',
		},{
			title: '姓名',
			dataIndex:'name',
		},{
			title: '实名认证',
			dataIndex:'realNameCertifiedState',
			// render:(text,record)=>{
			// 	return(
			// 		text?<Icon type="check" />:<Icon type="close" />
			// 	)
			// }
		},{
		// 	title: '职业认证',
		// 	dataIndex:'careerCertificate',
		// 	render:(text,record)=>{
		// 		return(
		// 			text?<Icon type="check" />:<Icon type="close" />
		// 		)
		// 	}
		// },{
			title: '警告次数',
			dataIndex:'warningTimes',
			render:(text,record)=>{
				let v = +text;
				if(v){
					return (
						<span>{text}</span>
					)
				}else {
					return text;
				}
			}
		},{
			title: '注册时间',
			dataIndex:'rigisterDate',
		},{
			title: '上次登录',
			dataIndex:'lastLoginTime',
		},{
			title: '状态',
			dataIndex:'state',
		},{
			title: '操作',
			dataIndex:'operation',
			render:(text,record)=>{
				return (
					<span className='opration' onClick={()=>{toDetailPage(record)}}>详情</span>
				)
			}
		}
	];
	const handleReset=()=>{
		form.resetFields();
		dispatch({type: 'brokerIdIndex/query'});
	};
	const handleSubmit=()=> {
		form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			if (err) {
				return;
			}
			let params = {};
			if(values.area && values.area.length){
				let areaPath=[];
				selectedCity.datas.filter(function(value){
					values.area.filter(function(valueArea){
						if(value.code===valueArea){
							areaPath.push(value.label);
						}
					})
				});
				if(areaPath.length>0){
					params.cityNames = "/"+areaPath.join("/");
				}
			}
			if(values.keyword){
				params.keyword = values.keyword;
			}
			if(values.trueNameRenZhen){
				params.realNameCertifiedState = values.trueNameRenZhen;
			}
			if(values.status){
				params.status = values.status;
			}
			dispatch({type: 'brokerIdIndex/query', payload: params});
		});
	}

	const pagination={
    total:totalElements,
    current: pageNo,
    pageSize: pageSize,
    showTotal:(data)=>{
       return `共 ${totalElements} 条`
    },
    onChange:(data)=>{
      dispatch({
				type:'brokerIdIndex/query',
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
		<div className="brokerIdIndex">
			<Form inline style={{margin:'20px 0'}}>
				<FormItem
					label="关键字"
				>
					{getFieldDecorator('keyword', {
					})(
						<Input placeholder='搜索帐号或名称'/>
					)}
				</FormItem>
				<FormItem label='地区'>
					{getFieldDecorator('area', {
					})(
						<Cascader placeholder='河北省 / 保定市' options={options} changeOnSelect={true}/>
					)}
				</FormItem>
				<FormItem
					label="实名认证"
				>
					{getFieldDecorator('trueNameRenZhen', {
						initialValue:"",
					})(
						<Select
							showSearch
							style={{minWidth:'70px'}}
							optionFilterProp='children'
						>
							<Option key='' value=''>全部</Option>
							<Option key='已认证' value='已认证'>已认证</Option>
							<Option key='未认证' value='未认证'>未认证</Option>
						</Select>
					)}
				</FormItem>
				{/* <FormItem
					label="职业认证"
				>
					{getFieldDecorator('zhiYeRenZheng', {
						initialValue:"",
					})(
						<Select
							showSearch
							style={{minWidth:'70px'}}
							optionFilterProp='children'
						>
							<Option key='' value=''>全部</Option>
							<Option key='已认证' value='已认证'>已认证</Option>
							<Option key='未认证' value='未认证'>未认证</Option>
						</Select>
					)}
				</FormItem> */}
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
					<Button type="primary"  style={{margin:'0 6px 0 0'}} onClick={handleSubmit}>搜索</Button>
					<Button type='ghost' onClick={handleReset}>重置</Button>
				</FormItem>
			</Form>
			<Table dataSource={tableData} columns={columns} pagination={pagination}/>
		</div>
	)
}


BrokerIdIndex.propTypes = {

};
function mapStateToProps({ brokerIdIndex }) {
	return { brokerIdIndex }
}

export default connect(mapStateToProps)(Form.create()(BrokerIdIndex))
