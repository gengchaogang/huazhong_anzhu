import React from  'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message,Timeline,Icon,Row,Col,Checkbox } from 'antd';
import {routerRedux} from 'dva/router'
import './showDetailsModal.css'
import DxPanelMini from '../../../commons/components/DxPanelMini'
import AuditPassOrRejectModal from './AuditPassOrRejectModal'
import {DxSteps,DxStep} from '../../../commons/View/DxSteps'
import PicListOne from '../../../commons/UI/PicListOne'
const Step = Steps.Step;
const confirm=Modal.confirm;
let stepState={
  current:1,
  status:'waiting',
};
function ShowDetailsModal({dispatch,secondHandHouseTransfer}){
  const {
    peoples,
    detailsModal,
    detailsTableData,
    completeBusiness,
    resultReason,
    resultInfos,
    transferInformation,
    auditinfos,
  }=secondHandHouseTransfer;
  const {visible,currentRecord}=detailsModal;
  switch(currentRecord.applyAuditStatus){
    case '等待受理':
      stepState={
        current:1,
        status:'process',
      };
      break;
    case '过户申请驳回':
      stepState={
        current:1,
        status:'error',
        description1:'已驳回'
      };
      break;
    case '等待过户':
      stepState={
        current:2,
        status:'process'
      };
      break;
    case '过户驳回':
      stepState={
        current:2,
        status:'error',
        description2:'已驳回'
      };
      break;
    case '已完成过户':
      stepState={
        current:2,
        status:'finish',
      };
      break;

    default:
      break;
  }
  const columns=[{
  		title: '房源编号',
  		dataIndex: 'resourcesNumber',
  	},{
  		title: '所属小区',
  		dataIndex: 'communityName',
  	},{
  		title:'房源信息',
  		dataIndex:'resourcesInfo',
  	},{
  		title:'房源面积',
  		dataIndex:'resourceArea',
  	},{
  		title: '房源单价',
  		dataIndex: 'unitPrice',
  	},{
  		title: '房源总价',
  		dataIndex: 'totalPrice',
  	},{
  		title:'支持贷款',
  		dataIndex:'resourceSupportLoan',
  	},{
  		title: '操作',
  		dataIndex:'operation',
  		render:(text,record)=>{
  			return(
  				<a style={{color:'#009900'}} onClick={()=>toDealDetail(currentRecord)}>交易详情</a>
  			)
  		}
  	}];
  const toDealDetail=(currentRecord)=>{
    dispatch({
      type:'secondHandHouseTransfer/toggleShowDetailsModal',
      payload:{
        visible:false,
        }
    });
  	dispatch(routerRedux.push({
      pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellTradeInfoDetails',
      state:{
        transCode:currentRecord.transCode
      }
    }))
		//跳转到详情页面;,传递项目ID过去;
  };
  const handleCancel=()=>{
  	dispatch({
  		type:'secondHandHouseTransfer/toggleShowDetailsModal',
  		payload:{
  			visible:false,
				}
    });
	};

  const hadleRejectAudit=(recordId)=>{
    console.log('recordId',recordId);
    dispatch({
      type:"auditPassOrRejectModal/setDefaultState"
    })
    dispatch({
      type:'auditPassOrRejectModal/changeState',
      payload:{
        visible:true,
        title:'驳回',
        inputTitle:'驳回说明',
        placeholder:'在此输入驳回说明',
        message:'请输入驳回说明',
        buttonText:'确认',
        showPicList:[],
        recordId:recordId,
        isPass:false,
        hidePeople:false,
        onSubmit:(values,form)=>{
          dispatch({
            type:"secondHandHouseTransfer/saveForm",
            payload:{form:form}
          })
          dispatch({
            type:"secondHandHouseTransfer/aduitReject",
            payload:values
          })
        },
      }
    });
  }
  const acceptance=(recordId)=>{
    dispatch({
      type:"auditPassOrRejectModal/setDefaultState"
    })
    dispatch({
      type:'auditPassOrRejectModal/changeState',
      payload:{
        visible:true,
        title:'受理',
        inputTitle:'受理说明',
        placeholder:'在此输入受理说明',
        message:'请输入受理说明',
        buttonText:'确认',
        showPicList:[],
        recordId:recordId,
        isPass:true,
        hidePeople:false,
        onSubmit:(values,form)=>{
          dispatch({
            type:"secondHandHouseTransfer/saveForm",
            payload:{form:form}
          })
          dispatch({
            type:"secondHandHouseTransfer/aduitPass",
            payload:values
          })
        },
      }
    });
  }
  const transferPass=(recordId)=>{
    dispatch({
      type:"auditPassOrRejectModal/setDefaultState"
    })
    dispatch({
      type:'auditPassOrRejectModal/changeState',
      payload:{
        visible:true,
        title:'完成过户',
        inputTitle:'过户说明',
        placeholder:'在此输入过户说明',
        message:'请输入过户说明',
        buttonText:'确认',
        showPicList:[],
        recordId:recordId,
        isPass:true,
        hidePeople:true,
        onSubmit:(values,form)=>{
          dispatch({
            type:"secondHandHouseTransfer/saveForm",
            payload:{form:form}
          })
          dispatch({
            type:"secondHandHouseTransfer/transferPass",
            payload:values
          })
        },
      }
    });
  }
  const hadleAuditPass=()=>{}
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

  const showFooterButton=()=>{
		let footer=[];
		if(currentRecord.applyAuditStatus==='等待受理'){
			footer=[
        <Button key="reject" size="large" className="ant-btn anzhu_btn_reject"
           onClick={()=>hadleRejectAudit(currentRecord.recordId)}>驳回</Button>,
				<Button key="acceptance" type="primary" size="large" onClick={()=>acceptance(currentRecord.recordId)}>受理</Button>,
			];
			return footer;
		}
    // else if(currentRecord.applyAuditStatus==='等待审核'){
    //   if(currentRecord.auditStatus==='过户申请驳回'||currentRecord.auditStatus==='已完成过户' || currentRecord.auditStatus==='已撤回申请' || currentRecord.auditStatus==='过户驳回'){
  	// 		footer=[
  	// 			<Button key="back" type="primary" size="large" onClick={handleCancel}>返回</Button>,
  	// 		];
  	// 		return footer;
  	// 	}else{
  	// 		footer=[
  	// 			<Button key="back" type="primary" size="large" onClick={()=>hadleRejectAudit(currentRecord.recordId)}>驳回</Button>,
  	// 			<Button key="pass" type="primary" size="large" onClick={()=>transferPass(currentRecord.recordId)}>完成过户</Button>
  	// 		];
  	// 		return footer;
  	// 	}
    // }
    else if(currentRecord.applyAuditStatus==='过户申请驳回'||currentRecord.applyAuditStatus==='已完成过户' || currentRecord.applyAuditStatus==='已撤回申请' || currentRecord.applyAuditStatus==='过户驳回'){
			footer=[
				<Button key="back" size="large" className="ant-btn ant-btn-ghost" onClick={handleCancel}>返回</Button>,
			];
			return footer;
		}else{
			footer=[
				<Button key="back" className="ant-btn anzhu_btn_reject" size="large" onClick={()=>hadleRejectAudit(currentRecord.recordId)}>驳回</Button>,
				<Button key="pass" type="primary" size="large" onClick={()=>transferPass(currentRecord.recordId)}>完成过户</Button>
			];
			return footer;
		}
	};
  const showRefunReasonImgs=()=>{
		if(!!resultReason&&!!resultReason.images){
			const images=resultReason.images
			return(
				<ul className="imgUl">
					{
						images.map((item,index)=>{
							return (
								<li key={index}>
									<img className="toogleImgWidth"src={item} alt="图片加载失败"/>
								</li>
							)
						})
					}
				</ul>
			);
		}
	};
  const showCompleteBusiness=()=>{
    return(
      <div className="complete">
        <Row>
          <Col span={3} ><Checkbox defaultChecked={completeBusiness.intentionPaid} disabled>意向金已支付</Checkbox></Col>
          <Col span={4}><Checkbox defaultChecked={completeBusiness.commissionPaid} disabled>中介佣金已支付</Checkbox></Col>
          <Col span={3}><Checkbox defaultChecked={completeBusiness.loanApproved} disabled>贷款已批</Checkbox></Col>
        </Row>
      </div>
    )
  }
  const showTransferInformation=()=>{
    return(
      <div className="transferInformation">
        <Row>
          {!!transferInformation.ownerName?<Col >业主姓名：{transferInformation.ownerName}</Col>:null}
          {!!transferInformation.ownerPhone?<Col >业主电话：{transferInformation.ownerPhone}</Col>:null}
          <Col>
            <Row>
                提供资料：
                {transferInformation.hasOwnerPropertyCertificate?'房产证':""}
                {!!transferInformation.hasOwnerPropertyCertificate&&!!transferInformation.hasOwnerIDCard?'、':""}
                {transferInformation.hasOwnerIDCard?'身份证原件':""}
            </Row>
          </Col>
          {!!transferInformation.customerName?<Col >购房者姓名：{transferInformation.customerName}</Col>:null}
          {!!transferInformation.customerPhone?<Col >购房者电话：{transferInformation.customerPhone}</Col>:null}
          <Col>
            <Row>
              提供资料：
              {transferInformation.hasCustomerHouseholdRegister?'户口本原件':""}
              {(!!transferInformation.hasCustomerHouseholdRegister&&!!transferInformation.hasCustomerMarriageCertificate)||(!!transferInformation.hasCustomerHouseholdRegister&&!!transferInformation.hasCustomerIDCard)?'、':""}
              {transferInformation.hasCustomerMarriageCertificate?'结婚证原件':""}
              {!!transferInformation.hasCustomerMarriageCertificate&&!!transferInformation.hasCustomerIDCard?'、':""}
              {transferInformation.hasCustomerIDCard?'身份证原件':""}
              {/*
                <Checkbox defaultChecked={transferInformation.hasCustomerHouseholdRegister} disabled>户口本原件</Checkbox>
                <Checkbox defaultChecked={transferInformation.hasCustomerMarriageCertificate} disabled>结婚证原件</Checkbox>
                <Checkbox defaultChecked={transferInformation.hasCustomerIDCard} disabled>身份证原件</Checkbox>
                */}
            </Row>
          </Col>
        </Row>
      </div>
    )
  }

  const showAuditInfo=()=>{
		let imgs;
		if(!!auditinfos){
			return(
				<div className="auditInfo">
          <Row>
            <Col >
              <Timeline>
    						{
    							auditinfos.map((item,index)=>{
    								imgs=item.images.map((i,ind)=>{
    									return(
                         <PicListOne picListData={i} key={i}/>
    										// <li key={i}>
    										// 	<img className="toogleImgWidth" src={i} alt="图片加载失败" key={`${i}a`}/>
    										// </li>
    									)
    								})
    								return(
    									<Timeline.Item key={index}>
    										{item.auditInfo}
    										{!!item.reason?<p style={{color:item.auditInfo.indexOf('驳回')>0?"red":""}}>{item.auditInfo.indexOf('驳回')>0?`驳回理由:${item.reason}`:`审核说明:${item.reason}`}</p>:null}
    										<ul className="imgUl">{imgs}</ul>
    									</Timeline.Item>
    								)
    							})
    						}
    					</Timeline>

            </Col>
          </Row>
				</div>
			)
		}
	};

  return(
    <Modal
      className="secondHandRefundAuditModal"
      visible={visible}
      maskClosable={true}
      title='二手房-申请过户'
      onCancel={handleCancel}
      footer={showFooterButton()}>
      <AuditPassOrRejectModal props={peoples}/>
      <div className="showDetailsModal">
        <DxSteps current={stepState.current} status={stepState.status}>
          <DxStep description={stepState.description0} title="申请过户" />
          <DxStep description={stepState.description1} title="过户办理" />
          <DxStep description={stepState.description2} title="完成过户" />
        </DxSteps>
      <DxPanelMini title='过户房源' hasPadding={false}>
          <Table
            dataSource={!!detailsTableData?detailsTableData:[]}
            columns={columns}
            pagination={false}
          />
      </DxPanelMini>
        <div className='showDetailsModal_list'>
      <DxPanelMini title='已完成业务' hasPadding={true}>
            {
              showCompleteBusiness()
            }
      </DxPanelMini>
      <DxPanelMini title='过户信息' hasPadding={true}>
            {
              showTransferInformation()
            }
      </DxPanelMini>
      <DxPanelMini title='办理进度' hasPadding={true}>
        <div className="showDetailsModal_list_bljd">
          {
            showAuditInfo()//审核信息
          }
        </div>
      </DxPanelMini>

          {
            showAuditExplain()//审核说明
          }
          {
            showRejectExplain()//审核说明
          }
        </div>
      </div>
    </Modal>

  )
}
function mapStateToProps({secondHandHouseTransfer}){
  return{secondHandHouseTransfer}
}
export default connect(mapStateToProps)(ShowDetailsModal)
