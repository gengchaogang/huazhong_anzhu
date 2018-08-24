import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import {Tabs,Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
const confirm = Modal.confirm;


function TableEachSide({location, dispatch, labelManagement}) {
	const {status,tableLoading_category, currentEditRecord, currentEditValue}=labelManagement;
	const tableData_eachSide=[
		{
			key:1,
			province:'北京市',
			city:'北京市',
			area:'全部',
			dealCenter:'全部',
			matchPlan:'A佣金方案',
			brokerageMatch:{
				broker:'90%',
				platform:'8%',
				provinceAgent:'3%',
				cityAgent:'5%',
				areaAgent:'5%',
				deal:'5%',
				advisor:'5%',
			},
			fuwufeiFangAn:'A服务费方案',
			jyfwfpb:{
				platform:'8%',
				provinceAgent:'3%',
				cityAgent:'5%',
				areaAgent:'5%',
			},
		}
	];
	
	const tableColumns=[
		{
			title: '序号',
			render:(text,record)=>{
				return(
					<span>1</span>
				)
			}

		}, {
			title: '省份',
			render:(text,record,index)=>{
				return(

				<span>河北省</span>
					)
			}
		},{
			title: '城市',
			render:(text,record,index)=>{
				return(

				<span>石家庄市</span>
					 )
			}
		}, {
			title: '区县',
			dataIndex:'categoryName',
			render:(text,record)=>{
				return(
					<span>桥东区</span>
				)
			}
		}, {
			title: '交易中心',
			dataIndex:'openDateTime',
			render:(text,record)=>{
				return(
					<span>桥东区交易中心</span>
				)
			}
		},{
			title: '配比方案',
			dataIndex:'updataPerson',
			render:(text,record)=>{
				return(
					<span>A佣金方案</span>
				)
			}
		},{
			title: '佣金配比',
			render:(text)=>{
				return(
					<span>...</span>
				)
			}
		},{
			title: '服务费配比方案',
			render:(text)=>{
				return(
					<span>A服务费方案</span>
				)
			}
		},{
			title: '交易服务费配比',
			render:(text)=>{
				return(
					<span>...</span>
				)
			}
		}, {
			title: '操作',
			render:(text,record,index)=>{
				let showConfirm_delete=()=>{
					confirm({
						title: '确认要删除此类别吗？',
						// content: 'When clicked the OK button, this dialog will be closed after 1 second',
						onOk() {
							return new Promise((resolve, reject) => {
								//在此发送请求
								dispatch({
									type:'labelManagement/deleteMatchScheme',//
									payload:{
										resolve:resolve,
										reject:reject,
										fetchArgu:{//fetch请求相关参数

										},
									}
								})
							}).catch(() => console.log('errors!'));
						},
						onCancel() {},
					});
				};
				return(
					<span>
						<a>编辑</a>
						<span className="ant-divider" />
						<a onClick={showConfirm_delete}>删除</a>
					</span>
				)
			}
		}
	];

	const pagination = {
		total: tableData_eachSide?tableData_eachSide.length:100,
		showSizeChanger: true,
		onShowSizeChange: (current, pageSize) => {
			console.log('Current: ', current, '; PageSize: ', pageSize);
		},
		onChange: (current) => {
			console.log('Current: ', current);
		},
	};
	return (
		<Table
			bordered={true}
			loading={tableLoading_category}
			columns={tableColumns}
			dataSource={tableData_eachSide}
			rowKey={record => record.key}
			pagination={pagination}
		/>
	);
}

TableEachSide.propTypes = {

}

function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}

export default connect(mapStateToProps)(TableEachSide)
