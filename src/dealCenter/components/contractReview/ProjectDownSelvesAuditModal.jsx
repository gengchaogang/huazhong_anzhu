import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message,Timeline } from 'antd';
import AuditExplainModal from './AuditExplainModal';
import './projectPublishAuditModal.css';
import PicList from '../../../commons/UI/PicList'
import DxPanelMini from '../../../commons/components/DxPanelMini'
import {
  isNull,
} from '../../../commons/utils/currencyFunction'
import '../../../commons/css/common.css';

import commonUtil from '../../../commons/utils/commonUtil.js';

const Step = Steps.Step;
import {DxSteps,DxStep} from '../../../commons/View/DxSteps'
const confirm=Modal.confirm;

/*****************************************************/
/*****************************************************/
/**********合同审核：  新房下架 ***********************/
/*****************************************************/
/*****************************************************/

function ProjectDownSelvesAuditModal({dispatch, newHouseContractReview}){
	const {projectDownSelvesAuditModal,
		projectSqObjInfo,projectShObjInfo,
		} = newHouseContractReview;

	const {visible, currentRecord,} =projectDownSelvesAuditModal;
	const tableData=[];
	tableData.push(currentRecord);


	//步骤条状态  等待审核
	let stepState={
		 current:1,
		 status:'process',
	};

	if (visible) {
			const nextStatus = currentRecord['status'];
			if (nextStatus == '下架申请') {
				stepState={
					 current:1,
					 status:'process',
				}
			}else if (nextStatus == '驳回下架') {
				stepState = {
						current:1,
						status:'error',
						description1:'已驳回'
				};
			}else if (nextStatus == '审核通过') {
				stepState = {
						current:1,
						status:'finish',
				};
			}else if (nextStatus == '已下架') {
				stepState={
					current:2,
					status:'finish',
				};
			}
	}

	const columns = [
			{
				title: '项目名称',
				dataIndex: 'name',
			},{
				title: '所在区域',
				dataIndex: 'areaPath',
			},{
				title: '带看数',
				dataIndex: 'lookNumber',
				render:(text,record)=>{
					return (
						<span>{text}个</span>
					)
				}
			},{
				title: '成交套数',
				dataIndex:'sellTotle',
			},{
				title: '创建时间',
				dataIndex: 'createDateTime',
			},
			// {
			// 	title: '下架时间',
			// 	dataIndex: 'offlineDate',
			// },
			{
				title: '创建人',
				dataIndex: 'createUser',
			}
	];


	const handleCancel=()=>{
		//关闭当前modal
		dispatch({
			type:'newHouseContractReview/setState',
			payload:{
				projectDownSelvesAuditModal:{
					...projectDownSelvesAuditModal,
					visible:false,
				}
			}
		});
	};
	const toProjectDetail=(projectId)=>{
		message.info('跳转到详情页,待处理',5);
		//跳转到详情页面;,传递项目ID过去;
	};

	const hadleAuditPass=(projectId)=>{
		dispatch({
			type:'auditExplainModal/setState',
			payload:{
				visible:true,
				title:'审核通过',
				inputTitle:'审核说明',
				placeholder:'在此输入审核说明',
				message:'请输入审核说明',
				isPass:false,
				showPicList:[],
				needPassWord:true,
				onSubmit:(values)=>{
						if (!commonUtil.isFirstClick()) {
							return;
						}
						values['projectId'] = projectId;
						values['status'] = 'pass';
						dispatch({
							type:"newHouseContractReview/downShelvesPass",
							payload:values,
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
				placeholder:'在此输入审核驳回',
				message:'请输入审核驳回',
				isPass:false,
				showPicList:[],
				needPassWord:true,
				onSubmit:(values)=>{
						if (!commonUtil.isFirstClick()) {
							return;
						}
						values['projectId'] = projectId;
						values['status'] = 'overrule';
						dispatch({
							type:"newHouseContractReview/downShelvesPass",
							payload:values,
						})
				}
			}
		});
	};

	// 项目信息
	const projectInfo=()=>{
		if(visible && projectSqObjInfo){
				var imgs = [];
				if (projectSqObjInfo.credentialsImages) {
					// imgs = projectSqObjInfo.credentialsImages;
					imgs=projectSqObjInfo.credentialsImages.map(item=>({
						title:'',
						src:item,
						isCover:false,
					}))
				}
				return(
					<DxPanelMini title='下架原因' hasPadding={true}>
						<div>
							<span>{projectSqObjInfo.description}</span>
							<PicList picListData={imgs}/>
							{/*<ul className="imgUl">
								{
									imgs.map((item)=>{
										return (
											<li key={item}>
												<img className={"toogleImgWidth"} src={item} alt="图片加载失败"/>
											</li>
											)
										})
								}
							</ul>*/}
						</div>
					</DxPanelMini>
				)
		}
	};

	// 审核信息
	const auditInfoHtml=()=>{
			let imgs;
			if(visible && projectSqObjInfo && projectSqObjInfo.auditInfo){
				return (
					<div className="auditInfo">
						<Timeline>
							{
								projectSqObjInfo.auditInfo.map((item,index)=>{
									// imgs = item.images.map((i,ind)=>{
									// 	return(
									// 		<li key={i}>
									// 			<img className="toogleImgWidth"src={i} alt="图片加载失败" key={`${i}a`}/>
									// 		</li>
									// 	)
									// });
									imgs=item.images.map(picItem=>({
										title:'',
										src:picItem,
										isCover:false,
									}))
									return(
										<Timeline.Item key={index}>
											{item.auditInfo}
											<PicList picListData={imgs}/>
											{/*<ul className="imgUl">{imgs}</ul>*/}
										</Timeline.Item>
									)
								})
							}
						</Timeline>
					</div>
				)
			}
	};

	//控制footer的Button显示
	const showFooterButton=()=>{
		let footer=[];
		let _nextStatus = currentRecord.nextStatus;
		if(_nextStatus == '等待审核') {
				footer=[
					<Button key="back" type="primary" className='anzhu_btn_reject' size="large" onClick={()=>hadleRejectAudit(currentRecord.id)}>审核驳回</Button>,
					<Button key="pass" type="primary" size="large" onClick={()=>hadleAuditPass(currentRecord.id)}>审核通过</Button>
				];
				return footer;
		}else {
			footer=[
				<Button key="back" type="primary" size="large" onClick={handleCancel}>返回</Button>,
			];
			return footer;
		}
	};

	const stepList = [
		{
			title:'申请下架',
			description:stepState.description0,
		},{
			title:'下架审核',
			description:stepState.description1,
		},{
			title:'已下架',
			description:stepState.description2,
		}
	]
	return(
		<Modal
			className="ProjectPublishAuditModal"
			visible={visible}
			maskClosable={true}
      style={{
        zIndex:'500'
      }}
			title="新房项目申请下架"
			onCancel={handleCancel}
			footer={showFooterButton()}
		>
			<div>
				{/*<Steps current={stepState.current} status={stepState.status}>
					<Step description={stepState.description0}  title="申请下架" />
					<Step description={stepState.description1} title="下架审核" />
					<Step description={stepState.description2} title="项目已下架" />
				</Steps>*/}
				<DxSteps current={isNull(stepState.current,0)} status={isNull(stepState.status,'process')}>
					{stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
				</DxSteps>
				<DxPanelMini title='下架项目'>
					<Table
						dataSource={tableData}
						columns={columns}
						pagination={false}
					/>
				</DxPanelMini>

				{
					projectInfo()					// 项目信息
				}
				<DxPanelMini title='审核信息' hasPadding={true}>
					<div>
						<ul>
							{
								auditInfoHtml()		// 审核信息
							}
						</ul>
					</div>
				</DxPanelMini>
			</div>
			{/*<AuditExplainModal/>*/}
		</Modal>
	)
}
ProjectDownSelvesAuditModal.propTypes={
	newHouseContractReview:PropTypes.object.isRequired,
};
function mapStateToProps({ newHouseContractReview }) {
	return { newHouseContractReview };
}
export default connect(mapStateToProps)(ProjectDownSelvesAuditModal);
