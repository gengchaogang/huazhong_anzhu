import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Table,Button} from 'antd'


import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import SHRentTradeInfo from '../../../../commons/components/SHRentTradeInfo'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'

import './SecondHouseRentDealUploadCommissionAgreement.css'
const SecondHouseRentDealUploadCommissionAgreement = ({location, dispatch,secondHouseRentDealUploadCommissionAgreement}) => {
  const {
    loading,
    promptObj,
    trackJSON,
    upLoadPicList,
  }=secondHouseRentDealUploadCommissionAgreement;
  const upLoadProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:10,
    maxSize:2,
    hideName:true,
    showDetail:true,
    changeList:(arr)=>dispatch({type:'secondHouseRentDealUploadCommissionAgreement/updatePicList',payload:arr}),
    doCover:false,
    showPicList:upLoadPicList,
  };
  return (
    <div className='secondHouseRentDealUploadCommissionAgreement'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseRentDealUploadCommissionAgreement/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseRentDealUploadCommissionAgreement/closePrompt'})}/>
      {!!trackJSON && <SHRentTradeInfo trackJSON={trackJSON} type='tradeCenter'/>}
      <DxPanel title='请上传佣金协议/合同'>
        <DxUpLoadPic {...upLoadProps}/>
      </DxPanel>
      <div className='dx_bottom_buttonBox'>
        <Button type='primary' onClick={()=>dispatch({type:'secondHouseRentDealUploadCommissionAgreement/doUpLoad'})}>保存</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.push('/tradeManagement/secondHouseRentTrade'))}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseRentDealUploadCommissionAgreement.propTypes = {
  secondHouseRentDealUploadCommissionAgreement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseRentDealUploadCommissionAgreement}) {
  return {secondHouseRentDealUploadCommissionAgreement}
}

export default connect(mapStateToProps)(SecondHouseRentDealUploadCommissionAgreement)
