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
import './SHSellLoanApplyInfo.css'
const tradeProgressOptions = ['意向金已支付', '中介佣金已支付'];
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:5,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const SHSellLoanApplyInfo=({dispatch,shSellLoanApplyInfo:{
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
      title: '成交单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    },{
      title: '成交总价',
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
    <div className='shSellLoanApplyInfo'>
      {!!revokeRefundModal.visible && <RevokeRefundModal {...revokeRefundModal} applyCallBack={(data)=>dispatch({
          type:'shSellLoanApplyInfo/postRevokeRefundData',
          payload:data,
        })} closeModal={()=>dispatch({type:'shSellLoanApplyInfo/closeRevokeRefund'})}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'shSellLoanApplyInfo/closePrompt'})} onCancel={()=>dispatch({type:'shSellLoanApplyInfo/closePrompt'})}/>
      <DxPanel title='二手房出售贷款申请审核详情'>
        <DxSteps current={current} status={status}>
          {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
        </DxSteps>
        <DxPanelMini title='贷款房源'>
          <Table dataSource={showDataInfo?[showData.orderInfo]:[]} rowKey={(record)=>`key_${record.transCode}`} columns={tableColumns} pagination={false}/>
        </DxPanelMini>
        <DxPanelMini title='客户已完成' hasPadding={true}>
          <CheckboxGroup options={tradeProgressOptions} value={showDataInfo?showData.compeleInfo:[]} disabled/>
        </DxPanelMini>
        {/*<DxPanelMini title='贷款信息' hasPadding={true}>
          <div>
            <DxValueList className='dx_valueList_padding_20' valueList={showDataInfo?[{label:'申请理由',value:showData.applyInfo.reason}]:[]}/>
            {(!!showDataInfo && !!showData.applyInfo.applyPics && showData.applyInfo.applyPics.length!==0) && <PicList picListData={showData.applyInfo.applyPics}/>}
          </div>
        </DxPanelMini>*/}
        <DxPanelMini title='贷款信息' hasPadding={true}>
          <DxValueList  valueList={showDataInfo?showData.loanInfo:[]}/>
        </DxPanelMini>
        <DxPanelMini title='贷款状态' hasPadding={true}>
          <TimeAxisList listData={showDataInfo?showData.auditInfo:[]}/>
        </DxPanelMini>
        <div className='anzhua_button_bottom'>
          {!!canRevoke && <Button type='primary' onClick={()=>dispatch({
            type:'shSellLoanApplyInfo/readyRevokeApply',
          })} loading={buttonLoading}>撤回申请</Button>}
          <Button type={!!canRevoke?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
        </div>
      </DxPanel>
    </div>
  )
}

SHSellLoanApplyInfo.propTypes = {
  shSellLoanApplyInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({shSellLoanApplyInfo}) {
  return {shSellLoanApplyInfo}
}
export default connect(mapStateToProps)(SHSellLoanApplyInfo);
