import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message,Timeline, } from 'antd';
import AuditExplainModal from '../contractReview/AuditExplainModal';

import './refundAuditModal.css';
import '../../../commons/css/common.css';

import commonUtil from '../../../commons/utils/commonUtil.js';

const Step = Steps.Step;
const confirm=Modal.confirm;


/*****************************************************/
/*****************************************************/
/**********财务审核：  团购退款  ***********************/
/*****************************************************/
/*****************************************************/


function NewHouseRefundAuditModal({dispatch, newHouseElectricityExamination}){
	const {refundAuditModal, auditExplainModal,refundOrerInfo,
		resultTableData,resultReason,
		resultInfos,} = newHouseElectricityExamination;
	const {visible, currentRecord,} =refundAuditModal;

	const tableData=[];
	if (visible && tableData) {
		if (currentRecord != null) {
				// 提取数据
				refundOrerInfo['refundType'] = currentRecord['refundType'];
		}
		tableData.push(refundOrerInfo);
	}

	//步骤条状态
	let stepState={current:2,status:"process"};
	if (visible) {
		let _refundStatus = currentRecord.refundStatus;
		if (_refundStatus == '待合同审核') {
			stepState={
				current:1,
				status:'process',
			};
		}else if(_refundStatus == '待财务审核') {
			stepState={
				current:2,
				status:'process',
			};
		}else if(_refundStatus == '合同审核/已驳回') {
			stepState={
				current:1,
				status:'error',
				description1:'已驳回'
			};
		}
		else if(_refundStatus == '待退款') {
			stepState={
				current:3,
				status:'process',
			};
		}
		else if(_refundStatus == '财务审核/已驳回') {
			stepState={
				current:2,
				status:'error',
				description1:'已驳回'
			};
		}
	}

	/** 列 */
	const columns=[{
		title: '退款类型',
		dataIndex: 'refundType',
		key:"refundType",
	},{
		title: '支付项目',
		dataIndex: 'projectName',
		key:"projectName",
	},{
		title:'支付订单',
		dataIndex:'payOrderNumber',
		key:"payOrderNumber",
	},{
		title:'支付方式',
		dataIndex:'payType',
		key:"payType",
	},{
		title: '支付流水号',
		dataIndex: 'paySerialNumber',
		key:"paySerialNumber",
	},{
		title: '支付客户',
		dataIndex: 'customerName',
		key:"customerName",
	},{
		title: '客户电话',
		dataIndex:'customerPhone',
		key:"customerPhone",
	},{
		title:'支付时间',
		dataIndex:'payFinishTime',
		key:"payFinishTime",
	},{
		title:'支付金额',
		dataIndex:'groupbuyMoney',
		key:"groupbuyMoney",
	},{
		title:'支付状态',
		dataIndex:'status',
		key:"status",
	},{
		title: '操作',
		dataIndex:'operation',
		render:(text,record)=>{
			return(
				<a style={{color:'#009900'}} onClick={()=>toDealDetail(record.id)}>交易详情</a>
			)
		}
	}];

	const toDealDetail=(projectId)=>{
		message.info('跳转到<<交易详情页>>,待处理',5);
		//跳转到详情页面;,传递项目ID过去;
	};


	const handleCancel=()=>{
		//关闭当前modal
		dispatch({
			type:'newHouseElectricityExamination/setState',
			payload:{
				refundAuditModal:{
					...refundAuditModal,
					visible:false,
				}
			}
		});
	};

	const hadleAuditPass=(groupbuyId)=>{
		console.log('in hadleAuditPass')
		dispatch({
			type:'auditExplainModal/setState',
			payload:{
				visible:true,
				title:'审核通过',
				inputTitle:'审核说明',
				placeholder:'在此输入财务审核说明',
				message:'请输入审核说明',
				buttonText:'确定',
				isPass:false,
				onSubmit:(values)=>{
					if (!commonUtil.isFirstClick()) {
						return;
					}
					values['groupbuyId'] = groupbuyId;
					dispatch({
						type:"newHouseElectricityExamination/newHouseRefundAuditPass",
						payload:values
					})
				}
			}
		});
	};
	const hadleRejectAudit=(groupbuyId)=>{
		dispatch({
			type:'auditExplainModal/setState',
			payload:{
				visible:true,
				title:'审核驳回',
				inputTitle:'驳回说明',
				placeholder:'在此输入驳回说明',
				message:'请输入驳回说明',
				onSubmit:(values)=>{
					if (!commonUtil.isFirstClick()) {
						return;
					}
					values['groupbuyId'] = groupbuyId;
					dispatch({
						type:"newHouseElectricityExamination/newhouseRefundAuditRefuse",
						payload:values
					})
				},
			}
		});
	};

	//控制footer的Button显示
	const showFooterButton=()=>{
		let footer=[];
		if(currentRecord.refundStatus=='待财务审核'){
			footer=[
				<Button key="back" type="primary" size="large" onClick={()=>hadleRejectAudit(currentRecord.groupbuyId)}>审核驳回</Button>,
				<Button key="pass" type="primary" size="large" onClick={()=>hadleAuditPass(currentRecord.groupbuyId)}>审核通过</Button>
			];
			return footer;
		}else{
			footer=[
				<Button key="back" type="primary" size="large" onClick={handleCancel}>返回</Button>,
			];
			return footer;
		}
	};

	// 退款理由图片信息
	const showRefunReasonImgs=()=>{
		if(visible && refundOrerInfo && refundOrerInfo.reasonPics){
			return(
				<ul className="imgUl">
					{
						refundOrerInfo.reasonPics.map((item)=>{
							return (
								<li key={item}>
									<img className='toogleImgWidth' src={item} alt="图片加载失败"/>
								</li>
							)
						})
					}
				</ul>
			);
		}
	};

	/** refundSchedules 退款跟踪信息 */
	const showAuditInfo=()=>{
		if(visible && refundOrerInfo && refundOrerInfo.refundSchedules){
			return(
				<div>
						<Timeline>
							{
								refundOrerInfo.refundSchedules.map((item,index)=>{
									return(
										<Timeline.Item key={index}>
											{item}
										</Timeline.Item>
									)
								})
							}
						</Timeline>
				</div>
			);
		}
	};

	/** 合同审核说明 */
	const showAuditExplain=()=>{
		if(visible && refundOrerInfo && refundOrerInfo.contractComment){
			let imags = [];
			const _imgs = refundOrerInfo.contractPics;
			if (_imgs != null) {
				imags = _imgs;
			}
			return(
				<div className="modalDivTop">
					<h4>合同审核结果</h4>
					<span>{refundOrerInfo.contractComment}</span>

					<ul className="imgUl">
						{
							imags.map((item, index)=>{
								return (
									<li key={index}>
										<img className="toogleImgWidth" src={item} alt="图片加载失败"/>
									</li>
								)
							})
						}
					</ul>
				</div>
			)
		}
	};

	/** 财务审核结果 financialComment */
	const showFinancial=()=>{
		if(visible && refundOrerInfo && refundOrerInfo.financialComment){
			let images = [];
			const _imgs = refundOrerInfo.financialPics;
			if (_imgs != null) {
					images = _imgs;
			}
			return(
				<div className="modalDivTop">
					<h4>财务审核结果</h4>
					<span>{refundOrerInfo.financialComment}</span>

					<ul className="imgUl">
						{
							images.map((item, index)=>{
								return (
									<li key={index}>
										<img className="toogleImgWidth" src={item} alt="图片加载失败"/>
									</li>
								)
							})
						}
					</ul>
				</div>
			)
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
								rowKey='datatable'
								dataSource={tableData}
								columns={columns}
								pagination={false}
							/>
					</div>

					<div className="modalDivTop">
							<h4>退款理由</h4>
							<span>{refundOrerInfo.reason}</span>
							{
								showRefunReasonImgs()		// 退款原因图片
							}
					</div>

					{
						showAuditExplain()					//合同审核说明
					}
					{
						showFinancial()							//财务审核说明
					}

					<div className="modalDivTop">
							<h4>审核信息</h4>
							{
								showAuditInfo()					//审核信息
							}
					</div>

			</div>
			<AuditExplainModal/>
		</Modal>
	)
}
NewHouseRefundAuditModal.propTypes={
	// newHouseElectricityExamination:PropTypes.object.isRequired,
};
function mapStateToProps({ newHouseElectricityExamination }) {
	return { newHouseElectricityExamination };
}
export default connect(mapStateToProps)(NewHouseRefundAuditModal);
