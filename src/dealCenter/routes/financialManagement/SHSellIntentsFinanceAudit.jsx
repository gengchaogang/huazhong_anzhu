import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
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
import './SHSellIntentsFinanceAudit.css'
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
const SHSellIntentsFinanceAudit=({dispatch,shSellIntentsFinanceAudit:{
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
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render:(text,record)=><span className='deal_operation' onClick={()=>dispatch(routerRedux.push({
        pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellTradeInfoDetails',
        state:{
          transCode,
        }
      }))}>交易详情</span>
    }
  ]
  return (
    <div className='shSellIntentsFinanceAudit'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <DxAuditModal {...auditModalProps} {...auditModal} doAudit={(data)=>dispatch({
          type:'shSellIntentsFinanceAudit/doAudit',
          payload:data,
        })} closeModal={()=>dispatch({
          type:'shSellIntentsFinanceAudit/cancelAudit'
        })} afterClose={()=>dispatch({
          type:'shSellIntentsFinanceAudit/afterCloseAuditModal'
        })}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'shSellIntentsFinanceAudit/closePrompt'})} onCancel={()=>dispatch({type:'shSellIntentsFinanceAudit/closePrompt'})}/>
      <DxPanel title='二手房出售意向金退款申请审核详情'>
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
              type:'shSellIntentsFinanceAudit/updateAudit',
              payload:'pass',
            })}>审核通过</Button>}
          {!!canAudit && <Button className='anzhu_btn_reject' onClick={()=>dispatch({
              type:'shSellIntentsFinanceAudit/updateAudit',
              payload:'reject',
            })}>驳回申请</Button>}
          <Button type={!!canAudit?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
        </div>
      </DxPanel>
    </div>
  )
}

SHSellIntentsFinanceAudit.propTypes = {
  shSellIntentsFinanceAudit: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({shSellIntentsFinanceAudit}) {
  return {shSellIntentsFinanceAudit}
}
export default connect(mapStateToProps)(SHSellIntentsFinanceAudit);
