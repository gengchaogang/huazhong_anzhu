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
function SearchBoxContent({form, labelManagement, dispatch}){
	const {Area, city, searchLoading} =labelManagement;
	const { getFieldDecorator, setFields } =form;
	// //布局控制
	const handleSubmit=()=> {
		// alert('筛选功能暂时禁用')
		form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			// let categoryNames;
			// if(values.categoryName){
			// 	let arrcategoryNames=values.categoryName.split('_');
			// 	categoryNames=arrcategoryNames[0];
			// }
			// console.log(categoryNames,'categoryNamescategoryNames');
			if (err) {
				return;
			}
			dispatch({
				type:'labelManagement/searchContent',
				payload:{
					name:values.labelName,
					typeName:values.categoryName,
					status:values.state,
					value:values.value,
				}
			});
		});
	};
	const handleReset=()=>{
		form.resetFields();
		dispatch({
			type:'labelManagement/searchContent',
			payload:{
				name:'',
				typeName:'',
				status:'',
				value:'',
			}
		});
		//初始化到初始状态
	};
	return (

		<Form inline style={{margin:'20px 0'}}>
			<FormItem
				label="标签名称"
			>
				{getFieldDecorator('labelName', {
				})(
					<Input placeholder="请输入标签名称"/>
				)}
			</FormItem>
			<FormItem
				label="标签值"
			>
				{getFieldDecorator('value', {
				})(
					<Input placeholder="请输入标签值"/>
				)}
			</FormItem>
			<FormItem
				label="标签类别"
			>
				{getFieldDecorator('categoryName', {
				})(
					<Select
						style={{minWidth:'220px'}}
						placeholder="请选择标签类别"
					>
						{
							labelManagement.categoryName.map((item,index)=>{
								return (
									<Option value={`${item.id}`} key={`item_${item.id}`}>{item.name}</Option>
								)
							})
						}
					</Select>
				)}
			</FormItem>
			<FormItem
				label="状态"
			>
				{getFieldDecorator('state', {
				})(
					<Select
						style={{minWidth:'100px'}}
						placeholder="请选择状态"
					>
						<Option value="">全部</Option>
						<Option value="使用中">使用中</Option>
						<Option value="未使用">未使用</Option>
					</Select>
				)}
			</FormItem>
			<Button loading={searchLoading} style={{margin:'0 6px 0 0'}}  onClick={handleSubmit} type="primary" icon="search">搜索</Button>
			<Button  onClick={handleReset} type='default'>重置</Button>
		</Form>
	);
};
SearchBoxContent.propTypes = {
	// submitLoading: PropTypes.bool,
	// modalVisible: PropTypes.bool,
	// changeVisible: PropTypes.func,
	// applicability:PropTypes.string,
	// changeApplicability: PropTypes.func,
	// changeSubmitLoading: PropTypes.func,
};
SearchBoxContent = Form.create({})(SearchBoxContent);
function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}
export default connect(mapStateToProps)(SearchBoxContent)
