import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, message, Form, Input,Select } from 'antd';
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
import PromptModal from '../../../commons/View/PromptModal';
import {
	getUserHasOptPwd,
} from '../../../commons/utils/currencyFunction'
import './projectPublishAuditModal.css';

const confirm=Modal.confirm;
const FormItem=Form.Item;
const Option = Select.Option;

function AuditExplainModal({dispatch, form,auditExplainModal}){
	const {
		getFieldDecorator,
		resetFields,
	}= form;
	const {visible, title, inputTitle,
				recordId, onSubmit, placeholder,
				buttonText, message,
				showPicList,isPass,toUserName,needPassWord,aduitUserList,
				promptObj,loadingShadow,
			} = auditExplainModal;
	let _needPassWord = true;
	if (needPassWord === false || !getUserHasOptPwd()) {
		_needPassWord = false;
	}
	console.log('_needPassWord -- ', _needPassWord + " =  " + isPass)
	const uploadPicProps={
		url:'/miss-anzhu-aliyun-file/putfile',
		 maxNum:5,//最大上传数
		 maxSize:2,//文件大小限值
		 showPicList:showPicList,//state管理图片list
		 doCover:false,
		 changeList:(data)=>{
			 dispatch({
				 type:"auditExplainModal/changePicList",
				 payload:data
			 })
		 },//更新list回调
	}
	const handleCancel=()=>{
		//关闭当前modal
		dispatch({
			type:'auditExplainModal/closeModal',
			payload:{visible:false}
		});
		form.resetFields();
	};


	const handleSubmit=(recordId)=>{
		console.log('【审核确定】recordId',recordId);
		form.validateFields((err, values) => {
			if (err) {
				console.log('【审核确定】error完善必填信息',err);
				// message.error('完善必填信息');
				return;
			}
			if (_needPassWord) {
				const oprationPwd = values.oprationPwd;
				if (!oprationPwd || oprationPwd.length <= 0) {
						message.error('填写密码');
						return;
				}
				values.oprationPwd = oprationPwd;
			}
			const toUserId = parseInt(values.toUserId)
			console.log('【审核确定】toUserId',toUserId);
			values.toUserId = toUserId;
			values.toUserName = toUserName;
			values.recordId = recordId;
			const images=[];
			if(!!showPicList&&showPicList.length!=0){
				showPicList.map(item=>{
					images.push(item.id)
				})
				values.images=images;
			}
			console.log('values',values);
			console.log('【审核确定】values',values);
			console.log('【审核确定】onSubmit',onSubmit);
			onSubmit(values);
		});
	};

	//图片上传组件用
	const getAuditUserOptions=()=>{
			if (aduitUserList != null && aduitUserList.length > 0) {
				return aduitUserList.map((item, index)=>{
					 return(
						 <Option key={index} value={`${item.userId}`}>{item.name}</Option>
					 )
			 })
		 }else {
			 return ('')
		 }
	}

	const onOkCallBack=()=>{
		if(promptObj.todo==='closeModal'){
			dispatch({
				type:"auditExplainModal/togglePrompt",
				payload:{
					visible:false
				}
			})
		}
	};
	const onCancelCallBack=()=>{

	};
	return(
		<Modal
			width="700px"
			visible={visible}
			maskClosable={false}
			title={title}
			afterClose={()=>resetFields}
			onCancel={handleCancel}
			footer={[
				<Button key="pass" type="primary" size="large" onClick={handleCancel}>取消</Button>,
				<Button key="back" type="primary" size="large" onClick={()=>handleSubmit(recordId)}>{buttonText?buttonText:'确认'}</Button>
			]}
			>

			<PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
			<DxLoadingShadow visible={loadingShadow} />

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
				{
					!!isPass && <div>
							<FormItem>
									{getFieldDecorator('toUserId', {
										rules: [{ required: isPass, message:'请选择审核人' }],
									})(
										<Select
											placeholder="请选择财务审核人员"
											onSelect={(value,option)=>{
												dispatch({
													type:"auditExplainModal/saveUserName",
													payload:{
														toUserName:option.props.children
													}
												})
											}}>
											{
													getAuditUserOptions()
											}
									</Select>
									)}
								</FormItem>
							</div>
				}
				{
					(getUserHasOptPwd() && _needPassWord)?<div>
						<FormItem
						extra='注：忘记审核密码，请联系管理员重置密码'>
								{getFieldDecorator('oprationPwd', {
									rules: [{ required: false, message:'请输入密码' }],
								})(
									<Input type="password" placeholder="请输入密码"/>
								)}
						</FormItem>
					</div>:null
				}

			</Form>
		</Modal>
	)
}
AuditExplainModal.propTypes={
	auditType:PropTypes.string,
	title:PropTypes.string,
	inputTitle:PropTypes.string,
	recordId:PropTypes.string,
	buttonText:PropTypes.string,
	visible:PropTypes.bool,
	onSubmit:PropTypes.func,
};
function mapStateToProps({ auditExplainModal }) {
	return { auditExplainModal };
}
export default connect(mapStateToProps)(
	Form.create({})
(AuditExplainModal));
