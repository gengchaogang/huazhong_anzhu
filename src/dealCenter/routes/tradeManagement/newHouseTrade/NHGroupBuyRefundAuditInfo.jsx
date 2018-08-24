import React, { PropTypes } from 'react'
import { routerRedux,Link} from 'dva/router'
import { connect } from 'dva'
import {Table,Button} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import DxPanelMini from '../../../../commons/components/DxPanelMini'
import DxConfirmModal from '../../../../commons/components/DxConfirmModal'
import PromptModal from '../../../../commons/View/PromptModal'
import DxValueList from '../../../../commons/UI/DxValueList'
import TimeAxisList from '../../../../commons/UI/TimeAxisList'
import PicList from '../../../../commons/UI/PicList'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import {DxSteps,DxStep} from '../../../../commons/View/DxSteps'
import './NHGroupBuyRefundAuditInfo.css'

const tableColumns=[
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
  },
  {
    title:'支付流水号',
    dataIndex:'paySerialNumber',
    key:'paySerialNumber',
  },
  {
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
    render:(text,record)=><Link className='deal_operation' to={{
      pathname:'/tradeManagement/newHouseTrade/newHouseTradeInfoDetails',
      state:{
        groupKey:record.groupKey,
      }
    }}>交易详情</Link>,
  }
]
const NHGroupBuyRefundAuditInfo=({dispatch,nhGroupBuyRefundAuditInfo:{
  promptObj,
  upLoadPicList,
  auditorList,
  orderInfo,
  buttonLoading,
  showDataInfo,
  groupBuyId,
  current,
  status,
  canRevoke,
  canReApply,
  stepList,
  confirmModal,
}})=>{
  const showData=showDataInfo?JSON.parse(showDataInfo):{};
  console.log('showData',showData);

  const confirmModalProps={
    ...confirmModal,
    onClose:()=>dispatch({
      type:'nhGroupBuyRefundAuditInfo/closeComfirmModal',
    }),
    onCancel:()=>dispatch({
      type:'nhGroupBuyRefundAuditInfo/closeComfirmModal',
    }),
    onOk:()=>dispatch({
      type:'nhGroupBuyRefundAuditInfo/onOkComfirmModal',
    }),
    afterClose:()=>dispatch({
      type:'nhGroupBuyRefundAuditInfo/afterCloseComfirmModal',
    }),
  }
  return (
    <div className='nhGroupBuyRefundAuditInfo applyInfoCom'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'nhGroupBuyRefundAuditInfo/closePrompt'})} onCancel={()=>dispatch({type:'nhGroupBuyRefundAuditInfo/closePrompt'})}/>
      <DxConfirmModal {...confirmModalProps}/>
      <DxPanel title='电商团购退款审核详情'>
        <div>
          <DxSteps current={current} status={status}>
            {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
          </DxSteps>
          <DxPanelMini title='订单详情'>
            <Table dataSource={showDataInfo?[showData.orderData]:[]} rowKey={(record)=>`key_${record.groupKey}`} columns={tableColumns} pagination={false}/>
          </DxPanelMini>
          <DxPanelMini title='退款说明' hasPadding={true}>
            <div>
              <DxValueList className='dx_valueList_padding_20' valueList={showDataInfo?[{label:'退款原因',value:showData.applyInfo.reason}]:[]}/>
              {(!!showDataInfo && !!showData.applyInfo.applyPics && showData.applyInfo.applyPics.length!==0) && <PicList picListData={showData.applyInfo.applyPics}/>}
            </div>
          </DxPanelMini>
          {/*(!!showDataInfo && !!showData.contractAuditInfo) &&  <DxPanelMini title='合同审核' hasPadding={true}>
            <div>
              <DxValueList className='dx_valueList_padding_20' valueList={[{label:'描述',value:showData.contractAuditInfo.reason}]}/>
              {(!!showData.contractAuditInfo.pics && showData.contractAuditInfo.pics.length!==0) && <PicList picListData={showData.contractAuditInfo.pics}/>}
            </div>
          </DxPanelMini>*/}
          {/*(!!showDataInfo && !!showData.financialAuditInfo) &&  <DxPanelMini title='财务审核' hasPadding={true}>
            <div>
              <DxValueList className='dx_valueList_padding_20' valueList={[{label:'描述',value:showData.financialAuditInfo.reason}]}/>
              {(!!showData.financialAuditInfo.pics && showData.financialAuditInfo.pics.length!==0) && <PicList picListData={showData.financialAuditInfo.pics}/>}
            </div>
          </DxPanelMini>*/}
          {/*!!showDataInfo && <DxPanelMini title='退款审核' hasPadding={true}>
            {showData.auditRecord.map((item,index)=><p style={{fontSize:14}} key={`auditRecordKey_${index}`}>{item}</p>)}
          </DxPanelMini>*/}
          {(!!showDataInfo && showData.auditRecord.length !== 0) && <DxPanelMini title='退款审核' hasPadding={true}>
            <TimeAxisList listData={showData.auditRecord}/>
          </DxPanelMini>}
          <div className='anzhua_button_bottom'>
            {!!canRevoke && <Button type='primary' onClick={()=>dispatch({
              type:'nhGroupBuyRefundAuditInfo/openRevokeComfirmModal',
            })} loading={buttonLoading}>撤回申请</Button>}
            {!!canReApply && <Button type='primary' onClick={()=>dispatch(routerRedux.push({
              pathname:'/tradeManagement/newHouseTrade/nhGroupBuyRefundApply',
              state:{
                groupBuyId,
              }
            }))}>重新申请</Button>}
            <Button type={(!!canRevoke || !!canReApply)?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
          </div>
        </div>
      </DxPanel>
    </div>
  )
}

NHGroupBuyRefundAuditInfo.propTypes = {
  nhGroupBuyRefundAuditInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({nhGroupBuyRefundAuditInfo}) {
  return {nhGroupBuyRefundAuditInfo}
}
export default connect(mapStateToProps)(NHGroupBuyRefundAuditInfo);
