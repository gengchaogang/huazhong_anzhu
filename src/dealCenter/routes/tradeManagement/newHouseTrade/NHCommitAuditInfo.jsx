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
import './NHCommitAuditInfo.css'

const tableColumns=[
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
const NHCommitAuditInfo=({dispatch,nhCommitAuditInfo:{
  promptObj,
  upLoadPicList,
  auditorList,
  orderInfo,
  groupKey,
  buttonLoading,
  showDataInfo,
  groupBuyId,
  current,
  status,
  canRevoke,
  stepList,
  confirmModal,
  canReApply,
  projectId,
}})=>{
  const showData=showDataInfo?JSON.parse(showDataInfo):{};
  const confirmModalProps={
    ...confirmModal,
    onClose:()=>dispatch({
      type:'nhCommitAuditInfo/closeComfirmModal',
    }),
    onCancel:()=>dispatch({
      type:'nhCommitAuditInfo/closeComfirmModal',
    }),
    onOk:()=>dispatch({
      type:'nhCommitAuditInfo/onOkComfirmModal',
    }),
    afterClose:()=>dispatch({
      type:'nhCommitAuditInfo/afterCloseComfirmModal',
    }),
  }
  console.log('showData.auditRecord',showData.auditRecord);
  return (
    <div className='nhCommitAuditInfo applyInfoCom'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'nhCommitAuditInfo/closePrompt'})} onCancel={()=>dispatch({type:'nhCommitAuditInfo/closePrompt'})}/>
      <DxConfirmModal {...confirmModalProps}/>
      <DxPanel title='新房成交审核详情'>
        <div>
          <DxSteps current={current} status={status}>
            {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
          </DxSteps>
          {(!!showDataInfo && !!showData.orderData) && <DxPanelMini title='成交详情'>
            <Table dataSource={showData.orderData?[showData.orderData]:[]} rowKey={(record)=>`key_${record.groupKey}`} columns={tableColumns} pagination={false}/>
          </DxPanelMini>}
          {(!!showDataInfo && showData.commissionInfos) && <DxPanelMini title='佣金分配'  hasPadding={true}>
            <DxValueList valueList={showData.commissionInfos}/>
          </DxPanelMini>}
          <DxPanelMini title='成交说明' hasPadding={true}>
            <div>
              <DxValueList className='dx_valueList_padding_20' valueList={showDataInfo?[{label:'成交原因',value:showData.applyInfo.reason}]:[]}/>
              {(!!showDataInfo && !!showData.applyInfo.applyPics && showData.applyInfo.applyPics.length!==0) && <PicList picListData={showData.applyInfo.applyPics}/>}
            </div>
          </DxPanelMini>
          {/*(!!showDataInfo && !!showData.contractAuditInfo) &&  <DxPanelMini title='成交审核' hasPadding={true}>
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
          {/*!!showDataInfo && <DxPanelMini title='成交审核' hasPadding={true}>
            {showData.auditRecord.map((item,index)=><p style={{fontSize:14}} key={`auditRecordKey_${index}`}>{item}</p>)}
          </DxPanelMini>*/}
          {!!showDataInfo && <DxPanelMini title='成交审核' hasPadding={true}>
            <TimeAxisList listData={showData.auditRecord}/>
          </DxPanelMini>}
          <div className='anzhua_button_bottom'>
            {!!canRevoke && <Button type='primary' onClick={()=>dispatch({
              type:'nhCommitAuditInfo/openRevokeComfirmModal',
            })} loading={buttonLoading}>撤回申请</Button>}
              {(!!canReApply && !!groupKey) && <Button type='primary' onClick={()=>dispatch(routerRedux.push({
                pathname: '/tradeManagement/newHouseTrade/creatTransactions',
                state:{
                  groupKey,
                  projectId,
                  todo:'reApply',
                },
            }))}>重新申请</Button>}
            <Button type={(!!canRevoke || !!canReApply)?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
          </div>
        </div>
      </DxPanel>
    </div>
  )
}

NHCommitAuditInfo.propTypes = {
  nhCommitAuditInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({nhCommitAuditInfo}) {
  return {nhCommitAuditInfo}
}
export default connect(mapStateToProps)(NHCommitAuditInfo);
