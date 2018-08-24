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
	Cascader,
} from 'antd';
const _getNameArrByCode=(arr, code)=>{
  var nameArr = [], item;
  for(var i=arr.length-1; i>=0; i--){
    item = arr[i];
    if(item.code == code){
      nameArr.push(item.lable);
      if(item.pCode){
        code = item.pCode;
      }else {
        break;
      }
    }
  }
  nameArr.reverse();
  return nameArr;
}

const _getNamePathsByCode=(arr, code)=>{
  var nameArr = _getNameArrByCode(arr, code);
	if(nameArr){
		return "/"+nameArr.join("/");
	}else{
		return
	}
}

const FormItem = Form.Item;
const Option = Select.Option;
function SearchBox({form, labelManagement, dispatch}){
	const {Area, city, searchLoading,searchOptions,searchArr} =labelManagement;
	const { getFieldDecorator, setFields } =form;
	// //布局控制
	const handleSubmit=()=> {
		// alert('该功能暂被禁用')
		form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			let areaPaths='';
			if(values.areaPath){
				areaPaths=_getNamePathsByCode(searchArr,values.areaPath[values.areaPath.length-1])
			}
			if (err) {
				return;
			}
			dispatch({
				type:'labelManagement/searchLabel',
				payload:{
					name:values.categoryName,
					status:values.state,
					areaPath:areaPaths,
				}
			});
		});
	};
	//重置
	const handleReset=()=>{
		form.resetFields();
		dispatch({
			type:'labelManagement/searchLabel',
			payload:{
				name:'',
				status:'',
			}
		});
		//初始化到初始状态
	};
	return (

		<Form inline style={{margin:'20px 0'}}>
			<FormItem
				label="类别名称"
			>
				{getFieldDecorator('categoryName', {
				})(
					<Input placeholder="请输入类别名称"/>
				)}
			</FormItem>
			<FormItem
				label="区域"
			>
				{getFieldDecorator('areaPath', {
				})(
					<Cascader options={searchOptions} placeholder='--'/>
			)}
			</FormItem>
			<FormItem
				label="状态"
			>
				{getFieldDecorator('state', {
					rules: [
						{ message: 'Please select your country!' },
					],
				})(
					<Select
						style={{minWidth:'150px'}}
						placeholder="请选择当前状态"
					>
						<Option value="">全部</Option>
						<Option value="启用">启用</Option>
						<Option value="停用">停用</Option>
					</Select>
				)}
			</FormItem>
			<Button loading={searchLoading} style={{margin:'0 6px 0 0'}}  onClick={handleSubmit} type="primary" icon="search">搜索</Button>
			<Button  onClick={handleReset} type='default'>重置</Button>
		</Form>
	);
};
SearchBox.propTypes = {
	// submitLoading: PropTypes.bool,
	// modalVisible: PropTypes.bool,
	// changeVisible: PropTypes.func,
	// applicability:PropTypes.string,
	// changeApplicability: PropTypes.func,
	// changeSubmitLoading: PropTypes.func,
};
SearchBox = Form.create({})(SearchBox);
function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}
export default connect(mapStateToProps)(SearchBox)
