import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Tabs,Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
const confirm = Modal.confirm;
const FormItem=Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function OpenedTable({location, dispatch, cityManagement,form}) {
	const { getFieldDecorator, setFields ,validateFields,resetFields,} =form;
	const {closeCityModal, cityOpenCode,tableOpen, activeKey, addAreaModal,eidtCityModalopened}=cityManagement;
	const {tableLoading, response}=tableOpen;
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
			let showConfirm=()=>{
				confirm({
					title: '确认是否关闭城市?',
					content: '关闭城市后，经纪人将无法切换到此城市，且此城市中所有房源将被下架，请谨慎操作。',
					okText:"继续关闭",
					cancelText:"取消",
					onOk() {
						dispatch({
							type:'cityManagement/setState',
							payload:{
								closeCityModal:{
									...closeCityModal,
									code:record.code,
									visible:true,
								},
							}
						})
					},
					onCancel() {},
				});
			};
			let toDivisionManagement=()=>{
				// console.log(record,'divisionManagement');
				dispatch(routerRedux.push({
					pathname:'/cityManagement/openCity/divisionManagement',
					state:{
						currentCityName:record.name,
						cityCode:record.code,
						currentCityStatus:activeKey,
						firstAreaId:record.zones[0]?record.zones[0].id:null,//第一个片区id
						currentProvince:record.province,
						currentCityId:record.id,
						activeAreaId:record.zones[0]?record.zones[0].id:null,
					},
				}));
			};
			let editCity=()=>{
				dispatch({
					type:'cityManagement/setState',
					payload:{
						eidtCityModalopened:true,
						cityOpenCode:record.code
					}
				})
			}
			return(
				<span>
					<a className='operationColor' onClick={toDivisionManagement}>片区管理</a>
					<a className='operationColor' onClick={showConfirm}>关闭城市</a>
					<a className='operationColor' onClick={editCity}>编辑城市</a>
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
			dataIndex:'zones',
			render:(text,record)=>{
				return columnsRender('area', text, record);
			}
		}, {
			title: '开通时间',
			dataIndex:'openTime',
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
				state:'开通',
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
	const eidtCityModalopenedhandleOk=()=>{
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			dispatch({
				type:'cityManagement/eidtCityModalopened',
				payload:{
					code:cityOpenCode,
					py:values.py,
				}
			})
			resetFields();
		})
	}
	const eidtCityModalopenedhandleCancel=()=>{
		dispatch({
			type:'cityManagement/setState',
			payload:{
				eidtCityModalopened:false,
			}
		})
		resetFields();
	}
	return (
		<div>
			<Table
				loading={tableLoading}
				columns={columns}
				dataSource={tableData}
				rowKey={record => record.id}
				pagination={pagination}
			/>
			<Modal title="编辑" visible={eidtCityModalopened}
          onOk={eidtCityModalopenedhandleOk} onCancel={eidtCityModalopenedhandleCancel}
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
		</div>
	);
}

OpenedTable.propTypes = {

}
OpenedTable = Form.create({})(OpenedTable);
function mapStateToProps({ cityManagement }) {
	return { cityManagement }
}

export default connect(mapStateToProps)(OpenedTable)
