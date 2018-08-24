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
import './SHSellTransferApplyInfo.css'

const tradeProgressOptions = ['意向金已支付','中介佣金已支付','购房贷款'];
const ownCertificatesOptions = ['身份证','房产证'];
const customerCertificatesOptions = ['身份证','结婚证','户口本'];

const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:5,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const SHSellTransferApplyInfo=({dispatch,shSellTransferApplyInfo:{
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
  console.log('showData',showData);
  const tableColumns=[
    {
      title: '房源编号',
      dataIndex: 'houseCode',
      key: 'houseCode',
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
    },
    // {
    //   title: '特点',
    //   dataIndex: 'traitName',
    //   key: 'traitName',
    // },
    {
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
      render:bool=><span>{!!bool?'支持':'不支持'}</span>
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
    <div className='shSellTransferApplyInfo'>
      {!!revokeRefundModal.visible && <RevokeRefundModal {...revokeRefundModal} applyCallBack={(data)=>dispatch({
          type:'shSellTransferApplyInfo/postRevokeRefundData',
          payload:data,
        })} closeModal={()=>dispatch({type:'shSellTransferApplyInfo/closeRevokeRefund'})}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'shSellTransferApplyInfo/closePrompt'})} onCancel={()=>dispatch({type:'shSellTransferApplyInfo/closePrompt'})}/>
      <DxPanel title='二手房出售过户申请审核详情'>
        <DxSteps current={current} status={status}>
          {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
        </DxSteps>
        <DxPanelMini title='过户房源'>
          <Table dataSource={showDataInfo?[showData.orderInfo]:[]} rowKey={(record)=>`key_${record.transCode}`} columns={tableColumns} pagination={false}/>
        </DxPanelMini>
        <DxPanelMini title='客户已完成' hasPadding={true}>
          <CheckboxGroup options={tradeProgressOptions} value={showDataInfo?showData.compeleInfo:[]} disabled/>
        </DxPanelMini>
        <DxPanelMini title='过户信息' hasPadding={true}>
          <div>
            <DxValueList  valueList={showDataInfo?showData.ownFormData:[]}/>
            <DxValueList isElem={true} valueList={showDataInfo?[
                {
                  label:'提供资料',
                  value:<CheckboxGroup options={ownCertificatesOptions} value={showDataInfo?showData.ownInfo:[]} disabled/>
                }
              ]:[]}/>
            <DxValueList  valueList={showDataInfo?showData.customerFormData:[]}/>
            <DxValueList isElem={true} valueList={showDataInfo?[
                {
                  label:'提供资料',
                  value:<CheckboxGroup options={customerCertificatesOptions} value={showDataInfo?showData.customerInfo:[]} disabled/>
                }
              ]:[]}/>
          </div>
        </DxPanelMini>
        {/*<DxPanelMini title='贷款信息' hasPadding={true}>
          <div>
            <DxValueList className='dx_valueList_padding_20' valueList={showDataInfo?[{label:'申请理由',value:showData.applyInfo.reason}]:[]}/>
            {(!!showDataInfo && !!showData.applyInfo.applyPics && showData.applyInfo.applyPics.length!==0) && <PicList picListData={showData.applyInfo.applyPics}/>}
          </div>
        </DxPanelMini>*/}
        <DxPanelMini title='过户状态' hasPadding={true}>
          <TimeAxisList listData={showDataInfo?showData.auditInfo:[]}/>
        </DxPanelMini>
        <div className='anzhua_button_bottom'>
          {!!canRevoke && <Button type='primary' onClick={()=>dispatch({
            type:'shSellTransferApplyInfo/readyRevokeApply',
          })} loading={buttonLoading}>撤回申请</Button>}
          <Button type={!!canRevoke?'ghost':'primary'} onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
        </div>
      </DxPanel>
    </div>
  )
}

SHSellTransferApplyInfo.propTypes = {
  shSellTransferApplyInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({shSellTransferApplyInfo}) {
  return {shSellTransferApplyInfo}
}
export default connect(mapStateToProps)(SHSellTransferApplyInfo);
