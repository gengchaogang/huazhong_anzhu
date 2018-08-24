import React, { PropTypes } from 'react'

import {Button,Select, Option,Radio,Table} from 'antd';

import DxPanel from '../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../commons/View/PromptModal'

import IntentionItem from '../../../commons/UI/tradeItems/IntentionItem'
import PicList from '../../../commons/UI/PicList'
import DxShowMsgForm from '../../../commons/UI/DxShowMsgForm'
import DxValueList from '../../../commons/UI/DxValueList'
import TimeRecordList from '../../../commons/UI/TimeRecordList'
import CustomerInformation from '../../../commons/UI/tradeItems/CustomerInformation'
import IntentionHouse from '../../../commons/UI/tradeItems/IntentionHouse'
import ReportBroker from '../../../commons/UI/tradeItems/ReportBroker'
import TimelineComponents from '../../../commons/UI/tradeItems/TimelineComponents'
import PictureShow from '../../../commons/UI/tradeItems/PictureShow'
import YgdsyhTable from '../../../commons/UI/tradeItems/YgdsyhTable'
import './SecondHouseRentTradeDetails.css'
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
    title:'租金/押金',
    dataIndex:'rentType',
    key:'rentType',
  },{
    title:'租期',
    dataIndex:'rentTerm',
    key:'rentTerm',
  },{
    title:'房租',
    dataIndex:'rentPrice',
    key:'rentPrice',
  },{
    title:'出租方式',
    dataIndex:'rentWay',
    key:'rentWay',
  },{
    title:'操作',
    dataIndex:'operation',
    key:'operation',
    render:(text,house)=><span>房源详情</span>,
  },
];
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
    title:'意向租金',
    dataIndex:'rentCommission',
    key:'rentCommission',
  },{
    title:'支付用户',
    dataIndex:'customer',
    key:'customer',
  },{
    title:'支付时间',
    dataIndex:'payTime',
    key:'payTime',
  },{
    title:'支付意向金（元）',
    dataIndex:'commissionAmount',
    key:'commissionAmount',
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
    title:'实际成交租金',
    dataIndex:'dealRentPrice',
    key:'dealRentPrice',
  },{
    title:'支付用户',
    dataIndex:'customer',
    key:'customer',
  },{
    title:'支付时间',
    dataIndex:'payTime',
    key:'payTime',
  },
  // {
  //   title:'意向金抵扣',
  //   dataIndex:'commissionDeductible',
  //   key:'commissionDeductible',
  // },
  {
    title:'实际支付佣金',
    dataIndex:'dealCommission',
    key:'dealCommission',
  },{
    title:'支付状态',
    dataIndex:'payStatus',
    key:'payStatus',
  }
];

export default function SecondHouseRentTradeDetails({trackJSON}){
  if(!trackJSON){
    return(
      <div className='newHouseTradeDetails'>交易信息加载中...</div>
    )
  }else{
    const trackData=!!trackJSON?JSON.parse(trackJSON):{};
    return(
      <div className='newHouseTradeDetails'>
        {/*报出租经纪人*/}
        {!!trackData.brokerInfo && <ReportBroker title='报出租经纪人' mainBrokerData={trackData.brokerInfo.data} hasPic={true} picUrl={trackData.brokerInfo.picUrl}/>}
        {/*租户*/}
        {!!trackData.customerInfo && <CustomerInformation title='租户' mainInformationData={trackData.customerInfo}/>}
        {/*租户所属经纪人*/}
        {!!trackData.customerBrokerInfo && <ReportBroker title='租户所属经纪人' mainBrokerData={trackData.customerBrokerInfo.data}   hasPic={true} picUrl={trackData.customerBrokerInfo.picUrl}/>}
        {/*合作成交佣金分配比例*/}
        {!!trackData.dealCommissionProportion && <CustomerInformation title='合作成交佣金分配比例' mainInformationData={trackData.dealCommissionProportion}/>}
        {/*出租房源*/}
        {!!trackData.houseInfo && <DxPanel title='出租房源'>
          <Table pagination={false} columns={houseColumns} dataSource={[trackData.houseInfo.houseInfo]}/>
        </DxPanel>}
        {/*房源委托信息*/}
        {!!trackData.houseEntrustAgreementPics && <DxPanel title='房源委托信息'>
          <PicList picListData={trackData.houseEntrustAgreementPics}/>
        </DxPanel>}
        {/*房源出租记录*/}
        {!!trackData.reportRecord && <DxPanel title='房源出租记录'>
          <TimeRecordList listData={trackData.reportRecord}/>
        </DxPanel>}
        {/*出租意向金*/}
        {!!trackData.intentsInfo && <DxPanel title='出租意向金'>
            <Table pagination={false} columns={intentsColumns} dataSource={[trackData.intentsInfo]}/>
          </DxPanel>}
        {/*租房意向金收据*/}
        {!!trackData.intentsAgreements && <DxPanel title='租房意向金收据'>
          <PicList picListData={trackData.intentsAgreements}/>
        </DxPanel>}
        {/*意向金退款办理进度*/}
        {!!trackData.intentsRefundInfo && <DxPanel title='意向金退款办理进度'>
          <TimeRecordList listData={trackData.intentsRefundInfo}/>
        </DxPanel>}
        {/*已支付租房佣金*/}
        {!!trackData.commissionInfo && <DxPanel title='已支付租房佣金'>
          <Table pagination={false} columns={commissionColumns} dataSource={[trackData.commissionInfo]}/>
        </DxPanel>}
        {/*已上传租房居间合同或收据*/}
        {!!trackData.commissionAgreements && <DxPanel title='已上传租房居间合同或收据/佣金协议'>
          <PicList picListData={trackData.commissionAgreements}/>
        </DxPanel>}
        {/*租房分期办理进度*/}
        {!!trackData.loanInfo && <DxPanel title='租房分期办理进度'>
          <TimeRecordList listData={trackData.loanInfo}/>
        </DxPanel>}
        {/*成交分佣设置*/}
        {!!trackData.commitCommissionInfo && <DxPanel title='成交分佣设置'>
          <DxValueList valueList={trackData.commitCommissionInfo}/>
        </DxPanel>}
        {/*二手房出租成交*/}
        {!!trackData.commitInfo && <DxPanel title='二手房出租成交'>
          <TimeRecordList listData={trackData.commitInfo}/>
        </DxPanel>}
      </div>
    )
  }
}
