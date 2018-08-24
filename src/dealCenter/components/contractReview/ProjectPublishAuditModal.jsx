import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message,Timeline } from 'antd';
import AuditExplainModal from './AuditExplainModal';
import './projectPublishAuditModal.css';
import '../../../commons/css/common.css';
import PicList from '../../../commons/UI/PicList'
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxPanelMini from '../../../commons/components/DxPanelMini'
import {DxSteps,DxStep} from '../../../commons/View/DxSteps'
import {
  isNull,
} from '../../../commons/utils/currencyFunction'
import {
  renderUnitPriceStr,
} from '../../../commons/utils/publicFunction'
const Step = Steps.Step;
const confirm=Modal.confirm;

/*****************************************************/
/*****************************************************/
/**********合同审核：  新房上架 Modal*******************/
/*****************************************************/
/*****************************************************/

function ProjectPublishAuditModal({dispatch, newHouseContractReview}){
	const {projectPublishAuditModal,
		projectSqObjInfo,projectShObjInfo,
		} = newHouseContractReview;

	const {visible, currentRecord,} =projectPublishAuditModal;
	const tableData=[];
	tableData.push(currentRecord);

	//步骤条状态  等待审核
	let stepState={
		 current:1,
		 status:'process',
	};

	if (visible) {
			const nextStatus = currentRecord['status'];
			if (nextStatus == '发布申请') {
				stepState={
					 current:1,
					 status:'process',
				}
			}else if (nextStatus == '驳回发布') {
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
			}else if (nextStatus == '项目已上线') {
				stepState={
					current:2,
					status:'finish',
				};
			}
	}

	const columns=[{
		title: '项目名称',
		dataIndex: 'name',
	},{
		title: '所在区域',
		dataIndex: 'areaPath',
	},{
		title: '房源单价',
		dataIndex: 'price',
		render:(text,record)=>renderUnitPriceStr(text)
	},{
		title: '电商优惠',
		dataIndex:'discount',
		render:(text,record)=>{
			return (
				<span>{text}个</span>
			)
		}
	},{
		title:'在售房源',
		dataIndex:'sellTotle',
    render:(text,record)=>currentRecord.sellTotle,
	},{
		title: '创建人',
		dataIndex: 'createUser',
	},{
		title: '创建时间',
		dataIndex: 'createDateTime',
	},{
		title: '申请上线时间',
		dataIndex: 'onsellDateTime',
	}];


	const handleCancel=()=>{
		//关闭当前modal
		dispatch({
			type:'newHouseContractReview/setState',
			payload:{
				projectPublishAuditModal:{
					...projectPublishAuditModal,
					visible:false,
				}
			}
		});
	};

	const toProjectDetail=(projectId)=>{
		console.log('projectId',projectId);
		message.info('跳转到<<项目详情>>页,待处理',5);
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
							type:"newHouseContractReview/publishPass",
							payload:values,
						})
				},
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
							type:"newHouseContractReview/publishPass",
							payload:values,
						})
				},
			}
		});
	};

	// 项目信息
	const projectInfo=()=>{
		if(visible && projectSqObjInfo){
				var imgs = [];
				// if (projectSqObjInfo.credentialsImages) {
				// 	imgs = projectSqObjInfo.credentialsImages;
				// }
				if(!!projectSqObjInfo.credentialsImages){
					imgs=projectSqObjInfo.credentialsImages.map(item=>({
						title:'',
						isCover:false,
						src:item,
						id:item,
					}))
				}
				return(
					<div>
						<h4>项目资质</h4>
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
				)
		}
	};

	// 审核信息
	const auditInfoHtml=()=>{
			let imgs;
      console.log('projectSqObjInfo',projectSqObjInfo);
			if(visible && projectSqObjInfo && projectSqObjInfo.auditInfo){
				return (
					<div className="auditInfo">
						<Timeline>
							{
								projectSqObjInfo.auditInfo.map((item,index)=>{
									{/*imgs = item.images.map((i,ind)=>{
										return(
											<li key={i}>
												<img className="toogleImgWidth" src={i} alt="图片加载失败" key={`${i}a`}/>
											</li>
										)
									});*/}
									imgs=item.images.map(itemImg=>({
										title:'',
										isCover:false,
										src:itemImg,
										id:itemImg,
									}))
									return(
										<Timeline.Item key={index}>
											<p>{item.auditInfo}</p>
  										{!!item.reason?<p style={{color:item.auditInfo.indexOf('驳回')>0?"red":"#009900"}}>{item.auditInfo.indexOf('驳回')>0?`驳回理由:${item.reason}`:`审核说明:${item.reason}`}</p>:null}
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
		const _nextStatus = currentRecord.nextStatus;
		if (_nextStatus == '等待审核') {
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
			title:'项目发布',
			description:stepState.description0,
		},{
			title:'项目审核',
			description:stepState.description1,
		},{
			title:'项目上线',
			description:stepState.description2,
		}
	]
	return(
		<Modal
			className="ProjectPublishAuditModal"
			visible={visible}
			maskClosable={true}
			title="项目发布审核"
			onCancel={handleCancel}
      style={{
        zIndex:'500'
      }}
			footer={showFooterButton()}
			>
			<div className="commonModalHeight">
					{/*<Steps current={stepState.current} status={stepState.status}>
						<Step description={stepState.description0}  title="项目发布" />
						<Step description={stepState.description1} title="项目审核" />
						<Step description={stepState.description2} title="项目上线" />
					</Steps>*/}
	        <DxSteps current={isNull(stepState.current,0)} status={isNull(stepState.status,'process')}>
	          {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
	        </DxSteps>
					<DxPanelMini title='发布项目'>
						<Table
							dataSource={tableData}
							columns={columns}
							pagination={false}
						/>
					</DxPanelMini>
					<DxPanelMini title='发布项目' hasPadding={true}>
						<div>
							{projectInfo()}
						</div>
					</DxPanelMini>
					<DxPanelMini title='审核信息' hasPadding={true}>
						<ul>
							{
								auditInfoHtml()
							}
						</ul>
					</DxPanelMini>
			</div>
			{/*<AuditExplainModal/>*/}
		</Modal>
	)
}
ProjectPublishAuditModal.propTypes={
	newHouseContractReview:PropTypes.object.isRequired,
};
function mapStateToProps({ newHouseContractReview }) {
	return { newHouseContractReview };
}
export default connect(mapStateToProps)(ProjectPublishAuditModal);
