import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import {Tabs,Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
const confirm = Modal.confirm;
const FormItem=Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import SearchInput from '../../../commons/View/SearchInput'
import SearchBox from './/SearchBox'
import DxPanel from '../../../commons/components/DxPanel'
import AddTargetCity from './/AddTargetCity';
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function UnOpenTable({location, dispatch, cityManagement,form}) {
	const { getFieldDecorator, setFields ,validateFields,resetFields,} =form;
	const {tableLoading, response}=cityManagement.tableAdded;
	const{eidtCityModalpreparation,cityPreparationCode}=cityManagement;
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
					pathname:'/cityManagement/openCity/divisionManagement',
					state:{
						currentCityName:record.name,
						currentCityStatus:cityManagement.activeKey,
						firstAreaId:record.zones[0]?record.zones[0].id:null,//第一个片区id
						cityCode:record.code,
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
								type:'cityManagement/openCity',
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
			let deletePreparation=()=>{
				Modal.confirm({
		      title: '提示',
		      content: '确定要删除吗？',
		      okText: '确定',
		      cancelText: '取消',
		      onOk:()=>{
						dispatch({
							type:'cityManagement/deletCityZones',
							payload:{
								id:record.id,
							}
						})
		      }
		    });
			}
			let editPreparation=()=>{
				dispatch({
					type:'cityManagement/setState',
					payload:{
						eidtCityModalpreparation:true,
						cityPreparationCode:record.code
					}
				})
			}
			return(
				<span>
					<a className='operationColor' onClick={openCity}>开通城市</a>
					<a className='operationColor' onClick={toDivisionManagement}>片区管理</a>
					<a className='operationColor' onClick={editPreparation}>编辑</a>
					<a className='operationColor' onClick={deletePreparation}>删除</a>
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
		dispatch({
			type:'cityManagement/query',
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
		current:number+1,
		onChange:onPageChange,
	};
	const eidtCityPreparationhandleOk=()=>{
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			dispatch({
				type:'cityManagement/eidtCityPreparation',
				payload:{
					code:cityPreparationCode,
					py:values.py,
				}
			})
			resetFields();
		})
	}
	const eidtCityPreparationhandleCancel=()=>{
		dispatch({
			type:'cityManagement/setState',
			payload:{
				eidtCityModalpreparation:false,
			}
		})
		resetFields();
	}
	return (
		<div>
			<Modal title="编辑" visible={eidtCityModalpreparation}
					onOk={eidtCityPreparationhandleOk} onCancel={eidtCityPreparationhandleCancel}
				>
				<FormItem
					label="城市拼音"
					{...formItemLayout}
				>
					{getFieldDecorator('py', {
						rules: [{ required: true, message: '必填' }],
					})(
						<Input placeholder='请输入城市拼音首字母如‘北京市：bj’'/>
					)}
				</FormItem>
			</Modal>
			<Table
				loading={tableLoading}
				columns={columns}
				dataSource={tableData}
				rowKey={record => record.id}
				pagination={pagination}
			/>
		</div>
	);
}

UnOpenTable.propTypes = {

}
UnOpenTable = Form.create({})(UnOpenTable);
function mapStateToProps({ cityManagement }) {
	return { cityManagement }
}

export default connect(mapStateToProps)(UnOpenTable)
