import React from  'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, message,Timeline,Icon,Row,Col } from 'antd';
import {routerRedux} from 'dva/router'
import {isNull} from '../../../../commons/utils/currencyFunction'
import PicList from '../../../../commons/UI/PicList'
import DxPanelMini from '../../../../commons/components/DxPanelMini'
// import './showDetailsModal.css'
const Step = Steps.Step;
const confirm=Modal.confirm;
import {DxSteps,DxStep} from '../../../../commons/View/DxSteps'
let stepState={};
function NewHouseDetailsModal({dispatch,projectManagement}){
  const {
    reasonImages,
    offlineReason,
    detailsModal,
    detailsTableData,
    completeBusiness,
    resultReason,
    resultInfos,
    transferInformation,
    auditInfos,
  }=projectManagement;
  const {visible,currentRecord}=detailsModal;
  console.log('currentRecord',currentRecord);
  switch(currentRecord.nextStatus){
    case '等待审核':
      stepState={
        current:0,
        status:'waiting',
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
  		title:'带看数',
  		dataIndex:'resourcesInfo',
      render:(text)=>currentRecord.lookNumber,
  	},{
  		title:'已售优惠',
  		dataIndex:'discount',
  	},{
  		title: '成交套数',
  		dataIndex: 'totalPrice',
      render:(text)=>currentRecord.transactions,
  	},{
  		title:'创建时间',
  		dataIndex:'createDateTime',
  	},
    // {
  	// 	title:'下架时间',
  	// 	dataIndex:'offLineTime',
  	// },
    {
      title:"创建人",
      dataIndex:"createUser"
    },{
      title:"房源销控",
      dataIndex:"sellTotle"
    }
    // ,{
  	// 	title: '操作',
  	// 	dataIndex:'operation',
  	// 	render:(text,record)=>{
  	// 		return(
  	// 			<a style={{color:'#009900'}} onClick={()=>toDealDetail(currentRecord)}>交易详情</a>
  	// 		)
  	// 	}
  	// }
  ];
  const toDealDetail=(currentRecord)=>{
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
  		type:'projectManagement/showDetailsModal',
  		payload:{
  			visible:false,
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
  const showOffLineModal=(record)=>{
    dispatch({
      type:"projectManagement/showDetailsModal",
      payload:{
        visible:false,
      }
    })
    dispatch({
      type:"projectManagement/showOffLineModal",
      payload:{
        visible:true,
      }
    })
    dispatch({
      type:"projectManagement/saveOffLineData",
      payload:{
        projectId:record.key,
        currentRecord:record
      }
    })
  }
  const showFooterButton=()=>{
		let footer=[];
    console.log('currentRecord',currentRecord);
    if(currentRecord.status === '下架申请'){
      footer=[
        <Button key="acceptance" type="primary" size="large" onClick={handleCancel}>关闭</Button>,
        <Button key="reacceptance" type="primary" size="large" onClick={()=>offlineWithdraw(currentRecord)}>撤回下架</Button>,
      ];
    }
    else{
      footer=[
        <Button key="acceptance" type="primary" size="large" onClick={handleCancel}>关闭</Button>
      ];
    }
    return footer;
		// if(currentRecord.projectStatusType==='下架'){
    //   if(currentRecord.status==="驳回下架"){
    //     footer=[
    //       <Button key="acceptance" type="primary" size="large" onClick={handleCancel}>关闭</Button>,
    //       <Button key="reacceptance" type="primary" size="large" onClick={()=>offlineAgain(currentRecord)}>重新下架</Button>,
    //     ];
    //     return footer;
    //   }else if(currentRecord.status==='下架申请'){
    //     footer=[
    //       <Button key="acceptance" type="primary" size="large" onClick={handleCancel}>关闭</Button>,
    //       <Button key="reacceptance" type="primary" size="large" onClick={()=>offlineWithdraw(currentRecord)}>撤回下架</Button>,
    //     ];
    //     return footer;
    //   }
		// }else if(currentRecord.status==="发布申请"){
		// 	footer=[
		// 		<Button key="back" type="primary" size="large" onClick={handleCancel}>返回</Button>,
		// 		<Button type="primary" size="large">撤回发布</Button>,
		// 	];
		// 	return footer;
		// }else{
		// 	footer='';
		// 	return footer;
		// }
	};
  const offlineWithdraw=(currentRecord)=>{
    dispatch({
      type:"projectManagement/showDetailsModal",
      payload:{visible:false}
    })
    dispatch({
      type:"projectManagement/offlineWithdraw",
      payload:{
        projectId:currentRecord.id
      }
    })
  }
  const offlineAgain=(currentRecord)=>{
    dispatch({
      type:"projectManagement/showDetailsModal",
      payload:{
        visible:false
      }
    })
    dispatch({
      type:"projectManagement/showOffLineModal",
      payload:{
        visible:true,
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
		if(!!reasonImages&&reasonImages.length!==0){
      const picListData = reasonImages.map(item=>({
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
        {!!offlineReason?offlineReason:null}
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
								{/*imgs=item.images.map((i,ind)=>{
									return(
										<li key={i}>
											<img className="toogleImgWidth"src={i} alt="图片加载失败" key={`${i}a`}/>
										</li>
									)
								})*/}
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

  const stepList = [
    {
      title:'申请下架',
      description:stepState.description0,
    },{
      title:'下架审核',
      description:stepState.description1,
    },{
      title:'项目已下架',
      description:stepState.description2,
    }
  ]
  return(
    <Modal
      className="secondHandRefundAuditModal"
      visible={visible}
      maskClosable={true}
      title='新房项目申请下架'
      onCancel={handleCancel}
      footer={showFooterButton()}>
      <div className="showDetailsModal">
        {/*<Steps current={stepState.current} status={stepState.status}>
          <Step description={stepState.description0} title="申请下架" />
          <Step description={stepState.description1} title="下架审核" />
          <Step description={stepState.description2} title="项目已下架" />
        </Steps>*/}
        <DxSteps current={isNull(stepState.current,0)} status={isNull(stepState.status,'process')}>
          {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
        </DxSteps>
        <DxPanelMini title='下架房源'>
          <Table
            dataSource={!!detailsTableData?detailsTableData:[]}
            columns={columns}
            pagination={false}
          />
        </DxPanelMini>
        <DxPanelMini title='下线理由' hasPadding={true}>
          <div>
            {showCompleteBusiness()}
            {showRefunReasonImgs()}
          </div>
        </DxPanelMini>
        {/*        <div>
                  <h4 className="title">申请下架时间</h4>
                  {
                    showTransferInformation()
                  }
                </div>*/}
        <DxPanelMini title='审核信息' hasPadding={true}>
          <div>
            {
              showAuditInfo()//审核信息
            }
            {
              showAuditExplain()//审核说明
            }
            {
              showRejectExplain()//审核说明
            }
          </div>
        </DxPanelMini>
      </div>
    </Modal>
  )
}
function mapStateToProps({projectManagement}){
  return{projectManagement}
}
export default connect(mapStateToProps)(NewHouseDetailsModal)
