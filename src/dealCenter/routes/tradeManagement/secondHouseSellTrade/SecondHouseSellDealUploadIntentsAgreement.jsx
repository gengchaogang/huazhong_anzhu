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

import './SecondHouseSellDealUploadIntentsAgreement.css'

const SecondHouseSellDealUploadIntentsAgreement = ({location, dispatch,secondHouseSellDealUploadIntentsAgreement}) => {
  const {
    loading,
    promptObj,
    trackJSON,
    upLoadPicList,
  }=secondHouseSellDealUploadIntentsAgreement;
  const upLoadProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:10,
    maxSize:2,
    hideName:true,
    showDetail:true,
    changeList:(arr)=>dispatch({type:'secondHouseSellDealUploadIntentsAgreement/updatePicList',payload:arr}),
    doCover:false,
    showPicList:upLoadPicList,
  };
  return (
    <div className='secondHouseSellDealUploadIntentsAgreement'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseSellDealUploadIntentsAgreement/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellDealUploadIntentsAgreement/closePrompt'})}/>
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      <DxPanel title='请上传意向金协议'>
        <DxUpLoadPic {...upLoadProps}/>
      </DxPanel>
      <div className='anzhua_button_bottom'>
        <Button type='primary' onClick={()=>dispatch({type:'secondHouseSellDealUploadIntentsAgreement/doUpLoad'})}>保存</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.push('/tradeManagement/secondHouseSellTrade'))}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellDealUploadIntentsAgreement.propTypes = {
  secondHouseSellDealUploadIntentsAgreement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellDealUploadIntentsAgreement}) {
  return {secondHouseSellDealUploadIntentsAgreement}
}

export default connect(mapStateToProps)(SecondHouseSellDealUploadIntentsAgreement)
