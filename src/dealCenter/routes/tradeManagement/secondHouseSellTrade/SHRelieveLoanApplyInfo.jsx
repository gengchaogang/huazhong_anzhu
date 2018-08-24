import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
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
import './SHRelieveLoanApplyInfo.css'

const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:5,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const SHRelieveLoanApplyInfo=({dispatch,shRelieveLoanApplyInfo:{
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
  const tableColumns=[
    {
      title:'房源编号',
      dataIndex:'resourcesNumber',
      key:'resourcesNumber',
    },{
      title: '所属小区',
      dataIndex: 'communityName',
      key: 'communityName',
    },
    {
      title: '物业类型',
      dataIndex: 'propertyType',
      key: 'propertyType',
    },{
      title: '房源信息',
      dataIndex: 'houseInfo',
      key: 'houseInfo',
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
      title: '支持贷款',
      dataIndex: 'resourceSupportLoan',
      key: 'resourceSupportLoan',
      render:bool=><span>{bool?'支持':'不支持'}</span>
    },{
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
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
    <div className='shRelieveLoanApplyInfo'>
      {!!revokeRefundModal.visible && <RevokeRefundModal {...revokeRefundModal} applyCallBack={(data)=>dispatch({
          type:'shRelieveLoanApplyInfo/postRevokeRefundData',
          payload:data,
        })} closeModal={()=>dispatch({type:'shRelieveLoanApplyInfo/closeRevokeRefund'})}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'shRelieveLoanApplyInfo/closePrompt'})} onCancel={()=>dispatch({type:'shRelieveLoanApplyInfo/closePrompt'})}/>
      <DxPanel title='二手房出售解押申请审核详情'>
        <DxSteps current={current} status={status}>
          {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
        </DxSteps>
        <DxPanelMini title='解押房源'>
          <Table dataSource={showDataInfo?[showData.orderInfo]:[]} rowKey={(record)=>`key_${record.transCode}`} columns={tableColumns} pagination={false}/>
        </DxPanelMini>
        <DxPanelMini title='解押说明' hasPadding={true}>
          <div>
            <DxValueList className='dx_valueList_padding_20' valueList={showDataInfo?[{label:'解押说明',value:showData.applyInfo.reason}]:[]}/>
            {(!!showDataInfo && !!showData.applyInfo.applyPics && showData.applyInfo.applyPics.length!==0) && <PicList picListData={showData.applyInfo.applyPics}/>}
          </div>
        </DxPanelMini>
        <DxPanelMini title='解押信息' hasPadding={true}>
          <DxValueList  valueList={showDataInfo?showData.relieveInfo:[]}/>
        </DxPanelMini>
        <DxPanelMini title='解押状态' hasPadding={true}>
          <TimeAxisList listData={showDataInfo?showData.auditInfo:[]}/>
        </DxPanelMini>
        <div className='anzhua_button_bottom'>
          {!!canRevoke && <Button type='primary' onClick={()=>dispatch({
            type:'shRelieveLoanApplyInfo/readyRevokeApply',
          })} loading={buttonLoading}>撤回申请</Button>}
          <Button type={!!canRevoke?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
        </div>
      </DxPanel>
    </div>
  )
}

SHRelieveLoanApplyInfo.propTypes = {
  shRelieveLoanApplyInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({shRelieveLoanApplyInfo}) {
  return {shRelieveLoanApplyInfo}
}
export default connect(mapStateToProps)(SHRelieveLoanApplyInfo);
