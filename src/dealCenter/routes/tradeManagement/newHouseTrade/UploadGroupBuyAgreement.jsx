import React, { PropTypes } from 'react'
import { connect } from 'dva'
import {Button,Row,Col} from 'antd'
import { routerRedux } from 'dva/router'

import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import NHTradeInfo from '../../../../commons/components/NHTradeInfo'

import './UploadGroupBuyAgreement.css'



function UploadGroupBuyAgreement({dispatch,uploadGroupBuyAgreement}){
  const{promptObj,loading,trackJSON,upLoadPicList,projectInfo}=uploadGroupBuyAgreement;
  const trackData=!!trackJSON?JSON.parse(trackJSON):{};
  const upLoadProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:10,
    maxSize:2,
    hideName:true,
    showDetail:true,
    changeList:(arr)=>dispatch({type:'uploadGroupBuyAgreement/updatePicList',payload:arr}),
    doCover:false,
    showPicList:upLoadPicList,
  };
  //报错提示框回调判断
  const promptOk=()=>{
    dispatch({
      type:'uploadGroupBuyAgreement/closePrompt',
    });
  }
  const promptCancel=()=>{
    dispatch({type:'uploadGroupBuyAgreement/onlyClosePrompt'})
  }
  return(
    <div className='uploadGroupBuyAgreement'>
      {!!loading && <DxLoadingShadow visible={loading}/>}
      <PromptModal {...promptObj} onOk={promptOk} onCancel={promptCancel}/>
      {!!trackJSON && <NHTradeInfo trackJSON={trackJSON} projectInfo={projectInfo}/>}
      <DxPanel title='请上传电商合同和协议'>
        <DxUpLoadPic {...upLoadProps}/>
      </DxPanel>
      <div style={{textAlign:'right'}}>
        <Button type='primary' onClick={()=>dispatch({
            type:'uploadGroupBuyAgreement/doUpLoad',
          })}>保存</Button>
      </div>
    </div>
  )
}

function mapStateToProps({uploadGroupBuyAgreement}) {
  return {uploadGroupBuyAgreement}
}

export default connect(mapStateToProps)(UploadGroupBuyAgreement)
