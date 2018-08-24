// /**************************** 项目管理 项目发布审核详情 ****************************/
// import React, { PropTypes } from 'react'
// import { routerRedux,Link } from 'dva/router'
// import { connect } from 'dva'
// import {Table,Button,Checkbox} from 'antd'
// const CheckboxGroup = Checkbox.Group;
// import DxPanel from '../../../commons/components/DxPanel'
// import DxPanelMini from '../../../commons/components/DxPanelMini'
// import PromptModal from '../../../commons/View/PromptModal'
// import DxValueList from '../../../commons/UI/DxValueList'
// import TimeAxisList from '../../../commons/UI/TimeAxisList'
// import PicList from '../../../commons/UI/PicList'
// import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
// import {DxSteps,DxStep} from '../../../commons/View/DxSteps'
// import RevokeRefundModal from '../../components/RevokeRefundModal'
// import './ProjectOnlineAuditApplyInfo.css'
// const upLoadProps={
//   url:'/miss-anzhu-aliyun-file/putfile',
//   maxNum:5,
//   maxSize:2,
//   hideName:true,
//   showDetail:true,
//   doCover:false,
// };
// const tableColumns=[
//   {
//     title: '项目名称',
//     dataIndex: 'projectName',
//     key: 'projectName',
//   },{
//     title: '所在区域',
//     dataIndex: 'area',
//     key: 'area',
//   },{
//     title: '房源单价',
//     dataIndex: 'housesUnitPrice',
//     key: 'housesUnitPrice',
//   },{
//     title: '在售房源',
//     dataIndex: 'saleHouses',
//     key: 'saleHouses',
//   },{
//     title: '电商优惠',
//     dataIndex: 'groupBuyNum',
//     key: 'groupBuyNum',
//   },{
//     title: '创建人',
//     dataIndex: 'creater',
//     key: 'creater',
//   },{
//     title: '创建时间',
//     dataIndex: 'createTime',
//     key: 'createTime',
//   },{
//     title: '操作',
//     dataIndex: 'operation',
//     key: 'operation',
//     render:(text,record)=><Link className='anzhu_link' to={{
//       pathname:'/tradeManagement/newHouseTrade/projectDetails'
//       state:{
//         projectId:record.projectId,
//         projectName:record.projectName,
//       }
//     }}>项目详情</Link>
//   }
// ];
// const ProjectOnlineAuditApplyInfo=({dispatch,projectOnlineAuditApplyInfo:{
//   promptObj,
//   upLoadPicList,
//   auditorList,
//   orderInfo,
//   buttonLoading,
//   showDataInfo,
//   transCode,
//   current,
//   status,
//   canRevoke,
//   stepList,
//   revokeRefundModal,
// }})=>{
//   const showData=showDataInfo?JSON.parse(showDataInfo):{};
//
//   return (
//     <div className='projectOnlineAuditApplyInfo'>
//       {!!revokeRefundModal.visible && <RevokeRefundModal {...revokeRefundModal} applyCallBack={(data)=>dispatch({
//           type:'projectOnlineAuditApplyInfo/postRevokeRefundData',
//           payload:data,
//         })} closeModal={()=>dispatch({type:'projectOnlineAuditApplyInfo/closeRevokeRefund'})}/>}
//       <PromptModal {...promptObj} onOk={()=>dispatch({type:'projectOnlineAuditApplyInfo/closePrompt'})} onCancel={()=>dispatch({type:'projectOnlineAuditApplyInfo/closePrompt'})}/>
//       <DxPanel title='二手房出售贷款申请审核详情'>
//         <DxSteps current={current} status={status}>
//           {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
//         </DxSteps>
//         {/*<DxPanelMini title='发布项目'>
//           <Table dataSource={showDataInfo?[showData.orderInfo]:[]} rowKey={(record)=>`key_${record.transCode}`} columns={tableColumns} pagination={false}/>
//         </DxPanelMini>
//         <DxPanelMini title='项目说明' hasPadding={true}>
//           <DxValueList  valueList={showDataInfo?showData.loanInfo:[]}/>
//         </DxPanelMini>
//         <DxPanelMini title='审核状态' hasPadding={true}>
//           <TimeAxisList listData={showDataInfo?showData.auditInfo:[]}/>
//         </DxPanelMini>
//         <div className='anzhua_button_bottom'>
//           {!!canRevoke && <Button type='primary' onClick={()=>dispatch({
//             type:'projectOnlineAuditApplyInfo/readyRevokeApply',
//           })} loading={buttonLoading}>撤回申请</Button>}
//           <Button type={!!canRevoke?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
//         </div>*/}
//       </DxPanel>
//     </div>
//   )
// }
//
// ProjectOnlineAuditApplyInfo.propTypes = {
//   projectOnlineAuditApplyInfo: PropTypes.object,
//   location: PropTypes.object,
//   dispatch: PropTypes.func,
// }
// function mapStateToProps({projectOnlineAuditApplyInfo}) {
//   return {projectOnlineAuditApplyInfo}
// }
// export default connect(mapStateToProps)(ProjectOnlineAuditApplyInfo);
