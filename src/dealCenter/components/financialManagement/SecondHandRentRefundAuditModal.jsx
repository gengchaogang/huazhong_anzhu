import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message,Timeline } from 'antd';
import AuditExplainModal from '../contractReview/AuditExplainModal';

import './secondHandRefundAuditModal.css';
import '../../../commons/css/common.css';


import PicList from '../../../commons/UI/PicList';
import DxShowMsgForm from '../../../commons/UI/DxShowMsgForm';
import {
	isNull,
} from '../../../commons/utils/currencyFunction';
import commonUtil from '../../../commons/utils/commonUtil.js';
import {creatHouseInfo} from '../../../commons/utils/currencyFunction.js';

const Step = Steps.Step;
const confirm=Modal.confirm;


/*****************************************************/
/*****************************************************/
/******财务审核：  二手房出售：意向金、首付、佣金弹出框 **/
/*****************************************************/
/*****************************************************/

function SecondHandRentRefundAuditModal({dispatch, secondHandHouseFinancialRentalAudit}){
	const {refundAuditModal, auditExplainModal,resultTableData,resultReason,resultInfos} = secondHandHouseFinancialRentalAudit;
	const {visible, currentRecord,} =refundAuditModal;

	//步骤条状态
	let stepState={
		current:2,
		status:'process'
	};

	// 等待退款审核,退款审核通过,退款申请驳回,等待财务审核,财务审核驳回,财务审核通过,已执行退款
	let _applyAuditStatus = currentRecord.applyAuditStatus;
	// 等待审核,审核通过,审核驳回,撤回申请,已执行分佣
	let _refundAuditStatus = currentRecord.refundAuditStatus;

	if (visible) {
			console.log('状态：', _applyAuditStatus + "   =====   " + _refundAuditStatus)
			if(_applyAuditStatus == '等待退款审核') {
				stepState={
					current:1,
					status:'process'
				};
			}else if (_applyAuditStatus == '退款审核通过') {
				stepState={
					current:1,
					status:'finish'
				};
			}else if (_applyAuditStatus == '退款申请驳回') {
				stepState={
					current:1,
					status:'error',
					description1:'已驳回'
				};
			}else if (_applyAuditStatus == '等待财务审核') {
				stepState={
					current:2,
					status:'wait'
				};
			}
			else if (_applyAuditStatus == '财务审核通过') {
				stepState={
					current:2,
					status:'finish'
				};
			}
			else if (_applyAuditStatus == '财务审核驳回') {
				stepState={
					current:2,
					status:'error',
					description1:'已驳回'
				};
			}else if (_refundAuditStatus == '已执行退款') {
				stepState={
					current:3,
					status:'finish',
				};
			}

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

	const downPaymentColumns=[{
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
		dispatch({
			type:'secondHandHouseFinancialRentalAudit/toggleRefundAuditModal',
			payload:{
				visible:false,
				}
		});
	};
	const toDealDetail=(projectId)=>{
		message.info('跳转到<<交易详情页>>,待处理',5);
		//跳转到详情页面;,传递项目ID过去;
	};

	/** 审核通过 */
	const hadleAuditPass=(recordId)=>{
		dispatch({
			type:'auditExplainModal/changeState',
			payload:{
				visible:true,
				title:'审核通过',
				inputTitle:'审核说明',
				placeholder:'在此输入财务审核说明',
				message:'请输入审核说明',
				buttonText:'确定',
				showPicList:[],
				refundType:currentRecord.refundType,
				recordId:recordId,
				isPass:false,
				onSubmit:(values)=>{
					if (!commonUtil.isFirstClick()) {
						return;
					}
					if(currentRecord.refundType==="购房定金"){
						dispatch({
							type:"secondHandHouseFinancialRentalAudit/intentMoneyPass",
							payload:values
						})
					}else if(currentRecord.refundType==="首付款"){
						dispatch({
							type:"secondHandHouseFinancialRentalAudit/downPaymentPass",
							payload:values
						})
					}else if(currentRecord.refundType==="佣金"){
						dispatch({
							type:"secondHandHouseFinancialRentalAudit/commissionPass",
							payload:values
						})
					}
				}
			}
		});
		// dispatch({
		// 	type:"getInitUser",
		// 	payload:{
		//
		// 	}
		// })
	};
	const hadleRejectAudit=(recordId)=>{
		dispatch({
			type:'auditExplainModal/changeState',
			payload:{
				visible:true,
				title:'审核驳回',
				inputTitle:'驳回说明',
				placeholder:'在此输入驳回说明',
				message:'请输入驳回说明',
				buttonText:'确认',
				showPicList:[],
				refundType:currentRecord.refundType,
				recordId:recordId,
				isPass:false,
				onSubmit:(values)=>{
					if(currentRecord.refundType==="购房定金"){
						dispatch({
							type:"secondHandHouseFinancialRentalAudit/intentMoneyReject",
							payload:values
						})
					}else if(currentRecord.refundType==="首付款"){
						dispatch({
							type:"secondHandHouseFinancialRentalAudit/downPaymentReject",
							payload:values
						})
					}else if(currentRecord.refundType==="佣金"){
						dispatch({
							type:"secondHandHouseFinancialRentalAudit/commissionReject",
							payload:values
						})
					}
				},
			}
		});
	};
	const auditInfo=()=>{
		if(currentRecord.auditInfo){
			const images=currentRecord.auditInfo.imgs.map(item=>({
				src:isNull(item.url,''),
				title:'',
				isCover:false,
			}))
			return(
				<div>
					<h4>审核说明</h4>
					<span>{currentRecord.auditInfo.text}</span>
					<PicList picListData={images}/>
					{/*<ul className="imgUl">
						{
							currentRecord.auditInfo.imgs.map((item)=>{
								return (
									<li key={item.imgName}>
										<img className={(item.width>item.height)?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
									</li>
								)
							})
						}
					</ul>*/}
				</div>
			)
		}
	};
	const showRejectExplain=()=>{
		if(currentRecord.rejectExplain){
			const images=currentRecord.rejectExplain.imgs.map(item=>({
				src:isNull(item.url,''),
				title:'',
				isCover:false,
			}))
			return(
				<div className="rejectExplain">
					<h4>驳回说明</h4>
					<span>{currentRecord.rejectExplain.text}</span>
					<PicList picListData={images}/>
					{/*<ul className="imgUl">
						{
							currentRecord.rejectExplain.imgs.map((item)=>{
								return (
									<li key={item.imgName}>
										<img className={(item.width>item.height)?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
									</li>
								)
							})
						}
					</ul>*/}
				</div>
			)
		}
	};

	const showAuditExplain=()=>{
		if(currentRecord.auditExplain){
			const images=currentRecord.auditExplain.imgs.map(item=>({
				src:isNull(item.url,''),
				title:'',
				isCover:false,
			}))
			return(
				<div>
					<h4>审核说明</h4>
					<span>{currentRecord.auditExplain.text}</span>
					<PicList picListData={images}/>
					{/*<ul className="imgUl">
						{
							currentRecord.auditExplain.imgs.map((item)=>{
								return (
									<li key={item.imgName}>
										<img className={(item.width>item.height)?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
									</li>
								)
							})
						}
					</ul>*/}
				</div>
			)
		}
	};

	//控制footer的Button显示
	const showFooterButton=()=>{
			let footer=[];
			// 出租成交审核
			if (visible && _refundAuditStatus == '等待审核') {
					footer=[
						<Button key="back" type="primary" size="large" onClick={()=>hadleRejectAudit(currentRecord.recordId)}>审核驳回</Button>,
						<Button key="pass" type="primary" size="large" onClick={()=>hadleAuditPass(currentRecord.recordId)}>审核通过</Button>
					];
					return footer;
			}else {
					footer=[
						<Button key="back" type="primary" size="large" onClick={handleCancel}>返回</Button>,
					];
					return footer;
			}
	};
	/** 退款理由图片 */
	const showRefunReasonImgs=()=>{
		if(!!resultReason && !!resultReason.images){
			const images=resultReason.images.map(item=>({
				src:isNull(item,''),
				title:'',
				isCover:false,
			}))
			return(
				<PicList picListData={images}/>
			);
		}
	};

	const showAuditInfo=()=>{
		let imgs;
		if(!!resultInfos){
			return(
				<div className="auditInfo">
					<Timeline>
						{
							resultInfos.map((item,index)=>{
								imgs=item.images.map(picItem=>({
									src:isNull(picItem,''),
									title:'',
									isCover:false,
								}))
								{/*imgs=item.images.map((i,ind)=>{
									return(
										<li key={i}>
											<img className="toogleImgWidth"src={i} alt="图片加载失败" key={`${i}a`}/>
										</li>
									)
								});*/}

								return(
									<Timeline.Item key={index}>
										{item.auditInfo}
										{!!item.reason?<p style={{color:currentRecord.refundAuditStatus==='审核驳回'?"red":"#009900"}}>{currentRecord.refundAuditStatus==='审核驳回'?`驳回理由:${item.reason}`:`审核说明:${item.reason}`}</p>:null}
										{/*<ul className="imgUl">{imgs}</ul>*/}
										<PicList picListData={imgs}/>
									</Timeline.Item>
								)
							})
						}
					</Timeline>
				</div>
			)
		}
	};

	return(
		<Modal
			className="secondHandRefundAuditModal"
			visible={visible}
			maskClosable={true}
			title={'二手房'+currentRecord.refundType+"退款申请"}
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
							<h4>订单信息1</h4>
							<Table
								dataSource={!!resultTableData?resultTableData:{}}
								columns={columns}
								pagination={false}
							/>
						</div>

						<div>
							<h4>退款理由</h4>
							<span className='refundReason'>{!!resultReason?resultReason.refundReason:' '}</span>
							<DxShowMsgForm msgData={resultReason.refundInfo} />
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
SecondHandRentRefundAuditModal.propTypes={
	// secondHandHouseFinancialRentalAudit:PropTypes.object.isRequired,
};
function mapStateToProps({ secondHandHouseFinancialRentalAudit }) {
	return { secondHandHouseFinancialRentalAudit };
}
export default connect(mapStateToProps)(SecondHandRentRefundAuditModal);
