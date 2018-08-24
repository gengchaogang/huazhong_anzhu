import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Form,Button,Icon,Table,Tabs,Popover,Modal,Input,Row, Col,Select,Checkbox}from 'antd'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
import DxPanel from '../../../../commons/components/DxPanel'
import StepsModal from '../../../../commons/UI/StepsModal'
import SearchInput from '../../../../commons/View/SearchInput'
import PromptModal from '../../../../commons/View/PromptModal'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import DxShowMsgForm from '../../../../commons/UI/DxShowMsgForm'
import TimeRecordList from '../../../../commons/UI/TimeRecordList'
import PicList from '../../../../commons/UI/PicList'
import DxPanelMini from '../../../../commons/components/DxPanelMini'
import TimelineComponents from '../../../../commons/UI/tradeItems/TimelineComponents'
import SHTradeRefundApplyModal from '../../../components/secondHouseSellTrade/SHTradeRefundApplyModal'
import RevokeRefundModal from '../../../components/RevokeRefundModal'

import DxConfirmModal from '../../../../commons/components/DxConfirmModal'
import './SecondHouseRentTrade.css'

const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:10,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};


const FormItem = Form.Item;

function SecondHouseRentTrade ({form,location, dispatch,secondHouseRentTrade}) {
  const{
    activeTabKey,
    promptObj,
    confirmModal,
    pagination,
    stepModal,
    activeTableData,
    activeTableDataBao,
    tableLoading,
    revokeRefundModal,
    rejectProcessingModel,//报成交申请驳回模态框
  }=secondHouseRentTrade;
  // tabs表格通用props
  const generalTableProps={
    dataSource:activeTableData,
    loading:tableLoading,
    rowKey:(record)=>record.transCode,
    pagination:{
      total: pagination.total,
      current:pagination.current,
      pageSize:10,
      onChange:(newPage)=>dispatch({
        type:'secondHouseRentTrade/getActiveTabTableData',
        payload:{
          pageNo:newPage,
        },
      }),
      showQuickJumper:true,
    },
  }
  const generalBaochengjiao={
    rowKey:(record)=>record.key,
    dataSource:activeTableDataBao,
    loading:tableLoading,
  }
  // 待处理表格props
  const getWaitProcessingTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      },
      {
        title: '报出租经纪人',
        dataIndex: 'brokerName',
      },{
        title: '联系电话',
        dataIndex: 'brokerPhone',
      },{
        title: '客户',
        dataIndex: 'customerName',
      },{
        title: '联系电话',
        dataIndex: 'customerPhone',
      },{
        title: '物业类型',
        dataIndex: 'propertyType',
      },{
        title: '房源信息',
        dataIndex: 'resourcesInfo',
        render:(text,record)=><span className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentHousesDetails',
          state:{
            transCode:record.transCode,
          },
        }))}>{text}</span>
      },{
        title: '成交方式',
        dataIndex: 'transactionMode',
      },{
        title: '报出租时间',
        dataIndex: 'reportDateTime',
      },{
        title: '预约办理时间',
        dataIndex: 'orderTime',
      },{
        title: '业务办理时间',
        dataIndex: 'handleDateTime',
      },{
        title: '状态',
        dataIndex: 'showStatus',
        render:(text,record)=><div>
        {text==='待处理' && <span className='deal_operation_noCursor'>待处理</span>}
        {text==='已驳回' && <Popover content={record.rejectReason} title='驳回原因'><span className='deal_reject_reson'>已驳回</span></Popover>}
      </div>
      },{
        title: '操作',
        dataIndex: 'operation',
        render:(text,record)=><div>
        {renderWaitProcessingOpration(record,dispatch)}
        {!record.hasClass && <span className='deal_operation' onClick={()=>dispatch(routerRedux.push({
            pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentTradeInfoDetails',
            state:{
              transCode:record.transCode,
            }
          }))}>详情</span>}
      </div>
    }
    ],
  }
  const baoChengJiao={
    columns:[
      {
        title: '客户姓名',
        dataIndex: 'ownerName',
      },
      {
        title: '客户电话',
        dataIndex: 'ownerPhone',
      },
      // {
      //   title: '电话',
      //   dataIndex: 'brokerPhone',
      // },
      {
        title: '经纪人',
        dataIndex: 'brokerName',
      },{
        title: '意向房源',
        dataIndex: 'houseName',
      },{
        title: '操作',
        dataIndex: 'operation',
        render:(text,record)=><span className='deal_operation' onClick={()=>dispatch({
            type:'secondHouseRentTrade/baoChengJiao',
            payload:{
              resourcesId:record.resourcesId,
              brokerId:record.brokerId,
              customerId:record.customerId,
              customerBrokerId:record.customerBrokerId,
              brokeUserId:record.brokeUserId,
              transactionMode:'合作成交',
              appointmentDatetime: "2018-07-06 09:59:00"
            }

          })}>{text}</span>
    }
    ],
  }
  //待成交表格props
  const getWaitTransactionTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      },
      {
        title: '经纪人',
        dataIndex: 'brokerName',
      },{
        title: '联系电话',
        dataIndex: 'brokerPhone',
      },{
        title: '客户',
        dataIndex: 'customerName',
      },
      // {
      //   title: '联系电话',
      //   dataIndex: 'customerPhone',
      // },
      {
        title: '物业类型',
        dataIndex: 'propertyType',
      },{
        title: '房源信息',
        dataIndex: 'resourcesInfo',
        render:(text,record)=><span className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentHousesDetails',
          state:{
            transCode:record.transCode,
          },
        }))}>{text}</span>
      },{
        title: '成交方式',
        dataIndex: 'transactionMode',
      },{
        title: '报成交时间',
        dataIndex: 'reportDateTime',
      },{
        title: '业务状态',
        dataIndex: 'showStatus',
        render:(text,record)=>renderWaitTransactionStatus(record,dispatch),
      },{
        title: '业务办理时间',
        dataIndex: 'handleDateTime',
      },{
          title: '操作',
          dataIndex: 'operation',
          render:(text,record)=><div>
          {renderWaitTransactionOpration(record,dispatch)}
          <span className='deal_operation' onClick={()=>dispatch(routerRedux.push({
              pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentTradeInfoDetails',
              state:{
                transCode:record.transCode,
              }
            }))}>详情</span>
        </div>
      }
    ],
  }
  //已成交表格props
  const getTransactionTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      },
      {
        title: '经纪人',
        dataIndex: 'brokerName',
      },{
        title: '联系电话',
        dataIndex: 'brokerPhone',
      },{
        title: '客户',
        dataIndex: 'customerName',
      },{
        title: '联系电话',
        dataIndex: 'customerPhone',
      },{
        title: '物业类型',
        dataIndex: 'propertyType',
      },{
        title: '房源信息',
        dataIndex: 'resourcesInfo',
        render:(text,record)=><span className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentHousesDetails',
          state:{
            transCode:record.transCode,
          },
        }))}>{text}</span>
      },{
        title: '成交方式',
        dataIndex: 'transactionMode',
      },{
        title: '报成交时间',
        dataIndex: 'reportDateTime',
      },{
        title: '业务状态',
        dataIndex: 'showStatus',
        render:(text,record)=>renderTransactionStatus(record,dispatch),
      },{
        title: '业务办理时间',
        dataIndex: 'handleDateTime',
      },{
          title: '操作',
          dataIndex: 'operation',
          render:(text,record)=><span className='deal_operation' onClick={()=>dispatch(routerRedux.push({
              pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentTradeInfoDetails',
              state:{
                transCode:record.transCode,
              }
            }))}>详情</span>
      }
    ],
  }
  const confirmModalProps={
    ...confirmModal,
    width:'400px',
    onClose:()=>dispatch({
      type:'secondHouseRentTrade/closeComfirmModal',
    }),
    onCancel:()=>dispatch({
      type:'secondHouseRentTrade/cancelComfirmModal',
    }),
    onOk:()=>dispatch({
      type:'secondHouseRentTrade/onOkComfirmModal',
    }),
    afterClose:()=>dispatch({
      type:'secondHouseRentTrade/afterCloseComfirmModal',
    }),
  }
  //步骤模态框props
  const stepsModalProps={
    title:stepModal.title,
    visible:stepModal.visible,
    stepList:stepModal.stepList,
    width:1000,
    stepStatus:stepModal.stepStatus,
    current:stepModal.current,
    onCancel:()=>dispatch({
      type:'secondHouseRentTrade/closeStepsAuditingModal'
    }),
    footer:renderStepModalFooter(stepModal,dispatch),
  }
  const placeholdershow=(key)=>{
    // console.log(key,'keykey');
    let _key='';
    if(key=='handle'){
      _key='请在此输入筛选关键字进行搜索，支持报出租经纪人，联系电话，客户，联系电话'
      return _key
    }else if(key=='hasConfirmed'){
      _key='请在此输入筛选关键字进行搜索，支持经纪人，联系电话，客户'
      return _key
    }else{
      _key='请在此输入筛选关键字进行搜索，支持经纪人，联系电话，客户，联系电话'
      return _key
    }
  }
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      dispatch({
        type:'secondHouseRentTrade/getBaoChengJiao',
        payload:values,
      })
    });
  }





  const {getFieldDecorator} = form;

  return (
    <div className='secondHouseRentTrade'>
      <DxConfirmModal {...confirmModalProps}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseRentTrade/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseRentTrade/onlyClosePrompt'})}/>

      <DxPanel title="房源报成交">
        <Form  layout="inline" onSubmit={handleSearch}>
          <Row>
            <Col span={6}>
              <FormItem label='房源编号'>
                {getFieldDecorator(`resourcesNumber`, {
                       rules: [{
                         required: true,
                         message: '请输入房源编号!',
                       }],
                     })(
                       <Input placeholder="请输入房源编号" />
                     )}
                 </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='客户手机号'>
                     {getFieldDecorator(`customerPhone`, {
                                rules: [{
                                  required: true,
                                  message: '请输入客户手机号!',
                                }],
                              })(
                                <Input placeholder="请输入客户手机号" />
                              )}
                </FormItem>
              </Col>
              <Col span={6}>
              <Button type="primary" htmlType="submit">搜索</Button>
              </Col>
            </Row>
          </Form>
              <br/><br/>
              <hr/>
              <br/>
        <Table {...generalBaochengjiao} {...baoChengJiao}/>
    </DxPanel>



      <div className='anzhu_dx_container_box'>
        <SearchInput type='button'
          placeholder={placeholdershow(activeTabKey)}
          searchFuc={(value)=>dispatch({
            type:'secondHouseRentTrade/setSearchKeyWordValue',
            payload:value,
          })}  clearFuc={()=>dispatch({type:'secondHouseRentTrade/setSearchKeyWordValue',payload:''})}/>
      </div>
      <div className='secondHouseRentTrade_tab'>
        <Tabs onChange={(value)=>dispatch({
            type:'secondHouseRentTrade/changeTabKeys',
            payload:value,
          })} type='card' activeKey={activeTabKey}>
      {  //   <TabPane tab='待处理' key='handle'>
        //     <Table {...generalTableProps} {...getWaitProcessingTableProps} rowClassName={creatReportedTabelColClassName}/>
        //   </TabPane>
      }
          <TabPane tab='待成交' key='hasConfirmed'>
            <Table {...generalTableProps} {...getWaitTransactionTableProps}/>
          </TabPane>
          <TabPane tab='已成交' key='hasTraded'>
            <Table {...generalTableProps} {...getTransactionTableProps}/>
          </TabPane>
        </Tabs>
      </div>
      <Modal title='驳回申请' visible={rejectProcessingModel.visible} onOk={()=>dispatch({type:'secondHouseRentTrade/doRejectProcessingApply'})}
      onCancel={()=>dispatch({type:'secondHouseRentTrade/closeRejectProcessingApply'})}>
        <span className='dx_block_label'>请输入驳回原因</span>
        <Input value={rejectProcessingModel.rejectReson} onChange={(e)=>dispatch({
            type:'secondHouseRentTrade/changeRejectProcessingReson',
            payload:e.target.value,
          })} addonAfter={`${rejectProcessingModel.rejectReson.length}/50`}/>
      </Modal>
      {!!stepsModalProps.visible && <div>{renderStepModal(stepModal,dispatch,stepsModalProps)}</div>}
      {!!revokeRefundModal.visible && <RevokeRefundModal {...revokeRefundModal} applyCallBack={(data)=>dispatch({
          type:'secondHouseRentTrade/postRevokeRefundData',
          payload:data,
        })} closeModal={()=>dispatch({type:'secondHouseRentTrade/closeRevokeRefund'})}/>}
    </div>
  )
}
//待处理操作
function renderWaitProcessingOpration(record,dispatch){
  if(record.showStatus==='待处理'){
    return(
      <Popover placement='bottom' content={<div>
            <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseRentTrade/acceptProcessingApply',
                payload:record.transCode,
              })}>受理申请</p>
            <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseRentTrade/openRejectProcessingApply',
                payload:record.transCode,
              })}>驳回申请</p>
          </div>} title={false} trigger='click'>
        <span className='deal_operation'>业务办理</span>
      </Popover>
    )
  }else{
    return ''
  }
}
//待成交操作
function renderWaitTransactionOpration(record,dispatch){
  if(!!record.isClosed){
    return <p>{''}</p>
  }else{
    if(1===1){
      return(
        <Popover placement='bottom' content={<div>
            {!record.intentionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentDealIntentsAdd',
                state:{
                  transCode:record.transCode,
                  transactionMode:record.transactionMode,
                }
              }))}>办理意向</p>}
            {(!!record.intentionComplete && !record.intentionContractsUploaded) && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentDealUploadIntentsAgreement',
                state:{
                  transCode:record.transCode,
                }
              }))}>上传意向金合同</p>}
            {/*!!record.intentionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseRentTrade/getStepModalData',
                payload:{
                  type:'intention',
                  current:1,
                  isApply:true,
                  status:'process',
                  applyId:record.applyId,
                  transCode:record.transCode,
                }
              })}>申请意向金退款</p>*/}
            {!!record.intentionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
              pathname:'/tradeManagement/secondHouseRentTrade/shRentIntentsRefundApply',
              state:{
                transCode:record.transCode,
              }
            }))}>申请意向金退款</p>}
            {!record.commissionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentCommissionAdd',
                state:{
                  transCode:record.transCode,
                }
              }))}>缴纳佣金</p>}
            {/*!!record.commissionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseRentTrade/getStepModalData',
                payload:{
                  type:'commission',
                  current:1,
                  isApply:true,
                  status:'process',
                  applyId:record.applyId,
                  transCode:record.transCode,
                }
              })}>申请佣金退款</p>*/}
            {!!record.commissionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
              pathname:'/tradeManagement/secondHouseRentTrade/shRentCommissionRefundApply',
              state:{
                transCode:record.transCode,
              }
            }))}>申请佣金退款</p>}
            {!!record.commissionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
              pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentCommitApply',
              state:{
                transCode:record.transCode,
              }
            }))}>办理成交</p>}
            {(!!record.commissionComplete && !record.commissionContractsUploaded) && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentDealUploadCommissionAgreement',
                state:{
                  transCode:record.transCode,
                }
              }))}>上传佣金协议</p>}
            {(!!record.commissionComplete && !record.loanComplete) && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentLoanApply',
                state:{
                  transCode:record.transCode,
                }
              }))}>贷款分期</p>}
            <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseRentTrade/closeTrade',
                payload:record.transCode,
              })}>关闭交易</p>
          </div>} title={false} trigger='click'>
          <span className='deal_operation'>业务办理</span>
        </Popover>
      )
    }else{
      return ''
    }
  }
}

//待成交 主状态
function renderWaitTransactionStatus(record,dispatch){
  if(!!record.isClosed){
    return <p className='red_cursor'>交易已关闭</p>
  }else if(record.transStatus==='已缴纳意向金'){
    return renderWaitTransactionRefundStatus(record,'已缴纳意向金','secondHouseRentDealUploadIntentsAgreement',dispatch,'intention');
  }else if(record.transStatus==='已申请意向金退款'){
    return renderWaitTransactionRefundStatus(record,'已申请意向金退款','secondHouseRentDealUploadIntentsAgreement',dispatch,'intention');
  }else if(record.transStatus==='已执行意向金退款'){
    return renderWaitTransactionRefundStatus(record,'已执行意向金退款','secondHouseRentDealUploadIntentsAgreement',dispatch,'intention');
  }else if(record.transStatus==='已缴纳佣金'){
    return renderWaitTransactionRefundStatus(record,'已缴纳佣金','secondHouseRentDealUploadCommissionAgreement',dispatch,'commission');
  }else if(record.transStatus==='已申请佣金退款'){
    return renderWaitTransactionRefundStatus(record,'已申请佣金退款','secondHouseRentDealUploadCommissionAgreement',dispatch,'commission');
  }else if(record.transStatus==='已执行佣金退款'){
    return renderWaitTransactionRefundStatus(record,'已执行佣金退款','secondHouseRentDealUploadCommissionAgreement',dispatch,'commission');
  }else if(record.transStatus==='已申请贷款'){
    return renderLoanStatus(record,dispatch);
  }else if(record.transStatus==='已申请成交'){
    return renderCommitStatus(record,dispatch);
  }else{
    return <div>{'待成交'}</div>
  }
}
//已成交 主状态
function renderTransactionStatus(record,dispatch){
  if(!!record.isClosed){
    return <p className='red_cursor'>交易已关闭</p>
  }else if(record.transStatus==='已申请成交'){
    if(!!record.assigncommission){
      return <div>
        <p>已成交</p>
        <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
            pathname:'/tradeManagement/secondHouseRentTrade/shRentCommitApplyInfo',
            state:{
              current:3,
              status:'finish',
              applyId:record.applyId,
              transCode:record.transCode,
            }
          }))}>佣金已分配</p>
      </div>
    }
    else{
      return <div>
        <p>已成交</p>
        <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
            pathname:'/tradeManagement/secondHouseRentTrade/shRentCommitApplyInfo',
            state:{
              current:3,
              status:'process',
              applyId:record.applyId,
              transCode:record.transCode,
            }
          }))}>等待佣金分配</p>
      </div>
    }
  }
  else if(record.transStatus==='已成交'){
    // console.log('record',record);
    if(!!record.assigncommission){
      return <div>
        <p>已成交</p>
        <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
            pathname:'/tradeManagement/secondHouseRentTrade/shRentCommitApplyInfo',
            state:{
              current:3,
              status:'finish',
              applyId:record.applyId,
              transCode:record.transCode,
            }
          }))}>佣金已分配</p>
      </div>
    }
  }
  else{
    return <div>{'---'}</div>
  }
}
// function renderTransactionStatus(record,dispatch){
//   if(!!record.isClosed){
//     return <p className='red_cursor'>交易已关闭</p>
//   }else if(record.transStatus==='已申请成交'){
//     if(!!record.assigncommission){
//       return <div>
//         <p>已成交</p>
//         <p className='blue_cursor' onClick={()=>dispatch({
//             type:'secondHouseRentTrade/getStepModalData',
//             payload:{
//               type:'commit',
//               current:3,
//               status:'finish',
//               applyId:record.applyId,
//               isApply:false,
//               transCode:record.transCode,
//             }
//           })}>佣金已分配</p>
//       </div>
//     }
//     else{
//       return <div>
//         <p>已成交</p>
//         <p className='blue_cursor' onClick={()=>dispatch({
//             type:'secondHouseRentTrade/getStepModalData',
//             payload:{
//               type:'commit',
//               current:3,
//               status:'process',
//               applyId:record.applyId,
//               isApply:false,
//               transCode:record.transCode,
//             }
//           })}>等待佣金分配</p>
//       </div>
//     }
//   }else{
//     return <div>{'---'}</div>
//   }
// }

function renderStepModal(stepModal,dispatch,stepsModalProps){
  // console.log('stepsModalProps',stepsModalProps);
  if(stepModal.type==='intentionApply'){
    const{visible,title}=stepsModalProps
    const tableInfoObj={
      columns:[
        {
          title: '订单编号',
          dataIndex: 'orderNumber',
          key: 'orderNumber',
        },{
          title: '支付方式',
          dataIndex: 'payWay',
          key: 'payWay',
        },{
          title: '支付流水号',
          dataIndex: 'paySerialNumber',
          key: 'paySerialNumber',
        },{
          title: '支付时间',
          dataIndex: 'payTime',
          key: 'payTime',
        },{
          title: '支付客户',
          dataIndex: 'payCustomer',
          key: 'payCustomer',
        },{
          title: '客户电话',
          dataIndex: 'customerPhone',
          key: 'customerPhone',
        },{
          title: '意向租金',
          dataIndex: 'intentionRentAmount',
          key: 'intentionRentAmount',
        },{
          title: '支付意向金',
          dataIndex: 'intentionAmount',
          key: 'intentionAmount',
        },{
          title: '支付状态',
          dataIndex: 'payStatus',
          key: 'payStatus',
        }
      ],
      dataSource:JSON.parse(stepModal.showDataInfo).orderInfo,
    }
    const refundModalProps={
      visible,
      title,
      tableInfo:JSON.stringify(tableInfoObj),
      transCode:stepModal.transCode,
      auditorList:stepModal.auditorList,
      closeModal:()=>dispatch({
        type:'secondHouseRentTrade/closeStepsAuditingModal'
      }),
      applyCallBack:(data)=>dispatch({
        type:'secondHouseRentTrade/postIntensRefundApplyData',
        payload:data,
      }),

    }
    return(
      <SHTradeRefundApplyModal {...refundModalProps}/>
    )
  }else if(stepModal.type==='commissionApply'){
    const{visible,title}=stepsModalProps
    const tableInfoObj={
      columns:[
        {
          title: '订单编号',
          dataIndex: 'orderNumber',
          key: 'orderNumber',
        },{
          title: '支付方式',
          dataIndex: 'payWay',
          key: 'payWay',
        },{
          title: '支付流水号',
          dataIndex: 'paySerialNumber',
          key: 'paySerialNumber',
        },{
          title: '支付时间',
          dataIndex: 'payTime',
          key: 'payTime',
        },{
          title: '承担方',
          dataIndex: 'undertaker',
          key: 'undertaker',
        },{
          title: '电话',
          dataIndex: 'undertakerPhone',
          key: 'undertakerPhone',
        },{
          title: '意向租金',
          dataIndex: 'intentionRentAmount',
          key: 'intentionRentAmount',
        },{
          title: '佣金比例',
          dataIndex: 'commissionRatio',
          key: 'commissionRatio',
        },{
          title: '佣金金额',
          dataIndex: 'commissionAmount',
          key: 'commissionAmount',
        },{
          title: '支付状态',
          dataIndex: 'payStatus',
          key: 'payStatus',
        }
      ],
      dataSource:JSON.parse(stepModal.showDataInfo).orderInfo,
    }
    const refundModalProps={
      visible,
      title,
      tableInfo:JSON.stringify(tableInfoObj),
      transCode:stepModal.transCode,
      auditorList:stepModal.auditorList,
      closeModal:()=>dispatch({
        type:'secondHouseRentTrade/closeStepsAuditingModal'
      }),
      applyCallBack:(data)=>dispatch({
        type:'secondHouseRentTrade/postCommissionRefundApplyData',
        payload:data,
      }),
    }
    return(
      <SHTradeRefundApplyModal {...refundModalProps}/>
    )
  }else{
    return(
      <StepsModal {...stepsModalProps}>
        {renderStepsModalChildren(stepModal,dispatch)}
      </StepsModal>
    )
  }
}
//待成交 通用审核次状态
function renderWaitTransactionRefundStatus(record,mainStatus,uploadPath,dispatch,type){
  if(record.processingStatus==='等待退款审核'){
    return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>退款待审核</p>
    </div>
  }else if(record.processingStatus==='退款审核通过'){
    return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>退款审核通过</p>
    </div>
  }else if(record.processingStatus==='退款申请驳回'){
    return <div>
      <p>{mainStatus}</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>退款申请驳回</p>
    </div>
  }else if(record.processingStatus==='等待财务审核'){
    return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>等待财务审核</p>
    </div>
  }else if(record.processingStatus==='财务审核驳回'){
    return <div>
      <p>{mainStatus}</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>财务审核驳回</p>
    </div>
  }else if(record.processingStatus==='财务审核通过'){
    return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>财务审核通过</p>
    </div>
  }else if(record.processingStatus==='已执行退款'){
    {/*return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            current:3,
            status:'finish',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>已执行退款</p>
    </div>*/}
    return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>已执行退款</p>
    </div>
  }else if(record.processingStatus==='已执行退款'){
    return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>已执行退款</p>
    </div>
  }else if(record.processingStatus==='撤回申请'){
    return <div>
      <p>{mainStatus}</p>
      <p>已撤回申请</p>
    </div>
  }else{
    return <div>
      <p>{mainStatus}</p>
      {/*<p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:`/tradeManagement/secondHouseRentTrade/${uploadPath}`,
          state:{
            transCode:record.transCode,
          }
        }))}>补传协议</p>*/}
    </div>
  }
}
// function renderWaitTransactionRefundStatus(record,mainStatus,uploadPath,dispatch,type){
//   if(record.processingStatus==='等待退款审核'){
//     return <div>
//       <p>{mainStatus}</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type,
//             current:0,
//             isApply:false,
//             status:'process',
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>退款待审核</p>
//     </div>
//   }else if(record.processingStatus==='退款审核通过'){
//     return <div>
//       <p>{mainStatus}</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type,
//             current:1,
//             status:'finish',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>退款审核通过</p>
//     </div>
//   }else if(record.processingStatus==='退款申请驳回'){
//     return <div>
//       <p>{mainStatus}</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type,
//             current:1,
//             status:'error',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>退款申请驳回</p>
//     </div>
//   }else if(record.processingStatus==='等待财务审核'){
//     return <div>
//       <p>{mainStatus}</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type,
//             current:2,
//             status:'process',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>等待财务审核</p>
//     </div>
//   }else if(record.processingStatus==='财务审核驳回'){
//     return <div>
//       <p>{mainStatus}</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type,
//             current:2,
//             status:'error',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>财务审核驳回</p>
//     </div>
//   }else if(record.processingStatus==='财务审核通过'){
//     return <div>
//       <p>{mainStatus}</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type,
//             current:2,
//             status:'process',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>财务审核通过</p>
//     </div>
//   }else if(record.processingStatus==='已执行退款'){
//     {/*return <div>
//       <p>{mainStatus}</p>
//       <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
//           pathname:getAuditRecodeTypePathName(type),
//           state:{
//             current:3,
//             status:'finish',
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         }))}>已执行退款</p>
//     </div>*/}
//     return <div>
//       <p>{mainStatus}</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type,
//             current:3,
//             status:'finish',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>已执行退款</p>
//     </div>
//   }else if(record.processingStatus==='已执行退款'){
//     return <div>
//       <p>{mainStatus}</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type,
//             current:3,
//             status:'finish',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>已执行退款</p>
//     </div>
//   }else{
//     return <div>
//       <p>{mainStatus}</p>
//       {/*<p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
//           pathname:`/tradeManagement/secondHouseRentTrade/${uploadPath}`,
//           state:{
//             transCode:record.transCode,
//           }
//         }))}>补传协议</p>*/}
//     </div>
//   }
// }

//成交申请 审核次状态
function renderCommitStatus(record,dispatch){
  if(record.processingStatus==='等待成交审核'){
    return <div>
      <p>申请成交</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseRentTrade/shRentCommitApplyInfo',
          state:{
            current:0,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>成交待审核</p>
    </div>
  }
  else if(record.processingStatus==='成交审核通过'){
    return <div>
      <p>申请成交</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseRentTrade/shRentCommitApplyInfo',
          state:{
            current:1,
            status:'finish',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>成交审核通过</p>
    </div>
  }
  else if(record.processingStatus==='成交申请驳回'){
    return <div>
      <p>申请成交</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseRentTrade/shRentCommitApplyInfo',
          state:{
            current:1,
            status:'error',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>成交申请驳回</p>
    </div>
  }
  else if(record.processingStatus==='等待财务审核'){
    return <div>
      <p>申请成交</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseRentTrade/shRentCommitApplyInfo',
          state:{
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>等待财务审核</p>
    </div>
  }
  else if(record.processingStatus==='财务审核驳回'){
    return <div>
      <p>申请成交</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseRentTrade/shRentCommitApplyInfo',
          state:{
            current:2,
            status:'error',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>财务审核驳回</p>
    </div>
  }
  else if(record.processingStatus==='财务审核通过'){
    return <div>
      <p>申请成交</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'//tradeManagement/secondHouseRentTrade/shRentCommitApplyInfo',
          state:{
            current:2,
            status:'finish',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>财务审核通过</p>
    </div>
  }
  else if(record.processingStatus==='撤回申请'){
    return <div>
      <p>申请成交</p>
      <p>已撤回申请</p>
    </div>
  }
  else{
    return <div>{'---'}</div>
  }
}
// function renderCommitStatus(record,dispatch){
//   if(record.processingStatus==='等待成交审核'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:1,
//             status:'process',
//             applyId:record.applyId,
//             isApply:false,
//             transCode:record.transCode,
//           }
//         })}>成交待审核</p>
//     </div>
//   }else if(record.processingStatus==='成交审核通过'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:1,
//             status:'finish',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>成交审核通过</p>
//     </div>
//   }else if(record.processingStatus==='成交申请驳回'){
//     return <div>
//       <p>申请成交</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:1,
//             status:'error',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>成交申请驳回</p>
//     </div>
//   }else if(record.processingStatus==='等待财务审核'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:2,
//             status:'process',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>等待财务审核</p>
//     </div>
//   }else if(record.processingStatus==='财务审核驳回'){
//     return <div>
//       <p>申请成交</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:2,
//             status:'error',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>财务审核驳回</p>
//     </div>
//   }else if(record.processingStatus==='财务审核通过'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:2,
//             status:'finish',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>财务审核通过</p>
//     </div>
//   }else{
//     return <div>{'---'}</div>
//   }
// }

//分期申请 审核次状态
function renderLoanStatus(record,dispatch){
  if(record.processingStatus==='等待受理'){
    return <div>
      <p>申请分期</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseRentTrade/getStepModalData',
          payload:{
            type:'loan',
            current:1,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>等待受理</p>
    </div>
  }else if(record.processingStatus==='贷款申请已受理'){
    return <div>
      <p>申请分期</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseRentTrade/getStepModalData',
          payload:{
            type:'loan',
            current:1,
            status:'finish',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>分期已受理</p>
    </div>
  }else if(record.processingStatus==='贷款申请驳回'){
    return <div>
      <p>申请分期</p>
      <p className='red_cursor' onClick={()=>dispatch({
          type:'secondHouseRentTrade/getStepModalData',
          payload:{
            type:'loan',
            current:1,
            status:'error',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>分期申请驳回</p>
    </div>
  }else if(record.processingStatus==='等待批款'){
    return <div>
      <p>申请分期</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseRentTrade/getStepModalData',
          payload:{
            type:'loan',
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>等待批款</p>
    </div>
  }else if(record.processingStatus==='批款驳回'){
    return <div>
      <p>申请分期</p>
      <p className='red_cursor' onClick={()=>dispatch({
          type:'secondHouseRentTrade/getStepModalData',
          payload:{
            type:'loan',
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>批款驳回</p>
    </div>
  }else if(record.processingStatus==='已批款'){
    return <div>
      <p>申请分期</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseRentTrade/getStepModalData',
          payload:{
            type:'loan',
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>分期已批</p>
    </div>
  }else{
    return <div>{'---'}</div>
  }
}
//步骤模态框生成内容
function renderStepsModalChildren(stepModal,dispatch){
  // console.log('stepModal',stepModal);
  if(stepModal.type==='intention'){
    const tableColumns=[
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },{
        title: '支付方式',
        dataIndex: 'payWay',
        key: 'payWay',
      },{
        title: '支付流水号',
        dataIndex: 'paySerialNumber',
        key: 'paySerialNumber',
      },{
        title: '支付时间',
        dataIndex: 'payTime',
        key: 'payTime',
      },{
        title: '支付客户',
        dataIndex: 'payCustomer',
        key: 'payCustomer',
      },{
        title: '客户电话',
        dataIndex: 'customerPhone',
        key: 'customerPhone',
      },{
        title: '意向租金',
        dataIndex: 'intentionRentAmount',
        key: 'intentionRentAmount',
      },{
        title: '支付意向金',
        dataIndex: 'intentionAmount',
        key: 'intentionAmount',
      },{
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>订单信息</b>
        {!!applyData && <Table columns={tableColumns} dataSource={[applyData.orderInfo]} pagination={false}/>}
        <b style={{display:'block'}}>退款信息</b>
        {!!applyData.applyInfo.formData && <DxShowMsgForm msgData={applyData.applyInfo.formData}/>}
        {!!applyData.applyInfo.applyPics && <PicList picListData={applyData.applyInfo.applyPics}/>}
        {!!applyData.auditInfo && <TimeRecordList listData={applyData.auditInfo}/>}
      </div>
    )
  }
  else if(stepModal.type==='loan'){
    const tableColumns=[
      {
        title: '物业类型',
        dataIndex: 'propertyType',
        key: 'propertyType',
      },{
        title: '所属小区',
        dataIndex: 'communityName',
        key: 'communityName',
      },{
        title: '房源信息',
        dataIndex: 'houseInfo',
        key: 'houseInfo',
      },{
        title: '房源面积',
        dataIndex: 'resourceArea',
        key: 'resourceArea',
      },{
        title: '租金/押金',
        dataIndex: 'rentType',
        key: 'rentType',
      },{
        title: '租期',
        dataIndex: 'rentTrem',
        key: 'rentTrem',
      },{
        title: '房租',
        dataIndex: 'rentAmount',
        key: 'rentAmount',
      },{
        title: '出租方式',
        dataIndex: 'rentWay',
        key: 'rentWay',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    const tradeProgressOptions = ['意向金已支付', '租房中介佣金已支付'];
    return(
      <div className='newHouseTrade_transApply_content'>
        <DxPanelMini title='分期房源'>
          <div>
          {!!applyData && <Table columns={tableColumns} dataSource={[applyData.orderInfo]} pagination={false}/>}</div>
        </DxPanelMini>
        <DxPanelMini title='客户已完成' hasPadding={true}>
          <CheckboxGroup options={tradeProgressOptions} value={applyData.applyInfo.compeleInfo} disabled/>
        </DxPanelMini>
        <DxPanelMini title='分期信息' hasPadding={true}>
          <div>
            {!!applyData.applyInfo.formData && <DxShowMsgForm msgData={applyData.applyInfo.formData}/>}
            {!!applyData.applyInfo.applyPics && <PicList picListData={applyData.applyInfo.applyPics}/>}
          </div>
        </DxPanelMini>
        <DxPanelMini title='办理进度' hasPadding={true}>
          {!!applyData.auditInfo && <TimeRecordList listData={applyData.auditInfo}/>}
        </DxPanelMini>
      </div>
    )
  }
  else if(stepModal.type==='commission'){
    const tableColumns=[
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },{
        title: '支付方式',
        dataIndex: 'payWay',
        key: 'payWay',
      },{
        title: '支付流水号',
        dataIndex: 'paySerialNumber',
        key: 'paySerialNumber',
      },{
        title: '支付时间',
        dataIndex: 'payTime',
        key: 'payTime',
      },{
        title: '承担方',
        dataIndex: 'undertaker',
        key: 'undertaker',
      },{
        title: '电话',
        dataIndex: 'undertakerPhone',
        key: 'undertakerPhone',
      },{
        title: '意向租金',
        dataIndex: 'intentionRentAmount',
        key: 'intentionRentAmount',
      },{
        title: '佣金比例',
        dataIndex: 'commissionRatio',
        key: 'commissionRatio',
      },{
        title: '佣金金额',
        dataIndex: 'commissionAmount',
        key: 'commissionAmount',
      },{
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    const tradeProgressOptions = ['意向金已支付', '租房中介佣金已支付'];
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>订单信息</b>
        {!!applyData && <Table columns={tableColumns} dataSource={[applyData.orderInfo]} pagination={false}/>}
        <b style={{display:'block'}}>退款信息</b>
        {!!applyData.applyInfo.formData && <DxShowMsgForm msgData={applyData.applyInfo.formData}/>}
        {!!applyData.applyInfo.applyPics && <PicList picListData={applyData.applyInfo.applyPics}/>}
        {!!applyData.auditInfo && <TimeRecordList listData={applyData.auditInfo}/>}
      </div>
    )
  }
  else if(stepModal.type==='commit'){
    const tableColumns=[
      {
        title: '房源信息',
        dataIndex: 'houseInfo',
        key: 'houseInfo',
      },{
        title: '物业类型',
        dataIndex: 'propertyType',
        key: 'propertyType',
      },{
        title: '房源面积',
        dataIndex: 'resourceArea',
        key: 'resourceArea',
      },{
        title: '租金/押金',
        dataIndex: 'rentType',
        key: 'rentType',
      },{
        title: '租期',
        dataIndex: 'rentTrem',
        key: 'rentTrem',
      },{
        title: '房租',
        dataIndex: 'rentPrice',
        key: 'rentPrice',
      },{
        title: '出租方式',
        dataIndex: 'rentWay',
        key: 'rentWay',
      },{
        title: '出租佣金',
        dataIndex: 'commissionAmount',
        key: 'commissionAmount',
      },{
        title: '房源经纪人',
        dataIndex: 'ownBroker',
        key: 'ownBroker',
      },{
        title: '租户经纪人',
        dataIndex: 'customerBroker',
        key: 'customerBroker',
      },{
        title: '成交时间',
        dataIndex: 'commitDate',
        key: 'commitDate',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    const tradeProgressOptions = ['意向金已支付','首付款已支付','中介佣金已支付','购房贷款','购房过户'];
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>订单信息</b>
        {!!applyData && <Table columns={tableColumns} dataSource={[applyData.orderInfo]} pagination={false}/>}
        <b style={{display:'block'}}>出租信息</b>
        {!!applyData.applyInfo.formData && <DxShowMsgForm msgData={applyData.applyInfo.formData}/>}
        {!!applyData.applyInfo.applyPics && <PicList picListData={applyData.applyInfo.applyPics}/>}
        {!!applyData.auditInfo && <TimeRecordList listData={applyData.auditInfo}/>}
      </div>
    )
  }
}
// //成交申请 审核次状态
// function renderCommitStatus(record,dispatch){
//   if(record.processingStatus==='等待成交审核'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:0,
//             status:'process',
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>成交待审核</p>
//     </div>
//   }else if(record.processingStatus==='成交审核通过'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:1,
//             status:'finish',
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>成交审核通过</p>
//     </div>
//   }else if(record.processingStatus==='成交申请驳回'){
//     return <div>
//       <p>申请成交</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:1,
//             status:'error',
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>成交申请驳回</p>
//     </div>
//   }else if(record.processingStatus==='等待财务审核'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:2,
//             status:'process',
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>等待财务审核</p>
//     </div>
//   }else if(record.processingStatus==='财务审核驳回'){
//     return <div>
//       <p>申请成交</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:2,
//             status:'error',
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>财务审核驳回</p>
//     </div>
//   }else if(record.processingStatus==='财务审核通过'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseRentTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:2,
//             status:'finish',
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>财务审核通过</p>
//     </div>
//   }else{
//     return <div>{'---'}</div>
//   }
// }

//生成审核步奏模态框footer元素
function renderStepModalFooter(stepModal,dispatch){
  // console.log('stepModal',stepModal);
  if(stepModal.current===0){
    return (
      <div>
        <Button type='ghost' onClick={()=>dispatch({
            type:'secondHouseRentTrade/closeStepsAuditingModal'
          })}>取消</Button>
        <Button type='primary' onClick={()=>dispatch({
            type:'secondHouseRentTrade/revokeRefundApply',
            payload:{
              transCode:stepModal.transCode,
              type:stepModal.type,
            },
          })}>撤回申请</Button>
      </div>
    );
  }else{
    return (
      <div>
        <Button type='ghost' onClick={()=>dispatch({
            type:'secondHouseRentTrade/closeStepsAuditingModal'
          })}>关闭</Button>
      </div>
    );
  }
}


function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
SecondHouseRentTrade.propTypes = {
  secondHouseRentTrade: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({secondHouseRentTrade}) {
  return {secondHouseRentTrade}
}
function getAuditRecodeTypePathName(type){
  if(type==='intention'){
    return '/tradeManagement/secondHouseRentTrade/shRentIntentsRefundAuditInfo'
  }
  else if(type==='commission'){
    return '/tradeManagement/secondHouseRentTrade/shRentCommissionRefundAuditInfo'
  }
}
function creatReportedTabelColClassName(record, index){
  if(!!record.hasClass){
    return 'anzhu_table_col_bold';
  }else{
    return '';
  }
}
export default connect(mapStateToProps)(Form.create({})(SecondHouseRentTrade));
