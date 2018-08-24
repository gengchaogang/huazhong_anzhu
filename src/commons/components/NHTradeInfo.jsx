import React, { PropTypes } from 'react'

import {Button,Select, Option,Radio,Table,Row,Col} from 'antd';

import DxPanel from './DxPanel'
import DxLoadingShadow from '../UI/DxLoadingShadow'
import PromptModal from '../View/PromptModal'

import IntentionItem from '../UI/tradeItems/IntentionItem'
import PicList from '../UI/PicList'
import CustomerInformation from '../UI/tradeItems/CustomerInformation'
import IntentionHouse from '../UI/tradeItems/IntentionHouse'
import ReportBroker from '../UI/tradeItems/ReportBroker'
import TimelineComponents from '../UI/tradeItems/TimelineComponents'
import PictureShow from '../UI/tradeItems/PictureShow'
import YgdsyhTable from '../UI/tradeItems/YgdsyhTable'
import ProjectInfo from './tradeInfoItem/ProjectInfo'
import TimeRecordList from '../UI/TimeRecordList'
import NhTimeRecordList from '../UI/NhTimeRecordList'
import './NHTradeInfo.css'
export default function NHTradeInfo({trackJSON,projectInfo}){
  if(!trackJSON){
    return(
      <div className='nhTradeInfo'>交易信息加载中...</div>
    )
  }else{
    const trackData=!!trackJSON?JSON.parse(trackJSON):{};
    // console.log('trackData>>>>>>>>',trackData);
    return(
      <div className='nhTradeInfo'>
        {!!projectInfo && <DxPanel title='意向项目'>
          <ProjectInfo projectInfo={projectInfo}/>
        </DxPanel>}
        {
          trackData.map((item,index)=><div className='nhTradeInfoItem' key={`nhTradeInfoItem_${index}`}>
          {renderNHTradeInfoItem(item)}
        </div>)
        }
      </div>
    )
  }
}
function renderNHTradeInfoItem(item,index){
  if(!!item.value){
    if(item.type === '确看意向房源'){
      return <IntentionHouse houseInfo={item.value}  title='确看意向房源'/>
    }
    else if(item.type === '报备经纪人'){
      return <ReportBroker mainBrokerData={item.value.data}   hasPic={true} picUrl={item.value.picUrl}/>
    }
    else if(item.type === '客户信息'){
      return <CustomerInformation mainInformationData={item.value}/>
    }
    else if(item.type === '看房记录'){
      return <TimelineComponents title='看房记录' timelineData={item.value} flex={true}/>
    }
    // else if(item.type === '意向项目'){
    //   return <TimelineComponents title='客户看房记录' timelineData={item.value} flex={true}/>
    // }
    else if(item.type === '团购锁定意向房源'){
      return <IntentionHouse houseInfo={item.value} title='团购锁定意向房源' footer={<span className='dx_hight_cover'>{`团购锁定意向房源剩余：${item.value.restTime}`}</span>}/>
    }
    else if(item.type === '已购电商优惠'){
      return <YgdsyhTable tableData={[item.value]}/>
    }
    else if(item.type === '电商优惠动态'){
      return <DxPanel title='电商优惠动态'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '电商收据/意向合同'){
      return <DxPanel title='电商收据/意向合同'>
        <PicList picListData={item.value}/>
      </DxPanel>
    }
    // else if(item.type === '团购退款审核'){
    //   return <DxPanel title='团购退款办理'>
    //     <TimeRecordList listData={item.value}/>
    //   </DxPanel>
    // }
    else if(item.type === '实际成交房源'){
      return <IntentionHouse title='实际成交房源' houseInfo={item.value}/>
    }
    // else if(item.type === '成交价格'){
    //   return <CustomerInformation mainInformationData={item.value} title='成交价格'/>
    // }
    else if(item.type === '成交经纪人'){
      return <ReportBroker mainBrokerData={item.value.data} title='成交经纪人' hasPic={true} picUrl={item.value.picUrl}/>
    }
    else if(item.type === '成交佣金'){
      return <CustomerInformation mainInformationData={item.value} title='成交佣金'/>
    }
    else if(item.type === '成交合同或协议'){
      return <DxPanel title='成交合同或协议'>
        <PicList picListData={item.value}/>
      </DxPanel>
    }
    // else if(item.type === '成交审核'){
    //   return <TimelineComponents title='成交审核' timelineData={item.value}/>
    // }
    else if(item.type === '房屋成交信息'){
      return <DxPanel title='房屋成交信息'>
        <NhTimeRecordList listData={item.value}/>
      </DxPanel>
    }
  }else{
    return <i></i>
  }
}
