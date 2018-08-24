import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message, Timeline, } from 'antd';
import AuditExplainModal from './AuditExplainModal';
import './secondHandDealAuditModal.css';
import '../../../commons/css/common.css';
import PicList from '../../../commons/UI/PicList'
import commonUtil from '../../../commons/utils/commonUtil.js';
import {creatHouseInfo} from '../../../commons/utils/currencyFunction.js';

const Step = Steps.Step;
const confirm=Modal.confirm;


/*****************************************************/
/*****************************************************/
/**********合同审核：  二手房出售：成交审核 *************/
/*****************************************************/
/*****************************************************/


function SecondHandDealAuditModal({dispatch, secondHandHouseSalesAudit}){

	const {projectDealAuditModal, auditExplainModal} = secondHandHouseSalesAudit;
	const {visible, currentRecord,dealAuditDatail,} = projectDealAuditModal;

	const tableData=[];
	const applyinfo = dealAuditDatail['applyinfo'];
	tableData.push(applyinfo);

	//步骤条状态
	let stepState={
		current:1,
		status:'process'
	};
	// 等待成交审核,成交审核通过,成交申请驳回,等待财务审核,财务审核驳回,财务审核通过,已成交
	let _applyAuditStatus = currentRecord.applyAuditStatus;
	// 等待审核,审核通过,审核驳回,撤回申请,已执行分佣
	let _auditStatus = currentRecord.auditStatus;
	if (visible) {
			console.log('状态：', _applyAuditStatus + "   =====   " + _auditStatus)
			if(_applyAuditStatus == '等待成交审核') {
				stepState={
					current:1,
					status:'process'
				};
			}else if (_applyAuditStatus == '成交审核通过') {
				stepState={
					current:1,
					status:'finish'
				};
			}else if (_applyAuditStatus == '成交申请驳回') {
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
			}else if (_auditStatus == '已执行分佣') {
				stepState={
					current:3,
					status:'finish',
				};
			}

	}

	const columns=[{
		title: '房源信息',
		dataIndex:'resourcesInfo',
		key: 'resourcesInfo',
		render:(text,record)=>{
				return(
					<span>
	            {creatHouseInfo(text)}
	        </span>
				)
		}
	},{
		title: '物业类型',
		dataIndex: 'propertyType',
		key: 'propertyType',
	},{
		title:'房源面积',
		dataIndex:'resourceArea',
		key: 'resourceArea',
	},{
		title: '房源单价',
		dataIndex: 'dealUnitPrice',
		key: 'dealUnitPrice',
	},{
		title: '房源总价',
		dataIndex: 'totalPrice',
		key: 'totalPrice',
	},{
		title: '成交佣金',
		dataIndex:'platformCommissionAmount',
		key: 'platformCommissionAmount',
	},{
		title:'房源经纪人',
		dataIndex:'brokerName',
		key: 'brokerName',
	},{
		title:'客户经纪人',
		dataIndex:'customerBrokerName',
		key: 'customerBrokerName',
	},{
		title:'成交时间',
		dataIndex:'applyDateTime',
		key: 'applyDateTime',
	},{
		title: '操作',
		dataIndex:'operation',
		key: 'operation',
		render:(text,record)=>{
			return(
				<a style={{color:'#009900'}} onClick={()=>toDealDetail(record)}>交易详情</a>
			)
		}
	}];

	const handleCancel=()=>{
		//关闭当前modal
		dispatch({
			type:'secondHandHouseSalesAudit/setState',
			payload:{
				projectDealAuditModal:{
					...projectDealAuditModal,
					visible:false,
				}
			}
		});
	};
	const toDealDetail=(record)=>{
		console.log('record',record);
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

	/**
	成交审核信息
	*/
	const showAuditProgress=()=>{
		let imgs;
		if(dealAuditDatail.auditinfos){
			return (
				<div className="auditInfo">
					<Timeline>
						{
							dealAuditDatail.auditinfos.map((item,index)=>{

								imgs = item.images.map((i,ind)=>{
									return(
										<li key={i}>
											<img className="toogleImgWidth"src={i} alt="图片加载失败" key={`${i}a`}/>
										</li>
									)
								});

								return(
									<Timeline.Item key={index}>
										{item.auditInfo}
										<ul className="imgUl">{imgs}</ul>
									</Timeline.Item>
								)
							})
						}
					</Timeline>
				</div>
			)
		}
	};

	/** 审核通过 */
	const hadleAuditPass=(recordId)=>{
		// 加载财务审核人员
		dispatch({
				type:"auditExplainModal/loadAuditUserList",
				payload:{
						name:"二手房成交财务审核"
				}
		});
		dispatch({
			type:'auditExplainModal/setState',
			payload:{
				visible:true,
				title:'审核通过',
				inputTitle:'审核说明',
				placeholder:'在此输入审核说明',
				message:'请输入审核说明',
				buttonText:'转交财务审核',
				recordId:recordId,
				isPass:true,
				onSubmit:(values)=>{
					if (!commonUtil.isFirstClick()) {
						return;
					}
					dispatch({
						type:"secondHandHouseSalesAudit/secondHandSaleDealPass",
						payload:values
					})
				}
			}
		});
	};

	/** 审核驳回 */
	const hadleRejectAudit=(projectId)=>{
		dispatch({
			type:'auditExplainModal/setState',
			payload:{
				visible:true,
				title:'审核驳回',
				inputTitle:'驳回说明',
				placeholder:'在此输入驳回说明',
				message:'请输入驳回说明',
				isPass: false,
				onSubmit:(values)=>{
					if (!commonUtil.isFirstClick()) {
						return;
					}
					dispatch({
						type:"secondHandHouseSalesAudit/secondHandSaleDealReject",
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
		if (visible && applyinfo['platformCommissionAmount']) {
			return(
				<div>
					<p>
						佣金总额：{applyinfo.platformCommissionAmount}元
						&nbsp;&nbsp;平台抽佣：{applyinfo.platformCommissionRate}
						&nbsp;&nbsp;交易服务费：XXX元
						&nbsp;&nbsp;剩余佣金总额：{applyinfo.releaseAmount}元
					</p>
					<p>
						成交方式：{applyinfo.transactionMode}
						&nbsp;&nbsp;佣金比例：90%
						&nbsp;&nbsp;佣金分配金额：{applyinfo.commissionAmount}元
					</p>
				</div>
			)
		}
	};

	/**
	申请说明
	*/
	const auditInfo=()=>{
		if(visible && applyinfo.memo){
			return(
				<div className="marginTop">
					<h4>申请说明</h4>
					<span>{applyinfo.memo}</span>

					<ul className="imgUl">
						{
							applyinfo.images.map((item)=>{
								return (
									<li key={item}>
										<img className='toogleImgWidth' src={item} key={`${item}a`} alt="图片加载失败"/>
									</li>
								)
							})
						}
					</ul>
				</div>
			)
		}
	};
	const rejectExplain=()=>{
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

	const transactionExplain=()=>{
		if(currentRecord.transactionExplain){
			return(
				<div>
					<h4>成交说明</h4>
					<span>{currentRecord.transactionExplain.text}</span>
					<ul className="imgUl">
						{
							currentRecord.transactionExplain.imgs.map((item)=>{
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
		if (visible && _auditStatus == '等待审核') {
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

	return(
		<Modal
			className="secondHandDealAuditModal"
			visible={visible}
			maskClosable={false}
			title="二手房--成交申请"
			onCancel={handleCancel}
			footer={showFooterButton()}
			>
			<div className="commonModalHeight">
					<Steps current={stepState.current} status={stepState.status}>
						<Step description={stepState.description0}  title="申请成交" />
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
							rowKey="xxtable"
						/>
					</div>

					<div className="marginTop">
							<h4>佣金分配</h4>
							{
								commissioInfo()
							}
					</div>

					{
						auditInfo() //申请说明
					}

					<div className="marginTop">
						<h4>成交审核信息</h4>
						<ul>
							{
								showAuditProgress()
							}
						</ul>
					</div>

					{
						rejectExplain() //驳回说明
					}
			</div>
			<AuditExplainModal/>
		</Modal>
	)
}
SecondHandDealAuditModal.propTypes={
	// secondHandHouseSalesAudit:PropTypes.object.isRequired,
};
function mapStateToProps({ secondHandHouseSalesAudit }) {
	return { secondHandHouseSalesAudit };
}
export default connect(mapStateToProps)(SecondHandDealAuditModal);