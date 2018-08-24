import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router';
import {Tabs,Cascader,Button,Table,Modal,Row,Col,Select, Form, Input, Alert, message} from 'antd'
const Option = Select.Option;
const FormItem=Form.Item;
const confirm = Modal.confirm;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
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
  return "/"+nameArr.join("/");
}
function AddCategoryModal({location, dispatch, labelManagement,form}) {
	const {AddCategoryModalVisible, submitLoading, isAdd,options,areaCityOptions}=labelManagement;
	const { getFieldDecorator, setFields ,resetFields} =form;
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
			type:'labelManagement/setState',
			payload:{
				AddCategoryModalVisible:false,
			}
		})
    form.resetFields();
	};
	const showConfirm=()=>{
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
      let areaCodes='';
      if(values.areaCode){
        areaCodes=values.areaCode[values.areaCode.length-1];
        confirm({
  				title: '确认添加?',
  				onOk:()=>{dispatch({
  					type:'labelManagement/addLabelType',
  					payload:{
              name:values.name,
              areaCode:areaCodes,
              areaPath:_getNamePathsByCode(areaCityOptions,areaCodes),
            },
  				})},
  				onCancel() {},
  			});
      }else{
        confirm({
  				title: '确认添加?',
  				onOk:()=>{dispatch({
  					type:'labelManagement/addLabelType',
  					payload:{
              name:values.name,
            },
  				})},
  				onCancel() {},
  			});
      }
		});
    resetFields();
	};


	return (
		<Modal title='添加类别'
					 maskClosable={false}
					 visible={AddCategoryModalVisible}
					 onCancel={onCancel}
					 footer={[
						 <Button key="back" type="ghost" size="large" onClick={onCancel}>关闭</Button>,
						 <Button key="add" loading={submitLoading}  type="primary" size="large" onClick={showConfirm}>添加</Button>
					 ]}
		>
			<Form horizontal>

				<FormItem
					{...formItemLayout}
					label="类别名称"
				>
					{getFieldDecorator('name', {
						rules: [{ required: true, message: '请输入类别名称!' }],
					})(
						<Input
							placeholder="请输入类别名称,最多15个字"
						/>
					)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="区域"
				>
					{getFieldDecorator('areaCode', {
					})(
						<Cascader options={options} placeholder='--'/>
					)}
				</FormItem>
			</Form>
			<div style={{color:'#FF5500'}}>{isAdd?<Alert message="该类别已存在不能重复添加!" type="error" showIcon />:null}</div>
		</Modal>
	);
}

AddCategoryModal.propTypes = {

};

function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}
AddCategoryModal = Form.create({})(AddCategoryModal);
export default connect(mapStateToProps)(AddCategoryModal)
