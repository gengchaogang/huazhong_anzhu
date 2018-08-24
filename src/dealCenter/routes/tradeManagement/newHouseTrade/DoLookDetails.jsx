import React, { PropTypes } from 'react'
import { connect } from 'dva'
import {Button,Row,Col} from 'antd'
import { routerRedux } from 'dva/router'

import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'

import IntentionItem from '../../../../commons/UI/tradeItems/IntentionItem'
import CustomerInformation from '../../../../commons/UI/tradeItems/CustomerInformation'
import IntentionHouse from '../../../../commons/UI/tradeItems/IntentionHouse'
import ReportBroker from '../../../../commons/UI/tradeItems/ReportBroker'
import TimelineComponents from '../../../../commons/UI/tradeItems/TimelineComponents'
import './DoLookDetails.css'

function DoLookDetails({dispatch,doLookDetails}){
  const {
    trackJSON,
    loading,
    promptObj,
    groupKey,
  }=doLookDetails;
  const goback=()=>{
    dispatch(routerRedux.goBack());
  }
  const promptOk=()=>{
    dispatch({
      type:'doLookDetails/closePrompt',
      payload:{
        visible:false,
      },
    });
  }
  const promptCancel=()=>{
    dispatch({
      type:'doLookDetails/closePrompt',
      payload:{
        visible:false,
      },
    });
  }
  const trackData=!!trackJSON?JSON.parse(trackJSON):{};
  console.log('trackData.houseInfo',trackData.houseInfo);
  return(
    <div className='dealCenter-doLookDetails'>
      <PromptModal {...promptObj} onOk={promptOk} onCancel={promptCancel}/>
      {!!loading && <DxLoadingShadow visible={loading}/>}
      {!!trackJSON && <div>
        <IntentionItem name={trackData.projectName}/>
        <CustomerInformation mainInformationData={trackData.customerInfo}/>
        <IntentionHouse {...trackData.houseInfo}/>
        {trackData.brokerInfo!=null && <ReportBroker mainBrokerData={trackData.brokerInfo.data}   hasPic={true} picUrl={trackData.brokerInfo.picUrl}/>}
        <TimelineComponents timelineData={trackData.visitRecord}/>
      </div>
      }
      <div className='creatGroupBuy-implementBox'>
        <Button type='primary' onClick={goback}>返回</Button>
      </div>
    </div>
  )
}
DoLookDetails.propTypes={

}
function mapStateToProps({doLookDetails}) {
  return {doLookDetails}
}
export default connect(mapStateToProps)(DoLookDetails)
