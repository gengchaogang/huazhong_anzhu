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
import './SHRentTradeInfo.css'
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
    title:'支付意向金',
    dataIndex:'commissionAmount',
    key:'commissionAmount',
  },{
    title:'支付状态',
    dataIndex:'payStatus',
    key:'payStatus',
  }
];
const houseColumnsForTradeCenter=[
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
    render:(text,house)=><Link className='deal_operation' to={{pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentHousesDetails',
      state:{
        transCode:house.transCode,
      }
    }}>房源详情</Link>
  }
];
const houseColumnsForNotTradeCenter=[
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
  },
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

export default function SHRentTradeInfo({trackJSON,type='tradeCenter'}){
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
          {renderSHRentTradeInfoItem(item,type)}
        </div>)
        }
      </div>
    )
  }
}
function renderSHRentTradeInfoItem(item,type){
  if(!!item.value){
    if(item.type === '交易中心' && type !== 'tradeCenter'){
      return <CustomerInformation title='交易中心' mainInformationData={item.value}/>
    }
    else if(item.type === '报出租经纪人'){
      return <ReportBroker title='报出租经纪人' mainBrokerData={item.value.data} hasPic={true} picUrl={item.value.picUrl}/>
    }
    else if(item.type === '租户所属经纪人'){
      return <ReportBroker title='租户所属经纪人' mainBrokerData={item.value.data}   hasPic={true} picUrl={item.value.picUrl}/>
    }
    else if(item.type === '合作成交佣金分配比例'){
      return <CustomerInformation title='
      合作成交佣金分配比例' mainInformationData={item.value}/>
    }
    else if(item.type === '出租房源'){
      return <DxPanel title='出租房源'>
        <Table pagination={false} columns={(type === 'tradeCenter')?houseColumnsForTradeCenter:houseColumnsForNotTradeCenter} dataSource={[item.value]}/>
      </DxPanel>
    }
    else if(item.type === '房源委托信息'){
      return <DxPanel title='房源委托信息'>
        <PicList picListData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '房源出租记录'){
      return <TimelineComponents title='房源出租记录' timelineData={item.value}/>
    }
    else if(item.type === '出租意向金'){
      return <DxPanel title='出租意向金'>
        <Table pagination={false} columns={intentsColumns} dataSource={[item.value]}/>
      </DxPanel>
    }
    else if(item.type === '意向金支付信息'){
      return <DxPanel title='意向金支付信息'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '佣金支付动态'){
      return <DxPanel title='佣金支付动态'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '租房分期'){
      return <DxPanel title='租房分期'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '承租方/租户'){
      return <CustomerInformation title='承租方/租户'
       mainInformationData={item.value}/>
    }
    else if(item.type === '意向合同或意向收据'){
      return <DxPanel title='意向金协议'>
        <PicList picListData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '租房意向金收据'){
      return <DxPanel title='租房意向金收据'>
        <PicList picListData={item.value}/>
      </DxPanel>
    }
    // else if(item.type === '意向金退款办理'){
    //   return <DxPanel title='意向金退款办理'>
    //     <TimeRecordList listData={item.value}/>
    //   </DxPanel>
    // }
    else if(item.type === '租房佣金'){
      return <DxPanel title='租房佣金'>
        <Table pagination={false} columns={commissionColumns} dataSource={[item.value]}/>
      </DxPanel>
    }
    else if(item.type === '已上传租房居间合同或收据'){
      return <DxPanel title='已上传租房居间合同或收据'>
        <PicList picListData={item.value}/>
      </DxPanel>
    }
    // else if(item.type === '佣金退款协议办理'){
    //   return <DxPanel title='佣金退款协议办理'>
    //     <TimeRecordList listData={item.value}/>
    //   </DxPanel>
    // }
    // else if(item.type === '房源贷款信息'){
    //   return <DxPanel title='房源贷款信息'>
    //     <TimeRecordList listData={item.value}/>
    //   </DxPanel>
    // }
    else if(item.type === '租房分期办理进度'){
      return <DxPanel title='租房分期'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
    else if(item.type === '成交资金释放账户'){
      return <CustomerInformation title='
      成交资金释放账户' mainInformationData={item.value}/>
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
    else if(item.type === '房源报成交记录'){
      return <TimelineComponents title='房源报成交记录' timelineData={item.value}/>
    }
    else if(item.type === '房屋出租成交信息'){
      return <DxPanel title='房屋出租成交信息'>
        <TimeRecordList listData={item.value}/>
      </DxPanel>
    }
  }else{
    return <i></i>
  }
}
