import React from  'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message,Timeline,Icon,Row,Col,Checkbox } from 'antd';
import {routerRedux} from 'dva/router'
import './showDetailsModal.css'
import DxPanelMini from '../../../commons/components/DxPanelMini'
import AuditPassOrRejectModal from '../transferManagement/AuditPassOrRejectModal'
import {DxSteps,DxStep} from '../../../commons/View/DxSteps'
import PicListOne from '../../../commons/UI/PicListOne'
const Step = Steps.Step;
const confirm=Modal.confirm;
let stepState={
  current:0,
  status:'waiting',
};
function ShowDetailsModal({dispatch,secondHandHouseSolution}){
  const {
    peoples,
    detailsModal,
    detailsTableData,
    completeBusiness,
    resultReason,
    resultInfos,
    transferInformation,
    auditinfos,
  }=secondHandHouseSolution;
  const {visible,currentRecord}=detailsModal;
  switch(currentRecord.applyAuditStatus){
    case '等待受理':
      stepState={
        current:0,
        status:'process',
      };
      break;
    case '解押申请驳回':
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
    case '解押驳回':
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
      render:(text)=><span>{`${text}㎡`}</span>
  	},{
  		title: '房源总价',
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
      type:'secondHandHouseSolution/toggleShowDetailsModal',
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
  		type:'secondHandHouseSolution/toggleShowDetailsModal',
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
          dispatch({
            type:"secondHandHouseSolution/saveForm",
            payload:{
              form:form
            }
          })
          dispatch({
            type:"secondHandHouseSolution/aduitReject",
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
            type:"secondHandHouseSolution/saveForm",
            payload:{
              form:form
            }
          })
          dispatch({
            type:"secondHandHouseSolution/aduitPass",
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
        placeholder:'在此输入批款说明',
        message:'请输入批款说明',
        buttonText:'确认',
        showPicList:[],
        recordId:recordId,
        isPass:true,
        hidePeople:true,
        onSubmit:(values,form)=>{
          dispatch({
            type:"secondHandHouseSolution/saveForm",
            payload:{
              form:form
            }
          })
          dispatch({
            type:"secondHandHouseSolution/transferPass",
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
                  <PicListOne picListData={item.url} key={item.imgName}/>
									// <li key={item.imgName}>
									// 	<img className={(item.width>item.height)?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
									// </li>
								)
							})
						}
					</ul>
				</div>
			)
		}
	};
  console.log('currentRecord',currentRecord);
  const showFooterButton=()=>{
		let footer=[];
		if(currentRecord.applyAuditStatus==='等待受理'){
			footer=[
        <Button key="reject" className="ant-btn anzhu_btn_reject" size="large" onClick={()=>hadleRejectAudit(currentRecord.recordId)}>驳回</Button>,
				<Button key="acceptance" type="primary" size="large" onClick={()=>acceptance(currentRecord.recordId)}>受理</Button>,
			];
			return footer;
		}else if(currentRecord.auditStatus==='审核驳回'||currentRecord.auditStatus==='已批款'||currentRecord.applyAuditStatus==="解押驳回"||currentRecord.applyAuditStatus==='解押申请驳回' || currentRecord.applyAuditStatus==="已撤回申请"){
			footer=[
				<Button key="back" type="ghost" size="large" onClick={handleCancel}>返回</Button>,
			];
			return footer;
		}else if(currentRecord.applyAuditStatus==="已撤消申请"){
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
                // <PicListOne picListData={item} key={index}/>
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
          <Col span={3} offset={1}><Checkbox defaultChecked={completeBusiness.intentionPaid} disabled>意向金已支付</Checkbox></Col>
          <Col span={3}><Checkbox defaultChecked={completeBusiness.firstPayMentPaid} disabled>意向金已支付</Checkbox></Col>
          <Col span={3}><Checkbox defaultChecked={completeBusiness.commissionPaid} disabled>中介佣金已支付</Checkbox></Col>
        </Row>
      </div>
    )
  }
  const showTransferInformation=()=>{
    return(
      <div className="transferInformation">
        <Row>
          {!!transferInformation.ownerName?<Col>业主姓名：{transferInformation.ownerName}</Col>:null}
          {!!transferInformation.ownerPhone?<Col>业主电话：{transferInformation.ownerPhone}</Col>:null}
          {/*{!!transferInformation.loanType?<Col offset={1}>贷款类型：{transferInformation.loanType}</Col>:null}*/}
          {!!transferInformation.loanAmount?<Col>解押金额：{`${transferInformation.loanAmount}元`}</Col>:null}
          {/*{!!transferInformation.loanTerm?<Col offset={1}>贷款期限：{transferInformation.loanTerm}</Col>:null}*/}
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
                        // 	<img className="toogleImgWidth"src={i} alt="图片加载失败" key={`${i}a`}/>
                        // </li>
                      )
                    })
                    return(
                      <Timeline.Item key={index}>
                        {item.auditDateTime}
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
      title='二手房-解押办理'
      onCancel={handleCancel}
      footer={showFooterButton()}>
      <AuditPassOrRejectModal props={peoples}/>
      <div className="showDetailsModal">
        <DxSteps current={stepState.current} status={stepState.status}>
          <DxStep description={stepState.description0} title="解押申请" />
          <DxStep description={stepState.description1} title="解押办理" />
          <DxStep description={stepState.description2} title="已批款" />
        </DxSteps>

        <DxPanelMini title='解押房源' hasPadding={false}>
          <Table
            dataSource={!!detailsTableData?detailsTableData:[]}
            columns={columns}
            pagination={false}
          />
      </DxPanelMini>
{/*        <div>
          <h4 className="title">购房意向</h4>
          {
            showCompleteBusiness()
          }
        </div>*/}
      <DxPanelMini title='解押申请信息' hasPadding={true}>
          {
            showTransferInformation()
          }
      </DxPanelMini>
      <DxPanelMini title='解押说明' hasPadding={true}>
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
function mapStateToProps({secondHandHouseSolution}){
  return{secondHandHouseSolution}
}
export default connect(mapStateToProps)(ShowDetailsModal)
