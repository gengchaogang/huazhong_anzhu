import React, { PropTypes } from 'react'
import {Select,Table,Timeline,Cascader,Button,Input,Row,Col}from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import UserMsg from '../UserMsg'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
//模拟图片数据
import textPic from '../../assets/yay.jpg'

import './index.css'
function TransactionDetails({dispatch,intentionProject,customerInformation,
  intentionHousingResources,filingBroker,houseRecord,electricityPreferential,
  buyLockIntentionListings,transactionListings,transactionCommission,
  contractOrAgreement,electricityReceipt,yjfpmx,
  transactionAudit,
  }){

  return(
    <div className='dealCenter-dealDetails'>
      {!!intentionProject && <DxPanel title='意向项目'>
        <span>{intentionProject}</span>
      </DxPanel>}
      {!!customerInformation && <DxPanel title='客户信息'>
        <div className='dealCenter-userMsgBox-userMsg'>
          <UserMsg userMsgData={customerInformation}/>
        </div>
      </DxPanel>}
      {!!intentionHousingResources && <DxPanel title='意向房源'>
        <div className='intentionListings'>
          <Table {...intentionHousingResources}/>
        </div>
      </DxPanel>}
      <div className='watchAgentHouseRecord'>
        <Row>
          <Col span={6}>
            {!!filingBroker && <DxPanel title='报备经纪人'>
              <div>
                <div className='dx-table-pic' style={{backgroundImage:`URL(${filingBroker.img})`}}></div>
                <div>性别:{filingBroker.gender}</div>
                <div>姓名:{filingBroker.name}</div>
                <div>联系电话:{filingBroker.phoneNumber}</div>
              </div>
            </DxPanel>}
          </Col>
          <Col span={18}>
            {!!houseRecord && <DxPanel title='看房记录'>
              <Timeline>
                {houseRecord.map((item,key)=><Timeline.Item key={`timeLine${key}`}>
                <span className='houseRecord-timeStamp'>{item.timeStamp}</span>
                <span className='houseRecord-content'>{item.content}</span>
                </Timeline.Item>)}
              </Timeline>
            </DxPanel>}
          </Col>
        </Row>
      </div>
      {!!electricityPreferential && <DxPanel title='已购电商优惠'>
        <div className='businessDiscount'>
          <Table {...electricityPreferential}/>
        </div>
      </DxPanel>}
      {!!buyLockIntentionListings && <DxPanel title='团购锁定意向房源'>
        <div className='groupBuyingLockingHouse'>
          <div className='groupBuyingLockingMain'>
            <div className='groupPurchaseContracts ' style={{backgroundImage:`URL(${buyLockIntentionListings.img})`}}></div>
            <div className='groupBuyingLockingword'>户型图/点击查看大图</div>
          </div>
          <div className='groupBuyingLockingMainIntroduce'>
            <div>{buyLockIntentionListings.mainWord}</div>
            <div>均价：{buyLockIntentionListings.junjia}  总价：{buyLockIntentionListings.price}</div>
          </div>
        </div>
      </DxPanel>}
      {!!electricityReceipt && <DxPanel title='电商收据/意向合同'>
        <div className='intentionListings'>
          {electricityReceipt.map((item,index)=>(<div className='groupPurchaseContracts ' key={index} style={{backgroundImage:`URL(${item})`}}></div>))}
        </div>
      </DxPanel>}
      {!!transactionListings && <DxPanel title='成交房源'>
        <div className='intentionListings'>
          <Table {...intentionHousingResources}/>
          <div style={{width:'200px'}}>
            <UserMsg userMsgData={transactionListings}/>
          </div>
        </div>
      </DxPanel>}
      {!!transactionCommission && <DxPanel title='成交佣金'>
        <div className='dealCommission'>
          <h3>成交经纪人</h3>
          <p>姓名：{transactionCommission.name} 性别：{transactionCommission.gender}</p>
          <p>联系电话：{transactionCommission.phone}</p>
          <h3>成交佣金</h3>
          <p>团购佣金总额：{transactionCommission.allCash} 平台抽佣10%实际佣金金额：
            {transactionCommission.cash}</p>
        </div>
      </DxPanel>}
      {!!contractOrAgreement && <DxPanel title='成交合同或协议'>
        <div className='intentionListings'>
          {contractOrAgreement.map((item,index)=>(<div className='groupPurchaseContracts ' key={index} style={{backgroundImage:`URL(${item})`}}></div>))}
        </div>
      </DxPanel>}
      {!!transactionAudit && <DxPanel title='成交审核'>
        <div className='houseRecord'>
          <Timeline>
          {transactionAudit.map((item,key)=><Timeline.Item key={`timeLine${key}`}>
          <span className='houseRecord-timeStamp'>{item.timeStamp}</span>
          <span className='houseRecord-content'>{item.content}</span>
          </Timeline.Item>)}
          </Timeline>
          <div style={{backgroundColor:'#CCC',padding:'15px'}}>
            <h3>佣金分配明细</h3>
            <p>佣金总额：{yjfpmx.yjTotal} 
               平台交易抽佣{yjfpmx.jyptcy}   实付佣金:{yjfpmx.sfyj}，
               经纪人：{yjfpmx.broker}
               银行账号：{yjfpmx.bankIdNumber}
            </p>
          </div>
        </div>
      </DxPanel>}
    </div>
  )
}
TransactionDetails.propTypes={

}
function mapStateToProps({transactionDetails}) {
  return {transactionDetails}
}
export default connect(mapStateToProps)(TransactionDetails)
