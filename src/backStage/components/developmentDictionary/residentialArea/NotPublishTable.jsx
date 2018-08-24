import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import {Tabs,Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
const confirm = Modal.confirm;
const FormItem=Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import SearchInput from '../../../../commons/View/SearchInput'


function NotPublishTable({location, dispatch, residentialArea}) {
	const {tableLoading, response}=residentialArea.tableNotPublish;
	const tableData=response.data?response.data.data.content:[];
	const totalElements=response.data?response.data.data.totalElements:0;
	const size=response.data?response.data.data.size:0;
	const number=response.data?response.data.data.number:0;
	const columnsRender=(dataIndex,text,record)=>{
		if(dataIndex==='area'){
			let zones=record.zones;
			if(zones.length!=0){
				let string='';
				for(let k=0; k<zones.length; k++){
					if(k==0){
						string+=zones[k].name
					}else {
						string+=('、'+zones[k].name)
					}
				}
				return(<span>{string}</span>)
			}else{
				return (<span style={{color:'#ddd'}}>未添加</span>)
			}
		}
		if(dataIndex==='operation'){
			let toDivisionManagement=()=>{
				dispatch(routerRedux.push({
					pathname:'/residentialArea/openCity/divisionManagement',
					state:{
						currentCityName:record.name,
						currentCityStatus:residentialArea.activeKey,
						firstAreaId:record.zones[0]?record.zones[0].id:null,//第一个片区id

						currentProvince:record.province,
						currentCityId:record.id,
						activeAreaId:record.zones[0]?record.zones[0].id:null,
					},
				}));
			};
			let openCity=()=>{
				confirm({
					title: '确认开通城市?',
					// content: 'When clicked the OK button, this dialog will be closed after 1 second',
					onOk() {
						return new Promise((resolve, reject) => {
							dispatch({
								type:'residentialArea/openCity',
								payload:{
									resolve:resolve,
									params:{
										code:record.code,
									}
								}
							})
						}).catch(() => console.log('Oops errors!'));
					},
					onCancel() {},
				});
			};
			return(
				<span>
					<a onClick={openCity}>开通城市</a>
					<span className="ant-divider" />
					<a onClick={toDivisionManagement}>片区管理</a>
				</span>
			);
		}
	};
	const columns=[
		{
			title: '序号',
			dataIndex:'key',
		}, {
			title: '省份',
			dataIndex:'province',
		}, {
			title: '城市',
			dataIndex:'name',
		}, {
			title: '区县',
			dataIndex:'subs',
			render:(text,record)=>{
				return columnsRender('area', text, record);
			}
		}, {
			title: '添加时间',
			dataIndex:'addTime',
		}, {
			title: '操作',
			render:(text,record)=>{
				return columnsRender('operation', text, record);
			}
		}
	];

	const onPageChange=(page)=>{
		console.log('page',page);
		dispatch({
			type:'residentialArea/query',
			payload:{
				state:'open',
				pageNo:page-1,
				state:'准备中',
			}
		})
	};
	const pagination={
		total:totalElements,
		showTotal:total => `共 ${total} 项`,
		showQuickJumper:true,
		pageSize:size,
		defaultCurrent:1,
		onChange:onPageChange,
	};
	return (
		<Table
			loading={tableLoading}
			columns={columns}
			dataSource={tableData}
			rowKey={record => record.id}
			pagination={pagination}
		/>
	);
}

NotPublishTable.propTypes = {

}

function mapStateToProps({ residentialArea }) {
	return { residentialArea }
}

export default connect(mapStateToProps)(NotPublishTable)
