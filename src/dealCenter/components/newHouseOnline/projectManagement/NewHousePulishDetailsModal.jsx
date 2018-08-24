
import React from  'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message,Timeline,Icon,Row,Col } from 'antd';
import {DxSteps,DxStep} from '../../../../commons/View/DxSteps'
import PicList from '../../../../commons/UI/PicList'
import {
  renderUnitPriceStr,
} from '../../../../commons/utils/publicFunction'
import DxPanelMini from '../../../../commons/components/DxPanelMini'
import {
  isNull,
} from '../../../../commons/utils/currencyFunction'
import {routerRedux} from 'dva/router'
// import './showDetailsModal.css'
const Step = Steps.Step;
const confirm=Modal.confirm;
let stepState={};
function NewHousePulishDetailsModal({dispatch,projectManagement}){
  const {
    reasonImages,
    offlineReason,
    detailsPulishModal,
    publishDetailsData,
    publishImages,
    publishReason,
    publishAuditContent,
    completeBusiness,
    resultReason,
    resultInfos,
    transferInformation,
    auditInfos,
  }=projectManagement;
  const {publishVisible,currentRecord}=detailsPulishModal;
  switch(currentRecord.nextStatus){
    case '等待审核':
      stepState={
        current:0,
        status:'waiting',
      };
      break;
    case '重新发布':
      stepState={
        current:1,
        status:'error',
        description1:'已驳回'
      };
      break;
    case '等待批款':
      stepState={
        current:2,
        status:'waiting'
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
  		title: '项目名称',
  		dataIndex: 'name',
  	},{
  		title: '所在区域',
  		dataIndex: 'areaPath',
  	},{
  		title:'房源单价',
  		dataIndex:'price',
      render:(text)=>renderUnitPriceStr(text),
  	},{
  		title:'在售房源',
  		dataIndex:'sellTotle',
      render:(text,record)=>currentRecord.sellTotle,
  	},{
  		title: '电商优惠',
  		dataIndex: 'discount',
      render:(text)=>`${text}个`
  	},{
  		title:'创建人',
  		dataIndex:'createUser',
  	},{
  		title:'创建时间',
  		dataIndex:'createDateTime',
  	},{
  		title: '操作',
  		dataIndex:'operation',
  		render:(text,record)=>{
  			return(
  				<a style={{color:'#009900'}} onClick={()=>toDealDetail(currentRecord)}>项目详情</a>
  			)
  		}
  }];
  const toDealDetail=(currentRecord)=>{
    console.log('currentRecord',currentRecord);
  	dispatch(routerRedux.push({
      pathname:'/tradeManagement/newHouseTrade/projectDetails',
      state:{
        projectId:currentRecord.id,
        projectName:currentRecord.name
      }
    }))


		//跳转到详情页面;,传递项目ID过去;
  };
  const handleCancel=()=>{
  	dispatch({
  		type:'projectManagement/showPublishDetailsModal',
  		payload:{
  			publishVisible:false,
				}
    });
	};

  const hadleAuditPass=()=>{}
  const auditInfo=()=>{
		if(currentRecord.auditInfo){
      const picListData = currentRecord.auditInfo.imgs.map(item=>({
        src:item.url,
        title:'',
        id:item.url,
      }))
			return(
				<div>
					<h4>审核说明</h4>
					<span>{currentRecord.auditInfo.text}</span>
          <PicList picListData={picListData}/>
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
      const picListData = currentRecord.rejectExplain.imgs.map(item=>({
        src:item.url,
        title:'',
        id:item.url,
      }))
			return(
				<div className="rejectExplain">
					<h4>驳回说明</h4>
					<span>{currentRecord.rejectExplain.text}</span>
          <PicList picListData={picListData}/>
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
      const picListData = currentRecord.auditExplain.imgs.map(item=>({
        src:item.url,
        title:'',
        id:item.url,
      }))
			return(
				<div>
					<h4>审核说明</h4>
					<span>{currentRecord.auditExplain.text}</span>
          <PicList picListData={picListData}/>
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
  const showFooterButton=()=>{
    console.log('currentRecord',currentRecord);
		let footer=[];
		if(currentRecord.status==='驳回发布'){
			footer=[
				<Button key="close" type="ghost" size="large" onClick={handleCancel}>关闭</Button>
			];
			return footer;
		}else if(currentRecord.status==='发布申请'){
			footer=[
				<Button key="back" type="ghost" size="large" onClick={handleCancel}>返回</Button>,
				<Button key="publishWithdraw" type="primary" size="large" onClick={()=>publishWithdraw(currentRecord)}>撤回发布</Button>,
			];
			return footer;
		}else{
			footer=[<Button key="close" type="ghost" size="large" onClick={handleCancel}>关闭</Button>,];
			return footer;
		}
	};
  const publishWithdraw=(currentRecord)=>{
    dispatch({
      type:"projectManagement/publishWithdraw",
      payload:{
        id:currentRecord.key
      }
    })
  }
  const showOffLineModal=(currentRecord)=>{
    dispatch({
      type:"projectManagement/getBriefInfo",
      payload:{
        projectId:currentRecord.key
      }
    })
    dispatch({
      type:"projectManagement/showPublishDetailsModal",
      payload:{
        publishVisible:false,
      }
    })
    dispatch({
      type:"projectManagement/releaseAuditModal",
      payload:{
        releaseAuditVisible:true,
      }
    })
    dispatch({
      type:"projectManagement/saveOffLineData",
      payload:{
        projectId:currentRecord.key,
        currentRecord:currentRecord
      }
    })
  }
  const showRefunReasonImgs=()=>{
		if(!!publishImages&&publishImages.length!==0){
      const picListData = publishImages.map(item=>({
        src:item,
        title:'',
        id:item,
      }))
			return(
        <PicList picListData={picListData}/>
			);
		}
	};
  const showCompleteBusiness=()=>{
    return(
      <div className="complete">
        {!!publishReason?publishReason:null}
      </div>
    )
  }
  const showTransferInformation=()=>{

  }
  const showAuditInfo=()=>{
		let imgs;
		if(!!auditInfos){
			return(
				<div className="auditInfo">
					<Timeline>
						{
							auditInfos.map((item,index)=>{
                const picListData = item.images.map(item=>({
                  src:item,
                  title:'',
                  id:item,
                }))
								// imgs=item.images.map((i,ind)=>{
								// 	return(
								// 		<li key={i}>
								// 			<img className="toogleImgWidth"src={i} alt="图片加载失败" key={`${i}a`}/>
								// 		</li>
								// 	)
								// })
								return(
									<Timeline.Item key={index}>
										{item.auditInfo}
										{!!item.reason?<p style={{color:item.auditInfo.indexOf('驳回')>0?"red":"#009900"}}>{item.auditInfo.indexOf('驳回')>0?`驳回理由:${item.reason}`:`审核说明:${item.reason}`}</p>:null}
										{/*<ul className="imgUl">{imgs}</ul>*/}
                    <PicList picListData={picListData}/>
									</Timeline.Item>
								)
							})
						}
					</Timeline>
				</div>
			)
		}
	};
  // const showAuditInfo=()=>{
	// 	if(!!publishAuditContent&&publishAuditContent.length!==0){
	// 		return(
	// 			<div className="auditInfo">
	// 				<Timeline>
	// 					{
	// 						publishAuditContent.map((item,index)=>{
	// 							return(
	// 								<Timeline.Item key={index}>
	// 									{item}
	// 								</Timeline.Item>
	// 							)
	// 						})
	// 					}
	// 				</Timeline>
	// 			</div>
	// 		)
	// 	}
	// };
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
      className="secondHandRefundAuditModal"
      visible={publishVisible}
      maskClosable={true}
      title='项目发布审核'
      onCancel={handleCancel}
      footer={showFooterButton()}>
      <div className="showDetailsModal">
        {/*<Steps current={stepState.current} status={stepState.status}>
          <Step description={stepState.description0} title="项目发布" />
          <Step description={stepState.description1} title="项目审核" />
          <Step description={stepState.description2} title="项目上线" />
        </Steps>*/}
        <DxSteps current={isNull(stepState.current,0)} status={isNull(stepState.status,'process')}>
          {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
        </DxSteps>
        <DxPanelMini title='发布项目'>
          <Table
            dataSource={!!publishDetailsData?publishDetailsData:[]}
            columns={columns}
            pagination={false}
          />
        </DxPanelMini>
        <DxPanelMini title='项目说明' hasPadding={true}>
          <div>
            {showCompleteBusiness()}
            {showRefunReasonImgs()}
          </div>
        </DxPanelMini>
        <DxPanelMini title='审核进度' hasPadding={true}>
          {showAuditInfo()}
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
function mapStateToProps({projectManagement}){
  return{projectManagement}
}
export default connect(mapStateToProps)(NewHousePulishDetailsModal)
