import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message,Timeline, } from 'antd';
import AuditExplainModal from '../contractReview/AuditExplainModal';
import './projectDealAuditModal.css';
import '../../../commons/css/common.css';
import commonUtil from '../../../commons/utils/commonUtil.js';


const Step = Steps.Step;
const confirm=Modal.confirm;

/*****************************************************/
/*****************************************************/
/**********财务审核：  新房成交  ***********************/
/*****************************************************/
/*****************************************************/


function ProjectDealAuditModal({dispatch, newHouseElectricityExamination}){
	const {projectDealAuditModal, auditExplainModal, trackDetailData} = newHouseElectricityExamination;
	const {visible, currentRecord,} =projectDealAuditModal;
	const tableData=[];
	tableData.push(currentRecord);

	console.log('projectDealAuditModal>>>>>>',projectDealAuditModal);
	// "txStatus": "审核中",	未申请审核 审核中 审核完成 已分佣
	// "auditStatus": "待审核",	已取消 待审核 业务已审核(通过/拒绝)  财务已审核(通过/拒绝) 已分佣
	// isFinished
	// isAllowed

	//步骤条状态
	let stepState={};
	if (currentRecord.isFinished) {
		// 已审核
		stepState={
			current:2,
			status:'finish',
		};
		if (!currentRecord.isAllowed) {
			stepState={
				current:2,
				status:'error',
				description1:'已驳回',
			};
		}
		else if (currentRecord.auditStatus == '业务审核通过') {
			stepState={
				current:1,
				status:'finish',
			};
		}else if (currentRecord.auditStatus == '业务审核拒绝') {
			stepState={
				current:1,
				status:'error',
				description1:'已驳回'
			};
		}else if (currentRecord.auditStatus == '待财务审核') {
			stepState={
				current:2,
				status:'process',
			};
		}else if (currentRecord.auditStatus == '财务审核通过') {
			stepState={
				current:2,
				status:'finish',
			};
		}else if (currentRecord.auditStatus == '财务审核拒绝') {
			stepState={
				current:2,
				status:'error',
				description2:'已驳回'
			};
		}else if (currentRecord.auditStatus == '已分佣') {
			stepState={
				current:3,
				status:'finish',
			};
		}

	}else {
		stepState={
			current:2,
			status:'process',
		};
	}

	console.log('   -- - - - - -- - ', JSON.stringify(stepState))

	const columns=[{
		title: '所属项目',
		dataIndex: 'projectName',
	},{
		title: '物业类型',
		dataIndex: 'propertyType',
	},{
		title:'成交房源',
		dataIndex:'houseName',
	},{
		title:'团购优惠',
		dataIndex:'discountName',
	},{
		title: '成交单价',
		dataIndex: 'unitPrice',
		render:(text, record) => (
				<span>
						{text}/㎡
				</span>
		)
	},{
		title: '成交总价',
		dataIndex: 'totalPrice',
		render:(text, record) => (
				<span>
						{text}/套
				</span>
		)
	},{
		title: '成交佣金',
		dataIndex:'brokerage',
	},{
		title:'成交经纪人',
		dataIndex:'brokerName',
	},{
		title:'申请时间',
		dataIndex:'txauditTime',
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
			type:'newHouseElectricityExamination/setState',
			payload:{
				projectDealAuditModal:{
					...projectDealAuditModal,
					visible:false,
				}
			}
		});
	};
	const toDealDetail=(projectId)=>{
		message.info('跳转到<<交易详情页>>,待处理',5);
		//跳转到详情页面;,传递项目ID过去;
	};
	const showImg=()=>{
		if(currentRecord.projectQualification){
			return (
				currentRecord.projectQualification.map((item)=>{
					return (
						<li key={item.imgName}>
							<img className={(item.width>item.height)?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
						</li>
					)
				})
			)
		}
	};

	/** 审核通过 */
	const hadleAuditPass=(id)=>{
		console.log('in hadleAuditPass')
		dispatch({
			type:'auditExplainModal/setState',
			payload:{
				visible:true,
				title:'财务审核通过',
				inputTitle:'审核说明',
				placeholder:'在此输入财务审核说明',
				message:'请输入审核说明',
				buttonText:'确定',
				recordId:id,
				isPass:false,
				onSubmit:(values)=>{
					if (!commonUtil.isFirstClick()) {
						return;
					}
					// 组装数据
					values['id'] = id;
					dispatch({
							type:"newHouseElectricityExamination/newHouseDealPass",
							payload:values
					})
				}
			}
		});
	};

	/** 申请驳回 */
	const hadleRejectAudit=(id)=>{
		dispatch({
			type:'auditExplainModal/setState',
			payload:{
				visible:true,
				title:'财务审核驳回',
				inputTitle:'驳回说明',
				placeholder:'在此输入驳回说明',
				message:'请输入驳回说明',
				recordId:id,
				isPass:false,
				onSubmit:(values)=>{
					if (!commonUtil.isFirstClick()) {
						return;
					}
					values['id'] = id;
					dispatch({
							type:"newHouseElectricityExamination/newhouseRejectDealAudit",
							payload:values
					})
				},
			}
		});
	};


	/**
	佣金信息
	*/
	const commissioInfo=()=>{
		if (visible && currentRecord) {
			return(
				<div>
					<p>
						佣金总额：{currentRecord.brokerage}元
						&nbsp;&nbsp;平台抽佣：{currentRecord.commissionRate}
						&nbsp;&nbsp;交易服务费：XXX元
						&nbsp;&nbsp;剩余佣金总额：{currentRecord.residualCommission}元
					</p>
					<p>
						成交方式：{currentRecord.txMode}
						&nbsp;&nbsp;佣金比例：90%
						&nbsp;&nbsp;佣金分配金额：{currentRecord.commissionAmount}元
					</p>
				</div>
			)
		}
	};

	/** 审核信息 */
	const auditInfo=()=>{
		if(visible && trackDetailData && trackDetailData['id']){
			let detailContent = [];
			let detailContentStr = trackDetailData['detailContent'];
			if (detailContentStr != null && detailContentStr.length > 2) {
					detailContent = JSON.parse(detailContentStr);
			}
			if(detailContent != null && detailContent.length > 0) {
				return(
					<div className="modalDivTop">
							<h4>成交审核</h4>

							<Timeline className="modalDivTop">
									{
											detailContent.map((item,index)=>{
													return(
														<Timeline.Item key={index}>
															{item.date} &nbsp;&nbsp;&nbsp;&nbsp; {item.content}
														</Timeline.Item>
													)
											})
									}
							</Timeline>
					</div>
				)
			}else {
				return(
					<div className="modalDivTop">
						<h4>成交审核</h4>
						<p>无审核信息...</p>
					</div>
				)
			}
		}
	};

	/**
	如果已驳回
	*/
	let resultImgs = [];
	const _auditResultFile = currentRecord['auditResultFile'];
	if (_auditResultFile != null && _auditResultFile.length > 2) {
			resultImgs = JSON.parse(_auditResultFile);
	}
	const rejectExplain=()=>{
		if(visible && currentRecord && currentRecord['isFinished']){
			return(
				<div className={currentRecord['isAllowed']?"modalDivTop modalDivTop":'rejectExplain modalDivTop'}>
					<h4>成交审核结果</h4>
					<span>{currentRecord.auditResultDesc}</span>

					<ul className="imgUl">
						{
								resultImgs.map((item)=>{
								return (
									<li key={item}>
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

	let images = [];
	const _attachments = "";
	if (currentRecord != null) {
		const _attachments = currentRecord.currentRecord;
		if(_attachments != null && _attachments.length > 2) {
				images = JSON.parse(_attachments);
		}
	}
	/** 申请说明 */
	const transactionExplain=()=>{
		if(visible && currentRecord){
			return(
				<div className="modalDivTop">
					<h4>成交说明</h4>
					<span>{currentRecord.auditDesc}</span>

					<ul className="imgUl">
						{
							images.map((item)=>{
								return (
									<li key={item}>
										<img className='toogleImgWidth' src={item} alt="图片加载失败"/>
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
		if (currentRecord.isFinished) {
			footer=[
				<Button key="back" type="primary" size="large" onClick={handleCancel}>返回</Button>,
			];
			return footer;
		}else {
			footer=[
				<Button key="back" type="primary" size="large" onClick={()=>hadleRejectAudit(currentRecord.id)}>审核驳回</Button>,
				<Button key="pass" type="primary" size="large" onClick={()=>hadleAuditPass(currentRecord.id)}>审核通过</Button>
			];
			return footer;
		}
	};


	return(
		<Modal
			className="ProjectDealAuditModal"
			visible={visible}
			maskClosable={false}
			title="成交审核"
			onCancel={handleCancel}
			footer={showFooterButton()}
			>
			<div className="commonModalHeight">
				<Steps current={stepState.current} status={stepState.status}>
					<Step description={stepState.description0} title="申请成交" />
					<Step description={stepState.description1} title="成交审核" />
					<Step description={stepState.description2} title="财务审核" />
					<Step description={stepState.description3} title="执行分佣" />
				</Steps>

				<div>
					<h4>成交信息</h4>
					<Table
						dataSource={tableData}
						columns={columns}
						pagination={false}
					/>
				</div>


				<div className="modalDivTop">
					<h4>佣金分配</h4>
					{
						commissioInfo()
					}
				</div>
				{
					transactionExplain()	//成交说明
				}
				{
					rejectExplain() 			//审核结果
				}
				{
					auditInfo() 					//审核信息
				}
			</div>

			<AuditExplainModal/>
		</Modal>
	)
}
ProjectDealAuditModal.propTypes={
	// newHouseElectricityExamination:PropTypes.object.isRequired,
};
function mapStateToProps({ newHouseElectricityExamination }) {
	return { newHouseElectricityExamination };
}
export default connect(mapStateToProps)(ProjectDealAuditModal);
