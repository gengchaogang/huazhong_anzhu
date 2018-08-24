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
import './createBrokerageSchemeModal.css'
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
function CreateServiceChargeSchemeModal({dispatch, earningSetting, form}) {
	const { getFieldDecorator, setFields } =form;
	const {
		serviceChargeVisible,
		serviceChargeSchemeName,
		serviceChargePlatformRatio,
		serviceChargeProvinceAgentRatio,
		serviceChargeCityAgentRatio,
		serviceChargeAreaAgentRatio,
		serviceChargeDealCenterRatio,
		serviceChargeAdvisorJolesRatio,
		totalWarning,
	}=earningSetting;
	const totalRatio=serviceChargePlatformRatio
		+serviceChargeProvinceAgentRatio
		+serviceChargeCityAgentRatio
		+serviceChargeAreaAgentRatio
		+serviceChargeDealCenterRatio
		+serviceChargeAdvisorJolesRatio;
	const onCloseSubmit=()=> {
		form.validateFields((err, values) => {
			console.log('values{}',values);
			if (err) {
				return;
			}
			//总计判断是否等于100
			if(totalRatio!=100){
				dispatch({
					type:'earningSetting/setState',
					payload:{
						totalWarning:true
					}
				});
				return;
			}
			confirm({
				title: '确认添加?',
				// content: 'When clicked the OK button, this dialog will be closed after 1 second',
				onOk() {
					return new Promise((resolve, reject) => {
						//在此发送请求,在models端根据fetch是否成功调用如:form.resetFields(),resolve()等相关操作!
						dispatch({
							type:'earningSetting/createServiceChargeScheme',
							payload:{
								form:form,
								resolve:resolve,
								fetchArgu:{//这是写fetch相关参数,根据实际数据结构做相应改动
									serviceChargeAdvisorJolesRatio:values.serviceChargeAdvisorJolesRatio+'%',
									serviceChargeAreaAgentRatio:values.serviceChargeAreaAgentRatio+'%',
									serviceChargeCityAgentRatio:values.serviceChargeCityAgentRatio+'%',
									serviceChargeDealCenterRatio:values.serviceChargeDealCenterRatio+'%',
									serviceChargePlatformRatio:values.serviceChargePlatformRatio+'%',
									serviceChargeProvinceAgentRatio:values.serviceChargeProvinceAgentRatio+'%',
									schemeName:values.schemeName,
								},
							}
						})
					}).catch(() => console.log('errors!'));
				},
				onCancel() {},
			});
		});
	};
	const onCancel=()=>{
		dispatch({
			type:'earningSetting/setState',
			payload:{
				serviceChargeVisible:false,
			}
		})
	};

	const tableData=[
		{
			itemName:'平台',
			ratioName:'serviceChargePlatformRatio',
			ratio:serviceChargePlatformRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						serviceChargePlatformRatio:value,
					}
				})
			},
		}, {
			itemName:'省级代理',
			ratioName:'serviceChargeProvinceAgentRatio',
			ratio:serviceChargeProvinceAgentRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						serviceChargeProvinceAgentRatio:value,
					}
				})
			},

		}, {
			itemName:'市级代理',
			ratioName:'serviceChargeCityAgentRatio',
			ratio:serviceChargeCityAgentRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						serviceChargeCityAgentRatio:value,
					}
				})
			},
		}, {
			itemName:'县级代理',
			ratioName:'serviceChargeAreaAgentRatio',
			ratio:serviceChargeAreaAgentRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						serviceChargeAreaAgentRatio:value,
					}
				})
			},
		},{
			itemName:'交易中心',
			ratioName:'serviceChargeDealCenterRatio',
			ratio:serviceChargeDealCenterRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						serviceChargeAreaAgentRatio:value,
					}
				})
			},
		},{
			itemName:'师傅角色',
			ratioName:'serviceChargeAdvisorJolesRatio',
			ratio:serviceChargeAdvisorJolesRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						serviceChargeAdvisorJolesRatio:value,
					}
				})
			},
		},{
			itemName:'总计',
			ratio:totalRatio
		},
	];
	const columns=[
		{
			title:'组成项目',
			dataIndex:'itemName',
		},{
			title:'比例',
			dataIndex:'ratio',
			render:(text,record)=>{
				switch (record.itemName){
					case '总计':
						return(
							<span>{record.ratio}%</span>
						);
					default:
						return(
							<FormItem>
								{getFieldDecorator(record.ratioName, {
									rules: [{
										required: true,
										type:'number',
										message: '请输入分配比例!'
									}],
								})(
									<InputNumber min={0} max={100} step={0.1} onChange={record.onChange}/>
								)}
								<span className="ant-form-text"> %</span>
							</FormItem>
						)
				}
			}
		}
	];

	return(
		<Modal
			title="新建交易服务费配比方案"
			maskClosable={false}
			visible={serviceChargeVisible}
			onCancel={onCancel}
			footer={[
				<Button key="完成" type="primary" size="large" onClick={onCloseSubmit}>完成</Button>,
				<Button key="取消" type="ghost" size="large" onClick={onCancel}>取消</Button>
			]}
		>
			<Form horizontal>
				<FormItem
					label='方案名称'
				>
					{getFieldDecorator('schemeName', {
						rules: [{ required: true, message: '请输入方案名称!' }],
					})(
						<Input placeholder="请输入方案名称!"/>
					)}
				</FormItem>
				<div>
					<p>配比设置</p>
					<span style={{color:totalWarning?'#FF5500':'#aaa'}}>所有组成项目比例之和必须等于100%</span>
					<Table
						id="createMatchProjectModalTable"
						bordered
						loading={false}
						columns={columns}
						dataSource={tableData}
						rowKey={record => record.itemName}
						pagination={false}
					/>
				</div>
			</Form>
		</Modal>
	)
}
CreateServiceChargeSchemeModal.propTypes = {
};

function mapStateToProps({ earningSetting }) {
	return { earningSetting }
}
CreateServiceChargeSchemeModal = Form.create({})(CreateServiceChargeSchemeModal);
export default connect(mapStateToProps)(CreateServiceChargeSchemeModal)