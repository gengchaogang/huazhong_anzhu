/**
 * Created by Jason on 2017/1/4.
 */
/**
 * Created by Jason on 2017/1/4.
 */
import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, Input, Form } from 'antd';
import Uploader from '../../../commons/components/Uploader';
import SelectAuditorModal from './SelectAuditorModal'
const FormItem = Form.Item;
const Step = Steps.Step;
function DownpaymentRefundInput({
	dispatch,
	secondDeal,
	form,
}){
	const {
		//弹出框控制
		downpaymentInputVisible,
		//图片上传器所需state
		fileList,
		previewVisible,
		previewImage
	}=secondDeal;
	const { getFieldDecorator, setFields } =form;

	//模拟步骤条状态
	const stepState={
		current:2,
		status:'finaly',
	};
	//模拟订单信息
	const data=[{
		orderNumber:332005469041,
		payment:'POS机支付/工商银行',
		SwiftNumber:65535,
		payTime:'2016-10-24 19:00',
		payClient:'Jason',
		dealTotalPrice:'250万',
		downpaymentRatio:'1%',
		earnestDeduction:'10000元',
		payedMoney:'10000元',
		payState:'已完成',
	}];

	const columns=[{
		title:'支付订单',
		dataIndex:'orderNumber'
	}, {
		title:'支付方式',
		dataIndex:'payment'
	}, {
		title:'支付流水号',
		dataIndex:'SwiftNumber'
	}, {
		title:'支付时间',
		dataIndex:'payTime'
	}, {
		title:'支付客户',
		dataIndex:'payClient'
	}, {
		title:'成交总价',
		dataIndex:'dealTotalPrice'
	}, {
		title:'首付款比例',
		dataIndex:'downpaymentRatio'
	},
	// {
	// 	title:'意向金抵扣',
	// 	dataIndex:'earnestDeduction'
	// },
	{
		title:'支付金额',
		dataIndex:'payedMoney'
	}, {
		title:'支付状态',
		dataIndex:'payState'
	}, {
		title:'操作',
		render:(record)=>{
			return(
				<a>交易详情</a>
			)
		}
	}];
	const EarnestRefundSubmit=()=>{
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			changeAuditorVisible(true);
			// setTimeout(() => {
			// 	changeEarnestRefundInputVisible(false);
			// }, 3000);
			// form.resetFields();
		});
	};
	//图片上传组件用
	const uploaderProps={
		tip:'最多可上传5张/单张不超过2M',
		fieldName:'Img_bu/sinesslicense',

		fileList,
		previewVisible,
		previewImage,

		handleCancel: () => {
			dispatch({
				type:'secondDeal/setState',
				payload:{
					previewVisible: false,
				}
			});
		},
		handlePreview: (file) => {
			dispatch({
				type:'secondDeal/setState',
				payload:{
					previewImage: file.url || file.thumbUrl,
					previewVisible: true,
				}
			});
		},
		handleChange :({ fileList }) => {
			dispatch({
				type:'secondDeal/setState',
				payload:{
					fileList,
				}
			});
		},
	};
	//审核对象弹出框所用
	const changeAuditorVisible=(bool)=>{
		dispatch({
			type:'secondDeal/setState',
			payload:{
				auditorModalVisible:bool,
			}
		})
	};
	const handleCancel=()=>{
		//关闭当前modal
		dispatch({
			type:'secondDeal/setState',
			payload:{
				downpaymentInputVisible:false,
			}
		});
		form.resetFields();
		//还要清除录入的图片;
		dispatch({
			type:'secondDeal/setState',
			payload:{
				fileList:[]
			}
		});
	};
	const SelectAuditorModalProps={
		changeAuditorVisible,
		inputModal_handleCancel:handleCancel,
	};
	return(
		<Modal
			visible={downpaymentInputVisible}
			maskClosable={false}
			title="二手房--首付款退款申请"
			onCancel={handleCancel}
			footer={[
				<Button key="submit" type="primary" size="large"  onClick={EarnestRefundSubmit}>提交申请</Button>,
				<Button key="back" type="default" size="large" onClick={handleCancel}>关闭</Button>
			]}
		>
			<div>
				<Steps current={stepState.current} status={stepState.status}>
					<Step  title="申请退款" />
					<Step  title="退款审核" />
					<Step  title="财务审核" />
					<Step  title="执行退款" />
				</Steps>
				<div>
					<h4>订单信息</h4>
					<Table
						columns={columns}
						dataSource={data}
						pagination={false}
					/>
				</div>
				<div>
					<h4>退款理由</h4>
					<Form horizontal>
						<FormItem
						>
							{getFieldDecorator('tuikuanReason', {
								rules: [{ required: true, message: '请输入退款理由!' }],
							})(
								<Input placeholder="请输入退款理由"/>
							)}
						</FormItem>
					</Form>
					<Uploader {...uploaderProps}/>
				</div>
				<SelectAuditorModal {...SelectAuditorModalProps}/>
			</div>
		</Modal>
	)
}
DownpaymentRefundInput.propTypes={
	downpaymentInputVisible:PropTypes.bool,
};
DownpaymentRefundInput = Form.create({})(DownpaymentRefundInput);
function mapStateToProps({ secondDeal }) {
	return { secondDeal };
}
export default connect(mapStateToProps)(DownpaymentRefundInput);
