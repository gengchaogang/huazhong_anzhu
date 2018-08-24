import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

import {Button,Select, Option,Radio,Table,Timeline} from 'antd';

import DxPanel from '../../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../../commons/View/PromptModal'

import IntentionItem from '../../../../commons/UI/tradeItems/IntentionItem'
import PicList from '../../../../commons/UI/PicList'
import CustomerInformation from '../../../../commons/UI/tradeItems/CustomerInformation'
import IntentionHouse from '../../../../commons/UI/tradeItems/IntentionHouse'
import ReportBroker from '../../../../commons/UI/tradeItems/ReportBroker'
import TimelineComponents from '../../../../commons/UI/tradeItems/TimelineComponents'
import PictureShow from '../../../../commons/UI/tradeItems/PictureShow'
import YgdsyhTable from '../../../../commons/UI/tradeItems/YgdsyhTable'
import './GroupBuyDetails.css'
function GroupBuyDetails({groupBuyDetails,dispatch}){
  const {
    groupKey,
    loading,
    trackJSON,
    promptObj,
  }=groupBuyDetails;
  const trackData=!!trackJSON?JSON.parse(trackJSON):{};
  //报错提示框回调判断
  const promptOk=()=>{
    dispatch({
      type:'groupBuyDetails/closePrompt',
    });
  }
  const promptCancel=()=>{
    dispatch({type:'groupBuyDetails/onlyClosePrompt'})
  }
  return(
    <div className='groupBuyDetails'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PromptModal {...promptObj} onOk={promptOk} onCancel={promptCancel}/>
      {!!trackJSON && <div>
        <IntentionItem name={trackData.projectName}/>
        <CustomerInformation mainInformationData={trackData.customerInfo}/>
        <IntentionHouse {...trackData.houseInfo}/>
        {trackData.brokerInfo!=null && <ReportBroker mainBrokerData={trackData.brokerInfo.data}   hasPic={true} picUrl={trackData.brokerInfo.picUrl}/>}
        <TimelineComponents timelineData={trackData.visitRecord}/>
        <YgdsyhTable tableData={[trackData.groupBuyDiscountInfo]}/>
        <IntentionHouse {...trackData.groupBuyHouseInfo} title='团购锁定意向房源' footer={<span className='dx_hight_cover'>{`团购锁定意向房源剩余：${trackData.groupBuyHouseInfo.houseInfo.restTime}`}</span>}/>
        <DxPanel title='电商收据/意向合同'>
          <PicList picListData={trackData.agreementInfo}/>
        </DxPanel>
      </div>}
      <div className='creatGroupBuy-implementBox'>
        <Button type='primary' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}
GroupBuyDetails.propTypes={

}
function mapStateToProps({groupBuyDetails}) {
  return {groupBuyDetails}
}
export default connect(mapStateToProps)(GroupBuyDetails)
