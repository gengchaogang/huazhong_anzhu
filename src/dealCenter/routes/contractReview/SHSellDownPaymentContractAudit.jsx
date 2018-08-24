/********************* 二手房出售首付款退款合同审核  *********************/
import React, { PropTypes } from 'react'
import { routerRedux,Link } from 'dva/router'
import { connect } from 'dva'
import {Table,Button} from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import DxPanelMini from '../../../commons/components/DxPanelMini'
import DxAuditModal from '../../../commons/components/DxAuditModal'
import PromptModal from '../../../commons/View/PromptModal'
import DxValueList from '../../../commons/UI/DxValueList'
import TimeAxisList from '../../../commons/UI/TimeAxisList'
import PicList from '../../../commons/UI/PicList'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import {DxSteps,DxStep} from '../../../commons/View/DxSteps'
// import RevokeRefundModal from '../../components/RevokeRefundModal'
import './SHSellDownPaymentContractAudit.css'
const auditModalProps={

}
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:5,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
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
  },
  // {
  //   title: '客户电话',
  //   dataIndex: 'customerPhone',
  //   key: 'customerPhone',
  // },
  // {
  //   title: '成交单价',
  //   dataIndex: 'unitPrice',
  //   key: 'unitPrice',
  // },
  {
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
  },{
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render:(text,record)=><Link className='deal_operation' to={{pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellTradeInfoDetails',state:{
      transCode:record.transCode,
    }}}>交易详情</Link>,
  }
]
const SHSellDownPaymentContractAudit=({dispatch,shSellDownPaymentContractAudit:{
  promptObj,
  upLoadPicList,
  loading,
  auditorList,
  orderInfo,
  buttonLoading,
  showDataInfo,
  transCode,
  current,
  status,
  canRevoke,
  stepList,
  auditModal,
  canAudit,
}})=>{
  const showData=showDataInfo?JSON.parse(showDataInfo):{};
  console.log('showData',showData);

  return (
    <div className='shSellDownPaymentContractAudit'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <DxAuditModal {...auditModalProps} {...auditModal} doAudit={(data)=>dispatch({
          type:'shSellDownPaymentContractAudit/doAudit',
          payload:data,
        })} closeModal={()=>dispatch({
          type:'shSellDownPaymentContractAudit/cancelAudit'
        })} afterClose={()=>dispatch({
          type:'shSellDownPaymentContractAudit/afterCloseAuditModal'
        })}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'shSellDownPaymentContractAudit/closePrompt'})} onCancel={()=>dispatch({type:'shSellDownPaymentContractAudit/closePrompt'})}/>
      <DxPanel title='二手房出售首付款退款申请审核'>
        <DxSteps current={current} status={status}>
          {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
        </DxSteps>
        <DxPanelMini title='退款信息'>
          <Table dataSource={showDataInfo?[showData.orderInfo]:[]} rowKey={(record)=>`key_${record.transCode}`} columns={tableColumns} pagination={false}/>
        </DxPanelMini>
        <DxPanelMini title='退款说明' hasPadding={true}>
          <div>
            <DxValueList className='dx_valueList_padding_20' valueList={showDataInfo?[{label:'退款原因',value:showData.applyInfo.reason}]:[]}/>
            {(!!showDataInfo && !!showData.applyInfo.applyPics && showData.applyInfo.applyPics.length!==0) && <PicList picListData={showData.applyInfo.applyPics}/>}
          </div>
        </DxPanelMini>
        <DxPanelMini title='退款账户' hasPadding={true}>
          <DxValueList  valueList={showDataInfo?showData.returnedInfo:[]}/>
        </DxPanelMini>
        <DxPanelMini title='退款状态' hasPadding={true}>
          <TimeAxisList listData={showDataInfo?showData.auditInfo:[]}/>
        </DxPanelMini>
        <div className='anzhua_button_bottom'>
          {!!canAudit && <Button type='primary' onClick={()=>dispatch({
              type:'shSellDownPaymentContractAudit/updateAudit',
              payload:'pass',
            })}>审核通过</Button>}
          {!!canAudit && <Button className='anzhu_btn_reject' onClick={()=>dispatch({
              type:'shSellDownPaymentContractAudit/updateAudit',
              payload:'reject',
            })}>驳回申请</Button>}
          <Button type={!!canAudit?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
        </div>
      </DxPanel>
    </div>
  )
}

SHSellDownPaymentContractAudit.propTypes = {
  shSellDownPaymentContractAudit: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({shSellDownPaymentContractAudit}) {
  return {shSellDownPaymentContractAudit}
}
export default connect(mapStateToProps)(SHSellDownPaymentContractAudit);
