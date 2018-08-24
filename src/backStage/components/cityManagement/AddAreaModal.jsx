import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router';
import output from '../../../commons/utils/getLatestAreas';
import regionalism from '../../../commons/assets/areas.json';
import {Tabs,Button,Table,Modal,Row,Col,Select, Form, Input, Popconfirm, message} from 'antd'
const Option = Select.Option;
const FormItem=Form.Item;
const confirm = Modal.confirm;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function AddAreaModal({location, dispatch, cityManagement,form}) {
	const {addAreaModal, currentProvince, currentCityName, currentCityId,
		cityOptions,cityOptionCodes,cityCode,firstName
	}=cityManagement;
  // console.log(firstName,'firstName>>>>firstName>>>firstName>>>');
	const {visible, submitLoading, isAdd, parentId, otherArea, disabled, existsAreaPy, areas}=addAreaModal;
	const { getFieldDecorator, setFields } =form;
	const tableData = [];
	for (let i = 0; i < 46; i++) {
		tableData.push({
			key:`city${i}`,
			serialNumber: i,
			province: `Edward King ${i}`,
			city: `Edward King ${i}`,
			zoning: `Edward King ${i}`,
			openingTime: 32,
			operation: `操作`,
		});
	}
	let onCancel=()=>{
		dispatch({
			type:'cityManagement/setState',
			payload:{
				addAreaModal:{
					...addAreaModal,
					visible:false,
				},
			}
		});
		form.resetFields();
	};

	// <Option key={item.code} value={item.name}>{item.name}</Option>
	// const options = regionalism? regionalism.map(item => ):null;
	//循环取出目标城市下面包含的所有行政区域；
	let zones=[];
	for(let k in regionalism){
		if(regionalism[k].name==currentProvince){
			let subs=regionalism[k].subs;
			for (let i in subs){
				if(subs[i].name==currentCityName){
					zones=subs[i].subs;
				}
			}
		}
	}

	let options=zones?zones.map((item)=><Option key={item.code} value={item.name}>{item.name}</Option>):null;
	const addSubmit=()=>{
		form.validateFields((err, values) => {
			let countyZoneCode;
			for(let i=0;i<cityOptionCodes.length;i++){
				if(cityOptionCodes[i].name==values.countyZoneName){
					countyZoneCode=cityOptionCodes[i].code
				}
			}
			if (err) {
				return;
			}
			dispatch({
				type:'cityManagement/addZone',
				payload:{
					closeModal:onCancel,
					params:{
						cityId:currentCityId,
						countyZoneCode:countyZoneCode,
						countyZoneName:values.countyZoneName,
						countyZonePy:values.countyZonePy,
						name:values.name,
						py:values.py,
					},
				}
			});
		});
	};
	const children = [];
	for (let i = 10; i < 36; i++) {
		children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
	}

	const handleChange=(value)=> {

	}
	const onSelectChange=(value)=>{
		if(value==='other'){
			dispatch({
				type:'cityManagement/setState',
				payload:{
					addAreaModal:{
						...addAreaModal,
						otherArea:true,
					}
				}
			})
		}else{
			dispatch({
				type:'cityManagement/setState',
				payload:{
					addAreaModal:{
						...addAreaModal,
						otherArea:false,
					}
				}
			})
			//验证当前选择区域是否在数据库存在，如存在则返回改区域的拼音检索,修改disabled为true
			for(let k in areas){
				if(areas.length!=0){
					for(let k in areas){
						if(areas[k].name==value){
							dispatch({
								type:'cityManagement/setState',
								payload:{
									addAreaModal:{
										...addAreaModal,
										disabled:true,
										existsAreaPy:areas[k].py
									}
								}
							})
						}
					}
				}else {
					dispatch({
						type:'setState',
						payload:{
							addAreaModal:{
								...addAreaModal,
								disabled:false,
							}
						}
					})
				}
			}
		}
	};
	const onValueChange=(e)=>{
		let value=e.target.value;
		for(let k in areas){
			if(areas.length!=0){
				for(let k in areas){
					if(areas[k].name==value){
						dispatch({
							type:'cityManagement/setState',
							payload:{
								addAreaModal:{
									...addAreaModal,
									disabled:true,
									existsAreaPy:areas[k].py
								}
							}
						})
					}
				}
			}else {
				dispatch({
					type:'setState',
					payload:{
						addAreaModal:{
							...addAreaModal,
							disabled:false,
						}
					}
				})
			}
		}
	};
	return (
		<Modal title='新增片区'
			 maskClosable={false}
			 visible={visible}
			 onCancel={onCancel}
			 footer={[
				 <Button key="add" loading={submitLoading}  type="primary" size="large" onClick={addSubmit}>添加</Button>,
				 <Button key="back" type="ghost" size="large" onClick={onCancel}>关闭</Button>
			 ]}
		>
			<Form horizontal>
				<FormItem
					label="所属区域"
					{...formItemLayout}
				>
					{getFieldDecorator('countyZoneName', {
            initialValue:firstName,
						rules: [{ required: true, message: '请选择' }],
					})(
						<Select>
							{!!cityOptions && cityOptions.map((item,index)=>(
								<Option key={item+index} value={item}>{item}</Option>
							))}
						</Select>
					)}
				</FormItem>
				<FormItem
					label="所属区域(可输入)"
					{...formItemLayout}
				>
					{getFieldDecorator('countyZoneName', {
            initialValue:firstName,
						rules: [{ required: true, message: '输入所属区域' }],
					})(
						<Input/>
					)}
				</FormItem>
				<FormItem
					label="区域拼音首字母"
					{...formItemLayout}
				>
					{getFieldDecorator('countyZonePy', {
						rules: [{ required: true, message: '输入区域拼音首字母!' }],
					})(
						<Input placeholder='请输入拼音首字母，如海淀区：hdq'/>
					)}
				</FormItem>
				<FormItem
					label="片区名称"
					{...formItemLayout}
				>
					{getFieldDecorator('name', {
					})(
						<Input
							placeholder="输入新增片区名称"
						/>
					)}
				</FormItem>
				<FormItem
					label="片区首字母拼音"
					{...formItemLayout}
				>
					{getFieldDecorator('py', {
					})(
						<Input
							placeholder="片区首字母拼音"
						/>
					)}
				</FormItem>
			</Form>
		</Modal>
	);
}

AddAreaModal.propTypes = {

};

function mapStateToProps({ cityManagement }) {
	return { cityManagement }
}
AddAreaModal = Form.create({})(AddAreaModal);
export default connect(mapStateToProps)(AddAreaModal)
