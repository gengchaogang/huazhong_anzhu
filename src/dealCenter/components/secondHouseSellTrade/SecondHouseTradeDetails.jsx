import React, { PropTypes } from 'react'

import { routerRedux} from 'dva/router'
import {Button,Select, Option,Radio,Table} from 'antd';

import DxPanel from '../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../commons/View/PromptModal'

import IntentionItem from '../../../commons/UI/tradeItems/IntentionItem'
import PicList from '../../../commons/UI/PicList'
import DxShowMsgForm from '../../../commons/UI/DxShowMsgForm'
import TimeRecordList from '../../../commons/UI/TimeRecordList'
import CustomerInformation from '../../../commons/UI/tradeItems/CustomerInformation'
import IntentionHouse from '../../../commons/UI/tradeItems/IntentionHouse'
import ReportBroker from '../../../commons/UI/tradeItems/ReportBroker'
import TimelineComponents from '../../../commons/UI/tradeItems/TimelineComponents'
import PictureShow from '../../../commons/UI/tradeItems/PictureShow'
import YgdsyhTable from '../../../commons/UI/tradeItems/YgdsyhTable'
import './SecondHouseTradeDetails.css'

const intentsColumns=[
  {
    title:'订单编号',
    dataIndex:'id',
    key:'id',
  },{
    title:'支付方式',
    dataIndex:'payWay',
    key:'payWay',
  },
  {
    title:'支付流水号',
    dataIndex:'paySerialNumber',
    key:'paySerialNumber',
  },
  {
    title:'支付时间',
    dataIndex:'payTime',
    key:'payTime',
  },{
    title:'支付客户',
    dataIndex:'customer',
    key:'customer',
  },{
    title:'支付手机号',
    dataIndex:'phoneNumber',
    key:'phoneNumber',
  },{
    title:'意向单价',
    dataIndex:'price',
    key:'price',
  },{
    title:'意向总价',
    dataIndex:'totalPrice',
    key:'totalPrice',
  },{
    title:'支付意向金',
    dataIndex:'intentsPrice',
    key:'intentsPrice',
  },{
    title:'支付状态',
    dataIndex:'payStatus',
    key:'payStatus',
  }
];
const downPaymentColumns=[
  {
    title:'订单编号',
    dataIndex:'id',
    key:'id',
  },{
    title:'支付方式',
    dataIndex:'payWay',
    key:'payWay',
  },
  {
    title:'支付流水号',
    dataIndex:'paySerialNumber',
    key:'paySerialNumber',
  },
  {
    title:'支付时间',
    dataIndex:'payTime',
    key:'payTime',
  },{
    title:'成交总价',
    dataIndex:'dealTotalPrice',
    key:'dealTotalPrice',
  },{
    title:'支付客户',
    dataIndex:'customer',
    key:'customer',
  },{
    title:'支付手机号',
    dataIndex:'phoneNumber',
    key:'phoneNumber',
  },{
    title:'首付款比例',
    dataIndex:'proportion',
    key:'proportion',
  },
  // {
  //   title:'意向金抵扣',
  //   dataIndex:'intentsDeductible',
  //   key:'intentsDeductible',
  // },
  {
    title:'支付金额',
    dataIndex:'payAmount',
    key:'payAmount',
  },{
    title:'支付状态',
    dataIndex:'payStatus',
    key:'payStatus',
  }
];
const commissionColumns=[
  {
    title:'订单编号',
    dataIndex:'orderNumber',
    key:'orderNumber',
  },{
    title:'支付方式',
    dataIndex:'payWay',
    key:'payWay',
  },
  {
    title:'支付流水号',
    dataIndex:'paySerialNumber',
    key:'paySerialNumber',
  },
  {
    title:'支付时间',
    dataIndex:'payTime',
    key:'payTime',
  },{
    title:'实际成交总价',
    dataIndex:'dealTotalPrice',
    key:'dealTotalPrice',
  },{
    title:'实际成交单价',
    dataIndex:'dealUnitPrice',
    key:'dealUnitPrice',
  },{
    title:'承担方',
    dataIndex:'undertaker',
    key:'undertaker',
  },{
    title:'交易服务费',
    dataIndex:'serviceCharge',
    key:'serviceCharge',
  },{
    title:'佣金比例',
    dataIndex:'proportion',
    key:'proportion',
  },{
    title:'支付金额',
    dataIndex:'payAmount',
    key:'payAmount',
  },{
    title:'支付状态',
    dataIndex:'payStatus',
    key:'payStatus',
  }
];
export default function SecondHouseTradeDetails({trackJSON,dispatch}){
  if(!trackJSON){
    return(
      <div className='newHouseTradeDetails'>交易信息加载中...</div>
    )
  }else{
    const trackData=!!trackJSON?JSON.parse(trackJSON):{};
    console.log('trackData',trackData);
    const houseColumns=[
      {
        title:'房源编号',
        dataIndex:'id',
        key:'id',
      },{
        title:'所属小区',
        dataIndex:'village',
        key:'village',
      },{
        title:'物业类型',
        dataIndex:'propertyType',
        key:'propertyType',
      },{
        title:'房源信息',
        dataIndex:'info',
        key:'info',
      },{
        title:'房源面积',
        dataIndex:'area',
        key:'area',
      },{
        title:'房源单价',
        dataIndex:'price',
        key:'price',
      },{
        title:'房源总价',
        dataIndex:'totalPrice',
        key:'totalPrice',
      },{
        title:'支持贷款',
        dataIndex:'loan',
        key:'loan',
        render:bool=><span>{!!bool?'支持':'不支持'}</span>,
      },{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render:(text,house)=><span className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellHousesDetails',
          state:{
            transCode:house.transCode,
          }
        }))}>房源详情</span>,
      },
    ];
    return(
      <div className='newHouseTradeDetails'>
        {/*报成交经纪人*/}
        {!!trackData.brokerInfo && <ReportBroker title='房源所属经纪人' mainBrokerData={trackData.brokerInfo.data} hasPic={true} picUrl={trackData.brokerInfo.picUrl}/>}
        {/*报成交客户*/}
        {!!trackData.customerInfo && <CustomerInformation title='
        报成交客户' mainInformationData={trackData.customerInfo}/>}
        {/*客户所属经纪人*/}
        {!!trackData.customerBrokerInfo && <ReportBroker title='客源所属经纪人' mainBrokerData={trackData.customerBrokerInfo.data}   hasPic={true} picUrl={trackData.customerBrokerInfo.picUrl}/>}
        {/*合作成交佣金分配比例*/}
        {!!trackData.dealCommissionProportion && <CustomerInformation title='
        合作成交佣金分配比例' mainInformationData={trackData.dealCommissionProportion}/>}
        {/*意向房源*/}
        {!!trackData.houseInfo && <DxPanel title='意向房源'>
          <Table pagination={false} columns={houseColumns} dataSource={[trackData.houseInfo.houseInfo]}/>
        </DxPanel>}
        {/*房源委托信息*/}
        {!!trackData.houseEntrustAgreementPics && <DxPanel title='房源委托信息'>
          <PicList picListData={trackData.houseEntrustAgreementPics}/>
        </DxPanel>}
        {/*房源报成交记录*/}
        {!!trackData.reportRecord && <TimelineComponents title='房源报成交记录' timelineData={trackData.reportRecord}/>}
        {/*已支付意向金*/}
        {!!trackData.intentsInfo && <DxPanel title='已支付意向金'>
            <Table pagination={false} columns={intentsColumns} dataSource={[trackData.intentsInfo]}/>
          </DxPanel>}
        {/*意向金协议*/}
        {!!trackData.intentsAgreements && <DxPanel title='意向金协议'>
          <PicList picListData={trackData.intentsAgreements}/>
        </DxPanel>}
        {/*意向金退款协议办理*/}
        {!!trackData.intentionRefundInfos && <DxPanel title='意向金退款协议办理'>
          <TimeRecordList listData={trackData.intentionRefundInfos}/>
        </DxPanel>}
        {/*已支付首付款*/}
        {!!trackData.downPaymentInfo && <DxPanel title='已支付首付款'>
          <Table pagination={false} columns={downPaymentColumns} dataSource={[trackData.downPaymentInfo]}/>
        </DxPanel>}
        {/*首付款协议/合同*/}
        {!!trackData.downPaymentAgreements && <DxPanel title='首付款协议/合同'>
          <PicList picListData={trackData.downPaymentAgreements}/>
        </DxPanel>}
        {/*首付款退款协议办理*/}
        {!!trackData.downPaymentRefundInfos && <DxPanel title='首付款退款协议办理'>
          <TimeRecordList listData={trackData.downPaymentRefundInfos}/>
        </DxPanel>}
        {/*佣金支付*/}
        {!!trackData.commissionInfo && <DxPanel title='佣金支付'>
          <Table pagination={false} columns={commissionColumns} dataSource={[trackData.commissionInfo]}/>
        </DxPanel>}
        {/*买卖居间协议/佣金协议*/}
        {!!trackData.commissionAgreements && <DxPanel title='买卖居间协议/佣金协议'>
          <PicList picListData={trackData.commissionAgreements}/>
        </DxPanel>}
        {/*佣金退款协议办理*/}
        {!!trackData.commissionRefundInfos && <DxPanel title='佣金退款协议办理'>
          <TimeRecordList listData={trackData.commissionRefundInfos}/>
        </DxPanel>}
        {/*房源贷款信息*/}
        {!!trackData.loanInfo && <DxPanel title='房源贷款信息'>
          <TimeRecordList listData={trackData.loanInfo}/>
        </DxPanel>}
        {/*房屋过户信息*/}
        {!!trackData.transferInfo && <DxPanel title='房屋过户信息'>
          <TimeRecordList listData={trackData.transferInfo}/>
        </DxPanel>}
        {/*二手房解押办理*/}
        {!!trackData.relieveLoadInfo && <DxPanel title='二手房解押办理'>
          <TimeRecordList listData={trackData.relieveLoadInfo}/>
        </DxPanel>}
        {/*成交资金释放账户*/}
        {!!trackData.commitReleaseFundInfo && <DxPanel title='成交资金释放账户'>
          <div>
            <DxShowMsgForm msgData={trackData.commitReleaseFundInfo.formData}/>
            {!!trackData.commitReleaseFundInfo.ownerInfo &&<DxShowMsgForm msgData={trackData.commitReleaseFundInfo.ownerInfo}/>}
            {!!trackData.commitReleaseFundInfo.picList && <PicList picListData={trackData.commitReleaseFundInfo.picList}/>}
          </div>
        </DxPanel>}
        {/*成交分佣设置*/}
        {!!trackData.commitCommissionInfo && <DxPanel title='成交分佣设置'>
          <DxShowMsgForm msgData={trackData.commitCommissionInfo}/>
        </DxPanel>}
        {/*房屋成交信息*/}
        {!!trackData.commitInfo && <DxPanel title='房屋成交信息'>
          <TimeRecordList listData={trackData.commitInfo}/>
        </DxPanel>}
      </div>
    )
  }
}
