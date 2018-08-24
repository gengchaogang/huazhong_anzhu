import React from  'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message,Timeline,Icon,Row,Col,Checkbox } from 'antd';
import {routerRedux} from 'dva/router'
import './showDetailsModal.css'
import DxPanelMini from '../../../commons/components/DxPanelMini'
import AuditPassOrRejectModal from '../transferManagement/AuditPassOrRejectModal'
import {DxSteps,DxStep} from '../../../commons/View/DxSteps'
import {
  renderTotalMoneyStr,
} from '../../../commons/utils/publicFunction'
import PicListOne from '../../../commons/UI/PicListOne'
const Step = Steps.Step;
const confirm=Modal.confirm;
let stepState={
  current:0,
  status:'waiting',
};
function ShowMortgageDealDetailsModal({dispatch,secondHandHouseMortgageDeal}){
  const {
    peoples,
    detailsModal,
    detailsTableData,
    completeBusiness,
    resultReason,
    resultInfos,
    transferInformation,
    auditinfos,
  }=secondHandHouseMortgageDeal;
  const {visible,currentRecord}=detailsModal;
  console.log('currentRecord.applyAuditStatus',currentRecord.applyAuditStatus);
  switch(currentRecord.applyAuditStatus){
    case '等待受理':
      stepState={
        current:0,
        status:'process',
      };
      break;
    case '贷款申请驳回':
      stepState={
        current:1,
        status:'error',
        description1:'已驳回'
      };
      break;
    case '等待批款':
      stepState={
        current:2,
        status:'process'
      };
      break;
    case '批款驳回':
      stepState={
        current:2,
        status:'error',
        description2:'已驳回'
      };
      break;
    case '已批款':
      stepState={
        current:2,
        status:'finish',
      };
      break;

    default:
      break;
  }
  const columns=[{
  		title: '物业类型',
  		dataIndex: 'propertyType',
  	},{
  		title: '所属小区',
  		dataIndex: 'communityName',
  	},{
  		title:'房源信息',
  		dataIndex:'resourcesInfo',
  	},{
  		title:'房源面积',
  		dataIndex:'resourceArea',
      render:(text)=><span>{`${parseFloat(text)}㎡`}</span>
  	},{
  		title: '成交单价',
  		dataIndex: 'unitPrice',
      render:(text)=><span>{`${text}`}</span>
  	},{
  		title: '成交总价',
  		dataIndex: 'totalPrice',
      render:(text)=><span>{`${text}`}</span>
  	},{
  		title:'支持贷款',
  		dataIndex:'resourceSupportLoan',
  	},{
  		title:'申请时间',
  		dataIndex:'applyDateTime',
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
      type:'secondHandHouseMortgageDeal/toggleShowDetailsModal',
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
    console.log('record',currentRecord);
  };
  const handleCancel=()=>{
  	dispatch({
  		type:'secondHandHouseMortgageDeal/toggleShowDetailsModal',
  		payload:{
  			visible:false,
				}
    });
	};

  const hadleRejectAudit=(recordId)=>{
    console.log('recordId',recordId);
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
          console.log('values',values);
          dispatch({
            type:"secondHandHouseMortgageDeal/saveForm",
            payload:{
              form:form
            }
          })
          dispatch({
            type:"secondHandHouseMortgageDeal/aduitReject",
            payload:values
          })
        },
      }
    });
  }
  const acceptance=(recordId)=>{
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
            type:"secondHandHouseMortgageDeal/saveForm",
            payload:{
              form:form
            }
          })
          dispatch({
            type:"secondHandHouseMortgageDeal/aduitPass",
            payload:values
          })
        },
      }
    });
  }
  const transferPass=(recordId)=>{
    dispatch({
      type:'auditPassOrRejectModal/changeState',
      payload:{
        visible:true,
        title:'完成批款',
        inputTitle:'批款说明',
        placeholder:'在此输入批款审核说明',
        message:'请输入批款审核说明',
        buttonText:'确认',
        showPicList:[],
        hidePeople:true,
        recordId:recordId,
        isPass:true,
        onSubmit:(values,form)=>{
          dispatch({
            type:"secondHandHouseMortgageDeal/saveForm",
            payload:{
              form:form
            }
          })
          dispatch({
            type:"secondHandHouseMortgageDeal/transferPass",
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
    console.log('currentRecord',currentRecord);
		if(currentRecord.applyAuditStatus==='等待受理'){
			footer=[
        <Button key="reject" className="ant-btn anzhu_btn_reject" size="large" onClick={()=>hadleRejectAudit(currentRecord.recordId)}>驳回</Button>,
				<Button key="acceptance" type="primary" size="large" onClick={()=>acceptance(currentRecord.recordId)}>受理</Button>,
			];
			return footer;
		}else if(currentRecord.applyAuditStatus=='已撤消申请'){
      footer=[
        <Button key="back" type="ghost" size="large" onClick={handleCancel}>返回</Button>,
      ];
      return footer;
    }else if(currentRecord.auditStatus==='审核驳回'||currentRecord.auditStatus==='已批款'||currentRecord.applyAuditStatus==="批款驳回"||currentRecord.applyAuditStatus==="贷款申请驳回" || currentRecord.applyAuditStatus==="已撤回申请"){
			footer=[
				<Button key="back" type="ghost" size="large" onClick={handleCancel}>返回</Button>,
			];
			return footer;
		}else{
			footer=[
				<Button key="back" className="ant-btn anzhu_btn_reject" size="large" onClick={()=>hadleRejectAudit(currentRecord.recordId)}>驳回</Button>,
				<Button key="pass" type="primary" size="large" onClick={()=>transferPass(currentRecord.recordId)}>批款</Button>
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
    // return(
    //   <div className="complete">
    //     <Row>
    //     {!!completeBusiness.loanAmount?
    //       <Col span={4} >解押金额：{`${completeBusiness.loanAmount}元`}</Col>:
    //       null
    //     }
    //     {!!completeBusiness.ownerName?
    //       <Col span={4} >业主姓名：{completeBusiness.ownerName}</Col>:
    //       null
    //     }
    //     {!!completeBusiness.ownerPhone?
    //       <Col span={4} >业主电话：{completeBusiness.ownerPhone}</Col>:
    //       null
    //     }
    //     </Row>
    //   </div>
    // )
    return(
      <div className="complete">
        <Row>
          <Col span={3}><Checkbox defaultChecked={completeBusiness.intentionPaid} disabled>意向金已支付</Checkbox></Col>
          {/*
                      <Col span={3}><Checkbox defaultChecked={completeBusiness.firstPayMentPaid} disabled>首付款已支付</Checkbox></Col>
            */}
          <Col span={4}><Checkbox defaultChecked={completeBusiness.commissionPaid} disabled>中介佣金已支付</Checkbox></Col>
        </Row>
      </div>
    )
  }
  const showTransferInformation=()=>{
    return(
      <div className="transferInformation">
        <Row>
          {!!transferInformation.customerName?<Col >贷款客户：{transferInformation.customerName}</Col>:null}
          {!!transferInformation.customerPhone?<Col >贷款人联系电话：{transferInformation.customerPhone}</Col>:null}
          {!!transferInformation.loanType?<Col >贷款类型：{transferInformation.loanType}</Col>:null}
          {!!transferInformation.loanRate?<Col >贷款比例：{transferInformation.loanRate*100}%</Col>:null}
          {!!transferInformation.loanAmount?<Col >贷款金额：{transferInformation.loanAmount/10000}万元</Col>:null}
          {!!transferInformation.loanTerm?<Col >贷款期限：{transferInformation.loanTerm}</Col>:null}
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
            <Col>
              <Timeline>
                {
                  auditinfos.map((item,index)=>{
                    imgs=item.images.map((i,ind)=>{
                      return(
                        <PicListOne picListData={i} key={i}/>
                        // <li key={i}>
                        //   <img className="toogleImgWidth"src={i} alt="图片加载失败" key={`${i}a`}/>
                        // </li>
                      )
                    })
                    return(
                      <Timeline.Item key={index}>
                        {item.auditDateTime}
                        {item.auditInfo}
                        {!!item.reason?<p style={{color:item.auditInfo.indexOf('驳回')>0?"red":"#009900"}}>{item.auditInfo.indexOf('驳回')>0?`驳回理由:${item.reason}`:`审核说明:${item.reason}`}</p>:null}
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
      title='二手房-贷款办理'
      onCancel={handleCancel}
      footer={showFooterButton()}>
      <AuditPassOrRejectModal props={peoples}/>
      <div className="showDetailsModal">
        <DxSteps current={stepState.current} status={stepState.status}>
          <DxStep description={stepState.description0} title="申请贷款" />
          <DxStep description={stepState.description1} title="办理贷款" />
          <DxStep description={stepState.description2} title="批款" />
        </DxSteps>
      <DxPanelMini title='贷款房源' hasPadding={false}>
          <Table
            dataSource={!!detailsTableData?detailsTableData:[]}
            columns={columns}
            pagination={false}
          />
      </DxPanelMini>
      <DxPanelMini title='购房意向' hasPadding={true}>
          {
            showCompleteBusiness()
          }
      </DxPanelMini>
      <DxPanelMini title='贷款信息' hasPadding={true}>
          {
            showTransferInformation()
          }
      </DxPanelMini>
      <DxPanelMini title='贷款状态' hasPadding={true}>
          {
            showAuditInfo()//审核信息
          }
      </DxPanelMini>
        {
          showAuditExplain()//审核说明
        }
        {
          showRejectExplain()//审核说明
        }
      </div>
    </Modal>

  )
}
function mapStateToProps({secondHandHouseMortgageDeal}){
  return{secondHandHouseMortgageDeal}
}
export default connect(mapStateToProps)(ShowMortgageDealDetailsModal)
