import React, { PropTypes } from 'react'
import {Select,Table,Timeline,Cascader,Button,Input,Row,Col}from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import TransactionDetails from '../../../components/TransactionDetails'
import UserMsg from '../../../components/UserMsg'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
//模拟图片数据
import textPic from '../../../assets/yay.jpg'

import './DealDetails.css'
import IntentionItem from '../../../../commons/UI/tradeItems/IntentionItem'
import CustomerInformation from '../../../../commons/UI/tradeItems/CustomerInformation'
import IntentionHouse from '../../../../commons/UI/tradeItems/IntentionHouse'
import ReportBroker from '../../../../commons/UI/tradeItems/ReportBroker'
import TimelineComponents from '../../../../commons/UI/tradeItems/TimelineComponents'
import PictureShow from '../../../../commons/UI/tradeItems/PictureShow'
import YgdsyhTable from '../../../../commons/UI/tradeItems/YgdsyhTable'

function DealDetails({dealDetails,dispatch}){
  const goback=()=>{
    dispatch(routerRedux.goBack());
  }
  const {
    intentionProject,
    customerInformation,
    intentionHousingResources,
    filingBroker,
    houseRecord,
    bbjjrImg,
    electricityPreferential,
    buyLockIntentionListings,
    transactionListings,
    transactionCommission,
    contractOrAgreement,
    transactionAudit,
    electricityReceipt,
    yjfpmx,
  }=dealDetails;

  const fenqi=(
    <div>
      {transactionListings.map((value,index)=>(
        <div key={`fenqi_${index}`}>
          <span>{value.label}：</span>
          <span>{value.value}</span>
        </div>
      ))}
    </div>
  )
  const yjfpmxs=(
    <div>
      <div>佣金分配明细</div>
      {yjfpmx.map((value,index)=>(
        <div key={`yjfpmxs${index}`}>
          <span>{value.label}：</span>
          <span>{value.value}</span>
        </div>
      ))}
    </div>
  )
  const headers=(<h3>成交经纪人</h3>);
  const footers=(
    <div>
      <h3>成交佣金</h3>
      {transactionCommission.map((value,index)=>(
        <div key={`footers${index}`}>
          <span>{value.label}：</span>
          <span>{value.value}</span>
        </div>
      ))}
    </div>
  );
  return(
    <div className='dealCenter-dealDetails'>
      <IntentionItem name={intentionProject}/>
      <CustomerInformation mainInformationData={customerInformation}/>
      <IntentionHouse houseData={intentionHousingResources}/>
      <ReportBroker mainBrokerData={filingBroker} hasPic={true}
        picUrl={bbjjrImg}/>
      <TimelineComponents timelineData={houseRecord}/>
      <YgdsyhTable tableData={electricityPreferential}/>
      <IntentionHouse houseData={buyLockIntentionListings}
        title='团购锁定意向房源'/>
      <PictureShow picArr={electricityReceipt}/>
      <ReportBroker mainBrokerData={filingBroker} hasPic={true}
        picUrl={bbjjrImg} title='成交佣金' footer={footers} header={headers}/>
      <IntentionHouse houseData={buyLockIntentionListings}
        title='成交房源' footer={fenqi} />
      <PictureShow picArr={electricityReceipt} title='成交合同或协议'/>
      <TimelineComponents timelineData={houseRecord} footer={yjfpmxs}/>
      <div className='creatGroupBuy-implementBox'>
        <Button type='primary' onClick={goback}>返回</Button>
      </div>
    </div>
  )
}

DealDetails.propTypes={

}
function mapStateToProps({dealDetails}) {
  return {dealDetails}
}
export default connect(mapStateToProps)(DealDetails)
