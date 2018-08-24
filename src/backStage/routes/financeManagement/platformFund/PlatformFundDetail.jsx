import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Select,Tabs,DatePicker,Cascader} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './PlatformFundDetail.css'
import defaultLogo from '../../../assets/images/img1.jpg'
function PlatformFundDetail({dispatch,platformFundDetail}) {
  const goback=()=>{
    dispatch(routerRedux.goBack());
  }
  const {
    aBrokerMoney,
    aMasterMoney,
    aTutorMoney,
    amount,
    areaAgentMoney,
    bBrokerMoney,
    bMasterMoney,
    bTutorMoney,
    cityAgentMoney,
    customer,
    customerPhone,
    house,
    houseCode,
    houseType,
    id,
    numericalOrder,
    orderNum,
    orderTime,
    payTime,
    payType,
    platformMoney,
    provinceAgentMoney,
    saleWay,
    specialApplicationType,
    specialOffer,
    status,
    tcAddress,
    tcLoginName,
    tcLogo,
    tcName,
    tcPath,
    tradingCenterMoney,
    transType,
    showAllocation,
  }=platformFundDetail;
  return (
    <div>
      <DxPanel title='订单信息'>
        <p className='margin'>订单时间：{orderTime}</p>
        <p className='margin'>订单编号：{orderNum}</p>
        <p className='margin'>支付状态：{status}</p>
        <p className='margin'>支付时间：{payTime}</p>
        <p className='margin'>支付流水号：{numericalOrder}</p>
        <p className='margin'>交易类型：{transType}</p>
        <div className='margin'>支付金额：<span className='pay'>{amount}元</span></div>
        <p className='margin'>支付方式：{payType}</p>
        <div>
          {houseType=='新房' &&
            <div className='margin'>优惠信息：<span className='youhui'>{specialOffer||'暂无'}</span></div>}
        </div>
        <div>
          {houseType=='新房' && <p className='margin'>适用类型：{specialApplicationType}</p>}
        </div>
        <p className='margin'>支付客户：{customer}</p>
        <p className='margin'>客户电话：{customerPhone}</p>
      </DxPanel>
      <DxPanel title='房源信息'>
        <p className='margin'>房源类型：{houseType=='住宅'?'二手房':houseType}</p>
        <p className='margin'>租售方式：{saleWay}</p>
        <p className='margin'>房源：{house}</p>
        <div>
          {houseType!='新房' && <p className='margin'>房源编号：{houseCode}</p>}
        </div>
      </DxPanel>
      <DxPanel title='交易中心'>
        <p className='margin tcLogo' style={{backgroundImage:`URL(${tcLogo})`}}></p>
        <p className='margin'>帐号：{tcLoginName}</p>
        <p className='margin'>交易中心名称：{tcName}</p>
        <p className='margin'>地址：{tcAddress}</p>
      </DxPanel>
      {showAllocation==true &&
      <DxPanel title='收益分配'>
        <div>
          <p className='margin'>总金额：{amount}元</p>
          {!!aBrokerMoney &&
            <p className='margin'>成交经纪人：{aBrokerMoney||0}元 {Math.round(aBrokerMoney/amount*10000)/100.00+'%'}</p>
          }
          {!!bBrokerMoney &&
            <p className='margin'>合作经纪人：{bBrokerMoney||0}元 {Math.round(bBrokerMoney/amount*10000)/100.00+'%'}</p>
          }
          {(aMasterMoney || bMasterMoney)&&
            <p className='margin'>师傅：{aMasterMoney+bMasterMoney}元 {Math.round((aMasterMoney+bMasterMoney)/amount*10000)/100.00+'%'}</p>
          }
          {(aTutorMoney || bTutorMoney)&&
            <p className='margin'>导师：{aTutorMoney+bTutorMoney}元 {Math.round((aTutorMoney+bTutorMoney)/amount*10000)/100.00+'%'}</p>
          }
          <div>
            {!!platformMoney &&
              <p className='margin'>平台：{platformMoney||0}元 {Math.round(platformMoney/amount*10000)/100.00+'%'}</p>
            }
            {!!provinceAgentMoney &&
              <p className='margin'>代理商（省级）：{provinceAgentMoney||0}元 {Math.round(provinceAgentMoney/amount*10000)/100.00+'%'}</p>
            }
            {!!cityAgentMoney &&
              <p className='margin'>代理商（市级）：{cityAgentMoney||0}元 {Math.round(cityAgentMoney/amount*10000)/100.00+'%'}</p>
            }
            {!!areaAgentMoney &&
              <p className='margin'>代理商（区县）：{areaAgentMoney||0}元 {Math.round(areaAgentMoney/amount*10000)/100.00+'%'}</p>
            }
            {!!tradingCenterMoney &&
              <p className='margin'>交易中心：{tradingCenterMoney||0}元 {Math.round(tradingCenterMoney/amount*10000)/100.00+'%'}</p>
            }
          </div>
        </div>
      </DxPanel>}
      <Button type='ghost' onClick={goback}>返回</Button>
    </div>
  );
}

function mapStateToProps({platformFundDetail}) {
  return {platformFundDetail }
}

export default connect(mapStateToProps)(PlatformFundDetail);
