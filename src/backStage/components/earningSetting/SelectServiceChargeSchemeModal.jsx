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
function SelectServiceChargeSchemeModal({dispatch, earningSetting, form}) {
	const {
		selectServiceChargeVisible,
		serviceSelectedRows,
	}=earningSetting;
	console.log('selectedRows',serviceSelectedRows);
	const onSubmit=()=> {
		dispatch({
			type:'earningSetting/setState',
			payload:{
				currentServiceScheme:serviceSelectedRows,
				selectServiceChargeVisible:false,
			}
		})
	};
	const onCancel=()=>{
		dispatch({
			type:'earningSetting/setState',
			payload:{
				selectServiceChargeVisible:false,
			}
		})
	};


	const tableData=[
		{
			key:1,
			schemeName:'A方案',
			platform:'8%',
			provinceAgent:'0.1%',
			cityAgent:'0.5%',
			areaAgent:'0.7%',
			dealCenter:'0.2%',
			advisorJoles:'0.5%',
		},{
			key:2,
			schemeName:'B方案',
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
			title:'方案名称',
			dataIndex:'schemeName'
		},{
			title:'平台',
			dataIndex:'platform',
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
		placeholder:'搜索服务费配比方案名称',
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
			title="选择服务费配比方案"
			maskClosable={false}
			visible={selectServiceChargeVisible}
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
					selectedRows:serviceSelectedRows,
					onChange:(selectedRowKeys, selectedRows)=>{
						console.log('selectedRows',selectedRows);
						dispatch({
							type:'earningSetting/setState',
							payload:{
								serviceSelectedRows:selectedRows,
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
SelectServiceChargeSchemeModal.propTypes = {
};

function mapStateToProps({ earningSetting }) {
	return { earningSetting }
}
SelectServiceChargeSchemeModal = Form.create({})(SelectServiceChargeSchemeModal);
export default connect(mapStateToProps)(SelectServiceChargeSchemeModal)