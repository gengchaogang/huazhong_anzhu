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
import './NHCommitContractAudit.css'
const auditModalProps={

}
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
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:5,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const NHCommitContractAudit=({dispatch,nhCommitContractAudit:{
  promptObj,
  upLoadPicList,
  loading,
  auditorList,
  orderInfo,
  buttonLoading,
  showDataInfo,
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
    <div className='nhCommitContractAudit applyInfoCom'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <DxAuditModal {...auditModalProps} {...auditModal} doAudit={(data)=>dispatch({
          type:'nhCommitContractAudit/doAudit',
          payload:data,
        })} closeModal={()=>dispatch({
          type:'nhCommitContractAudit/cancelAudit'
        })} afterClose={()=>dispatch({
          type:'nhCommitContractAudit/afterCloseAuditModal'
        })}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'nhCommitContractAudit/closePrompt'})} onCancel={()=>dispatch({type:'nhCommitContractAudit/closePrompt'})}/>
      <DxPanel title='新房成交合同审核'>
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
          {!!showDataInfo && <DxPanelMini title='成交审核' hasPadding={true}>
            <TimeAxisList listData={showData.auditRecord}/>
          </DxPanelMini>}
          <div className='anzhua_button_bottom'>
            {!!canAudit && <Button type='primary' onClick={()=>dispatch({
                type:'nhCommitContractAudit/updateAudit',
                payload:'pass',
              })}>审核通过</Button>}
            {!!canAudit && <Button className='anzhu_btn_reject' onClick={()=>dispatch({
                type:'nhCommitContractAudit/updateAudit',
                payload:'reject',
              })}>驳回申请</Button>}
            <Button type={!!canAudit?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
          </div>
        </div>
      </DxPanel>
    </div>
  )
}

NHCommitContractAudit.propTypes = {
  nhCommitContractAudit: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({nhCommitContractAudit}) {
  return {nhCommitContractAudit}
}
export default connect(mapStateToProps)(NHCommitContractAudit);
