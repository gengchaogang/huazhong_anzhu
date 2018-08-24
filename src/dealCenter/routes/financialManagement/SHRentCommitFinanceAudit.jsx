/********************* 二手房出售成交合同审核  *********************/
import React, { PropTypes } from 'react'
import { routerRedux,Link } from 'dva/router'
import { connect } from 'dva'
import {Table,Button,Checkbox} from 'antd'
const CheckboxGroup = Checkbox.Group;
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
import './SHRentCommitFinanceAudit.css'
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
const tradeProgressOptions = ['意向金已支付','中介佣金已支付','租房分期'];
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
];
const SHRentCommitFinanceAudit=({dispatch,shRentCommitFinanceAudit:{
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
    <div className='shRentCommitFinanceAudit applyInfoCom'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <DxAuditModal {...auditModalProps} {...auditModal} doAudit={(data)=>dispatch({
          type:'shRentCommitFinanceAudit/doAudit',
          payload:data,
        })} closeModal={()=>dispatch({
          type:'shRentCommitFinanceAudit/cancelAudit'
        })} afterClose={()=>dispatch({
          type:'shRentCommitFinanceAudit/afterCloseAuditModal'
        })}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'shRentCommitFinanceAudit/closePrompt'})} onCancel={()=>dispatch({type:'shRentCommitFinanceAudit/closePrompt'})}/>
      <DxPanel title='二手房出租成交审核申请审核'>
        <div>
          <DxSteps current={current} status={status}>
            {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
          </DxSteps>
          <DxPanelMini title='成交房源'>
            <Table dataSource={showDataInfo?[showData.orderInfo]:[]} rowKey={(record)=>`key_${record.transCode}`} columns={tableColumns} pagination={false}/>
          </DxPanelMini>
          <DxPanelMini title='已办理业务' hasPadding={true}>
            <CheckboxGroup options={tradeProgressOptions} value={showDataInfo?showData.compeleInfo:[]} disabled/>
          </DxPanelMini>
          <DxPanelMini title='成交说明' hasPadding={true}>
            <div>
              <DxValueList className='dx_valueList_padding_20' valueList={showDataInfo?[{label:'成交说明',value:showData.applyInfo.reason}]:[]}/>
              {(!!showDataInfo && !!showData.applyInfo.applyPics && showData.applyInfo.applyPics.length!==0) && <PicList picListData={showData.applyInfo.applyPics}/>}
            </div>
          </DxPanelMini>
          <DxPanelMini title='成交信息' hasPadding={true}>
            <DxValueList  valueList={showDataInfo?showData.commitInfo:[]}/>
          </DxPanelMini>
          {(!!showDataInfo && !!showData.releaseInfo && showData.releaseInfo.length!==0) && <DxPanelMini title='成交资金释放' hasPadding={true}>
            <DxValueList  valueList={showDataInfo?showData.releaseInfo:[]}/>
          </DxPanelMini>}
          {(!!showDataInfo && !!showData.ownerInfo && showData.ownerInfo.length!==0) && <DxPanelMini title='业主信息' hasPadding={true}>
            <DxValueList  valueList={showDataInfo?showData.ownerInfo:[]}/>
          </DxPanelMini>}
          <DxPanelMini title='成交状态' hasPadding={true}>
            <TimeAxisList listData={showDataInfo?showData.auditInfo:[]}/>
          </DxPanelMini>
          <div className='anzhua_button_bottom'>
            {!!canAudit && <Button type='primary' onClick={()=>dispatch({
                type:'shRentCommitFinanceAudit/updateAudit',
                payload:'pass',
              })}>审核通过</Button>}
            {!!canAudit && <Button className='anzhu_btn_reject' onClick={()=>dispatch({
                type:'shRentCommitFinanceAudit/updateAudit',
                payload:'reject',
              })}>驳回申请</Button>}
            <Button type={!!canAudit?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
          </div>
        </div>
      </DxPanel>
    </div>
  )
}

SHRentCommitFinanceAudit.propTypes = {
  shRentCommitFinanceAudit: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({shRentCommitFinanceAudit}) {
  return {shRentCommitFinanceAudit}
}
export default connect(mapStateToProps)(SHRentCommitFinanceAudit);
