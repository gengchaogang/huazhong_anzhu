import React, { PropTypes } from 'react'

import {Button,Select, Option,Radio,Table} from 'antd';

import DxPanel from '../../../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../../../commons/View/PromptModal'

import IntentionItem from '../../../../../commons/UI/tradeItems/IntentionItem'
import PicList from '../../../../../commons/UI/PicList'
import CustomerInformation from '../../../../../commons/UI/tradeItems/CustomerInformation'
import IntentionHouse from '../../../../../commons/UI/tradeItems/IntentionHouse'
import ReportBroker from '../../../../../commons/UI/tradeItems/ReportBroker'
import TimelineComponents from '../../../../../commons/UI/tradeItems/TimelineComponents'
import PictureShow from '../../../../../commons/UI/tradeItems/PictureShow'
import YgdsyhTable from '../../../../../commons/UI/tradeItems/YgdsyhTable'
import './NewHouseTradeDetails.css'
export default function NewHouseTradeDetails({trackJSON}){
  if(!trackJSON){
    return(
      <div className='newHouseTradeDetails'>交易信息加载中...</div>
    )
  }else{
    const trackData=!!trackJSON?JSON.parse(trackJSON):{};
    return(
      <div className='newHouseTradeDetails'>
        {/*意向项目*/}
        {!!trackData.projectName && <IntentionItem name={trackData.projectName}/>}
        {/*客户信息*/}
        {!!trackData.customerInfo && <CustomerInformation mainInformationData={trackData.customerInfo}/>}
        {/*意向房源*/}
        {!!trackData.houseInfo && <IntentionHouse {...trackData.houseInfo}/>}
        {/*报备经纪人*/}
        {!!trackData.brokerInfo && <ReportBroker mainBrokerData={trackData.brokerInfo.data}   hasPic={true} picUrl={trackData.brokerInfo.picUrl}/>}
        {/*看房记录*/}
        {!!trackData.visitRecord && <TimelineComponents timelineData={trackData.visitRecord}/>}
        {/*已购电商优惠*/}
        {!!trackData.groupBuyDiscountInfo && <YgdsyhTable tableData={[trackData.groupBuyDiscountInfo]}/>}
        {/*团购锁定意向房源*/}
        {!!trackData.groupBuyHouseInfo && <IntentionHouse {...trackData.groupBuyHouseInfo} title='团购锁定意向房源' footer={<span className='dx_hight_cover'>{`团购锁定意向房源剩余：${trackData.groupBuyHouseInfo.houseInfo.restTime}`}</span>}/>}
        {/*电商收据/意向合同*/}
        {!!trackData.agreementInfo && <DxPanel title='电商收据/意向合同'>
          <PicList picListData={trackData.agreementInfo}/>
        </DxPanel>}
      </div>
    )
  }
}
