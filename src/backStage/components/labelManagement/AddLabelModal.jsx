import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router';
import {Tabs,Button,Table,Modal,Row,Col,Select, Form, Input, Alert, message} from 'antd'
const Option = Select.Option;
const FormItem=Form.Item;
const confirm = Modal.confirm;
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
function AddLabelModal({location, dispatch, labelManagement,form}) {
	const {AddLabelModalVisible, submitLoading, isAdd,labelTypesNameList,
    showPicList,
  }=labelManagement;
	const { getFieldDecorator, setFields ,resetFields} =form;
  const shopsUplod={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    changeList:(data)=>{
      dispatch({
        type:'labelManagement/setState',
        payload:{showPicList:data}
      })
    },//更新list回调
  }
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
				AddLabelModalVisible:false,
        showPicList:[],
			}
		})
    form.resetFields();
	};
	const showConfirm=()=>{
		form.validateFields((err, values) => {
      // console.log(showPicList,'valuse');
			if (err) {
				return;
			}
			confirm({
				title: '确认添加?',
				onOk:()=>{dispatch({
					type:'labelManagement/addLabel',
					payload:{
						name:values.labelName,
						typeId:values.categoryName,
            value:values.value,
            key:(showPicList.length!=0?showPicList[0].id:''),
					}
				})},
				onCancel:()=>{},
			});
		});
    resetFields();
	};


	return (
		<Modal title='添加标签'
					 maskClosable={false}
					 visible={AddLabelModalVisible}
					 onCancel={onCancel}
					 footer={[
						 <Button key="back" type="ghost" size="large" onClick={onCancel}>取消</Button>,
						 <Button key="add" loading={submitLoading}  type="primary" size="large" onClick={showConfirm}>完成</Button>
					 ]}
		>
			<Form horizontal>
				<FormItem
					label="标签类别"
					{...formItemLayout}
				>
					{getFieldDecorator('categoryName', {
						rules:[{required:true, message:'请选择待添加标签所属类别!'}]
					})(
						<Select
							style={{minWidth:'150px'}}
							placeholder="请选择标签类别"
						>
							{labelTypesNameList.map(item=><Option key={`type_${item.id}`} value={String(item.id)}>{item.name}</Option>)}
						</Select>
					)}
				</FormItem>
				<FormItem
				{...formItemLayout}
					label="标签名称"
				>
					{getFieldDecorator('labelName', {
						rules: [{ required: true, message: '请输入标签名称!' }],
					})(
						<Input
							placeholder="请输入标签名称,最多4个字"
						/>
					)}
				</FormItem>
				<FormItem
				{...formItemLayout}
					label="标签值"
				>
					{getFieldDecorator('value', {
						rules: [{ required: true, message: '请输入标签值!' }],
					})(
						<Input
							placeholder="请输入标签值"
						/>
					)}
				</FormItem>
        <div className='uploadParent'>
          <DxUpLoadPic {...shopsUplod}/>
        </div>
			</Form>
			<div style={{color:'#FF5500'}}>{isAdd?<Alert message="该标签已存在不能重复添加!" type="error" showIcon />:null}</div>
		</Modal>
	);
}

AddLabelModal.propTypes = {

};

function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}
AddLabelModal = Form.create({})(AddLabelModal);
export default connect(mapStateToProps)(AddLabelModal)
