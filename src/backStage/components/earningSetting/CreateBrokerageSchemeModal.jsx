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
function CreateBrokerageSchemeModal({dispatch, earningSetting, form}) {
	const { getFieldDecorator, setFields } =form;
	const {
		brokerageVisible,
		brokerageSchemeName,
		brokerageBrokerRatio,
		brokeragePlatformRatio,
		brokerageProvinceAgentRatio,
		brokerageCityAgentRatio,
		brokerageAreaAgentRatio,
		brokerageDealCenterRatio,
		brokerageAdvisorJolesRatio,
		brokerageTotalWarning,
	}=earningSetting;
	const totalRatio=brokerageBrokerRatio
		+brokeragePlatformRatio
		+brokerageProvinceAgentRatio
		+brokerageCityAgentRatio
		+brokerageAreaAgentRatio
		+brokerageDealCenterRatio
		+brokerageAdvisorJolesRatio;
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
						brokerageTotalWarning:true
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
							type:'earningSetting/createBrokerageScheme',
							payload:{
								form:form,
								resolve:resolve,
								fetchArgu:{
									brokerageAdvisorJolesRatio:values.brokerageAdvisorJolesRatio+'%',
									brokerageAreaAgentRatio:values.brokerageAreaAgentRatio+'%',
									brokerageBrokerRatio:values.brokerageBrokerRatio+'%',
									brokerageCityAgentRatio:values.brokerageCityAgentRatio+'%',
									brokerageDealCenterRatio:values.brokerageDealCenterRatio+'%',
									brokeragePlatformRatio:values.brokeragePlatformRatio+'%',
									brokerageProvinceAgentRatio:values.brokerageProvinceAgentRatio+'%',
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
				brokerageVisible:false,
			}
		})
	};

	const tableData=[
		{
			itemName:'经纪人',
			ratioName:'brokerageBrokerRatio',
			ratio:brokerageBrokerRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						brokerageBrokerRatio:value,
					}
				})
			}
		}, {
			itemName:'平台',
			ratioName:'brokeragePlatformRatio',
			ratio:brokeragePlatformRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						brokeragePlatformRatio:value,
					}
				})
			},
		}, {
			itemName:'省级代理',
			ratioName:'brokerageProvinceAgentRatio',
			ratio:brokerageProvinceAgentRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						brokerageProvinceAgentRatio:value,
					}
				})
			},

		}, {
			itemName:'市级代理',
			ratioName:'brokerageCityAgentRatio',
			ratio:brokerageCityAgentRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						brokerageCityAgentRatio:value,
					}
				})
			},
		}, {
			itemName:'县级代理',
			ratioName:'brokerageAreaAgentRatio',
			ratio:brokerageAreaAgentRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						brokerageAreaAgentRatio:value,
					}
				})
			},
		},{
			itemName:'交易中心',
			ratioName:'brokerageDealCenterRatio',
			ratio:brokerageDealCenterRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						brokerageAreaAgentRatio:value,
					}
				})
			},
		},{
			itemName:'师傅角色',
			ratioName:'brokerageAdvisorJolesRatio',
			ratio:brokerageAdvisorJolesRatio,
			onChange:(value)=>{
				dispatch({
					type:'earningSetting/setState',
					payload:{
						brokerageAdvisorJolesRatio:value,
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
			title="新建佣金配比方案"
			maskClosable={false}
			visible={brokerageVisible}
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
					<span style={{color:brokerageTotalWarning?'#FF5500':'#aaa'}}>所有组成项目比例之和必须等于100%</span>
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
CreateBrokerageSchemeModal.propTypes = {
};

function mapStateToProps({ earningSetting }) {
	return { earningSetting }
}
CreateBrokerageSchemeModal = Form.create({})(CreateBrokerageSchemeModal);
export default connect(mapStateToProps)(CreateBrokerageSchemeModal)