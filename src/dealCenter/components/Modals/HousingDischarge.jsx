/**
 * Created by Jason on 2017/1/6.
 */

import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, Popconfirm, message, Icon, Form, Input, InputNumber } from 'antd';
import Uploader from '../../../commons/components/Uploader';
import SelectAuditorModal from './SelectAuditorModal';
const Step = Steps.Step;
const FormItem=Form.Item;

function HousingDischarge({width,dispatch,secondDeal,form}){
	const {
		HousingDischargeVisible,
		HousingDischarge_status,
		//Uploader用;
		fileList,
		previewVisible,
		previewImage,
	}=secondDeal;
	//步骤条状态
	let stepState=null;
	let HousingDischargeButton='';//根据状态判断下方按钮
	const {getFieldDecorator}= form;
	switch(HousingDischarge_status){
		case '解押申请':
			stepState={
				current:0,
				// status:'progress',
				description0:'',
			};
			HousingDischargeButton='提交申请';
			break;
		case '解押申请中':
			stepState={
				current:0,
				status:'progress',
				description0:'',
			};
			HousingDischargeButton='撤回申请';
			break;
		case '解押申请已驳回':
			stepState={
				current:1,
				status:'error',
				description1:'已驳回'
			};
			HousingDischargeButton='重新申请';
			break;
		case '解押已受理':
			stepState={
				current:1,
				status:'finally',
				description1:''
			};
			HousingDischargeButton='default';
			break;
		case '解押已批款':
			stepState={
				current:2,
				status:'finally',
				description3:''
			};
			HousingDischargeButton='default';
			break;
		default:
			stepState={
				current:0,
				status:'finally',
				description0:''
			};
			HousingDischargeButton='default';
			break;
	}
	//模拟解押申请信息
	const dischargeInfo={
		money:'100.000.000元',
		ownerName:'你大爷',
		ownerTel:'13525846610'
	};
	//模拟解押说明
	const reasonsData={
		text:'我是退款文字理由',
		img:[{
			key:1,
			url:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
		},{
			key:2,
			url:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
		},{
			key:3,
			url:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
		}]
	};
	//模拟审核信息
	const shenHeInfo=[
		{
			key:1,
			text:'2015-10-24 19:00 由黄林枫 申请退款  等待 李白 退款审核。'
		},{
			key:2,
			text:'2015-10-24 19:00 由 李白 审核通过  等待财务 王颖 进行审核'
		},{
			key:3,
			text:'2015-10-24 19:00 由 财务 王颖 审核通过 等待执行退款'
		},{
			key:4,
			text:'2015-10-24 19:00 由 财务 王颖 已执行退款  1~2个工作日后 退款将退回原卡账户。'
		}
	];

	//模拟成交房源
	const data=[{
		houseNumber:598989465446,
		community:'我的世界',
		propertyType:'住宅',
		houseInfo:'鼎炫科技/A区域/1号楼/单元/7层/7002室',
		houseArea:'100㎡',
		houseUnitPrice:'1000元/㎡',
		houseTotalPrice:'200万/套',
		isSupportLoan:'支持',
	}];
	const columns=[{
		title:'房源编号',
		dataIndex:'houseNumber'
	}, {
		title:'所属小区',
		dataIndex:'community'
	}, {
		title:'物业类型',
		dataIndex:'propertyType'
	}, {
		title:'房源信息',
		dataIndex:'houseInfo'
	}, {
		title:'房源面积',
		dataIndex:'houseArea'
	}, {
		title:'房源单价',
		dataIndex:'houseUnitPrice'
	}, {
		title:'房源总价',
		dataIndex:'houseTotalPrice'
	}, {
		title:'支持贷款',
		dataIndex:'isSupportLoan'
	},{
		title:'操作',
		render:(record)=>{
			return(
				<a>房源详情</a>
			)
		}
	}];
	const showInputModal=()=>{
		dispatch({
			type:'secondDeal/setState',
			payload:{
				HousingDischarge_status:'解押申请'
			}
		})
	};
	let confirm=()=> {
		//发起撤回请求
		setTimeout(() => {
			message.success('Click on Yes');
			dispatch({
				type:'secondDeal/setState',
				payload:{
					HousingDischargeVisible:false,
					HousingDischargeButton:'default',
				}
			})
		}, 2000);

	};

	let cancel=()=> {
		message.error('Click on No');
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
	const handleCancel=()=>{
		//关闭当前modal
		dispatch({
			type:'secondDeal/setState',
			payload:{
				HousingDischargeVisible:false,
				HousingDischargeButton:'default',
				fileList:[],
			}
		});
	};
	const SelectAuditorModalProps={

	};

	let content=()=>{
		switch(HousingDischarge_status){
			case '解押申请':
				return(
					<div>
						<h4>解押申请信息:</h4>
						<Form horizontal>
							<FormItem
								label="解押贷款金额"
							>
								{getFieldDecorator('dischargeLoanAmount', {
									rules: [{ required: true, type:'number', message: '请输入解押所需贷款金额!' }],
								})(
									<InputNumber min={0}  />
								)}
								<span className="ant-form-text"> 元</span>
							</FormItem>
							<FormItem
								label="业主姓名"
							>
								{getFieldDecorator('ownerName', {
									rules: [{ required: true, message: '请输入业主姓名!' }],
								})(
									<Input placeholder='在此请输入业主姓名'/>
								)}
							</FormItem>
							<FormItem
								label="业主联系电话"
							>
								{getFieldDecorator('ownerTel', {
									rules: [{ required: true, message: '请输入业主联系电话!' }],
								})(
									<Input placeholder='在此输入业主联系电话'/>
								)}
							</FormItem>
							<FormItem
								label="解押说明"
							>
								{getFieldDecorator('dischargeExplain', {
									rules: [{ required: true, message: '请输入相关说明!' }],
								})(
									<Input placeholder='请在此输入贷款解押'/>
								)}
							</FormItem>
						</Form>
						<Uploader {...uploaderProps}/>
						<SelectAuditorModal {...SelectAuditorModalProps}/>
					</div>
				);
			default:
				return(
					<div>
						<div>
							<h4>解押申请信息</h4>
							<ul>
								<li>解押金额: {dischargeInfo.money}</li>
								<li>业主姓名: {dischargeInfo.ownerName}</li>
								<li>业主电话: {dischargeInfo.ownerTel}</li>
							</ul>
						</div>
						<div>
							<h4>解押说明</h4>
							<p>Lorem ipsuad a possimus squidem recusandae saepe temporibus.</p>
							<ul className="tuiKuanImgs">
								{reasonsData.img.map((item)=>{
									return (
										<li key={item.key}>
											<img className={'判断宽高条件'?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
										</li>
									)
								})}
							</ul>
						</div>
						<div>
							<ul>
								{
									shenHeInfo.map((item)=>{
										return (
											<li key={item.key}><span>{item.text}</span></li>
										)
									})
								}
							</ul>
						</div>
					</div>
				);
		}
	};
	const showAuditor=()=>{
		form.validateFields((err, values) => {
			console.log(err,values);
			if (err) {
				return;
			}
			dispatch({
				type:'secondDeal/setState',
				payload:{
					auditorModalVisible:true,
				}
			})
		});
	};
	return(
		<Modal
			className="HousingDischarge"
			visible={HousingDischargeVisible}
			maskClosable={false}
			title="二手房--解押申请"
			onCancel={handleCancel}
			width={width?width:1000}
			footer={
				HousingDischargeButton==='重新申请'?
					[
						<Button key="reApply" type="primary" size="large" onClick={showInputModal}>重新申请</Button>,
						<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>
					]:
					HousingDischargeButton==='撤回申请'?
						[
							<Popconfirm  key="cancelApply" title="确认撤回申请?" onConfirm={confirm} onCancel={cancel} okText="是" cancelText="否">
								<Button type="primary" size="large">撤回申请</Button>
							</Popconfirm>,
							<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>,
						]:
						HousingDischargeButton==='提交申请'?
							[
								<Button key="reApply" type="primary" size="large" onClick={showAuditor}>提交申请</Button>,
								<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>
							]:
							[
								<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>
							]
			}
		>
			<div>
				<Steps current={stepState.current} status={stepState.status}>
					<Step description={stepState.description0}  title="解押申请" />
					<Step description={stepState.description1} title="解押办理" />
					<Step description={stepState.description2} title="已批款" />
				</Steps>
				<div>
					<h4>解押房源</h4>
					<Table
						columns={columns}
						dataSource={data}
						pagination={false}
					/>
				</div>
				{
					content()
				}
			</div>
		</Modal>
	)
}
HousingDischarge.propTypes={

};
function mapStateToProps({ secondDeal }) {
	return { secondDeal };
}
HousingDischarge=Form.create({})(HousingDischarge);
export default connect(mapStateToProps)(HousingDischarge);
