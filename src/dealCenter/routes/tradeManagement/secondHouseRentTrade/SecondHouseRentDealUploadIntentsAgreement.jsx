import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Table,Button} from 'antd'

import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import SHRentTradeInfo from '../../../../commons/components/SHRentTradeInfo'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'

import './SecondHouseRentDealUploadIntentsAgreement.css'

const SecondHouseRentDealUploadIntentsAgreement = ({location, dispatch,secondHouseRentDealUploadIntentsAgreement}) => {
  const {
    loading,
    promptObj,
    trackJSON,
    upLoadPicList,
  }=secondHouseRentDealUploadIntentsAgreement;
  const upLoadProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:10,
    maxSize:2,
    hideName:true,
    showDetail:true,
    changeList:(arr)=>dispatch({type:'secondHouseRentDealUploadIntentsAgreement/updatePicList',payload:arr}),
    doCover:false,
    showPicList:upLoadPicList,
  };
  return (
    <div className='secondHouseRentDealUploadIntentsAgreement'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseRentDealUploadIntentsAgreement/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseRentDealUploadIntentsAgreement/closePrompt'})}/>
      {!!trackJSON && <SHRentTradeInfo trackJSON={trackJSON} type='tradeCenter'/>}
      <DxPanel title='请上传出租意向金收据'>
        <DxUpLoadPic {...upLoadProps}/>
      </DxPanel>
      <div className='dx_bottom_buttonBox'>
        <Button type='primary' onClick={()=>dispatch({type:'secondHouseRentDealUploadIntentsAgreement/doUpLoad'})}>保存</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.push('/tradeManagement/secondHouseRentTrade'))}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseRentDealUploadIntentsAgreement.propTypes = {
  secondHouseRentDealUploadIntentsAgreement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseRentDealUploadIntentsAgreement}) {
  return {secondHouseRentDealUploadIntentsAgreement}
}

export default connect(mapStateToProps)(SecondHouseRentDealUploadIntentsAgreement)
