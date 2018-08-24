import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {
  isNull,
} from '../../../../commons/utils/currencyFunction'
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
import DxConfirmModal from '../../../../commons/components/DxConfirmModal'
import DxShowMsgForm from '../../../../commons/UI/DxShowMsgForm'
import TimeRecordList from '../../../../commons/UI/TimeRecordList'
import PicList from '../../../../commons/UI/PicList'
import TimelineComponents from '../../../../commons/UI/tradeItems/TimelineComponents'
import SHTradeRefundApplyModal from '../../../components/secondHouseSellTrade/SHTradeRefundApplyModal'
import RevokeRefundModal from '../../../components/RevokeRefundModal'


import './SecondHouseSellTrade.css'

const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:10,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const FormItem = Form.Item;
function SecondHouseSellTrade ({form,location, dispatch,secondHouseSellTrade})  {

  const{
    activeTabKey,
    promptObj,
    pagination,
    activeTableData,
    activeTableDataBao,
    tableLoading,
    stepModal,
    revokeRefundModal,
    rejectProcessingModel,//报成交申请驳回模态框
    confirmModal,//确认模态框
  }=secondHouseSellTrade;
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
        type:'secondHouseSellTrade/getActiveTabTableData',
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

  //待处理表格props
  const getWaitProcessingTableProps={
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
        title: '所属小区',
        dataIndex: 'communityName',
      },{
        title: '物业类型',
        dataIndex: 'propertyType',
      },{
        title: '房源信息',
        dataIndex: 'resourcesInfo',
        render:(text,record)=><span className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellHousesDetails',
          state:{
            transCode:record.transCode,
          },
        }))}>{text}</span>
      },{
        title: '客户',
        dataIndex: 'customerName',
      },{
        title: '成交方式',
        dataIndex: 'transactionMode',
      },{
        title: '报成交时间',
        dataIndex: 'reportDateTime',
      },{
        title: '预约办理时间',
        dataIndex: 'orderTime',
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
            pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellTradeInfoDetails',
            state:{
              transCode:record.transCode,
            }
          }))}>详情</span>}
      </div>
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
      },
      // {
      //   title: '电话',
      //   dataIndex: 'brokerPhone',
      // },
      {
        title: '所属小区',
        dataIndex: 'communityName',
      },{
        title: '物业类型',
        dataIndex: 'propertyType',
      },{
        title: '房源信息',
        dataIndex: 'resourcesInfo',
        render:(text,record)=><span className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellHousesDetails',
          state:{
            transCode:record.transCode,
          },
        }))}>{text}</span>
      },{
        title: '客户',
        dataIndex: 'customerName',
      },{
        title: '成交方式',
        dataIndex: 'transactionMode',
      },{
        title: '报成交时间',
        dataIndex: 'reportDateTime',
      },{
        title: '业务办理',
        dataIndex: 'handler',
      },{
        title: '业务状态',
        dataIndex: 'showStatus',
        render:(text,record)=>renderWaitTransactionStatus(record,dispatch),
      },{
        title: '办理时间',
        dataIndex: 'processingDateTime',
      },{
          title: '操作',
          dataIndex: 'operation',
          render:(text,record)=><div>
          {renderWaitTransactionOpration(record,dispatch)}
          <span className='deal_operation' onClick={()=>dispatch(routerRedux.push({
              pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellTradeInfoDetails',
              state:{
                transCode:record.transCode,
              }
            }))}>详情</span>
        </div>
      }
    ],
  }
  //已成交列表
  const getCommitListTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      },
      {
        title: '所属经纪人',
        dataIndex: 'brokerName',
      },{
        title: '所属小区',
        dataIndex: 'communityName',
      },{
        title: '物业类型',
        dataIndex: 'propertyType',
      },{
        title: '房源信息',
        dataIndex: 'resourcesInfo',
        render:(text,record)=><span className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellHousesDetails',
          state:{
            transCode:record.transCode,
          },
        }))}>{text}</span>
      },{
        title: '客户',
        dataIndex: 'customerName',
      },{
        title: '成交方式',
        dataIndex: 'transactionMode',
      },{
        title: '报成交时间',
        dataIndex: 'reportDateTime',
      },{
        title: '业务办理',
        dataIndex: 'handler',
      },{
        title: '业务状态',
        dataIndex: 'showStatus',
        render:(text,record)=>renderTransactionStatus(record,dispatch),
      },{
        title: '办理时间',
        dataIndex: 'processingDateTime',
      },{
          title: '操作',
          dataIndex: 'operation',
          render:(text,record)=><span className='deal_operation' onClick={()=>dispatch(routerRedux.push({
              pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellTradeInfoDetails',
              state:{
                transCode:record.transCode,
              }
            }))}>详情</span>
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
            type:'secondHouseSellTrade/baoChengJiao',
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
  //步骤模态框props
  const stepsModalProps={
    title:stepModal.title,
    visible:stepModal.visible,
    confirmLoading:stepModal.confirmLoading,
    stepList:stepModal.stepList,
    width:1000,
    stepStatus:stepModal.stepStatus,
    current:stepModal.current,
    onCancel:()=>dispatch({
      type:'secondHouseSellTrade/closeStepsAuditingModal'
    }),
    footer:renderStepModalFooter(stepModal,dispatch),
  }
  const confirmModalProps={
    ...confirmModal,
    width:'400px',
    onClose:()=>dispatch({
      type:'secondHouseSellTrade/closeComfirmModal',
    }),
    onCancel:()=>dispatch({
      type:'secondHouseSellTrade/cancelComfirmModal',
    }),
    onOk:()=>dispatch({
      type:'secondHouseSellTrade/onOkComfirmModal',

    }),
    afterClose:()=>dispatch({
      type:'secondHouseSellTrade/afterCloseComfirmModal',
    }),
  }
  const placeholdershow=(key)=>{
    let _key='';
    if(key=='handle'){
      _key='请在此输入筛选关键字进行搜索，支持经纪人，联系电话，所属小区，客户'
      return _key
    }else if(key=='hasConfirmed'){
      _key='请在此输入筛选关键字进行搜索，支持经纪人，所属小区，客户，业务办理'
      return _key
    }else{
      _key='请在此输入筛选关键字进行搜索，支持所属经纪人，所属小区，客户，业务办理'
      return _key
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      dispatch({
        type:'secondHouseSellTrade/getBaoChengJiao',
        payload:values,
      })
    });
  }





  const {getFieldDecorator} = form;

  return (
    <div className='secondHouseSellTrade'>
      <DxConfirmModal {...confirmModalProps}/>
      <PromptModal zIndex={5000} {...promptObj} zIndex={5000} onOk={()=>dispatch({type:'secondHouseSellTrade/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellTrade/onlyClosePrompt'})}/>
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
            type:'secondHouseSellTrade/setSearchKeyWordValue',
            payload:value,
          })} clearFuc={()=>dispatch({type:'secondHouseSellTrade/setSearchKeyWordValue',payload:''})}/>
      </div>
      <div className='secondHouseSellTrade_tab'>
        <Tabs onChange={(value)=>dispatch({
            type:'secondHouseSellTrade/changeTabKeys',
            payload:value,
          })} type='card' activeKey={activeTabKey}>
        { // <TabPane tab='待处理' key='handle'>
         //    <Table {...generalTableProps} {...getWaitProcessingTableProps} rowClassName={creatReportedTabelColClassName}/>
         //  </TabPane>
       }
          <TabPane tab='待成交' key='hasConfirmed'>
            <Table {...generalTableProps} {...getWaitTransactionTableProps}/>
          </TabPane>
          <TabPane tab='已成交' key='hasTraded'>
            <Table {...generalTableProps} {...getCommitListTableProps}/>
          </TabPane>
        </Tabs>
      </div>
      <Modal title='驳回申请' visible={rejectProcessingModel.visible} onOk={()=>dispatch({type:'secondHouseSellTrade/doRejectProcessingApply'})}
      onCancel={()=>dispatch({type:'secondHouseSellTrade/closeRejectProcessingApply'})}>
        <span className='dx_block_label'>请输入驳回原因</span>
        <Input value={rejectProcessingModel.rejectReson} onChange={(e)=>dispatch({
            type:'secondHouseSellTrade/changeRejectProcessingReson',
            payload:e.target.value,
          })} addonAfter={`${rejectProcessingModel.rejectReson.length}/50`}/>
      </Modal>
      {!!stepsModalProps.visible && <div>{renderStepModal(stepModal,dispatch,stepsModalProps)}</div>}
      {!!revokeRefundModal.visible && <RevokeRefundModal {...revokeRefundModal} applyCallBack={(data)=>dispatch({
          type:'secondHouseSellTrade/postRevokeRefundData',
          payload:data,
        })} closeModal={()=>dispatch({type:'secondHouseSellTrade/closeRevokeRefund'})}/>}
    </div>
  )
}
SecondHouseSellTrade.propTypes = {
  secondHouseSellTrade: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function renderStepModal(stepModal,dispatch,stepsModalProps){
  // console.log('stepsModalProps',stepsModalProps);
  if(stepModal.type==='intentionApply'){
    const{visible,title,confirmLoading}=stepsModalProps;
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
        },
        {
          title: '支付流水号',
          dataIndex: 'paySerialNumber',
          key: 'paySerialNumber',
        },
        {
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
          title: '意向单价',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
        },{
          title: '意向总价',
          dataIndex: 'totalPrice',
          key: 'totalPrice',
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
      confirmLoading,
      title,
      tableInfo:JSON.stringify(tableInfoObj),
      transCode:stepModal.transCode,
      auditorList:stepModal.auditorList,
      closeModal:()=>dispatch({
        type:'secondHouseSellTrade/closeStepsAuditingModal'
      }),
      applyCallBack:(data)=>dispatch({
        type:'secondHouseSellTrade/postIntensRefundApplyData',
        payload:data,
      }),
    }
    return(
      <SHTradeRefundApplyModal {...refundModalProps}/>
    )
  }else if(stepModal.type==='payDownApply'){
    const{visible,title,confirmLoading}=stepsModalProps
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
        },
        {
          title: '支付流水号',
          dataIndex: 'paySerialNumber',
          key: 'paySerialNumber',
        },
        {
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
          title: '成交单价',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
        },{
          title: '成交总价',
          dataIndex: 'totalPrice',
          key: 'totalPrice',
        },{
          title: '首付款比例',
          dataIndex: 'payDownRatio',
          key: 'payDownRatio',
        },
        // {
        //   title: '意向金抵扣',
        //   dataIndex: 'deductedIntention',
        //   key: 'deductedIntention',
        // },
        {
          title: '支付金额',
          dataIndex: 'payAmount',
          key: 'payAmount',
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
      confirmLoading,
      title,
      tableInfo:JSON.stringify(tableInfoObj),
      transCode:stepModal.transCode,
      auditorList:stepModal.auditorList,
      closeModal:()=>dispatch({
        type:'secondHouseSellTrade/closeStepsAuditingModal'
      }),
      applyCallBack:(data)=>dispatch({
        type:'secondHouseSellTrade/postPayDownRefundApplyData',
        payload:data,
      }),
    }
    return(
      <SHTradeRefundApplyModal {...refundModalProps}/>
    )
  }else if(stepModal.type==='commissionApply'){
    const{visible,title,confirmLoading}=stepsModalProps
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
        },
        {
          title: '支付流水号',
          dataIndex: 'paySerialNumber',
          key: 'paySerialNumber',
        },
        {
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
          title: '成交总价',
          dataIndex: 'totalPrice',
          key: 'totalPrice',
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
      confirmLoading,
      title,
      tableInfo:JSON.stringify(tableInfoObj),
      transCode:stepModal.transCode,
      auditorList:stepModal.auditorList,
      closeModal:()=>dispatch({
        type:'secondHouseSellTrade/closeStepsAuditingModal'
      }),
      applyCallBack:(data)=>dispatch({
        type:'secondHouseSellTrade/postCommissionRefundApplyData',
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
//待处理操作
function renderWaitProcessingOpration(record,dispatch){
  if(record.showStatus==='待处理'){
    return(
      <Popover placement='bottom' content={<div>
            <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseSellTrade/acceptProcessingApply',
                payload:record.transCode,
              })}>受理申请</p>
            <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseSellTrade/openRejectProcessingApply',
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
  // console.log('record',record);
  if(!!record.isClosed){
    return <p>{''}</p>
  }else{
    if(1===1){
      return(
        <Popover placement='bottom' content={<div>
            {!record.intentionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellDealIntentsAdd',
                state:{
                  transCode:record.transCode,
                  transactionMode:record.transactionMode,
                }
              }))}>缴纳意向金</p>}
            {/*!!record.intentionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseSellTrade/getStepModalData',
                payload:{
                  type:'intention',
                  current:1,
                  isApply:true,
                  status:'process',
                  applyId:record.applyId,
                  transCode:record.transCode,
                }
              })}>申请意向金退款</p>*/}
            {(!!record.intentionComplete && !record.intentionContractsUploaded) && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadIntentsAgreement',
                state:{
                  transCode:record.transCode,
                }
              }))}>补传意向合同</p>}
            {!!record.intentionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
              pathname:'/tradeManagement/secondHouseSellTrade/shSellIntentsRefundApply',
              state:{
                transCode:record.transCode,
              }
            }))}>申请意向金退款</p>}
            {/*!record.firstpaymentComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellDownPaymentAdd',
                state:{
                  transCode:record.transCode,
                }
              }))}>缴纳首付</p>*/}
            {/*!!record.firstpaymentComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseSellTrade/getStepModalData',
                payload:{
                  type:'payDown',
                  current:1,
                  isApply:true,
                  status:'process',
                  applyId:record.applyId,
                  transCode:record.transCode,
                }
              })}>申请首付款退款</p>*/}
            {/*!!record.firstpaymentComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
              pathname:'/tradeManagement/secondHouseSellTrade/shSellDownPaymentRefundApply',
              state:{
                transCode:record.transCode,
              }
            }))}>申请首付款退款</p>*/}
            {/*(!!record.firstpaymentComplete && !record.firstpaymentContractsUploaded) && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadDownPaymentAgreement',
                state:{
                  transCode:record.transCode,
                }
              }))}>上传首付合同</p>*/}
            {!record.releaseComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseRelieveLoan',
                state:{
                  transCode:record.transCode,
                }
              }))}>房产解押</p>}
            {!record.commissionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellCommissionAdd',
                state:{
                  transCode:record.transCode,
                }
              }))}>缴纳佣金</p>}
            {/*!!record.commissionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseSellTrade/getStepModalData',
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
              pathname:'/tradeManagement/secondHouseSellTrade/shSellCommissionRefundApply',
              state:{
                transCode:record.transCode,
              }
            }))}>申请佣金退款</p>}
            {(!!record.commissionComplete && !record.loanComplete) && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellLoanApply',
                state:{
                  transCode:record.transCode,
                }
              }))}>贷款分期</p>}
            {(!!record.commissionComplete && !record.transferComplete) && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellTransferApply',
                state:{
                  transCode:record.transCode,
                }
              }))}>办理过户</p>}
            {!!record.commissionComplete && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellCommitApply',
                state:{
                  transCode:record.transCode,
                }
              }))}>办理成交</p>}
            {(!!record.commissionComplete && !record.commissionContractsUploaded) && <p className='newhousedeal-operation-item' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadCommissionAgreement',
                state:{
                  transCode:record.transCode,
                }
              }))}>上传佣金协议</p>}
            {!record.isClosed && <p className='newhousedeal-operation-item' onClick={()=>dispatch({
                type:'secondHouseSellTrade/closeTrade',
                payload:record.transCode,
              })}>关闭交易</p>}
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
    return renderWaitTransactionRefundStatus(record,'已缴纳意向金','secondHouseSellDealUploadIntentsAgreement',dispatch,'intention');
  }else if(record.transStatus==='已缴纳首付款'){
    return renderWaitTransactionRefundStatus(record,'已缴纳首付款','secondHouseSellDealUploadDownPaymentAgreement',dispatch,'payDown');
  }else if(record.transStatus==='已申请首付款退款'){
    return renderWaitTransactionRefundStatus(record,'已申请首付款退款','secondHouseSellDealUploadDownPaymentAgreement',dispatch,'payDown');
  }else if(record.transStatus==='已执行首付款退款'){
    return renderWaitTransactionRefundStatus(record,'已执行首付款退款','secondHouseSellDealUploadDownPaymentAgreement',dispatch,'payDown');
  }else if(record.transStatus==='已申请意向金退款'){
    return renderWaitTransactionRefundStatus(record,'已申请意向金退款','secondHouseSellDealUploadIntentsAgreement',dispatch,'intention');
  }
  else if(record.transStatus==='已执行意向金退款'){
    return renderWaitTransactionRefundStatus(record,'已执行意向金退款','secondHouseSellDealUploadIntentsAgreement',dispatch,'intention');
  }else if(record.transStatus==='已缴纳佣金'){
    return renderWaitTransactionRefundStatus(record,'已缴纳佣金','secondHouseSellDealUploadCommissionAgreement',dispatch,'commission');
  }else if(record.transStatus==='已申请佣金退款'){
    return renderWaitTransactionRefundStatus(record,'已申请佣金退款','secondHouseSellDealUploadCommissionAgreement',dispatch,'commission');
  }else if(record.transStatus==='已执行佣金退款'){
    return renderWaitTransactionRefundStatus(record,'已执行佣金退款','secondHouseSellDealUploadCommissionAgreement',dispatch,'commission');
  }else if(record.transStatus==='已申请贷款'){
    return renderLoanStatus(record,dispatch);
  }else if(record.transStatus==='已申请过户'){
    return renderTransferStatus(record,dispatch);
  }else if(record.transStatus==='已申请成交'){
    return renderCommitStatus(record,dispatch);
  }else if(record.transStatus==='已申请解押'){
    return renderRelieveLoanStatus(record,dispatch);
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
            pathname:'/tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo',
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
            pathname:'/tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo',
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
            pathname:'/tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo',
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
//             type:'secondHouseSellTrade/getStepModalData',
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
//             type:'secondHouseSellTrade/getStepModalData',
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

function getAuditRecodeTypePathName(type){
  if(type==='intention'){
    return '/tradeManagement/secondHouseSellTrade/shSellIntentsRefundAuditInfo'
  }
  else if(type==='payDown'){
    return '/tradeManagement/secondHouseSellTrade/shSellDownPaymentRefundAuditInfo'
  }
  else if(type==='commission'){
    return '/tradeManagement/secondHouseSellTrade/shSellCommissionRefundAuditInfo'
  }
  else{
    // dispatch({
    //     type:'secondHouseSellTrade/getStepModalData',
    //     payload:{
    //       type,
    //       current:0,
    //       status:'process',
    //       isApply:false,
    //       applyId:record.applyId,
    //       transCode:record.transCode,
    //     }
    //   })
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
            current:0,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>退款待审核</p>
    </div>
    {/*return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type,
            current:0,
            status:'process',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>退款待审核</p>
    </div>*/}
  }else if(record.processingStatus==='退款审核通过'){
    return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            current:1,
            status:'finish',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>退款审核通过</p>
    </div>
    {/*return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type,
            current:1,
            status:'finish',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>退款审核通过</p>
    </div>*/}
  }else if(record.processingStatus==='退款申请驳回'){
    return <div>
      <p>{mainStatus}</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            current:1,
            status:'error',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>退款申请驳回</p>
    </div>
    {/*return <div>
      <p>{mainStatus}</p>
      <p className='red_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type,
            current:1,
            status:'error',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>退款申请驳回</p>
    </div>*/}
  }else if(record.processingStatus==='等待财务审核'){
    return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>等待财务审核</p>
    </div>
    {/*return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type,
            current:2,
            status:'process',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>等待财务审核</p>
    </div>*/}
  }else if(record.processingStatus==='财务审核驳回'){
    return <div>
      <p>{mainStatus}</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            current:2,
            status:'error',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>财务审核驳回</p>
    </div>
    {/*return <div>
      <p>{mainStatus}</p>
      <p className='red_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type,
            current:2,
            status:'error',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>财务审核驳回</p>
    </div>*/}
  }else if(record.processingStatus==='财务审核通过'){
    return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:getAuditRecodeTypePathName(type),
          state:{
            current:2,
            status:'success',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>财务审核通过</p>
    </div>
    {/*return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type,
            current:2,
            status:'process',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>财务审核通过</p>
    </div>*/}
  }else if(record.processingStatus==='已执行退款'){
    return <div>
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
    </div>
  }else if(record.processingStatus==='已执行退款'){
    return <div>
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
    </div>
    {/*return <div>
      <p>{mainStatus}</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type,
            current:3,
            status:'finish',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>已执行退款</p>
    </div>*/}
  }else if(record.processingStatus==='撤回申请'){
    return <div>
      <p>{mainStatus}</p>
      <p>已撤回申请</p>
    </div>
  }else{
    return <div>
      <p>{mainStatus}</p>
      {/*<p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:`/tradeManagement/secondHouseSellTrade/${uploadPath}`,
          state:{
            transCode:record.transCode,
          }
        }))}>补传协议</p>*/}
    </div>
  }
}

//贷款申请 审核次状态
function renderLoanStatus(record,dispatch){
  if(record.processingStatus==='等待受理'){
    return <div>
      <p>申请贷款</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellLoanApplyInfo',
          state:{
            current:0,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>等待受理</p>
    </div>
    {/*return <div>
      <p>申请贷款</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'loan',
            current:0,
            status:'process',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>等待受理</p>
    </div>*/}
  }else if(record.processingStatus==='贷款申请已受理'){
    return <div>
      <p>申请贷款</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellLoanApplyInfo',
          state:{
            current:1,
            status:'finish',
            isApply:false,
            transCode:record.transCode,
          }
        }))}>贷款已受理</p>
    </div>
    {/*return <div>
      <p>申请贷款</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'loan',
            current:1,
            status:'finish',
            applyId:record.applyId,
            isApply:false,
            transCode:record.transCode,
          }
        })}>贷款已受理</p>
    </div>*/}
  }else if(record.processingStatus==='贷款申请驳回'){
    return <div>
      <p>申请贷款</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellLoanApplyInfo',
          state:{
            current:1,
            status:'error',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>贷款申请驳回</p>
    </div>
    {/*return <div>
      <p>申请贷款</p>
      <p className='red_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'loan',
            current:1,
            status:'error',
            applyId:record.applyId,
            isApply:false,
            transCode:record.transCode,
          }
        })}>贷款申请驳回</p>
    </div>*/}
  }else if(record.processingStatus==='等待批款'){
    return <div>
      <p>申请贷款</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellLoanApplyInfo',
          state:{
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>等待批款</p>
    </div>
    {/*return <div>
      <p>申请贷款</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'loan',
            current:2,
            status:'process',
            applyId:record.applyId,
            isApply:false,
            transCode:record.transCode,
          }
        })}>等待批款</p>
    </div>*/}
  }else if(record.processingStatus==='批款驳回'){
    return <div>
      <p>申请贷款</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellLoanApplyInfo',
          state:{
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>批款驳回</p>
    </div>
    {/*return <div>
      <p>申请贷款</p>
      <p className='red_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'loan',
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
            isApply:false,
          }
        })}>批款驳回</p>
    </div>*/}
  }else if(record.processingStatus==='已批款'){
    return <div>
      <p>申请贷款</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellLoanApplyInfo',
          state:{
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>贷款已批</p>
    </div>
    {/*return <div>
      <p>申请贷款</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'loan',
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
            isApply:false,
          }
        })}>贷款已批</p>
    </div>*/}
  }else if(record.processingStatus==='撤回申请'){
    return <div>
      <p>申请贷款</p>
      <p>已撤回申请</p>
    </div>
  }else{
    return <div>
      <p>{record.transStatus}</p>
      <p>{isNull(record.processingStatus,'---')}</p>
    </div>
  }
}
// function renderLoanStatus(record,dispatch){
//   if(record.processingStatus==='等待受理'){
//     return <div>
//       <p>申请贷款</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'loan',
//             current:0,
//             status:'process',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>等待受理</p>
//     </div>
//   }else if(record.processingStatus==='贷款申请已受理'){
//     return <div>
//       <p>申请贷款</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'loan',
//             current:1,
//             status:'finish',
//             applyId:record.applyId,
//             isApply:false,
//             transCode:record.transCode,
//           }
//         })}>贷款已受理</p>
//     </div>
//   }else if(record.processingStatus==='贷款申请驳回'){
//     return <div>
//       <p>申请贷款</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'loan',
//             current:1,
//             status:'error',
//             applyId:record.applyId,
//             isApply:false,
//             transCode:record.transCode,
//           }
//         })}>贷款申请驳回</p>
//     </div>
//   }else if(record.processingStatus==='等待批款'){
//     return <div>
//       <p>申请贷款</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'loan',
//             current:2,
//             status:'process',
//             applyId:record.applyId,
//             isApply:false,
//             transCode:record.transCode,
//           }
//         })}>等待批款</p>
//     </div>
//   }else if(record.processingStatus==='批款驳回'){
//     return <div>
//       <p>申请贷款</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'loan',
//             current:2,
//             status:'process',
//             applyId:record.applyId,
//             transCode:record.transCode,
//             isApply:false,
//           }
//         })}>批款驳回</p>
//     </div>
//   }else if(record.processingStatus==='已批款'){
//     return <div>
//       <p>申请贷款</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'loan',
//             current:2,
//             status:'process',
//             applyId:record.applyId,
//             transCode:record.transCode,
//             isApply:false,
//           }
//         })}>贷款已批</p>
//     </div>
//   }else if(record.processingStatus==='撤回申请'){
//     return <div>
//       <p>申请贷款</p>
//       <p>已撤回申请</p>
//     </div>
//   }else{
//     return <div>
//       <p>{record.transStatus}</p>
//       <p>{isNull(record.processingStatus,'---')}</p>
//     </div>
//   }
// }


//过户申请 审核次状态
function renderTransferStatus(record,dispatch){
  if(record.processingStatus==='等待受理'){
    return <div>
      <p>申请过户</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellTransferApplyInfo',
          state:{
            current:0,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>等待受理</p>
    </div>
  }
  else if(record.processingStatus==='过户申请已受理'){
    return <div>
      <p>申请过户</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellTransferApplyInfo',
          state:{
            current:1,
            status:'finish',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>过户申请已受理</p>
    </div>
  }
  else if(record.processingStatus==='过户申请驳回'){
    return <div>
      <p>申请过户</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellTransferApplyInfo',
          state:{
            current:1,
            status:'error',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>过户申请驳回</p>
    </div>
  }
  else if(record.processingStatus==='等待过户'){
    return <div>
      <p>申请过户</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellTransferApplyInfo',
          state:{
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>等待过户</p>
    </div>
  }
  else if(record.processingStatus==='过户驳回'){
    return <div>
      <p>申请过户</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellTransferApplyInfo',
          state:{
            current:2,
            status:'error',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>过户驳回</p>
    </div>
  }
  else if(record.processingStatus==='已完成过户'){
    return <div>
      <p>申请过户</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellTransferApplyInfo',
          state:{
            current:2,
            status:'finish',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>已完成过户</p>
    </div>
  }
  else if(record.processingStatus==='撤回申请'){
    return <div>
      <p>申请过户</p>
      <p>已撤回申请</p>
    </div>
  }else{
    return <div>{'---'}</div>
  }
}
// function renderTransferStatus(record,dispatch){
//   if(record.processingStatus==='等待受理'){
//     return <div>
//       <p>申请过户</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'transfer',
//             current:0,
//             status:'process',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>等待受理</p>
//     </div>
//   }
//   else if(record.processingStatus==='过户申请已受理'){
//     return <div>
//       <p>申请过户</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'transfer',
//             current:1,
//             status:'finish',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>过户申请已受理</p>
//     </div>
//   }
//   else if(record.processingStatus==='过户申请驳回'){
//     return <div>
//       <p>申请过户</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'transfer',
//             current:1,
//             status:'error',
//             isApply:false,
//             applyId:record.applyId,
//             transCode:record.transCode,
//           }
//         })}>过户申请驳回</p>
//     </div>
//   }
//   else if(record.processingStatus==='等待过户'){
//     return <div>
//       <p>申请过户</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'transfer',
//             current:2,
//             status:'process',
//             applyId:record.applyId,
//             isApply:false,
//             transCode:record.transCode,
//           }
//         })}>等待过户</p>
//     </div>
//   }
//   else if(record.processingStatus==='过户驳回'){
//     return <div>
//       <p>申请过户</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'transfer',
//             current:2,
//             status:'error',
//             applyId:record.applyId,
//             isApply:false,
//             transCode:record.transCode,
//           }
//         })}>过户驳回</p>
//     </div>
//   }
//   else if(record.processingStatus==='已完成过户'){
//     return <div>
//       <p>申请过户</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'transfer',
//             current:2,
//             status:'finish',
//             applyId:record.applyId,
//             isApply:false,
//             transCode:record.transCode,
//           }
//         })}>已完成过户</p>
//     </div>
//   }
//   else if(record.processingStatus==='撤回申请'){
//     return <div>
//       <p>申请过户</p>
//       <p>已撤回申请</p>
//     </div>
//   }else{
//     return <div>{'---'}</div>
//   }
// }

//成交申请 审核次状态
function renderCommitStatus(record,dispatch){
  if(record.processingStatus==='等待成交审核'){
    return <div>
      <p>申请成交</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo',
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
          pathname:'/tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo',
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
          pathname:'/tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo',
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
          pathname:'/tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo',
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
          pathname:'/tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo',
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
          pathname:'/tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo',
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
//           type:'secondHouseSellTrade/getStepModalData',
//           payload:{
//             type:'commit',
//             current:0,
//             status:'process',
//             applyId:record.applyId,
//             isApply:false,
//             transCode:record.transCode,
//           }
//         })}>成交待审核</p>
//     </div>
//   }
//   else if(record.processingStatus==='成交审核通过'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
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
//   }
//   else if(record.processingStatus==='成交申请驳回'){
//     return <div>
//       <p>申请成交</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
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
//   }
//   else if(record.processingStatus==='等待财务审核'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
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
//   }
//   else if(record.processingStatus==='财务审核驳回'){
//     return <div>
//       <p>申请成交</p>
//       <p className='red_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
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
//   }
//   else if(record.processingStatus==='财务审核通过'){
//     return <div>
//       <p>申请成交</p>
//       <p className='blue_cursor' onClick={()=>dispatch({
//           type:'secondHouseSellTrade/getStepModalData',
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
//   }
//   else{
//     return <div>{'---'}</div>
//   }
// }

//解押申请 审核次状态
function renderRelieveLoanStatus(record,dispatch){
  if(record.processingStatus==='等待受理'){
    return <div>
      <p>房屋解押</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shRelieveLoanApplyInfo',
          state:{
            current:0,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>解押申请中</p>
    </div>
  }else if(record.processingStatus==='解押申请已受理'){
    return <div>
      <p>房屋解押</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shRelieveLoanApplyInfo',
          state:{
            current:1,
            status:'finish',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>解押已受理</p>
    </div>
  }else if(record.processingStatus==='解押申请驳回'){
    return <div>
      <p>房屋解押</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shRelieveLoanApplyInfo',
          state:{
            current:1,
            status:'error',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>解押申请驳回</p>
    </div>
  }else if(record.processingStatus==='等待批款'){
    return <div>
      <p>房屋解押</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shRelieveLoanApplyInfo',
          state:{
            current:2,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>等待批款</p>
    </div>
  }else if(record.processingStatus==='解押驳回'){
    return <div>
      <p>房屋解押</p>
      <p className='red_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shRelieveLoanApplyInfo',
          state:{
            current:2,
            status:'error',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>解押驳回</p>
    </div>
  }else if(record.processingStatus==='已批款'){
    return <div>
      <p>房屋解押</p>
      <p className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shRelieveLoanApplyInfo',
          state:{
            current:2,
            status:'finish',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        }))}>解押已批款</p>
    </div>
  }else if(record.processingStatus==='撤回申请'){
    return <div>
      <p>房屋解押</p>
      <p>已撤回申请</p>
    </div>
  }else{
    return <div>{'---'}</div>
  }
}

{/*
function renderRelieveLoanStatus(record,dispatch){
  if(record.processingStatus==='等待受理'){
    return <div>
      <p>房屋解押</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'relieveLoan',
            current:0,
            status:'process',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>解押申请中</p>
    </div>
  }else if(record.processingStatus==='解押申请已受理'){
    return <div>
      <p>房屋解押</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'relieveLoan',
            current:1,
            status:'finish',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>解押已受理</p>
    </div>
  }else if(record.processingStatus==='解押申请驳回'){
    return <div>
      <p>房屋解押</p>
      <p className='red_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'relieveLoan',
            current:1,
            status:'error',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>解押申请驳回</p>
    </div>
  }else if(record.processingStatus==='等待批款'){
    return <div>
      <p>房屋解押</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'relieveLoan',
            current:2,
            isApply:false,
            status:'process',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>等待批款</p>
    </div>
  }else if(record.processingStatus==='解押驳回'){
    return <div>
      <p>房屋解押</p>
      <p className='red_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'relieveLoan',
            current:2,
            status:'error',
            isApply:false,
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>解押驳回</p>
    </div>
  }else if(record.processingStatus==='已批款'){
    return <div>
      <p>房屋解押</p>
      <p className='blue_cursor' onClick={()=>dispatch({
          type:'secondHouseSellTrade/getStepModalData',
          payload:{
            type:'relieveLoan',
            current:2,
            isApply:false,
            status:'finish',
            applyId:record.applyId,
            transCode:record.transCode,
          }
        })}>解押已批款</p>
    </div>
  }else if(record.processingStatus==='撤回申请'){
    return <div>
      <p>房屋解押</p>
      <p>已撤回申请</p>
    </div>
  }else{
    return <div>{'---'}</div>
  }
}
*/}
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
      },
      {
        title: '支付流水号',
        dataIndex: 'paySerialNumber',
        key: 'paySerialNumber',
      },
      {
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
        title: '意向单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },{
        title: '意向总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
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
  else if(stepModal.type==='payDown'){
    const tableColumns=[
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },{
        title: '支付方式',
        dataIndex: 'payWay',
        key: 'payWay',
      },
      {
        title: '支付流水号',
        dataIndex: 'paySerialNumber',
        key: 'paySerialNumber',
      },
      {
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
        title: '成交单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },{
        title: '成交总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
      },{
        title: '首付款比例',
        dataIndex: 'payDownRatio',
        key: 'payDownRatio',
      },
      // {
      //   title: '意向金抵扣',
      //   dataIndex: 'deductedIntention',
      //   key: 'deductedIntention',
      // },
      {
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
        title: '房源总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
      },{
        title: '支持贷款',
        dataIndex: 'resourceSupportLoan',
        key: 'resourceSupportLoan',
        render:bool=><span>{bool?'支持':'不支持'}</span>
      },{
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    // const tradeProgressOptions = ['意向金已支付', '首付款已支付', '中介佣金已支付'];
    const tradeProgressOptions = ['意向金已支付', '中介佣金已支付'];
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>贷款房源</b>
        {!!applyData && <Table columns={tableColumns} dataSource={[applyData.orderInfo]} pagination={false}/>}
        <b style={{display:'block'}}>已完成</b>
        {!!applyData.applyInfo.compeleInfo && <div style={{padding:20}}>
          <CheckboxGroup options={tradeProgressOptions} value={applyData.applyInfo.compeleInfo} disabled/>
        </div>}
        <b style={{display:'block'}}>贷款信息</b>
        {!!applyData.applyInfo.formData && <DxShowMsgForm msgData={applyData.applyInfo.formData}/>}
        {!!applyData.applyInfo.applyPics && <PicList picListData={applyData.applyInfo.applyPics}/>}
        {!!applyData.auditInfo && <TimeRecordList listData={applyData.auditInfo}/>}
      </div>
    )
  }
  else if(stepModal.type==='relieveLoan'){
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
        title: '房源总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
      },{
        title: '支持贷款',
        dataIndex: 'resourceSupportLoan',
        key: 'resourceSupportLoan',
        render:bool=><span>{bool?'支持':'不支持'}</span>
      },{
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>解押房源</b>
        {!!applyData && <Table columns={tableColumns} dataSource={[applyData.orderInfo]} pagination={false}/>}
        <b style={{display:'block'}}>解押申请信息</b>
        {!!applyData.applyInfo.formData && <DxShowMsgForm msgData={applyData.applyInfo.formData}/>}
        {!!applyData.applyInfo.applyPics && <PicList picListData={applyData.applyInfo.applyPics}/>}
        {!!applyData.auditInfo && <TimeRecordList listData={applyData.auditInfo}/>}
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
      },
      {
        title: '支付流水号',
        dataIndex: 'paySerialNumber',
        key: 'paySerialNumber',
      },
      {
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
        title: '总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
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
    const tradeProgressOptions = ['意向金已支付', '中介佣金已支付'];
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
        title: '房源单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },{
        title: '房源总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
      },{
        title: '成交佣金',
        dataIndex: 'commissionAmount',
        key: 'commissionAmount',
      },{
        title: '房源经纪人',
        dataIndex: 'ownBroker',
        key: 'ownBroker',
      },{
        title: '客源经纪人',
        dataIndex: 'customerBroker',
        key: 'customerBroker',
      },{
        title: '成交时间',
        dataIndex: 'commitDate',
        key: 'commitDate',
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    // const tradeProgressOptions = ['意向金已支付','首付款已支付','中介佣金已支付','购房贷款','购房过户'];
    const tradeProgressOptions = ['意向金已支付','中介佣金已支付','购房贷款','购房过户'];
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>订单信息</b>
        {!!applyData && <Table columns={tableColumns} dataSource={[applyData.orderInfo]} pagination={false}/>}
        <b style={{display:'block'}}>已完成业务</b>
        {!!applyData.applyInfo.compeleInfo && <div style={{padding:20}}>
          <CheckboxGroup options={tradeProgressOptions} value={applyData.applyInfo.compeleInfo} disabled/>
        </div>}
        <b style={{display:'block'}}>退款信息</b>
        {!!applyData.applyInfo.formData && <DxShowMsgForm msgData={applyData.applyInfo.formData}/>}
        {!!applyData.applyInfo.applyPics && <PicList picListData={applyData.applyInfo.applyPics}/>}
        {!!applyData.auditInfo && <TimeRecordList listData={applyData.auditInfo}/>}
      </div>
    )
  }
  else if(stepModal.type==='transfer'){
    const tableColumns=[
      {
        title: '房源编号',
        dataIndex: 'houseCode',
        key: 'houseCode',
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
        title: '特点',
        dataIndex: 'traitName',
        key: 'traitName',
      },{
        title: '房源单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },{
        title: '房源总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
      },{
        title: '支持贷款',
        dataIndex: 'resourceSupportLoan',
        key: 'resourceSupportLoan',
        render:bool=><span>{!!bool?'支持':'不支持'}</span>
      }
    ];
    const applyData=!!stepModal.showDataInfo?JSON.parse(stepModal.showDataInfo):null;
    // const tradeProgressOptions = ['意向金已支付','首付款已支付','中介佣金已支付','购房贷款'];
    const tradeProgressOptions = ['意向金已支付','中介佣金已支付','购房贷款'];
    const ownCertificatesOptions = ['身份证','房产证'];
    const customerCertificatesOptions = ['身份证','结婚证','户口本'];
    return(
      <div className='newHouseTrade_transApply_content'>
        <b style={{display:'block'}}>过户房源</b>
        {!!applyData && <Table columns={tableColumns} dataSource={[applyData.orderInfo]} pagination={false}/>}
        <b style={{display:'block'}}>已完成业务</b>
        {!!applyData.applyInfo.compeleInfo && <div style={{padding:20}}>
          <CheckboxGroup options={tradeProgressOptions} value={applyData.applyInfo.compeleInfo} disabled/>
        </div>}
        <b style={{display:'block'}}>过户信息</b>
        {!!applyData.applyInfo.ownFormData && <DxShowMsgForm msgData={applyData.applyInfo.ownFormData}/>}
        {!!applyData.applyInfo.ownInfo && <div style={{padding:20}}>
          <CheckboxGroup options={ownCertificatesOptions} value={applyData.applyInfo.ownInfo} disabled/>
        </div>}
        {!!applyData.applyInfo.customerFormData && <DxShowMsgForm msgData={applyData.applyInfo.customerFormData}/>}
        {!!applyData.applyInfo.customerInfo && <div style={{padding:20}}>
          <CheckboxGroup options={customerCertificatesOptions} value={applyData.applyInfo.customerInfo} disabled/>
        </div>}
        {!!applyData.applyInfo.applyPics && <PicList picListData={applyData.applyInfo.applyPics}/>}
        {!!applyData.auditInfo && <TimeRecordList listData={applyData.auditInfo}/>}
      </div>
    )
  }
}
//生成审核步奏模态框footer元素
function renderStepModalFooter(stepModal,dispatch){
  const {confirmLoading}=stepModal;
  if(stepModal.current===0){
    return (
      <div>
        <Button type='ghost' onClick={()=>dispatch({
            type:'secondHouseSellTrade/closeStepsAuditingModal'
          })}>取消</Button>
        <Button type='primary' onClick={()=>dispatch({
            type:'secondHouseSellTrade/revokeRefundApply',
            payload:{
              transCode:stepModal.transCode,
              type:stepModal.type,
            },
          })} loading={confirmLoading}>撤回申请</Button>
      </div>
    );
  }else{
    return (
      <div>
        <Button type='ghost' onClick={()=>dispatch({
            type:'secondHouseSellTrade/closeStepsAuditingModal'
          })}>关闭</Button>
      </div>
    );
  }
}
function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
function mapStateToProps({secondHouseSellTrade}) {
  return {secondHouseSellTrade}
}
function creatReportedTabelColClassName(record, index){
  if(!!record.hasClass){
    return 'anzhu_table_col_bold';
  }else{
    return '';
  }
}
//export default connect(mapStateToProps)(Form.create({})(secondHouseSellTrade))
export default connect(mapStateToProps)(Form.create({})(SecondHouseSellTrade));
