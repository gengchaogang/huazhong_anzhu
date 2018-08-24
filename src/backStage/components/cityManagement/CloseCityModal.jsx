import React, { Component, PropTypes } from 'react';
import {connect} from 'dva';
import {
	Form,
	Radio,
	Button,
	Modal,
	Input,
	DatePicker,
	Checkbox,
	message,
	Row,
} from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
function CloseCityModal({dispatch,cityManagement, form}) {
	const {closeCityModal}=cityManagement;
	const { visible, code, submitLoading}=closeCityModal;
	const { getFieldDecorator, setFields } =form;
	const onCloseSubmit=()=> {
		form.validateFields((err, values) => {
			// console.log('values{}',values);
			if (err) {
				return;
			}
			dispatch({
				type:'cityManagement/closeCity',
				payload:{
					params:{
						code:code,
						reason:values.reason
					},
					form:form,
				}
			});

		});
	};
	const onCancel=()=>{
		dispatch({
			type:'cityManagement/setState',
			payload:{
				closeCityModal:{
					...closeCityModal,
					visible:false,
				}
			}
		});
		form.resetFields();
	};
	return(
		<Modal title="填写关闭城市原因"
					 maskClosable={false}
					 visible={visible}
					 onCancel={onCancel}
					 footer={[
						 <Button key="完成" loading={submitLoading}  type="primary" size="large" onClick={onCloseSubmit}>完成</Button>,
						 <Button key="取消" type="ghost" size="large" onClick={onCancel}>取消</Button>
					 ]}
		>
			<Form horizontal>
				<FormItem
				>
					{getFieldDecorator('reason', {
						rules: [{ required: true, message: '请输入关闭城市原因' }],
					})(
						<Input  type="textarea" rows={4} placeholder="在此输入关闭城市原因"/>
					)}
				</FormItem>
			</Form>
		</Modal>
	)
}
CloseCityModal.propTypes = {
	// submitLoading: PropTypes.bool,
	// modalVisible: PropTypes.bool,
	// changeVisible: PropTypes.func,
	// applicability:PropTypes.string,
	// changeApplicability: PropTypes.func,
	// changeSubmitLoading: PropTypes.func,
};

function mapStateToProps({ cityManagement }) {
	return { cityManagement }
}
CloseCityModal = Form.create({})(CloseCityModal);
export default connect(mapStateToProps)(CloseCityModal)
