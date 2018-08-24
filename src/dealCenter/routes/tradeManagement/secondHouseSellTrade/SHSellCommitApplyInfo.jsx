import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Table,Button,Checkbox} from 'antd'
const CheckboxGroup = Checkbox.Group;
import DxPanel from '../../../../commons/components/DxPanel'
import DxPanelMini from '../../../../commons/components/DxPanelMini'
import PromptModal from '../../../../commons/View/PromptModal'
import DxValueList from '../../../../commons/UI/DxValueList'
import TimeAxisList from '../../../../commons/UI/TimeAxisList'
import PicList from '../../../../commons/UI/PicList'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import {DxSteps,DxStep} from '../../../../commons/View/DxSteps'
import RevokeRefundModal from '../../../components/RevokeRefundModal'
import './SHSellCommitApplyInfo.css'
const tradeProgressOptions = ['意向金已支付','中介佣金已支付','购房贷款','购房过户'];
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:5,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
/************************** 二手房出售成交申请审核详情 **********************************/
const SHSellCommitApplyInfo=({dispatch,shSellCommitApplyInfo:{
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
  canReApply,
  stepList,
  revokeRefundModal,
}})=>{
  const showData=showDataInfo?JSON.parse(showDataInfo):{};
  console.log('showData',showData);
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
      title: '成交单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    },{
      title: '成交总价',
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
    <div className='shSellCommitApplyInfo'>
      {!!revokeRefundModal.visible && <RevokeRefundModal {...revokeRefundModal} applyCallBack={(data)=>dispatch({
          type:'shSellCommitApplyInfo/postRevokeRefundData',
          payload:data,
        })} closeModal={()=>dispatch({type:'shSellCommitApplyInfo/closeRevokeRefund'})}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'shSellCommitApplyInfo/closePrompt'})} onCancel={()=>dispatch({type:'shSellCommitApplyInfo/closePrompt'})}/>
      <DxPanel title='二手房出售成交申请审核详情'>
        <div>
          <DxSteps current={current} status={status}>
            {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
          </DxSteps>
          <DxPanelMini title='成交房源'>
            <Table dataSource={showDataInfo?[showData.orderInfo]:[]} rowKey={(record)=>`key_${record.transCode}`} columns={tableColumns} pagination={false}/>
          </DxPanelMini>
          <DxPanelMini title='客户已完成' hasPadding={true}>
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
            {!!canRevoke && <Button type='primary' onClick={()=>dispatch({
              type:'shSellCommitApplyInfo/readyRevokeApply',
            })} loading={buttonLoading}>撤回申请</Button>}
            {!!canReApply && <Button type='primary' onClick={()=>dispatch(routerRedux.push({
                pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellCommitApply',
                state:{
                  transCode,
                }
              }))}>重新申请</Button>}
            <Button type={!!canRevoke?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
          </div>
        </div>
      </DxPanel>
    </div>
  )
}

SHSellCommitApplyInfo.propTypes = {
  shSellCommitApplyInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({shSellCommitApplyInfo}) {
  return {shSellCommitApplyInfo}
}
export default connect(mapStateToProps)(SHSellCommitApplyInfo);
