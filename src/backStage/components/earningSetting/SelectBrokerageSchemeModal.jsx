import React, { Component, PropTypes } from 'react';
import {connect} from 'dva';
import {
	Form,
	Radio,
	Button,
	Modal,
	Input,
	DatePicker,
	Checkbox,
	InputNumber,
	Table,
} from 'antd';
import SearchBar from '../../../commons/View/SearchInput/index'
import './selectBrokerageSchemeModal.css'
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
function SelectBrokerageSchemeModal({dispatch, earningSetting, form}) {
	const {
		selectBrokerageVisible,
		selectedRows,
	}=earningSetting;
	console.log('selectedRows',selectedRows);
	const onSubmit=()=> {
		dispatch({
			type:'earningSetting/setState',
			payload:{
				currentBrokerageScheme:selectedRows,
				selectBrokerageVisible:false,
			}
		})
	};
	const onCancel=()=>{
		dispatch({
			type:'earningSetting/setState',
			payload:{
				selectBrokerageVisible:false,
			}
		})
	};


	const tableData=[
		{
			key:1,
			schemeName:'A方案',
			broker:'90%',
			platform:'8%',
			provinceAgent:'0.1%',
			cityAgent:'0.5%',
			areaAgent:'0.7%',
			dealCenter:'0.2%',
			advisorJoles:'0.5%',
		},{
			key:2,
			schemeName:'B方案',
			broker:'80%',
			platform:'8%',
			provinceAgent:'0.1%',
			cityAgent:'0.5%',
			areaAgent:'0.7%',
			dealCenter:'0.2%',
			advisorJoles:'0.5%',
		}
	];
	const columns=[
		{
			title:'佣金方案名称',
			dataIndex:'schemeName',
		},{
			title:'经纪人',
			dataIndex:'broker',
			sorter: (a, b) => parseFloat(a.broker) - parseFloat(b.broker)
		},{
			title:'平台',
			dataIndex:'platform',
			sorter: (a, b) => parseFloat(a.platform) - parseFloat(b.platform)
		},{
			title:'省级代理',
			dataIndex:'provinceAgent',
		},{
			title:'市级代理',
			dataIndex:'cityAgent',
		},{
			title:'区县代理',
			dataIndex:'areaAgent',
		},{
			title:'交易中心',
			dataIndex:'dealCenter',
		},{
			title:'师傅角色',
			dataIndex:'advisorJoles',
		}
	];
	const SearchBarProps={
		searchFuc:(argu)=>{
			console.log('??????????????????????????',argu)
		},
		buttonTitle:'搜索',
		placeholder:'搜索佣金方案名称',
	};
	const pagination = {
		total: tableData.length,
		showSizeChanger: true,
		onShowSizeChange: (current, pageSize) => {
			console.log('Current: ', current, '; PageSize: ', pageSize);
		},
		onChange: (current) => {
			console.log('Current: ', current);
		},
	};
	return(
		<Modal
			style={{minWidth:'650px'}}
			title="选择佣金方案"
			maskClosable={false}
			visible={selectBrokerageVisible}
			onCancel={onCancel}
			footer={[
				<Button key="完成" type="primary" size="large" onClick={onSubmit}>完成</Button>,
				<Button key="取消" type="ghost" size="large" onClick={onCancel}>取消</Button>
			]}
		>
				<SearchBar {...SearchBarProps}/>
				<Table
					bordered={true}
					loading={false}
					columns={columns}
					dataSource={tableData}
					rowSelection={{
						type:'radio',
						selectedRows,
						onChange:(selectedRowKeys, selectedRows)=>{
							console.log('selectedRows',selectedRows);
							dispatch({
								type:'earningSetting/setState',
								payload:{
									selectedRows,
								}
							})
						}
					}}
					rowKey={record => record.key}
					pagination={pagination}
				/>
		</Modal>
	)
}
SelectBrokerageSchemeModal.propTypes = {
};

function mapStateToProps({ earningSetting }) {
	return { earningSetting }
}
SelectBrokerageSchemeModal = Form.create({})(SelectBrokerageSchemeModal);
export default connect(mapStateToProps)(SelectBrokerageSchemeModal)