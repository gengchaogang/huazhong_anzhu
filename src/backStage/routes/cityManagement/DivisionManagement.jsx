import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import {Icon,Button,Table,Modal,Row,Input,Select,Form, Radio} from 'antd';
import { routerRedux } from 'dva/router';
const RadioButton=Radio.Button;
const RadioGroup=Radio.Group;
const FormItem=Form.Item;
import './divisionManagement.css'
import DxPanel from '../../../commons/components/DxPanel'
import AddAreaModal from '../../components/cityManagement/AddAreaModal';
function EditBox({form,initialName,initialPy}) {
	const { getFieldDecorator } =form;
	return (
		<Form inline>
			<FormItem
				label="片区名称"
			>
				{getFieldDecorator('name', {
					initialValue:initialName,
					rules: [{ required:true, message: '请输入目标城市拼音首字母!'}],
				})(
					<Input placeholder='请输入片区名称'/>
				)}
			</FormItem>
			<FormItem
				label="名称首字母"
			>
				{getFieldDecorator('py', {
					initialValue:initialPy,
					rules: [{ required:true, message: '请输入目标城市拼音首字母!' }],
				})(
					<Input placeholder='请输入目标城市的首拼音字母,如添加"中关村",则输入"zgc"'/>
				)}
			</FormItem>
		</Form>
	)
}
function DivisionManagement({location, dispatch, cityManagement, form}) {
	const {
		tableLoading,
		cityResponse,
		areaResponse,
		addAreaModal,
		activeAreaId,
		firstAreaName,
		zones,
		currentCityId,
		editState,
		editId,
		editName,
		editPy,
		cityCode,
		firstName,
	}=cityManagement;
	// console.log(firstName,'firstNamefirstName>>>>>>>>>>>>>>>>>>>>>>>>>');
	const currentCity=cityResponse.data?cityResponse.data.data.content[0].name:'';
	const totalElements=areaResponse.data?areaResponse.data.data.totalElements:0;
	const size=areaResponse.data?areaResponse.data.data.size:0;
	const number=areaResponse.data?areaResponse.data.data.number:0;

	const tableData=areaResponse.data?areaResponse.data.data.content:[];
	const columnsRender=(text,record,index)=>{
		let showPianQuModal=()=>{
			dispatch({
				type:'cityManagement/setState',
				payload:{
					AddPianQuModalVisible:true,
				}
			})
		};
		let switchZone=(action)=>{
			switch(action){
				case '置顶':
					dispatch({
						type:'cityManagement/switchZone',
						payload:{
							id:record.id,
							toId:-1,
						}
					});
					break;
				case '置底':
					dispatch({
						type:'cityManagement/switchZone',
						payload:{
							id:record.id,
							toId:0,
						}
					});
					break;
				case '上移':
					for(let i=0;i<tableData.length;i++){
						if(tableData[i].id==record.id&&record.id!=tableData[0].id){
							dispatch({
								type:'cityManagement/switchZone',
								payload:{
									id:record.id,
									toId:tableData[i-1].id,
								}
							});
						}
					}
					break;
				case '下移':
					for(let i=0;i<tableData.length;i++){
						if(tableData[i].id==record.id&&record.id!=tableData[tableData.length-1].id){
							dispatch({
								type:'cityManagement/switchZone',
								payload:{
									id:record.id,
									toId:tableData[i+1].id,
								}
							});
						}
					}
					break;
				default:
					break;
			}
		};
		let changeEditState=()=>{
			dispatch({
				type:'cityManagement/setState',
				payload:{
					editState:true,
					editId:record.id,
					editName:record.name,
					editPy:record.py,
				}
			});
		};
		let editSubmit=()=>{
			form.validateFields((err, values) => {
				if (err) {
					return;
				}
				console.log('value>>>>>',values)
				dispatch({
					type:'cityManagement/editZone',
					payload:{
						id:record.id,
						name:values.name,
						py:values.py,
					}
				})
			});
		};
		let editCancel=()=>{
			dispatch({type:'cityManagement/setState',payload:{editState:false}})
		};
		let deletePianqu=()=>{
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
		if(editState&&editId==record.id){
			return(
				<div>
					<Button type='primary' onClick={editSubmit}>保存</Button>
					<Button type="default" onClick={editCancel}>取消</Button>
				</div>
			)
		}else{
			return(
				<span>
					<a className='operationColor' onClick={()=>{switchZone('置顶')}}>置顶</a>
					<a className='operationColor' onClick={()=>{switchZone('置底')}}>置底</a>
					<a className='operationColor' onClick={()=>{switchZone('上移')}}>上移</a>
					<a className='operationColor' onClick={()=>{switchZone('下移')}}>下移</a>
					<a className='operationColor' onClick={changeEditState}>编辑</a>
					<a className='operationColor' onClick={deletePianqu}>删除</a>
				</span>
			)
		}
	};
	const tableColumns=[
		{
			title: '序号',
			dataIndex:'key',
		}, {
			title: '片区',
			dataIndex: 'name',
			render:(text,record)=>{
				if(editState&&editId==record.id){
					return (
						<EditBox initialName={editName} initialPy={editPy} form={form}/>
					)
				}else{
					return(
						<span>{text}</span>
					)
				}
			}
		}, {
			title: '操作',
			dataIndex: 'operation',
			render:(text,record,index)=>{
				return columnsRender(text,record,index);
			}
		}
	];
	const onPageChange=(page)=>{
		console.log('page',page);
		dispatch({type:'cityManagement/setState',payload:{currentPage:page-1}});
		dispatch({
			type:'cityManagement/queryZones',
			payload:{
				id:activeAreaId,
				pageNo:page-1,
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


	const showAddAreaModal=()=>{
		console.log(cityCode,'cityCode');
		dispatch({
			type:'cityManagement/setState',
			payload:{
				addAreaModal:{
					...addAreaModal,
					visible:true,
				}
			}
		});
		dispatch({
			type:'cityManagement/queryExistsArea',
			payload:{
				code:cityCode,
			}
		})
	};
	const showArea=()=>{
		if(cityResponse.data){
			let zones=cityResponse.data.data.content[0].zones;
			return zones.map((item)=>{
				return(
					<RadioButton key={item.id} value={item.id}>{item.name}</RadioButton>
				)
			});
		}
	};
	const goBack=()=>{
		dispatch({
			type:'cityManagement/setState',
			payload:{
				areaResponse:{},
			}
		})
		dispatch(routerRedux.goBack());
	}
	const onChange=(e)=>{
		const zonesArr=cityResponse.data.data.content[0].zones;
		const value=e.target.value;
		let firstNames='';
		for(let i=0;i<zonesArr.length;i++){
			if(zonesArr[i].id==e.target.value){
				firstNames=zonesArr[i].name
			}
		}
		dispatch({
			type:'cityManagement/setState',
			payload:{
				activeAreaId:value,
				firstName:firstNames,
			}
		});
		dispatch({type:'cityManagement/queryZones',payload:{id:value}})
	};
	return (
		<DxPanel title='区划管理'>
			<div className='divisionManagement'>
				<div className='divisionTitle'>
					<div>
						<span>当前城市：</span>
						<span>{currentCity}</span>
					</div>
					<div className="containArea">
						<p>包含区域：</p>
						<RadioGroup onChange={onChange} value={activeAreaId} >
							{
								showArea()
							}
						</RadioGroup>
					</div>
				</div>
				<Button type='primary' onClick={showAddAreaModal}><Icon type="plus"/>添加片区</Button>
				<div className='cityManagement-mainBox'>
					<Table
						rowKey={tableData.name}
						loading={tableLoading}
						columns={tableColumns}
						dataSource={tableData}
						pagination={pagination}/>
				</div>
			</div>
			{/*以下为添加片区模态框*/}
			<AddAreaModal/>
			<div>
				<Button onClick={goBack}>返回</Button>
			</div>
		</DxPanel>
	);
}

DivisionManagement.propTypes = {

}

function mapStateToProps({ cityManagement }) {
	return { cityManagement }
}
DivisionManagement = Form.create({})(DivisionManagement);
export default connect(mapStateToProps)(DivisionManagement)
