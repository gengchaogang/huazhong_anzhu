import React, { PropTypes } from 'react'

import {Button,Select, Option,Radio,Table,Row,Col} from 'antd';

import DxPanel from '../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../commons/View/PromptModal'

import IntentionItem from '../../../commons/UI/tradeItems/IntentionItem'
import PicList from '../../../commons/UI/PicList'
import CustomerInformation from '../../../commons/UI/tradeItems/CustomerInformation'
import IntentionHouse from '../../../commons/UI/tradeItems/IntentionHouse'
import ReportBroker from '../../../commons/UI/tradeItems/ReportBroker'
import TimelineComponents from '../../../commons/UI/tradeItems/TimelineComponents'
import PictureShow from '../../../commons/UI/tradeItems/PictureShow'
import YgdsyhTable from '../../../commons/UI/tradeItems/YgdsyhTable'
import ProjectInfo from './ProjectInfo'
import './NewHouseTradeDetails.css'
export default function NewHouseTradeDetails({trackJSON,projectInfo}){
  if(!trackJSON){
    return(
      <div className='newHouseTradeDetails'>交易信息加载中...</div>
    )
  }else{
    const trackData=!!trackJSON?JSON.parse(trackJSON):{};
    console.log('trackData',trackData);
    return(
      <div className='newHouseTradeDetails'>
        {/*意向项目*/}
        {/*!!trackData.projectName && <IntentionItem name={trackData.projectName}/>*/}
        <DxPanel title='客户意向项目'>
          <ProjectInfo projectInfo={projectInfo}/>
        </DxPanel>
        {/*客户信息*/}
        {!!trackData.customerInfo && <CustomerInformation mainInformationData={trackData.customerInfo}/>}
        {/*意向房源*/}
        {!!trackData.houseInfo && <IntentionHouse {...trackData.houseInfo}/>}
        {/*报备经纪人*/}
        {!!trackData.brokerInfo && <ReportBroker mainBrokerData={trackData.brokerInfo.data}   hasPic={true} picUrl={trackData.brokerInfo.picUrl}/>}
        {/*看房记录*/}
        {!!trackData.visitRecord && <TimelineComponents title='客户看房记录' timelineData={trackData.visitRecord} flex={true}/>}
        {/*已购电商优惠*/}
        {!!trackData.groupBuyDiscountInfo && <YgdsyhTable tableData={[trackData.groupBuyDiscountInfo]}/>}
        {/*团购锁定意向房源*/}
        {!!trackData.groupBuyHouseInfo && <IntentionHouse {...trackData.groupBuyHouseInfo} title='团购锁定意向房源' footer={<span className='dx_hight_cover'>{`团购锁定意向房源剩余：${trackData.groupBuyHouseInfo.houseInfo.restTime}`}</span>}/>}
        {/*电商收据/意向合同*/}
        {!!trackData.agreementInfo && <DxPanel title='电商收据/意向合同'>
          <PicList picListData={trackData.agreementInfo}/>
        </DxPanel>}
        {/*成交房源*/}
        {!!trackData.commitHouseInfo && <IntentionHouse title='成交房源' {...trackData.commitHouseInfo}/>}
        {/*成交价格*/}
        {!!trackData.commitAmount && <CustomerInformation mainInformationData={trackData.commitAmount} title='成交价格'/>}
        {/*成交经纪人*/}
        {!!trackData.commitBrokerInfo && <ReportBroker mainBrokerData={trackData.commitBrokerInfo.data} title='成交经纪人' hasPic={true} picUrl={trackData.commitBrokerInfo.picUrl}/>}
        {/*成交佣金*/}
        {!!trackData.commissionAmount && <CustomerInformation mainInformationData={trackData.commissionAmount} title='成交佣金'/>}
        {/*成交合同或协议*/}
        {!!trackData.commitAgreement && <DxPanel title='成交合同或协议'>
          <PicList picListData={trackData.commitAgreement}/>
        </DxPanel>}
        {/*成交记录*/}
        {!!trackData.commitRecord && <TimelineComponents title='成交记录' timelineData={trackData.commitRecord}/>}
      </div>
    )
  }
}
