import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import regionalism from '../../../commons/assets/areas.json';
import {Table, Icon, Form, Input, Select, Button}from 'antd'
import './brokerSearchBox.css'
const Option = Select.Option;
const FormItem=Form.Item;
function BrokerSearchBox({dispatch,brokerIdIndex, form}) {

	const {submitLoading,city}=brokerIdIndex;

	const { getFieldDecorator} =form;
	// //布局控制
	const handleSubmit=()=> {
		form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			if (err) {
				return;
			}
		});
	};
	const provinceOptions = regionalism? regionalism.map(item => <Option key={item.code} value={item.name}>{item.name}</Option>):null;
	const cityOptions =city? city.map(item => <Option key={item.code} value={item.name}>{item.name}</Option>):null;
	const handleReset=()=>{

	};
	const onProvinceChange=(value)=>{
		console.log(value);
		//重置城市选项的值
		// form.setFieldsValue({
		// 	[city]:null
		// })
		for(let k in regionalism){
			if(regionalism[k].name===value){
				dispatch({
					type:'brokerIdIndex/setState',
					payload:{

						city:regionalism[k].subs,

					}
				});
				return;
			}
		}
	};
	return(
		<div className="brokerSearchBox">
			<Form inline style={{margin:'20px 0'}}>
				<FormItem
					label="关键字"
				>
					{getFieldDecorator('keyword', {
					})(
						<Input placeholder="城市名称，支持首字母搜索"/>
					)}
				</FormItem>
				<FormItem
					label="地区"
				>
					{getFieldDecorator('province', {
					})(
						<Select
							showSearch
							style={{minWidth:'150px'}}
							onChange={onProvinceChange}
							placeholder='请选择省份'
							optionFilterProp='children'
						>
							{provinceOptions}
						</Select>

					)}
				</FormItem>
				<FormItem
				>
					{getFieldDecorator('city', {
					})(
						<Select
							showSearch
							style={{minWidth:'150px'}}
							placeholder='请选择城市'
							optionFilterProp='children'
						>
							{cityOptions}
						</Select>
					)}
				</FormItem>
				<FormItem
					label="实名认证"
				>
					{getFieldDecorator('nameCertificate', {
						initialValue:"全部",
					})(
						<Select
							showSearch
							style={{minWidth:'70px'}}
							optionFilterProp='children'
						>
							<Option key='全部' value='全部'>全部</Option>
							<Option key='已认证' value='已认证'>已认证</Option>
							<Option key='未认证' value='未认证'>未认证</Option>
						</Select>
					)}
				</FormItem>
				<FormItem
					label="职业认证"
				>
					{getFieldDecorator('careerCertificate', {
						initialValue:"全部",
					})(
						<Select
							showSearch
							style={{minWidth:'70px'}}
							optionFilterProp='children'
						>
							<Option key='全部' value='全部'>全部</Option>
							<Option key='已认证' value='已认证'>已认证</Option>
							<Option key='未认证' value='未认证'>未认证</Option>
						</Select>
					)}
				</FormItem>
				<FormItem
					label="状态"
				>
					{getFieldDecorator('state', {
						initialValue:"全部",
					})(
						<Select
							showSearch
							style={{minWidth:'60px'}}
							optionFilterProp='children'
						>
							<Option key='全部' value='全部'>全部</Option>
							<Option key='正常' value='正常'>正常</Option>
							<Option key='冻结' value='冻结'>冻结</Option>
						</Select>
					)}
				</FormItem>
				<Button loading={submitLoading} style={{margin:'0 6px 0 0'}}  onClick={handleSubmit} type="primary" icon="search">搜索</Button>
				<Button  onClick={handleReset} type='ghost'>重置</Button>
			</Form>
		</div>
	)
}


BrokerSearchBox.propTypes = {

};
BrokerSearchBox = Form.create({})(BrokerSearchBox);
function mapStateToProps({ brokerIdIndex }) {
	return { brokerIdIndex }
}

export default connect(mapStateToProps)(BrokerSearchBox)
