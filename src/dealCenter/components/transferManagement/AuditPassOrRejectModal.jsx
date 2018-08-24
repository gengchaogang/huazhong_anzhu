import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, message, Form, Input,Select } from 'antd';
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic';
import {
	getUserHasOptPwd,
} from '../../../commons/utils/currencyFunction'
import './projectPublishAuditModal.css';
const confirm=Modal.confirm;
const FormItem=Form.Item;
const Option = Select.Option;
function AuditPassOrRejectModal({dispatch, form,auditPassOrRejectModal,props}){
	const {getFieldDecorator}= form;
	const {
		visible,
		title,
		inputTitle,
		recordId,
		onSubmit,
		placeholder,
		buttonText,
		message,
		showPicList,
		isPass,
		toUserName,
		hidePeople,
	}=auditPassOrRejectModal
	const uploadPicProps={
		url:'/miss-anzhu-aliyun-file/putfile',
		 maxNum:5,//最大上传数
		 maxSize:2,//文件大小限值
		 showPicList:showPicList,//state管理图片list
		 doCover:false,
		 changeList:(data)=>{
			 dispatch({
				 type:"auditPassOrRejectModal/changePicList",
				 payload:data
			 })
		 },//更新list回调
	}
	const handleCancel=()=>{
		//关闭当前modal
		dispatch({
			type:'auditPassOrRejectModal/closeModal',
			payload:{visible:false}
		});
		form.resetFields();
	};

	const handleSubmit=(recordId)=>{
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			const oprationPwd=parseInt(values.oprationPwd)
			const toUserId=parseInt(values.toUserId)
			values.oprationPwd=oprationPwd;
			values.toUserId=toUserId;
			values.toUserName=toUserName;
			values.recordId=recordId;
			const images=[];
			if(!!showPicList&&showPicList.length!=0){
				showPicList.map(item=>{
					images.push(item.id)
				})
				values.images=images;
			}
			onSubmit(values,form);
		});
	};

	//图片上传组件用

	return(
		<Modal
			width="700px"
			visible={visible}
			maskClosable={false}
			title={title}
			onCancel={handleCancel}
			footer={[
				<Button key="pass" type="primary" size="large" onClick={handleCancel}>取消</Button>,
				<Button key="back" type="primary" size="large" onClick={()=>handleSubmit(recordId)}>{buttonText?buttonText:'确认'}</Button>
			]}
		>
			<Form>
				<div>
					<p>{inputTitle}</p>
					<FormItem
					>
						{getFieldDecorator('reason', {
							rules: [{ required: true, message:{message} }],
						})(
							<Input placeholder={placeholder}/>
						)}
					</FormItem>
				</div>
				<div style={{marginBottom:"14px"}}>
					<DxUpLoadPic {...uploadPicProps}/>
				</div>
				{/*
					(!!isPass && !hidePeople)?<div>
					<FormItem>
							{getFieldDecorator('toUserId', {
								rules: [{ required: true, message:'请选择审核人' }],
							})(
								<Select
									placeholder="请选择审核人员"
									onSelect={(value,option)=>{
										dispatch({
											type:"auditPassOrRejectModal/saveUserName",
											payload:{
												toUserName:option.props.children
											}
										})
									}}>
									{!!props&&props.length!==0?
										props.map((item,index)=>{
											return(
													<Option key={index} value={item.userId}>{item.name}</Option>
											)
										}):null
									}

							</Select>
							)}
						</FormItem>
				</div>:null
				*/
				}
				{getUserHasOptPwd() && <FormItem
				extra='注：忘记审核密码，请联系管理员重置密码'>
				{getFieldDecorator('oprationPwd', {
					rules: [{ required: true, message:'请输入密码' }],
				})(
					<Input type="password" placeholder="请输入密码"/>
				)}
			</FormItem>}
			</Form>
		</Modal>
	)
}
AuditPassOrRejectModal.propTypes={
	auditType:PropTypes.string,
	title:PropTypes.string,
	inputTitle:PropTypes.string,
	recordId:PropTypes.string,
	buttonText:PropTypes.string,
	visible:PropTypes.bool,
	onSubmit:PropTypes.func,
};
function mapStateToProps({ auditPassOrRejectModal }) {
	return { auditPassOrRejectModal };
}
export default connect(mapStateToProps)(
	Form.create({})
(AuditPassOrRejectModal));
