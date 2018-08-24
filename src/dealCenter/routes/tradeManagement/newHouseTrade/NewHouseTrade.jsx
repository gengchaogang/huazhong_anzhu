import React, { PropTypes } from 'react'
import { routerRedux,Link} from 'dva/router'
import { connect } from 'dva'
import {Button,Icon,Table,Tabs,Popover,Modal,Input,Row, Col,Card,Select,Timeline}from 'antd'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import SearchInput from '../../../../commons/View/SearchInput'
import PromptModal from '../../../../commons/View/PromptModal'
import StepsModal from '../../../../commons/UI/StepsModal'
import LabelValueList from '../../../../commons/UI/LabelValueList'
import PayModal from '../../../components/PayModal'
import SelectProjectModal from '../../../components/NewHouseTrade/SelectProjectModal'
import NHEntrance from '../../../components/NewHouseTrade/NHEntrance'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import DxShowMsgForm from '../../../../commons/UI/DxShowMsgForm'
import PicList from '../../../../commons/UI/PicList'
import TimelineComponents from '../../../../commons/UI/tradeItems/TimelineComponents'
import DxConfirmModal from '../../../../commons/components/DxConfirmModal'
//
import {
  judgeJurisdiction,
} from '../../../../commons/utils/currencyFunction'
import ExportModal from '../../../../commons/UI/ExportModal'
import './NewHouseTrade.css'

const initProjectInfo={
  name:'尚未选择',
  img:'',
  basicInfos:[
    {
      label:'项目负责人',
      value:'',
    },{
      label:'联系电话',
      value:'',
    }
  ],
  tradeInfos:[
    {
      label:'已售团购',
      value:'',
    },{
      label:'已成交',
      value:'',
    },{
      label:'剩余套数',
      value:'',
    },{
      label:'项目结束时间',
      value:'',
    }
  ],
}
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:10,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
/*
//权限具体配置示例
// {!!permissions.get('驳回看房') && <p className='newhousedeal-operation-item' onClick={showModal}>驳回看房</p>}
// {!!permissions.get('处理看房') && <p className='newhousedeal-operation-item' onClick={()=>routePush('customerDoLook')}>处理看房</p>}
// {!!permissions.get('办理团购') && <p className='newhousedeal-operation-item' onClick={()=>routePush('creatGroupBuy')}>办理团购</p>}*/
//已团购操作
const groupBuyPopoverContent=(type,record,dispatch,projectId)=>{
  switch (type) {
    case '已团购':
      return(
        <div>
          <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
            pathname: '/tradeManagement/newHouseTrade/creatTransactions',
            state:{
              groupKey:record.groupKey,
              projectId:projectId,
            },
          }))}>办理成交</p>
          {!record.isUploadAgreement && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
            pathname: '/tradeManagement/newHouseTrade/uploadGroupBuyAgreement',
            state:{
              groupKey:record.groupKey,
              groupBuyId:record.groupBuyId,
              projectId:projectId,
            },
          }))}>补缴协议</p>}
          {/*!!record.isUploadAgreement && <p className='newhousedeal-operation-item' onClick={()=>dispatch({type:'newHouseTrade/getStepsModalData',payload:{
            record,
            type:'applyGroupBuyRefund'
          }})}>申请退款</p>*/}
          {!!record.isUploadAgreement && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
            pathname:'/tradeManagement/newHouseTrade/nhGroupBuyRefundApply',
            state:{
              groupBuyId:record.groupBuyId,
              groupKey:record.groupKey,
            }
          }))}>申请退款</p>}
        </div>
      )
    case '申请退款':
    // console.log('record',record);
      return(
        <div>
          <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
            pathname: '/tradeManagement/newHouseTrade/creatTransactions',
            state:{
              groupKey:record.groupKey,
              projectId:projectId,
            },
          }))}>办理成交</p>
        {/*record.refundStatus==='待合同审核' && <p className='newhousedeal-operation-item' onClick={()=>dispatch({type:'newHouseTrade/doTransaction',payload:record.groupBuyId})}>撤回申请</p>*/}
          {/*!!record.isUploadAgreement && <p className='newhousedeal-operation-item' onClick={()=>dispatch({type:'newHouseTrade/getStepsModalData',payload:{
            record,
            type:'applyGroupBuyRefund'
          }})}>申请退款</p>*/}
          {(record.refundStatus==='合同审核/已驳回' || record.refundStatus==='财务审核/已驳回') && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
            pathname:'/tradeManagement/newHouseTrade/nhGroupBuyRefundApply',
            state:{
              groupBuyId:record.groupBuyId,
              groupKey:record.groupKey,
            }
          }))}>申请退款</p>}
        </div>
      );
    case '待支付':
      return(
        <div>
          <p className='newhousedeal-operation-item' onClick={()=>dispatch({
            type:'newHouseTrade/getGroupBuyPayCode',
            payload:{
              groupBuyId:record.groupBuyId,
              groupKey:record.groupKey,
            },
          })}>立即支付</p>
          <p className='newhousedeal-operation-item' onClick={()=>dispatch({
            type:'newHouseTrade/cancelGroupBuyOrder',
            payload:{
              groupBuyId:record.groupBuyId,
              groupKey:record.groupKey,
            },
          })}>取消订单</p>
        </div>
      );
    default:
      return(
        <div>
          <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
            pathname: '/tradeManagement/newHouseTrade/creatTransactions',
            state:{
              groupKey:record.groupKey,
              projectId:projectId,
            },
          }))}>办理成交</p>
          {!record.isUploadAgreement && <p className='newhousedeal-operation-item' onClick={()=>dispatch({type:'newHouseTrade/uploadAgreement',payload:record.groupBuyId})}>补缴协议</p>}
          {/*!!record.isUploadAgreement && <p className='newhousedeal-operation-item' onClick={()=>dispatch({type:'newHouseTrade/getStepsModalData',payload:{
            record,
            type:'applyGroupBuyRefund'
          }})}>申请退款</p>*/}
          {!!record.isUploadAgreement && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
            pathname:'/tradeManagement/newHouseTrade/nhGroupBuyRefundApply',
            state:{
              groupBuyId:record.groupBuyId,
              groupKey:record.groupKey,
            }
          }))}>申请退款</p>}
        </div>
      )
    }
}
const renderGroupBuyOpration=(record,dispatch,projectId)=>{
  // if(record.groupbuyStatus==='待支付'){
  //   return(<span className='newhousedeal-operation' onClick={()=>dispatch({
  //     type:'newHouseTrade/getGroupBuyPayCode',
  //     payload:{
  //       groupBuyId:record.groupBuyId,
  //       groupKey:record.groupKey,
  //     },
  //   })}>立即支付</span>)
  if(record.groupbuyStatus==='待支付'){
    return(
      <Popover placement='bottom' content={groupBuyPopoverContent('待支付',record,dispatch,projectId)} title={false} trigger="click">
        <span className='newhousedeal-operation'>业务办理</span>
      </Popover>
    );
  }else if(record.groupbuyStatus==='已团购'){
    return(
      <Popover placement='bottom' content={groupBuyPopoverContent('已团购',record,dispatch,projectId)} title={false} trigger="click">
        <span className='newhousedeal-operation'>业务办理</span>
      </Popover>
    );
  }else if(record.groupbuyStatus==='申请退款'){
    return(
      <Popover placement='bottom' content={groupBuyPopoverContent('申请退款',record,dispatch,projectId)} title={false} trigger="click">
        <span className='newhousedeal-operation'>业务办理</span>
      </Popover>
    );
  }
}
//团购状态操作
const renderGroupBuyStatus=(record,dispatch)=>{
  if(record.groupbuyStatus==='待支付'){
    return(<span style={{color:'#333333'}}>待支付</span>)
  }else if(record.groupbuyStatus==='已团购'){
    return(
      <div>
        <p style={{color:'#333333'}}>已团购</p>
        {!record.isUploadAgreement && <p style={{color:'#43B38D',cursor:'pointer'}}>未上传协议</p>}
      </div>
    );
  }else if(record.groupbuyStatus==='申请退款'){
    return(
      <div>
        <p style={{color:'#cccccc'}}>申请退款</p>
        {record.refundStatus==='待合同审核' && <Link className='deal_operation' to={{
          pathname:'/tradeManagement/newHouseTrade/nhGroupBuyRefundAuditInfo',
          state:{
            groupBuyId:record.groupBuyId,
            groupKey:record.groupKey,
          }
        }}>待合同审核</Link>}
        {record.refundStatus==='合同审核/已驳回' && <p style={{color:'#FF6A6A',cursor:'pointer'}} onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/newHouseTrade/nhGroupBuyRefundAuditInfo',
          state:{
            groupBuyId:record.groupBuyId,
            groupKey:record.groupKey,
          }
        }))}>合同审核/已驳回</p>}
        {record.refundStatus==='待财务审核' && <p style={{color:'#43B38D',cursor:'pointer'}} onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/newHouseTrade/nhGroupBuyRefundAuditInfo',
          state:{
            groupBuyId:record.groupBuyId,
            groupKey:record.groupKey,
          }
        }))}>待财务审核</p>}
        {record.refundStatus==='财务审核/已驳回' && <p style={{color:'#FF6A6A',cursor:'pointer'}} onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/newHouseTrade/nhGroupBuyRefundAuditInfo',
          state:{
            groupBuyId:record.groupBuyId,
            groupKey:record.groupKey,
          }
        }))}>财务审核/已驳回</p>}
        {record.refundStatus==='待退款' && <p style={{color:'#43B38D',cursor:'pointer'}} onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/newHouseTrade/nhGroupBuyRefundAuditInfo',
          state:{
            groupBuyId:record.groupBuyId,
            groupKey:record.groupKey,
          }
        }))}>待退款</p>}
        {record.refundStatus==='已退款' && <p style={{color:'#43B38D',cursor:'pointer'}} onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/newHouseTrade/nhGroupBuyRefundAuditInfo',
          state:{
            groupBuyId:record.groupBuyId,
            groupKey:record.groupKey,
          }
        }))}>>已退款</p>}
      </div>
    );
  }
}
// const renderGroupBuyStatus=(record,dispatch)=>{
//   if(record.groupbuyStatus==='待支付'){
//     return(<span style={{color:'#333333'}}>待支付</span>)
//   }else if(record.groupbuyStatus==='已团购'){
//     return(
//       <div>
//         <p style={{color:'#333333'}}>已团购</p>
//         {!record.isUploadAgreement && <p style={{color:'#43B38D',cursor:'pointer'}}>未上传协议</p>}
//       </div>
//     );
//   }else if(record.groupbuyStatus==='申请退款'){
//     return(
//       <div>
//         <p style={{color:'#cccccc'}}>申请退款</p>
//         {record.refundStatus==='待合同审核' && <p style={{color:'#43B38D',cursor:'pointer'}} onClick={()=>dispatch({
//           type:'newHouseTrade/getStepsModalData',
//           payload:{
//             record,
//             type:'groupBuyRefundInfo'
//           },
//         })}>待合同审核</p>}
//         {record.refundStatus==='合同审核/已驳回' && <p style={{color:'#FF6A6A',cursor:'pointer'}} onClick={()=>dispatch({
//           type:'newHouseTrade/getStepsModalData',
//           payload:{
//             record,
//             type:'groupBuyRefundInfo'
//           },
//         })}>合同审核/已驳回</p>}
//         {record.refundStatus==='待财务审核' && <p style={{color:'#43B38D',cursor:'pointer'}} onClick={()=>dispatch({
//           type:'newHouseTrade/getStepsModalData',
//           payload:{
//             record,
//             type:'groupBuyRefundInfo'
//           },
//         })}>待财务审核</p>}
//         {record.refundStatus==='财务审核/已驳回' && <p style={{color:'#FF6A6A',cursor:'pointer'}} onClick={()=>dispatch({
//           type:'newHouseTrade/getStepsModalData',
//           payload:{
//             record,
//             type:'groupBuyRefundInfo'
//           },
//         })}>财务审核/已驳回</p>}
//         {record.refundStatus==='待退款' && <p style={{color:'#43B38D',cursor:'pointer'}} onClick={()=>dispatch({
//           type:'newHouseTrade/getStepsModalData',
//           payload:{
//             record,
//             type:'groupBuyRefundInfo'
//           },
//         })}>待退款</p>}
//         {record.refundStatus==='已退款' && <p style={{color:'#43B38D',cursor:'pointer'}}>已退款</p>}
//       </div>
//     );
//   }
// }
const creatReportOperation=({record,dispatch,routePush,selectProject})=>{
  const {status,serialNumber,groupKey}=record;
  switch (status){
    case '待受理':
      return <div>
        <p className='newhousedeal-operation-item' onClick={()=>dispatch({type:'newHouseTrade/acceptReport',payload:serialNumber})}>报备受理</p>
        <p className='newhousedeal-operation-item' onClick={()=>dispatch({type:'newHouseTrade/openRejectModal',payload:{id:record.serialNumber,type:'add'}})}>驳回看房</p>
        {/*<p className='newhousedeal-operation-item' onClick={()=>routePush('customerDoLook',{groupKey,hasIntentHouse:!!record.intentionHousingResources,projectId:selectProject})}>处理看房</p>
        <p className='newhousedeal-operation-item' onClick={()=>routePush('creatGroupBuy',{projectId:selectProject,groupKey,})}>办理团购</p>*/}
      </div>;
    case '待看房':
      return <div>
        <p className='newhousedeal-operation-item' onClick={()=>routePush('customerDoLook',{groupKey,hasIntentHouse:!!record.intentionHousingResources,projectId:selectProject})}>处理看房</p>
        <p className='newhousedeal-operation-item' onClick={()=>routePush('creatGroupBuy',{projectId:selectProject,groupKey,})}>办理团购</p>
      </div>;
    default:
      return <div>{''}</div>;
  }
}
const creatViewOperation=({record,dispatch,routePush,selectProject})=>{
  //permissions权限判断
  if(1===1){
    return<div>
      <p className='newhousedeal-operation-item' onClick={()=>routePush('customerDoLook',{groupKey:record.groupKey,hasIntentHouse:!!record.intentHouseId,projectId:selectProject})}>处理看房</p>
      <p className='newhousedeal-operation-item' onClick={()=>routePush('creatGroupBuy',{
          projectId:selectProject,
          groupKey:record.groupKey,
        })}>办理团购</p>
    </div>
  }
}
const placeholdershow=(key)=>{
  let _key='';
  if(key=='hasReported'){
    _key='请在此输入筛选关键字进行搜索，支持报备经纪人，报备客户，客户手机号'
    return _key
  }else if(key=='hasConfirmed'){
    _key='请在此输入筛选关键字进行搜索，支持带看经纪人，经纪人电话，确看客户，联系电话'
    return _key
  }else if(key=='hasGroupPurchase'){
    _key='请在此输入筛选关键字进行搜索，支持客户姓名，联系电话'
    return _key
  }else{
    _key='请在此输入筛选关键字进行搜索，支持带看经纪人，客户姓名，联系电话，成交房源'
    return _key
  }
}
'请在此输入筛选关键字进行搜索，例如客户姓名，经纪人姓名'
const NewHouseTrade = ({ children, location, dispatch,newHouseTrade}) => {
  const {
    promptObj,
    lockProject,
    selectProject,
    rejectModel,
    activeTableData,
    tableLoading,
    tabsActiveKey,
    entrance,
    pagination,
    projectName,
    projectInfo,
    selectProjectModal,
    payModal,
    refundModal,
    confirmModal,
    loading,
    exportModal,
    stepsAuditingModalState,
  }=newHouseTrade;
  //选择项目select
  // const selectProjectProps=lockProject?{
  //     disabled:true,
  //     value:selectProject,
  //   }:{
  //     placeholder:'请选择项目',
  //     onSelect:(value,e)=>{
  //       dispatch({
  //         type:'newHouseTrade/setSelectProject',
  //         payload:{
  //           id:value,
  //           name:e.props.children,
  //         },
  //       })
  //     }
  // };
  //路由跳转
  const routePush=(path,state)=>{
    if(!!state){
      if(path && path.length!==0){
        dispatch(routerRedux.push({
          pathname: `/tradeManagement/newHouseTrade/${path}`,
          state,
        }));
      }
    }else{
      if(path && path.length!==0){
        dispatch(routerRedux.push({
          pathname: `/tradeManagement/newHouseTrade/${path}`,
        }));
      }
    }

  }
  //搜索框
  const searchInputProps={
    type:'button',
    placeholder:placeholdershow(tabsActiveKey),
    searchFuc:(value)=>{dispatch({type:'newHouseTrade/filterTableData',payload:value})},
    clearFuc:()=>dispatch({type:'newHouseTrade/filterTableData',payload:''})
  }
  //表格上方tag切换回调
  const tableTagOnChange=(key)=>{
    dispatch({
      type:'newHouseTrade/updateTabsActiveKey',
      payload:key,
    });
  }
  //设置模拟数据
  //已报备
  const showModalRefind=()=>{
    dispatch({
      type:'newHouseTrade/hanleRefund'
    })
  }
  const handleRefundOk=()=>{
    dispatch({
      type:'newHouseTrade/handleRefundOk'
    })
  }
  const handleRefundCancel=()=>{
    dispatch({
      type:'newHouseTrade/handleRefundCancel'
    })
  }
  const preferentialInformation={
    columns:[
      {
        title: '退款类型',
        dataIndex: 'refindPic',
        key: 'refindPic',
      },{
        title: '支付项目',
        dataIndex: 'paymentItems',
        key: 'paymentItems',
      },{
        title: '订单订单',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },{
        title: '支付方式',
        dataIndex: 'payAway',
        key: 'payAway',
      },{
        title: '支付流水号',
        dataIndex: 'paySerialNumber',
        key: 'paySerialNumber',
      },{
        title: '支付客户',
        dataIndex: 'payCustomer',
        key: 'payCustomer',
      },{
        title: '客户电话',
        dataIndex: 'customerPhone',
        key: 'customerPhone',
      },{
        title: '支付时间',
        dataIndex: 'payTime',
        key: 'payTime',
      },{
        title: '支付金额',
        dataIndex: 'payCash',
        key: 'payCash',
      },{
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
      },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
      },
    ],
    dataSource:[
      {
        key:'001',
        refindPic:"电商团购",
        paymentItems:"远洋山水",
        orderNumber:332005469041,
        payAway:"POS机支付/工商银行",
        paySerialNumber:65535,
        payCustomer:"张三",
        customerPhone:"15120050558",
        payTime:"2016-10-24 19:00",
        payCash:"10000元",
        payStatus:"已支付",
        operation:"交易详情"
      },
    ],
  };
  /*
  *以下为各个表格配置props
  */
  //分页变化回调函数
  const paginationOnChange=(current)=>{
    dispatch({
      type:'newHouseTrade/getPageTableData',
      payload:current,
    });
  }
  //tabs表格通用props
  // console.log(pagination,'paginationpaginationpagination');
  const generalTableProps={
    dataSource:activeTableData,
    loading:tableLoading,
    pagination:{
      total: pagination.total,
      current:pagination.current,
      pageSize:10,
      onChange:paginationOnChange,
      showQuickJumper:true,
    },
  }
  //已报备
  const hasReportedTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      }, {
        title: '报备经纪人',
        dataIndex: 'filingBroker',
      }, {
        title: '报备客户',
        dataIndex: 'reportCustomer',
      },{
        title: '客户手机号',
        dataIndex: 'customerPhoneNumber',
      },{
        title:'性别',
        dataIndex:'Gender',
      },{
        title:'报备时间',
        dataIndex:'reportTime',
      },{
        title:'预约看房时间',
        dataIndex:'bookingRoomTime',
      },{
        title:'物业类型',
        dataIndex:'propertyType',
        sorter: (a, b) => a- b,
      },{
        title:'意向房源',
        dataIndex:'intentionHousingResources',
      },{
        title:'状态',
        dataIndex:'status',
        sorter: (a, b) => a- b,
        render:(text,obj)=>{
          if(text==='已驳回'){
            return<div><p style={{color:'#FF6A6A'}}>已驳回</p><p style={{color:'#43B38D',cursor:'pointer'}}
              onClick={()=>dispatch({type:'newHouseTrade/openRejectModal',payload:{reson:obj.reasonForRejection,type:'show'}})}>驳回理由</p></div>
          }else{
            return text
          }
        },
      },{
        title:'操作',
        dataIndex:'operation',
        render:(id,record)=><div>{(record.status==='已驳回' || record.status==='已看房' || record.status==='已取消' || record.status==='已爽约')?'':<Popover placement='bottom' content={creatReportOperation({record,dispatch,routePush,selectProject})} title={false} trigger="click">
          <span className='newhousedeal-operation'>业务办理</span>
        </Popover>}
        </div>,
      }
    ],
  }
  //已确看
  const hasConfirmedTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      }, {
        title: '带看经纪人',
        dataIndex: 'agent',
      }, {
        title: '经纪人电话',
        dataIndex: 'agentPhoneNumber',
      },{
        title: '确看客户',
        dataIndex: 'customer',
      },{
        title:'联系电话',
        dataIndex:'customerPhoneNumber',
      },{
        title:'物业类型',
        dataIndex:'propertyType',
        sorter: (a, b) => a- b,
      },{
        title:'意向房源',
        dataIndex:'intentionHousingResources',
      },{
        title:'客户保护期',
        dataIndex:'protectionPeriod',
        sorter: (a, b) => a- b,
      },{
        title:'看房状态',
        dataIndex:'houseStatus',
        render:text=><span style={{color:'#43B38D'}}>{text}</span>
      },{
        title:'看房时间',
        dataIndex:'houseTime',
      },{
        title:'操作',
        dataIndex:'operation',
        //权限判断
        render:(text,record)=><div>
            {1===1?<Popover placement='bottom' content={creatViewOperation({record,dispatch,routePush,selectProject})} title={false} trigger="click">
              <span className='newhousedeal-operation'>业务办理</span>
            </Popover>:''}
           {1===1?<span className='newhousedeal-operation' onClick={()=>routePush('newHouseTradeInfoDetails',{groupKey:record.groupKey})}>确看记录</span>:''}
        </div>,
      }
    ],
  }
  //已团购
  const hasGroupPurchaseTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      },{
        title: '客户姓名',
        dataIndex: 'customer',
      },{
        title:'联系电话',
        dataIndex:'customerPhoneNumber',
      },{
        title:'物业类型',
        dataIndex:'propertyType',
        sorter: (a, b) => a- b,
      },{
        title:'意向房源',
        dataIndex:'intentionHousingResources',
      },{
        title:'已购团购',
        dataIndex:'hasGroupBuy',
        sorter: (a, b) => a- b,
      },{
        title:'团购时间',
        dataIndex:'groupBuyTime',
      },{
        title:'团购金额',
        dataIndex:'groupBuyAmount',
      },{
        title:'状态',
        dataIndex:'status',
        render:(status,record)=><div>{renderGroupBuyStatus(record,dispatch)}</div>,
      },{
        title:'操作',
        dataIndex:'operation',
        render:(text,record)=><div>
        {renderGroupBuyOpration(record,dispatch,selectProject)}
        <span className='newhousedeal-operation' onClick={()=>dispatch(
          routerRedux.push({
            pathname: '/tradeManagement/newHouseTrade/newHouseTradeInfoDetails',
            state:{
              groupKey:record.groupKey,
            },
          })
        )}>详情</span>
      </div>,
      }
    ],
  }
  //已成交
  const hasTradedTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      },{
        title: '带看经纪人',
        dataIndex: 'agent',
      },{
        title: '客户姓名',
        dataIndex: 'customer',
      },{
        title:'联系电话',
        dataIndex:'customerPhoneNumber',
      },{
        title:'成交类型',
        dataIndex:'dealType',
        sorter: (a, b) => a- b,
      },{
        title:'成交房源',
        dataIndex:'dealHousingResources',
      },{
        title:'成交时间',
        dataIndex:'dealTime',
      },{
        title:'成交优惠',
        dataIndex:'dealDiscount',
      },{
        title:'成交金额',
        dataIndex:'dealAmount',
      },{
        title:'成交状态',
        dataIndex:'dealStatus',
        render:(text,record)=><div>
        <p style={{color:'#43B38D'}}>已成交</p>
        {/*record.txStatus==='未申请审核' && <p style={{color:'#43B38D',cursor:'pointer'}} onClick={()=>dispatch(routerRedux.push({
          pathname: '/tradeManagement/newHouseTrade/uploadGroupBuyAgreement',
          state:{
            groupKey:payModal.groupKey,
            groupBuyId:payModal.groupBuyId,
            projectId:selectProject,
          },
        }))}>未申请审核</p>*/}
        {/*record.txStatus!=='未申请审核' && <p style={{color:`${(!!record.isFinish && !record.isAllow)?'#FF6A6A':'#43B38D'}`,cursor:'pointer'}} onClick={()=>dispatch({
            type:'newHouseTrade/getStepsModalData',
            payload:{
              record,
              type:'applyTransAuditing',
            },
          })}>{text}</p>*/}

        {record.txStatus==='未申请审核' && <p style={{color:'#43B38D',cursor:'pointer'}} onClick={()=>dispatch(routerRedux.push({
          pathname: '/tradeManagement/newHouseTrade/nhCommitApply',
          state:{
            groupKey:record.groupKey,
          },
        }))}>未申请审核</p>}
        {record.txStatus!=='未申请审核' && <p style={{color:`${(!!record.isFinish && !record.isAllow)?'#FF6A6A':'#43B38D'}`,cursor:'pointer'}} onClick={()=>dispatch(routerRedux.push({
          pathname: '/tradeManagement/newHouseTrade/nhCommitAuditInfo',
          state:{
            groupKey:record.groupKey,
          },
        }))}>{text}</p>}
      </div>
      },{
        title:'操作',
        dataIndex:'operation',
        render:(text,record)=><span className='newhousedeal-operation' onClick={()=>dispatch(
          routerRedux.push({
            pathname: '/tradeManagement/newHouseTrade/newHouseTradeInfoDetails',
            state:{
              groupKey:record.groupKey,
            },
          })
        )}>详情</span>,
      }
    ],
  }
  //报错提示框回调判断
  const promptOk=()=>{
    dispatch({
      type:'newHouseTrade/closePrompt',
    })
  }
  const promptCancel=()=>{
    dispatch({type:'newHouseTrade/closePrompt'})
  }
  const payModalProps={
    orderInfo:payModal.orderInfo==null?{}:JSON.parse(payModal.orderInfo),
    loading:payModal.loading,
    serialNumber:payModal.serialNumber,
    orderModal:{
      title:'电商优惠订单',
      visible:payModal.visible,
      okText:'提交订单',
    },
    payModal:{
      visible:false,
    },
    type:'customer',
    closeOrder(){
      dispatch({
        type:'newHouseTrade/closeBuyModal'
      })
    },
    creatOrder(data){
      dispatch({
        type:'newHouseTrade/payGroupBuy',
        payload:data,
      })
    },
    paySuccess(){
      dispatch(
        routerRedux.push({
          pathname: '/tradeManagement/newHouseTrade/uploadGroupBuyAgreement',
          state:{
            groupKey:payModal.groupKey,
            groupBuyId:payModal.groupBuyId,
            projectId:selectProject,
          },
        })
      )
    },
  }
  const stepsModalProps={
    title:stepsAuditingModalState.title,
    visible:stepsAuditingModalState.visible,
    stepList:stepsAuditingModalState.stepList,
    onCancel:()=>dispatch({
      type:'newHouseTrade/closeStepsAuditingModal'
    }),
    width:1000,
    stepStatus:stepsAuditingModalState.stepStatus,
    current:stepsAuditingModalState.current,
    footer:renderStepModalFooter(stepsAuditingModalState,dispatch),
  }
  const projectInfoData=!!projectInfo?JSON.parse(projectInfo):initProjectInfo;
  //确认模态框
  const confirmModalProps={
    ...confirmModal,
    width:'400px',
    onClose:()=>dispatch({
      type:'newHouseTrade/closeComfirmModal',
    }),
    onCancel:()=>dispatch({
      type:'newHouseTrade/closeComfirmModal',
    }),
    onOk:()=>dispatch({
      type:'newHouseTrade/onOkComfirmModal',
    }),
    afterClose:()=>dispatch({
      type:'newHouseTrade/afterCloseComfirmModal',
    }),
  }
  //导出模态框
  const exportModalProps={
    ...exportModal,
    ...renderExportModalProps(tabsActiveKey,selectProject,projectName),
    onCancel:()=>dispatch({
      type:'newHouseTrade/closeExportTradeExcel'
    }),

  }
  return (
    <div className='newhousedeal'>
      {!!loading && <DxLoadingShadow visible={!!loading} zIndex={900}/>}
      <DxConfirmModal {...confirmModalProps}/>
      <PromptModal {...promptObj} onOk={promptOk} onCancel={promptCancel}/>
      <PayModal {...payModalProps}/>
      <ExportModal {...exportModalProps}/>
      <div className='anzhu_nh_project_contrl'>
        <div className='anzhu_panel'>
          <div className='nh_project_box'>
            <div className='nh_showProject'>
              <div className='nh_showProject_pic' style={{backgroundImage:`URL(${projectInfoData.img})`}}></div>
              <div className='nh_showProject_msg'>
                <div className='nh_showProject_projectName'>
                  <span>项目名称：</span>
                  <span>{projectInfoData.name}</span>
                </div>
                <LabelValueList list={projectInfoData.basicInfos}/>
                <LabelValueList list={projectInfoData.tradeInfos}/>
              </div>
              <div className='nh_showProject_opt'>
                <Button type='primary' onClick={()=>dispatch({type:'newHouseTrade/getProjectListData'})}>更换项目</Button>
              </div>
            </div>
          </div>
        </div>
        <NHEntrance list={entrance} clickCallBack={(path)=>routePush(path,{projectId:selectProject,projectName,})}/>
        <div style={{display:`${!!selectProject?'none':'block'}`}} className='newhousedeal_noProject_shadow'></div>
      </div>
      {!!selectProject && <div className='newhousedeal_searchBox'>
        <SearchInput {...searchInputProps}/>
      </div>}
      {!!selectProject && <div className='newhousedeal-main'>
        {<span className='renderTradeExcel' onClick={()=>dispatch({
            type:'newHouseTrade/openExportTradeExcel',
          })}>{renderExcelOpt(tabsActiveKey)}</span>}
        <Tabs onChange={tableTagOnChange} type='card' activeKey={tabsActiveKey}>
          <TabPane tab='已报备' key='hasReported'>
            <Table {...generalTableProps} rowClassName={creatReportedTabelColClassName} className='newhousedeal-table' {...hasReportedTableProps} />
          </TabPane>
          <TabPane tab='已确看' key='hasConfirmed'>
            <Table {...generalTableProps} className='newhousedeal-table' {...hasConfirmedTableProps} />
          </TabPane>
          <TabPane tab='已团购' key='hasGroupPurchase'>
            <Table {...generalTableProps} className='newhousedeal-table' {...hasGroupPurchaseTableProps} />
          </TabPane>
          <TabPane tab='已成交' key='hasTraded'>
            <Table {...generalTableProps} className='newhousedeal-table' {...hasTradedTableProps} />
          </TabPane>
        </Tabs>
      </div>}

      {/*以下为驳回理由的模态框*/}
      <Modal title="驳回理由" visible={rejectModel.visible}
        onOk={rejectModel.type==='add'?()=>dispatch({type:'newHouseTrade/uploadReject'}):()=>dispatch({type:'newHouseTrade/closeRejectModal'})} onCancel={()=>dispatch({type:'newHouseTrade/closeRejectModal'})} okText={rejectModel.type==='add'?'提交':'确定'}
        >
        <span>{rejectModel.type==='add'?'请输入驳回理由':'驳回理由：'}</span>
        {rejectModel.type==='add'?<Input type='textarea' placeholder="请输入驳回理由，文字不超过五十个字符"
          maxLength={50} autosize={{ minRows: 2, maxRows: 6 }} value={rejectModel.value} onChange={(e)=>dispatch({
            type:'newHouseTrade/changeRejectModalValue',
            payload:e.target.value,
          })}
        />:<p className='report_reject_content'>{rejectModel.value}</p>}
      </Modal>
      <StepsModal {...stepsModalProps}>
        {renderStepsModalChildren(stepsAuditingModalState,dispatch)}
      </StepsModal>
      {/*以下为选择项目模态框*/}
      <SelectProjectModal visible={selectProjectModal.visible} projectList={selectProjectModal.projectList} projectId={selectProject} onOk={(data)=>dispatch({
          type:'newHouseTrade/setSelectProject',
          payload:data,
        })} onCancel={()=>dispatch({
          type:'newHouseTrade/closeSelectProjectModal'
        })}/>
    </div>
  )
}

NewHouseTrade.propTypes = {
  newHouseTrade: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
//生成审核步奏模态框footer元素
function renderStepModalFooter(stepModal,dispatch){
  switch (stepModal.type) {
    case 'transApply':
      return (
        <div>
          <Button type='ghost' onClick={()=>dispatch({
              type:'newHouseTrade/closeStepsAuditingModal'
            })}>取消</Button>
          <Button type='primary' onClick={()=>dispatch({
              type:'newHouseTrade/postTransApplyData',
            })}>提交成交申请</Button>
        </div>
      );
    case 'applyGroupBuyRefund':
      return (
        <div>
          <Button type='ghost' onClick={()=>dispatch({
              type:'newHouseTrade/closeStepsAuditingModal'
            })}>取消</Button>
          <Button type='primary' onClick={()=>dispatch({
              type:'newHouseTrade/postGroupBuyRefundApply',
            })}>提交团购退款申请</Button>
        </div>
      );
    case 'groupBuyRefundInfo':
      return (
        <div>
          <Button type='ghost' onClick={()=>dispatch({
              type:'newHouseTrade/closeStepsAuditingModal'
            })}>取消</Button>
          <Button type='primary' onClick={()=>dispatch({
              type:'newHouseTrade/revokeGroupBuyRefundApply',
            })}>撤回申请</Button>
        </div>
      );
    case 'applyTransAuditingInfo':
      return (
        <div>
          <Button type='ghost' onClick={()=>dispatch({
              type:'newHouseTrade/closeStepsAuditingModal'
            })}>取消</Button>
          <Button type='primary' onClick={()=>dispatch({
              type:'newHouseTrade/revokeApplyTrans',
              payload:stepModal.groupKey,
            })}>撤回申请</Button>
        </div>
      );
    case 'default':
      return <div></div>;
    default:
      return <div></div>;
  }
}
function groupBuyRefundTableProps(dispatch){
  return {
    pagination:false,
    columns:[
      {
        title:'退款类型',
        dataIndex:'refundType',
        key:'refundType',
      },{
        title:'支付项目',
        dataIndex:'projectName',
        key:'projectName',
      },{
        title:'支付订单',
        dataIndex:'orderNumber',
        key:'orderNumber',
      },{
        title:'支付方式',
        dataIndex:'payWay',
        key:'payWay',
      },{
        title:'支付流水号',
        dataIndex:'paySerialNumber',
        key:'paySerialNumber',
      },{
        title:'支付客户',
        dataIndex:'customerName',
        key:'customerName',
      },{
        title:'客户电话',
        dataIndex:'customerPhone',
        key:'customerPhone',
      },{
        title:'支付时间',
        dataIndex:'payTime',
        key:'payTime',
      },{
        title:'支付金额',
        dataIndex:'payAmount',
        key:'payAmount',
      },{
        title:'支付状态',
        dataIndex:'payStatus',
        key:'payStatus',
      },{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render:(text,record)=><span className='newhousedeal-operation' onClick={()=>dispatch(
          routerRedux.push({
            pathname: '/tradeManagement/newHouseTrade/newHouseTradeInfoDetails',
            state:{
              groupKey:record.groupKey,
            },
          })
        )}>交易详情</span>
      }
    ]
  }
}


//生成退款申请、驳回模态框子项
function renderStepsModalChildren(stepModal,dispatch){
  // console.log('stepModal',stepModal.type);
  if(stepModal.type==='transApply'){//成交申请
    const transApplyTableColumns=[
      {
        title: '所属项目',
        dataIndex: 'project',
        key: 'project',
      },{
        title: '物业类型',
        dataIndex: 'propertyType',
        key: 'propertyType',
      },{
        title: '成交房源',
        dataIndex: 'intentionHouse',
        key: 'intentionHouse',
      },{
        title: '团购优惠',
        dataIndex: 'groupBuyType',
        key: 'groupBuyType',
      },{
        title: '实际成交单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },{
        title: '实际成交总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
      },{
        title: '成交佣金',
        dataIndex: 'commission',
        key: 'commission',
      },{
        title: '成交经纪人',
        dataIndex: 'agent',
        key: 'agent',
      },{
        title: '申请时间',
        dataIndex: 'time',
        key: 'time',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    //成交申请
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>成交详情</b>
        {!!applyData && <Table columns={transApplyTableColumns} dataSource={applyData.tableData} pagination={false}/>}
        <b style={{display:'block'}}>佣金分配</b>
        {!!applyData && <DxShowMsgForm msgData={applyData.orderInfo}/>}
        <b style={{display:'block'}}>申请说明</b>
        <Input value={stepModal.inputValue} onChange={(e)=>dispatch({
          type:'newHouseTrade/changeStepsAuditingModalInputValue',
          payload:e.target.value,
        })} addonAfter={`${stepModal.inputValue.length}/20`}/>
        <b style={{display:'block'}}>请上传申请原因图片</b>
        <DxUpLoadPic {...upLoadProps} showPicList={stepModal.upLoadPicList} changeList={(arr)=>dispatch({type:'newHouseTrade/changeStepsAuditingModalUploadPicList',payload:arr})}/>
        {stepModal.selectList.length!==0 && <div>
          <b style={{display:'block'}}>请选择审核人员</b>
          <Select
            showSearch
            style={{ width: 250 }}
            placeholder='请选择或搜索审核对象'
            optionFilterProp='children'
            value={!!stepModal.selectValue?stepModal.selectValue:''}
            onChange={(value)=>dispatch({
              type:'newHouseTrade/initStepsAuditingModalStateSelectChange',
              payload:value,
            })}
            filterOption={(input, option) => filterAuditor(input, option)}
          >
            {stepModal.selectList.map(item=><Option value={item.id} key={`auditor_${item.id}`}>{item.name}</Option>)}
          </Select>
        </div>}
      </div>
    )
  }else if(stepModal.type==='applyGroupBuyRefund'){//团购退款申请
    const groupBuyRefundApplyTableColumns=[
      {
        title:'退款类型',
        dataIndex:'refundType',
        key:'refundType',
      },{
        title: '支付项目',
        dataIndex: 'project',
        key: 'project',
      },{
        title: '支付订单',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },{
        title: '支付方式',
        dataIndex: 'payType',
        key: 'payType',
      },{
        title: '支付流水号',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
      },{
        title: '支付客户',
        dataIndex: 'customerName',
        key: 'customerName',
      },{
        title: '客户电话',
        dataIndex: 'customerPhone',
        key: 'customerPhone',
      },{
        title: '支付时间',
        dataIndex: 'payDateTime',
        key: 'payDateTime',
      },{
        title: '支付金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
      },{
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    //添加团购退款申请
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>订单信息</b>
        {!!applyData && <Table columns={groupBuyRefundApplyTableColumns} dataSource={applyData.tableData} pagination={false}/>}
        <b style={{display:'block'}}>退款理由</b>
        <Input value={stepModal.inputValue} onChange={(e)=>dispatch({
          type:'newHouseTrade/changeStepsAuditingModalInputValue',
          payload:e.target.value,
        })} addonAfter={`${stepModal.inputValue.length}/20`}/>
        <b style={{display:'block'}}>请上传退款理由图片</b>
        <DxUpLoadPic {...upLoadProps} showPicList={stepModal.upLoadPicList} changeList={(arr)=>dispatch({type:'newHouseTrade/changeStepsAuditingModalUploadPicList',payload:arr})}/>
        {stepModal.selectList.length!==0 && <div>
          <b style={{display:'block'}}>请选择审核人员</b>
          <Select
            showSearch
            style={{ width: 250 }}
            placeholder='请选择或搜索审核对象'
            optionFilterProp='children'
            value={!!stepModal.selectValue?stepModal.selectValue:''}
            onChange={(value)=>dispatch({
              type:'newHouseTrade/initStepsAuditingModalStateSelectChange',
              payload:value,
            })}
            filterOption={(input, option) => filterAuditor(input, option)}
          >
            {stepModal.selectList.map(item=><Option value={item.id} key={`auditor_${item.id}`}>{item.name}</Option>)}
          </Select>
        </div>}
      </div>
    )
  }else if(stepModal.type==='groupBuyRefundInfo'){//团购退款审核详情
    const groupBuyRefundApplyTableColumns=[
      {
        title:'退款类型',
        dataIndex:'refundType',
        key:'refundType',
      },{
        title: '支付项目',
        dataIndex: 'project',
        key: 'project',
      },{
        title: '支付订单',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },{
        title: '支付方式',
        dataIndex: 'payType',
        key: 'payType',
      },{
        title: '支付流水号',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
      },{
        title: '支付客户',
        dataIndex: 'customerName',
        key: 'customerName',
      },{
        title: '客户电话',
        dataIndex: 'customerPhone',
        key: 'customerPhone',
      },{
        title: '支付时间',
        dataIndex: 'payDateTime',
        key: 'payDateTime',
      },{
        title: '支付金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
      },{
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    //团购退款审核详情
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>订单信息</b>
        {!!applyData && <Table columns={groupBuyRefundApplyTableColumns} dataSource={applyData.tableData} pagination={false}/>}
        {!!applyData && <DxShowMsgForm msgData={applyData.applyInfo}/>}
        {(!!applyData.reasonPics && applyData.reasonPics.length!==0) && <PicList picListData={applyData.reasonPics}/>}
        {(!!applyData &&!!applyData.contractInfo) && <DxShowMsgForm msgData={applyData.contractInfo}/>}
        {(!!applyData &&!!applyData.contractRejectInfo) && <div style={{color:'red'}}><DxShowMsgForm msgData={applyData.contractRejectInfo}/></div>}
        {(!!applyData.contractPics && applyData.contractPics.length!==0) && <PicList picListData={applyData.contractPics}/>}
        {(!!applyData &&!!applyData.financialInfo) && <DxShowMsgForm msgData={applyData.financialInfo}/>}
        {(!!applyData &&!!applyData.financialRejectInfo) && <div style={{color:'red'}}><DxShowMsgForm msgData={applyData.financialRejectInfo}/></div>}
        {(!!applyData.financialPics && applyData.financialPics.length!==0) && <PicList picListData={applyData.financialPics}/>}
        {(!!applyData.refundSchedules && applyData.refundSchedules.length!==0) &&<div className='newHouseTrade_groupBuyRefund_timeList'>
          <b style={{display:'block'}}>退款进度</b>
          <Timeline>
            {applyData.refundSchedules.map((item,index)=><Timeline.Item key={`timeLine${index}`}>
            <span className='houseRecord-timeStamp'>{item.label}</span>
            <span className='houseRecord-content'>{item.value}</span>
            </Timeline.Item>)}
          </Timeline>
        </div>}
      </div>
    )
  }else if(stepModal.type==='applyTransAuditingInfo'){//成交申请审核详情
    const transApplyTableColumns=[
      {
        title: '所属项目',
        dataIndex: 'project',
        key: 'project',
      },{
        title: '物业类型',
        dataIndex: 'propertyType',
        key: 'propertyType',
      },{
        title: '成交房源',
        dataIndex: 'intentionHouse',
        key: 'intentionHouse',
      },{
        title: '团购优惠',
        dataIndex: 'groupBuyType',
        key: 'groupBuyType',
      },{
        title: '实际成交单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },{
        title: '实际成交总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
      },{
        title: '成交佣金',
        dataIndex: 'commission',
        key: 'commission',
      },{
        title: '成交经纪人',
        dataIndex: 'agent',
        key: 'agent',
      },{
        title: '申请时间',
        dataIndex: 'time',
        key: 'time',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    //团购退款审核详情
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>订单信息</b>
        {!!applyData && <Table columns={transApplyTableColumns} dataSource={applyData.tableData} pagination={false}/>}
        {(!!applyData &&!!applyData.orderInfo) && <DxShowMsgForm msgData={applyData.orderInfo}/>}
        {!!applyData && <DxShowMsgForm msgData={applyData.applyInfo}/>}
        {(!!applyData.applyPics && applyData.applyPics.length!==0) && <PicList picListData={applyData.applyPics}/>}
        {(!!applyData &&!!applyData.contractInfo) && <DxShowMsgForm msgData={applyData.contractInfo}/>}
        {(!!applyData &&!!applyData.contractRejectInfo) && <div style={{color:'red'}}><DxShowMsgForm msgData={applyData.contractRejectInfo}/></div>}
        {(!!applyData.contractPics && applyData.contractPics.length!==0) && <PicList picListData={applyData.contractPics}/>}
        {(!!applyData &&!!applyData.financialInfo) && <DxShowMsgForm msgData={applyData.financialInfo}/>}
        {(!!applyData &&!!applyData.financialRejectInfo) && <div style={{color:'red'}}><DxShowMsgForm msgData={applyData.financialRejectInfo}/></div>}
        {(!!applyData.financialPics && applyData.financialPics.length!==0) && <PicList picListData={applyData.financialPics}/>}
        {(!!applyData.refundSchedules && applyData.refundSchedules.length!==0) &&<div className='newHouseTrade_groupBuyRefund_timeList'>
          <b style={{display:'block'}}>退款进度</b>
          <Timeline>
            {applyData.refundSchedules.map((item,index)=><Timeline.Item key={`timeLine${index}`}>
            <span className='houseRecord-timeStamp'>{item.label}</span>
            <span className='houseRecord-content'>{item.value}</span>
            </Timeline.Item>)}
          </Timeline>
        </div>}
      </div>
    )
  }
}//
function creatReportedTabelColClassName(record, index){
  if(!!record.hasClass){
    return 'anzhu_table_col_bold';
  }else{
    return '';
  }
}
function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
function mapStateToProps({newHouseTrade}) {
  return {newHouseTrade}
}
function renderExcelOpt(key){
  if(key === 'hasReported'){
    return '导出已报备报表'
  }
  else if(key === 'hasConfirmed'){
    return '导出已确看报表'
  }
  else if(key === 'hasGroupPurchase'){
    return '导出已团购报表'
  }
  else if(key === 'hasTraded'){
    return '导出已成交报表'
  }
  else{
    return '导出已报备列表'
  }
}
//生成导出模态框 props
function renderExportModalProps(key,projectId,projectName){
  if(key === 'hasReported'){
    return{
      title:'导出已报备报表',
      path:`/miss-anzhu-newhouse-tx-report/reports/preExportExcel?projectId=${projectId}`,
      todo:'exportReported',
      fileName:`${projectName}_已报备_`,
    }
  }
  else if(key === 'hasConfirmed'){
    return{
      title:'导出已确看报表',
      path:`/miss-anzhu-newhouse-tx-view/viewed/preExportExcel?projectId=${projectId}`,
      todo:'exportConfirmed',
      fileName:`${projectName}_已确看_`,
    }
  }
  else if(key === 'hasGroupPurchase'){
    return{
      title:'导出已团购报表',
      path:`/miss-anzhu-newhouse-tx-groupbuy/groupbuy/preExportExcel?projectId=${projectId}`,
      todo:'exportGroupBuy',
      fileName:`${projectName}_已团购_`,
    }
  }
  else if(key === 'hasTraded'){
    return{
      title:'导出已成交报表',
      path:`/miss-anzhu-newhouse-tx-commit/tx/preExportExcel?projectId=${projectId}`,
      todo:'exportTraded',
      fileName:`${projectName}_已成交_`,
    }
  }
  else{
    return{
      title:'导出已报备报表',
      path:`/miss-anzhu-newhouse-tx-groupbuy/groupbuy/exportExcel?projectId=${projectId}`,
      todo:'exportReported',
      fileName:`${projectName}_已报备_`,
    }
  }
}
export default connect(mapStateToProps)(NewHouseTrade)
