import React from 'react'
import {connect} from 'dva';
import {
  Icon,
  Button,
  Timeline
} from 'antd';
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../../commons/components/DxPanel'
import PromptModal from '../../../../../../commons/View/PromptModal'
import './SecHandSellingDeal.css'
import SHSellTradeInfo from '../../../../../../commons/components/SHSellTradeInfo'
function SecHandSellingDeal({dispatch,secHandSellingDeal}){
  const {
    promptObj,
    projectId,
    transCode,
    trackJSON,
  }=secHandSellingDeal;
  const handleCallBackOk=()=>{

  }
  const handleCallBackCancel=()=>{

  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingRecord',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell'
    }))
  }
  return (
    <div className="selling-strike-hands">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      {!!trackJSON ? <SHSellTradeInfo type='backStage' trackJSON={trackJSON}/>:
      <div className="no-info-box">
        <p>
          <Icon type="picture"/>
        </p>
        <div>暂无成交信息</div>
      </div>}
      {/*!!track?
        <div>
          {!!JSON.parse(track).tradingCenterInfo &&<DxPanel title='交易中心'>
              <div>
                {JSON.parse(track).tradingCenterInfo.map((item,index)=>(
                  <div key={`item_${index}`}>
                    <span>{item.label}：</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
          </DxPanel>}
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
      <div>
        <Button type="primary" onClick={toPrve}>上一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  );
}
function mapStateToProps({secHandSellingDeal}){
  return{secHandSellingDeal}
}
export default connect(mapStateToProps)(SecHandSellingDeal)
