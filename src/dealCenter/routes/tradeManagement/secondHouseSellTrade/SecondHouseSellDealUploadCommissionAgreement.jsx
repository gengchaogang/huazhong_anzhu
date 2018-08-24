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

import './SecondHouseSellDealUploadCommissionAgreement.css'
const SecondHouseSellDealUploadCommissionAgreement = ({location, dispatch,secondHouseSellDealUploadCommissionAgreement}) => {
  const {
    loading,
    promptObj,
    trackJSON,
    upLoadPicList,
  }=secondHouseSellDealUploadCommissionAgreement;
  const upLoadProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:10,
    maxSize:2,
    hideName:true,
    showDetail:true,
    changeList:(arr)=>dispatch({type:'secondHouseSellDealUploadCommissionAgreement/updatePicList',payload:arr}),
    doCover:false,
    showPicList:upLoadPicList,
  };
  return (
    <div className='secondHouseSellDealUploadCommissionAgreement'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseSellDealUploadCommissionAgreement/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellDealUploadCommissionAgreement/closePrompt'})}/>
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      <DxPanel title='请上传佣金协议/合同'>
        <DxUpLoadPic {...upLoadProps}/>
      </DxPanel>
      <div className='anzhua_button_bottom'>
        <Button type='primary' onClick={()=>dispatch({type:'secondHouseSellDealUploadCommissionAgreement/doUpLoad'})}>保存</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.push('/tradeManagement/secondHouseSellTrade'))}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellDealUploadCommissionAgreement.propTypes = {
  secondHouseSellDealUploadCommissionAgreement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellDealUploadCommissionAgreement}) {
  return {secondHouseSellDealUploadCommissionAgreement}
}

export default connect(mapStateToProps)(SecondHouseSellDealUploadCommissionAgreement)
