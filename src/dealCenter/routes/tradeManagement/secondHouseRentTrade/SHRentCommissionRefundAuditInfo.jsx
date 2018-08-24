import React, { PropTypes } from 'react'
import { routerRedux,Link} from 'dva/router'
import { connect } from 'dva'
import {Table,Button} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import DxPanelMini from '../../../../commons/components/DxPanelMini'
import PromptModal from '../../../../commons/View/PromptModal'
import DxValueList from '../../../../commons/UI/DxValueList'
import TimeAxisList from '../../../../commons/UI/TimeAxisList'
import PicList from '../../../../commons/UI/PicList'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import {DxSteps,DxStep} from '../../../../commons/View/DxSteps'
import RevokeRefundModal from '../../../components/RevokeRefundModal'
import './SHRentCommissionRefundAuditInfo.css'

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
  },
  // {
  //   title: '承担方',
  //   dataIndex: 'undertaker',
  //   key: 'undertaker',
  // },{
  //   title: '电话',
  //   dataIndex: 'undertakerPhone',
  //   key: 'undertakerPhone',
  // },
  {
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
  },{
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render:(text,record)=><Link className='deal_operation' to={{
      pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentTradeInfoDetails',
      state:{
        transCode:record.transCode,
      }
    }}>交易详情</Link>
  }
]
const SHRentCommissionRefundAuditInfo=({dispatch,shRentCommissionRefundAuditInfo:{
  promptObj,
  upLoadPicList,
  auditorList,
  orderInfo,
  buttonLoading,
  showDataInfo,
  transCode,
  current,
  status,
  canRevoke,
  stepList,
  revokeRefundModal,
}})=>{
  const showData=showDataInfo?JSON.parse(showDataInfo):{};
  return (
    <div className='shRentCommissionRefundAuditInfo applyInfoCom'>
      {!!revokeRefundModal.visible && <RevokeRefundModal {...revokeRefundModal} applyCallBack={(data)=>dispatch({
          type:'shRentCommissionRefundAuditInfo/postRevokeRefundData',
          payload:data,
        })} closeModal={()=>dispatch({type:'shRentCommissionRefundAuditInfo/closeRevokeRefund'})}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'shRentCommissionRefundAuditInfo/closePrompt'})} onCancel={()=>dispatch({type:'shRentCommissionRefundAuditInfo/closePrompt'})}/>
      <DxPanel title='二手房出租佣金退款申请审核详情'>
        <DxSteps current={current} status={status}>
          {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
        </DxSteps>
        <DxPanelMini title='退款信息'>
          <Table dataSource={showDataInfo?[showData.orderInfo]:[]} rowKey={(record)=>`key_${record.transCode}`} columns={tableColumns} pagination={false}/>
        </DxPanelMini>
        <DxPanelMini title='退款说明' hasPadding={true}>
          <div>
            <DxValueList className='dx_valueList_padding_20' valueList={showDataInfo?showData.applyInfo.formData:[]}/>
            {(!!showDataInfo && !!showData.applyInfo.applyPics && showData.applyInfo.applyPics.length!==0) && <PicList picListData={showData.applyInfo.applyPics}/>}
          </div>
        </DxPanelMini>
        {/*<DxPanelMini title='退款账户' hasPadding={true}>
          <DxValueList  valueList={showDataInfo?showData.returnedInfo:[]}/>
        </DxPanelMini>*/}
        <DxPanelMini title='退款状态' hasPadding={true}>
          <TimeAxisList listData={showDataInfo?showData.auditInfo:[]}/>
        </DxPanelMini>
        <div className='anzhua_button_bottom'>
          {!!canRevoke && <Button type='primary' onClick={()=>dispatch({
            type:'shRentCommissionRefundAuditInfo/readyRevokeApply',
          })} loading={buttonLoading}>撤回申请</Button>}
          <Button type={!!canRevoke?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
        </div>
      </DxPanel>
    </div>
  )
}

SHRentCommissionRefundAuditInfo.propTypes = {
  shRentCommissionRefundAuditInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({shRentCommissionRefundAuditInfo}) {
  return {shRentCommissionRefundAuditInfo}
}
export default connect(mapStateToProps)(SHRentCommissionRefundAuditInfo);
