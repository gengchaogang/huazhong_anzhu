import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message } from 'antd';
import AuditExplainModal from './AuditExplainModal';
import './refundAuditModal.css';
import '../../../commons/css/common.css';
import commonUtil from '../../../commons/utils/commonUtil.js';


const Step = Steps.Step;
const confirm=Modal.confirm;



function RefundAuditModal({dispatch, secondHandHouseSalesAudit}){
	const {refundAuditModal, auditExplainModal,resultTableData,resultReason,resultInfos,} = secondHandHouseSalesAudit;
	const {visible, currentRecord,} =refundAuditModal;

	console.log('currentRecord>>>>>>',currentRecord);
	console.log('resultTableData>>>>>>',resultTableData);

	//步骤条状态
	let stepState={};
	switch(currentRecord.applyAuditStatus){
		case '等待退款审核':
			stepState={
				current:2,
				status:'waiting',
			};
			break;
		case '申请驳回':
			stepState={
				current:2,
				status:'error',
				description1:'已驳回'
			};
			break;
		case '审核通过':
			stepState={
				current:2,
				status:'waiting'
			};
			break;
		case '已退款':
			stepState={
				current:3,
				status:'finish',
			};
			break;

		default:
			break;
	}
	const columns=[{
		title: '订单编号',
		dataIndex: 'orderNumber',
	},{
		title: '支付方式',
		dataIndex: 'paymentMethod',
	},{
		title:'支付流水号',
		dataIndex:'serialNumber',
	},{
		title:'支付时间',
		dataIndex:'paymentDateTime',
	},{
		title: '支付客户',
		dataIndex: 'customerName',
	},{
		title: '意向单价',
		dataIndex: 'unitPrice',
	},{
		title: '意向总价',
		dataIndex:'totalPrice',
	},{
		title:'支付意向金',
		dataIndex:'amount',
	},{
		title:'支付状态',
		dataIndex:'paymentStatus',
	},{
		title: '操作',
		dataIndex:'operation',
		render:(text,record)=>{
			return(
				<a style={{color:'#009900'}} onClick={()=>toDealDetail(record.id)}>交易详情</a>
			)
		}
	}];

	const handleCancel=()=>{
		//关闭当前modal
		dispatch({
			type:'newHouseTransactionContractReview/setState',
			payload:{
				refundAuditModal:{
					...refundAuditModal,
					visible:false,
				}
			}
		});
	};
	const toDealDetail=(projectId)=>{
		message.info('跳转到<<交易详情页>>,待处理',5);
		//跳转到详情页面;,传递项目ID过去;
	};
	const hadleAuditPass=(projectId)=>{
		console.log('in hadleAuditPass')
		dispatch({
			type:'auditExplainModal/setState',
			payload:{
				visible:true,
				title:'审核通过',
				inputTitle:'审核说明',
				placeholder:'在此输入审核说明',
				message:'请输入审核说明',
				buttonText:'转交财务审核',
				onSubmit:(values)=>{
					dispatch({

					})
				}
			}
		});
	};
	const hadleRejectAudit=(projectId)=>{
		dispatch({
			type:'auditExplainModal/setState',
			payload:{
				visible:true,
				title:'审核驳回',
				inputTitle:'驳回说明',
				placeholder:'在此输入驳回说明',
				message:'请输入驳回说明',
				onSubmit:(values)=>{
				},
			}
		});
	};
	const auditInfo=()=>{
		if(currentRecord.auditInfo){
			return(
				<div>
					<h4>审核说明</h4>
					<span>{currentRecord.auditInfo.text}</span>
					<ul className="imgUl">
						{
							currentRecord.auditInfo.imgs.map((item)=>{
								return (
									<li key={item.imgName}>
										<img className={(item.width>item.height)?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
									</li>
								)
							})
						}
					</ul>
				</div>
			)
		}
	};
	const showRejectExplain=()=>{
		if(currentRecord.rejectExplain){
			return(
				<div className="rejectExplain">
					<h4>驳回说明</h4>
					<span>{currentRecord.rejectExplain.text}</span>
					<ul className="imgUl">
						{
							currentRecord.rejectExplain.imgs.map((item)=>{
								return (
									<li key={item.imgName}>
										<img className={(item.width>item.height)?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
									</li>
								)
							})
						}
					</ul>
				</div>
			)
		}
	};

	const showAuditExplain=()=>{
		if(currentRecord.auditExplain){
			return(
				<div>
					<h4>审核说明</h4>
					<span>{currentRecord.auditExplain.text}</span>
					<ul className="imgUl">
						{
							currentRecord.auditExplain.imgs.map((item)=>{
								return (
									<li key={item.imgName}>
										<img className={(item.width>item.height)?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
									</li>
								)
							})
						}
					</ul>
				</div>
			)
		}
	};
	//控制footer的Button显示
	const showFooterButton=()=>{
		let footer=[];
		if(currentRecord.auditStatus!='待审核'){
			footer=[
				<Button key="back" type="primary" size="large" onClick={handleCancel}>返回</Button>,
			];
			return footer;
		}else{
			footer=[
				<Button key="back" type="primary" size="large" onClick={()=>hadleRejectAudit(currentRecord.id)}>审核驳回</Button>,
				<Button key="pass" type="primary" size="large" onClick={()=>hadleAuditPass(currentRecord.id)}>审核通过</Button>
			];
			return footer;
		}
	};
	const showRefunReasonImgs=()=>{
		if(currentRecord.refundReason&&currentRecord.refundReason.imgs){
			return(
				<ul className="imgUl">
					{
						currentRecord.refundReason.imgs.map((item)=>{
							return (
								<li key={item.imgName}>
									<img className={(item.width>item.height)?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
								</li>
							)
						})
					}
				</ul>
			);
		}
	};
	const showAuditInfo=()=>{
		if(currentRecord.auditInfo){
			return(
				<ul>
					{
						currentRecord.auditInfo.map((item)=>{
							return (
								<li key={item.key}>
									<span>{item.text}</span>
								</li>
							)
						})
					}
				</ul>
			);
		}
	};

	return(

		<Modal
			className="RefundAuditModal"
			visible={visible}
			maskClosable={false}
			title={currentRecord.refundType+"--退款申请"}
			onCancel={handleCancel}
			footer={showFooterButton()}
			>
			<div className="commonModalHeight">
					<Steps current={stepState.current} status={stepState.status}>
						<Step description={stepState.description0} title="申请退款" />
						<Step description={stepState.description1} title="退款审核" />
						<Step description={stepState.description2} title="财务审核" />
						<Step description={stepState.description3} title="执行退款" />
					</Steps>
					<div>
						<h4>订单信息</h4>
						<Table
							dataSource={!!resultTableData?resultTableData:[]}
							columns={columns}

							pagination={false}
						/>
					</div>
					<div>
						<h4>退款理由</h4>
						<span>{currentRecord.refundReason?currentRecord.refundReason.text:''}</span>
						{
							showRefunReasonImgs()
						}
					</div>
					<div>
						<h4>审核信息</h4>
						{
							showAuditInfo()//审核信息
						}
					</div>
					{
						showAuditExplain()//审核说明
					}
					{
						showRejectExplain()//审核说明
					}
			</div>
			<AuditExplainModal/>
		</Modal>
	)
}
RefundAuditModal.propTypes={
	// newHouseTransactionContractReview:PropTypes.object.isRequired,
};
function mapStateToProps({ secondHandHouseSalesAudit }) {
	return { secondHandHouseSalesAudit };
}
export default connect(mapStateToProps)(RefundAuditModal);
