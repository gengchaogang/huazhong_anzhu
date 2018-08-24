import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import {connect} from 'dva'
import {
	Form,
	Input,
	Button,
	Cascader,
	Select,
	Row,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
function SearchBox_EachSide({form, labelManagement, dispatch}){
	const {Area, city, searchLoading} =labelManagement;
	const { getFieldDecorator, setFields } =form;
	// //布局控制
	const handleSubmit=()=> {
		form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			if (err) {
				return;
			}
			dispatch({
				type:'labelManagement/setState',
				payload:{
					searchLoading:true,
				}
			});
		});
	};
	const handleReset=()=>{
		form.resetFields();
		//初始化到初始状态
	};
	const options = [{
		value: 'zhejiang',
		label: 'Zhejiang',
		children: [{
			value: 'hangzhou',
			label: 'Hangzhou',
			children: [{
				value: 'xihu',
				label: 'West Lake',
			}],
		}],
	}, {
		value: 'jiangsu',
		label: 'Jiangsu',
		children: [{
			value: 'nanjing',
			label: 'Nanjing',
			children: [{
				value: 'zhonghuamen',
				label: 'Zhong Hua Men',
			}],
		}],
	}];
	const onChange=(value)=>{
		console.log(value);
	};
	return (
		<Form inline style={{margin:'20px 0'}}>
			<Row type="flex" align="middle" >
				<FormItem
					label="关键字"
				>
					{getFieldDecorator('keyword', {
					})(
						<Input placeholder="搜索交易中心名称或配比方案"/>
					)}
				</FormItem>
				<FormItem
					label="城市"
				>
					{getFieldDecorator('state', {
					})(
						<Cascader options={options} onChange={onChange} placeholder="请选择城市" changeOnSelect/>
					)}
				</FormItem>
				<Button loading={searchLoading} style={{margin:'0 6px 0 0'}}  onClick={handleSubmit} type="primary" icon="search">搜索</Button>
				<Button  onClick={handleReset} type='default'>重置</Button>
			</Row>
		</Form>
	);
};
SearchBox_EachSide.propTypes = {
	// submitLoading: PropTypes.bool,
	// modalVisible: PropTypes.bool,
	// changeVisible: PropTypes.func,
	// applicability:PropTypes.string,
	// changeApplicability: PropTypes.func,
	// changeSubmitLoading: PropTypes.func,
};
SearchBox_EachSide = Form.create({})(SearchBox_EachSide);
function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}
export default connect(mapStateToProps)(SearchBox_EachSide)