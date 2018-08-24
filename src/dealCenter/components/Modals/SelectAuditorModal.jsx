import React, { PropTypes } from 'react'
import { Modal, Button, Input, Form, Radio, Icon } from 'antd';
import {connect} from 'dva';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
function SelectAuditorModal({ dispatch, form ,secondDeal, inputModal_handleCancel}){
			{/*footer={[
				<Button key="firm" type="ghost" size="large" onClick={()=>{changeEarnestRefundVisible(false)}}>确定</Button>,
				<Button key="cancle" type="ghost" size="large" onClick={()=>{changeEarnestRefundVisible(false)}}>取消</Button>,
			]}*/}
			{/*onCancel={()=>{changeEarnestRefundVisible(false)}}*/}
	const {auditorModalVisible, auditorModalSubmitLoading}=secondDeal;
	const {getFieldDecorator}=form;
	const handleSubmit=()=>{
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			//按钮loading控制
			dispatch({
				type:'secondDeal/setState',
				payload:{
					auditorModalSubmitLoading:true,
				},
			});
			setTimeout(() => {
				dispatch({
					type:'secondDeal/setState',
					payload:{
						auditorModalSubmitLoading:false,
						auditorModalVisible:false,
						fileList1:[],
					},
				});
				inputModal_handleCancel();
				//提交成功后还要清除form录入
			}, 3000);
			form.resetFields();
		});
	};
	const onChange=(e)=> {
		// this.setState({
		// 	value: e.target.value,
		// });
	};
	const radioStyle = {
		display: 'block',
		height: '30px',
		lineHeight: '30px',
	};
	const handleSearchChange=(e)=>{
	};
	const currentPageCancel=()=>{
		dispatch({
			type:'secondDeal/setState',
			payload:{
				auditorModalVisible:false,
			}
		});
	};
	return(
		<Modal
			visible={auditorModalVisible}
			maskClosable={false}
			title="请选择审核对象"
			onCancel={currentPageCancel}
			footer={[
				<Button loading={auditorModalSubmitLoading} key="firm" type="ghost" size="large" onClick={handleSubmit}>确定</Button>,
				<Button key="cancle" type="ghost" size="large" onClick={currentPageCancel}>取消</Button>,
			]}
		>
			<Input placeholder="搜索成员"/>
			<Form horizontal>
				<FormItem
				>
					{getFieldDecorator('auditor', {
						rules: [{ required: true, message: '请选择审核对象!' }],
					})(
						<RadioGroup onChange={onChange}>
							<Radio style={radioStyle} value={'黄林枫'}><Icon type="aliwangwang" />黄林枫</Radio>
							<Radio style={radioStyle} value={'张三'}><Icon type="aliwangwang" />张三</Radio>
							<Radio style={radioStyle} value={'李四'}><Icon type="aliwangwang" />李四</Radio>
						</RadioGroup>
					)}
				</FormItem>
			</Form>
		</Modal>
	)
}
SelectAuditorModal.propTypes={
	// earnestRefundModalVisible:PropTypes.bool,
	// changeEarnestRefundVisible:PropTypes.func,
};
function mapStateToProps({ secondDeal }) {
	return { secondDeal };
}
SelectAuditorModal = Form.create({})(SelectAuditorModal);
export default connect(mapStateToProps)(SelectAuditorModal);
