import React from 'react'
import {Table,Icon,Timeline} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'

import './SecHouseShopOffceDone.css'
import SHRentTradeInfo from '../../../../commons/components/SHRentTradeInfo'
import SHSellTradeInfo from '../../../../commons/components/SHSellTradeInfo'
export default function SecHouseShopOffceDone({issaleWay,trackJSON}){
  const getTrackHouseOffDatil=(way,track)=>{
    if(way=='出售'){
      if(!!track){
        return <SHSellTradeInfo type='backStage' trackJSON={track}/>
      }else{
        return (
          <div className="no-info-box">
            <p>
              <Icon type="picture"/>
            </p>
            <div>暂无成交信息</div>
          </div>
        )
      }
    }else if(way=='出租'){
      if(!!track){
        return <SHRentTradeInfo type='backStage' trackJSON={track}/>
      }else{
        return (
          <div className="no-info-box">
            <p>
              <Icon type="picture"/>
            </p>
            <div>暂无成交信息</div>
          </div>
        )
      }
    }
  }
  return(
    <div>
      {getTrackHouseOffDatil(issaleWay,trackJSON)}
      {/*!!trackJSON?<SHRentTradeInfo type='backStage' trackJSON={trackJSON}/>:
      <div className="no-info-box">
        <p>
          <Icon type="picture"/>
        </p>
        <div>暂无成交信息</div>
      </div>*/}
      {/*!!track?
        <div>
          {!!JSON.parse(track).brokerInfo &&<DxPanel title='报成交经纪人'>
            <div className='flexStart'>
              <span className='logo' style={{background:`URL(${JSON.parse(track).brokerInfo.picUrl})`}}></span>
              <div className='flexBetween'>
                {JSON.parse(track).brokerInfo.data.map((item,index)=>(
                  <div key={`item_${index}`}>
                    <span>{item.label}：</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </DxPanel>}
          {!!JSON.parse(track).customerInfo &&<DxPanel title='报成交客户'>
            <div className='flexBetween'>
              {JSON.parse(track).customerInfo.map((item,index)=>(
                <div key={`item_${index}`}>
                  <span>{item.label}：</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </DxPanel>}
          {!!JSON.parse(track).customerBrokerInfo &&<DxPanel title='客户所属经纪人'>
            <div className='flexStart'>
              <span className='logo' style={{background:`URL(${JSON.parse(track).brokerInfo.picUrl})`}}></span>
              <div className='flexBetween'>
                {JSON.parse(track).customerBrokerInfo.data.map((item,index)=>(
                  <div key={`item_${index}`}>
                    <span>{item.label}：</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </DxPanel>}
          {!!JSON.parse(track).dealCommissionProportion &&<DxPanel title='合作成交佣金分配比例'>
            <div className='flexBetween'>
              {JSON.parse(track).dealCommissionProportion.map((item,index)=>(
                <div key={`item_${index}`}>
                  <span>{item.label}：</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </DxPanel>}
          {!!JSON.parse(track).reportRecord &&<DxPanel title='房源报成交记录'>
            <Timeline>
              {JSON.parse(track).reportRecord.map((item,index)=>(
                <Timeline.Item key={`item_${index}`}>{item.label} {item.value}</Timeline.Item>
              ))}
            </Timeline>
          </DxPanel>}
        </div>
        :<div className="no-info-box">
          <p>
            <Icon type="picture"/>
          </p>
          <div>暂无成交信息</div>
        </div>
      */}
    </div>
  )
}
