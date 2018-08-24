import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router';
import output from '../../../commons/utils/getLatestAreas';
import {Tabs,Button,Table,Modal,Row,Col,Select, Form, Input,
	Popconfirm, message,Cascader} from 'antd'
import regionalism from '../../../commons/assets/areas.json';
const Option = Select.Option;
const FormItem=Form.Item;
const confirm = Modal.confirm;
function AddTargetCity({location, dispatch, cityManagement,form}) {
	const {addCityModalState,arrOptions,options}=cityManagement;
	const { submitLoading, visible, city, provinceCode}=addCityModalState;
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
				addCityModalState:{
					...addCityModalState,
					visible:false,
				}
			}
		})
	};

	const provinceOptions = regionalism? regionalism.map(item => <Option key={item.code} value={item.name}>{item.name}</Option>):null;
	const cityOptions =city? city.map(item => <Option key={item.code} value={item.name}>{item.name}</Option>):null;
	const onProvinceChange=(value)=>{
		// console.log(value);
		for(let k in regionalism){
			if(regionalism[k].name===value){
				dispatch({
					type:'cityManagement/setState',
					payload:{
						addCityModalState:{
							...addCityModalState,
							city:regionalism[k].subs,
							provinceCode:regionalism[k].code
						}
					}
				});
				return;
			}
		}
	};
	const handleSubmit=()=>{
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			
			dispatch({
				type:'cityManagement/addCity',
				payload:{
					form:form,
					params:{
						code:values.code[values.code.length-1],
						py:values.py,
					}
				}
			});
		});
	};
	return (
		<Modal title='添加目标城市'
					 maskClosable={false}
					 visible={visible}
					 onCancel={onCancel}
					 footer={[
						<Button key="add" loading={submitLoading}  type="primary" size="large" onClick={handleSubmit}>添加</Button>,
						 <Button key="back" type="ghost" size="large" onClick={onCancel}>关闭</Button>
					 ]}
		>
			<p className='addCityModal-tip'>添加目标城市是便于前期开咱市场推广，填出城市数据；之后还需执行“开通城市”操作，此城市才可正常使用</p>
			<Form horizontal>
				<FormItem
					label="请选择目标城市"
				>
					{getFieldDecorator('code', {
						rules: [{ required: true, message: '请选择目标城市!' }],
					})(
						<Cascader options={options} placeholder='--'/>
					)}
				</FormItem>
				<FormItem
					label="城市拼音"
				>
					{getFieldDecorator('py', {
						rules: [{ required: true, message: '请输入目标城市拼音首字母!' }],
					})(
						<Input placeholder='请输入目标城市的首拼音字母,如添加"北京市",则输入"bj"'/>

					)}
				</FormItem>
			</Form>
		</Modal>
	);
}

AddTargetCity.propTypes = {

};

function mapStateToProps({ cityManagement }) {
	return { cityManagement }
}
AddTargetCity = Form.create({})(AddTargetCity);
export default connect(mapStateToProps)(AddTargetCity)
