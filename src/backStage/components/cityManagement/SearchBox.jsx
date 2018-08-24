import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import {connect} from 'dva'
import {
	Form,
	Input,
	Button,
	Row,
	Col,
	Select,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
function SearchBox({form, cityManagement, submit, reset}){
	const {searchLoading} =cityManagement;
	const { getFieldDecorator, setFields } =form;
	// //布局控制
	const handleSubmit=()=> {
		form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			if (err) {
				return;
			}
			submit(values.keyword);
		});
	};
	const handleReset=()=>{
		form.resetFields();
		//初始化到初始状态
		reset();
	};
	{/*const provinceOptions = Area? Area.map(item => <Option key={item.adcode} value={item.adcode}>{item.name}</Option>):null;*/}
	{/*const cityOptions =city? city.map(item => <Option key={item.adcode} value={item.adcode}>{item.name}</Option>):null;*/}
	{/*const onProvinceChange=(value)=>{*/}
		{/*console.log(value);*/}
		{/*for(let k in Area){*/}
			{/*if(Area[k].adcode===value){*/}
				{/*dispatch({*/}
					{/*type:'cityManagement/setState',*/}
					{/*payload:{*/}
						{/*city:Area[k].districts*/}
					{/*}*/}
	// 			});
	// 			return;
	// 		}
	// 	}
	// };
	return (

		<Form inline style={{margin:'20px 0'}}>
			<FormItem
				label="关键字"
			>
				{getFieldDecorator('keyword', {
				})(
					<Input placeholder="目前只支持搜索城市名称"/>
				)}
			</FormItem>
			{/*<FormItem
				label="城市"
			>
				{getFieldDecorator('province', {
				})(
					<Select
						showSearch
						style={{width:'100px'}}
						onChange={onProvinceChange}
						placeholder='请选择省份，支持手动输入'
						optionFilterProp='children'
						filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
						style={{width:'100px'}}
						placeholder='请选择省份，支持手动输入'
						optionFilterProp='children'
						filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					>
						{cityOptions}
					</Select>
				)}
			</FormItem>*/}
			<Button loading={searchLoading} style={{margin:'0 6px 0 0'}}  onClick={handleSubmit} type="primary" icon="search">搜索</Button>
			<Button  onClick={handleReset} type='default'>重置</Button>
		</Form>
		);
};
SearchBox.propTypes = {
	// submitLoading: PropTypes.bool,
	// modalVisible: PropTypes.bool,
	submit: PropTypes.func.isRequired,
	reset: PropTypes.func.isRequired,
	// applicability:PropTypes.string,
	// changeApplicability: PropTypes.func,
	// changeSubmitLoading: PropTypes.func,
};
SearchBox = Form.create({})(SearchBox);
function mapStateToProps({ cityManagement }) {
	return { cityManagement }
}
export default connect(mapStateToProps)(SearchBox)