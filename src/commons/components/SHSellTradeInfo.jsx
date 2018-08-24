import React, { PropTypes } from 'react'
import { routerRedux,Link } from 'dva/router'
import {Button,Select, Option,Radio,Table} from 'antd';

import DxPanel from './DxPanel'
import DxLoadingShadow from '../UI/DxLoadingShadow'
import PromptModal from '../View/PromptModal'

import IntentionItem from '../UI/tradeItems/IntentionItem'
import PicList from '../UI/PicList'
import DxShowMsgForm from '../UI/DxShowMsgForm'
import TimeRecordList from '../UI/TimeRecordList'
import CustomerInformation from '../UI/tradeItems/CustomerInformation'
import IntentionHouse from '../UI/tradeItems/IntentionHouse'
import ReportBroker from '../UI/tradeItems/ReportBroker'
import TimelineComponents from '../UI/tradeItems/TimelineComponents'
import PictureShow from '../UI/tradeItems/PictureShow'
import YgdsyhTable from '../UI/tradeItems/YgdsyhTable'
import './SHSellTradeInfo.css'

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
  },
  // {
  //   title:'支付客户',
  //   dataIndex:'customer',
  //   key:'customer',
  // },
  // {
  //   title:'支付手机号',
  //   dataIndex:'phoneNumber',
  //   key:'phoneNumber',
  // },
  {
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
  },
  {
    title:'支付流水号',
    dataIndex:'paySerialNumber',
    key:'paySerialNumber',
  },
  {
    title:'实际成交单价',
    dataIndex:'dealUnitPrice',
    key:'dealUnitPrice',
  },
  {
    title:'实际成交总价',
    dataIndex:'dealTotalPrice',
    key:'dealTotalPrice',
  },
  {
    title:'支付方式',
    dataIndex:'payWay',
    key:'payWay',
  },
  {
    title:'承担方',
    dataIndex:'undertaker',
    key:'undertaker',
  },
  {
    title:'佣金比例',
    dataIndex:'proportion',
    key:'proportion',
  },
  {
    title:'交易服务费',
    dataIndex:'serviceCharge',
    key:'serviceCharge',
  },

  {
    title:'支付金额',
    dataIndex:'payAmount',
    key:'payAmount',
  },
  {
    title:'支付时间',
    dataIndex:'payTime',
    key:'payTime',
  },
  {
    title:'支付状态',
    dataIndex:'payStatus',
    key:'payStatus',
  }
];
const houseColumnsForTradeCenter=[
  {
    title:'房源编号',
    dataIndex:'resourcesNumber',
    key:'resourcesNumber',
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
    render:(text,house)=><Link className='deal_operation' to={{pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellHousesDetails',
      state:{
        transCode:house.transCode,
      }
    }}>房源详情</Link>
  }
];
const houseColumnsForNotTradeCenter=[
  {
    title:'房源编号',
    dataIndex:'resourcesNumber',
    key:'resourcesNumber',
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
  }
];


export default function SHSellTradeInfo({trackJSON,type='tradeCenter'}){
  if(!trackJSON){
    return(
      <div className='shTradeInfo'>交易信息加载中...</div>
    )
  }else{
    const trackData=!!trackJSON?JSON.parse(trackJSON):{};
    console.log('trackData',trackData);
    return(
      <div className='shTradeInfo'>
        {
          trackData.map((item,index)=><div className='shTradeInfoItem' key={`shTradeInfoItem_${index}`}>
          {renderSHSellTradeInfoItem(item,type)}
        </div>)
        }
      </div>
    )
  }
}
function renderSHSellTradeInfoItem(item,type){
  if(!!item.value){
    if(item.type === '交易中心' && type !== 'tradeCenter'){
      return <CustomerInformation title='交易中心' mainInformationData={item.value}/>
    }
    else if(item.type === '房源报成交经纪人'){
      return <ReportBroker title='房源报成交经纪人' mainBrokerData={item.value.data} hasPic={true} picUrl={item.value.picUrl}/>
    }
    else if(item.type === '客户所属经纪人'){
      return <ReportBroker title='客源所属经纪人' mainBrokerData={item.value.data}   hasPic={true} picUrl={item.value.picUrl}/>
    }
    else if(item.type === '合作成交佣金分配比例'){
      return <CustomerInformation title='
      合作成交佣金分配比例' mainInformationData={item.value}/>
    }
    else if(item.type === '意向房源'){
      return <DxPanel title='意向房源'>
        <Table pagination={false} columns={(type === 'tradeCenter')?houseColumnsForTradeCenter:houseColumnsForNotTradeCenter} dataSource={[item.value]}/>
      </DxPanel>
    }
    else if(item.type === '房源委托信息'){
      return <DxPanel title='房源委托信息'>
        <PicList picListData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '房源报成交记录'){
      return <TimelineComponents title='房源报成交记录' timelineData={item.value}/>
    }
    else if(item.type === '支付意向金'){
      return <DxPanel title='支付意向金'>
        <Table pagination={false} columns={intentsColumns} dataSource={[item.value]}/>
      </DxPanel>
    }
    else if(item.type === '房源报成交客户'){
      return <CustomerInformation title='
      房源报成交客户' mainInformationData={item.value}/>
    }
    else if(item.type === '意向合同/协议'){
      return <DxPanel title='意向合同/协议'>
        <PicList picListData={item.value}/>
      </DxPanel>
    }
    // else if(item.type === '意向金退款办理'){
    //   return <DxPanel title='意向金退款协议办理'>
    //     <TimeRecordList listData={item.value}/>
    //   </DxPanel>
    // }
    else if(item.type === '已支付首付款'){
      return <DxPanel title='已支付首付款'>
        <Table pagination={false} columns={downPaymentColumns} dataSource={[item.value]}/>
      </DxPanel>
    }
    else if(item.type === '首付款协议/合同'){
      return <DxPanel title='首付款协议/合同'>
        <PicList picListData={item.value}/>
      </DxPanel>
    }
    // else if(item.type === '首付款退款业务'){
    //   return <DxPanel title='首付款退款协议办理'>
    //     <TimeRecordList listData={item.value}/>
    //   </DxPanel>
    // }
    else if(item.type === '已支付佣金'){
      return <DxPanel title='已支付佣金'>
        <Table pagination={false} columns={commissionColumns} dataSource={[item.value]}/>
      </DxPanel>
    }
    else if(item.type === '意向金支付动态'){
      return <DxPanel title='意向金支付动态'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '佣金支付动态'){
      return <DxPanel title='佣金支付动态'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '解押贷款申请'){
      return <DxPanel title='解押贷款申请'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '购房分期贷款申请'){
      return <DxPanel title='购房分期贷款申请'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '买卖居间协议/佣金协议'){
      return <DxPanel title='买卖居间协议/佣金协议'>
        <PicList picListData={item.value}/>
      </DxPanel>
    }
    // else if(item.type === '佣金退款协议办理'){
    //   return <DxPanel title='佣金退款协议办理'>
    //     <TimeRecordList listData={item.value}/>
    //   </DxPanel>
    // }
    // else if(item.type === '房屋过户信息'){
    //   return <DxPanel title='房屋过户信息'>
    //     <TimeRecordList listData={item.value}/>
    //   </DxPanel>
    // }
    else if(item.type === '房屋过户申请'){
      return <DxPanel title='房屋过户申请'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '房源贷款信息'){
      return <DxPanel title='房源贷款信息'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    // else if(item.type === '二手房解押办理'){
    //   return <DxPanel title='二手房解押办理'>
    //     <TimeRecordList listData={item.value}/>
    //   </DxPanel>
    // }
    else if(item.type === '成交资金释放账户'){
      return <CustomerInformation title='成交资金释放账户'
       mainInformationData={item.value}/>
      // return <DxPanel title='成交资金释放账户'>
      //   <div>
      //     <DxShowMsgForm msgData={item.value.formData}/>
      //     {!!item.value.ownerInfo &&<DxShowMsgForm msgData={item.value.ownerInfo}/>}
      //     {!!item.value.picList && <PicList picListData={item.value.picList}/>}
      //   </div>
      // </DxPanel>
    }
    else if(item.type === '成交分佣设置'){
      return <DxPanel title='成交分佣设置'>
        <DxShowMsgForm msgData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '房屋成交信息'){
      return <DxPanel title='房屋成交信息'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
  }else{
    return <i></i>
  }
}
