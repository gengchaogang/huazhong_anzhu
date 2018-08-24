import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Table,Button} from 'antd'


import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
// import SecondHouseTradeDetails from '../../../components/secondHouseSellTrade/SecondHouseTradeDetails'
import SHSellTradeInfo from '../../../../commons/components/SHSellTradeInfo'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'

import './SecondHouseSellDealUploadDownPaymentAgreement.css'
const SecondHouseSellDealUploadDownPaymentAgreement = ({location, dispatch,secondHouseSellDealUploadDownPaymentAgreement}) => {
  const {
    loading,
    promptObj,
    trackJSON,
    upLoadPicList,
  }=secondHouseSellDealUploadDownPaymentAgreement;
  const upLoadProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:10,
    maxSize:2,
    hideName:true,
    showDetail:true,
    changeList:(arr)=>dispatch({type:'secondHouseSellDealUploadDownPaymentAgreement/updatePicList',payload:arr}),
    doCover:false,
    showPicList:upLoadPicList,
  };
  return (
    <div className='secondHouseSellDealUploadDownPaymentAgreement'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseSellDealUploadDownPaymentAgreement/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellDealUploadDownPaymentAgreement/closePrompt'})}/>
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      <DxPanel title='请上传首付款协议/合同'>
        <DxUpLoadPic {...upLoadProps}/>
      </DxPanel>
      <div className='anzhua_button_bottom'>
        <Button type='primary' onClick={()=>dispatch({type:'secondHouseSellDealUploadDownPaymentAgreement/doUpLoad'})}>保存</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.push('/tradeManagement/secondHouseSellTrade'))}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellDealUploadDownPaymentAgreement.propTypes = {
  secondHouseSellDealUploadDownPaymentAgreement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellDealUploadDownPaymentAgreement}) {
  return {secondHouseSellDealUploadDownPaymentAgreement}
}

export default connect(mapStateToProps)(SecondHouseSellDealUploadDownPaymentAgreement)
