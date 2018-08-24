import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table, Button}from 'antd'
import './DealCenterDetailIncome.css';
import DxPanel from '../../../commons/components/DxPanel'
function DealCenterDetailIncome({dispatch,dealCenterDetailIncome}) {
  const {
    customer,
    customerPhone,
    house,
    houseCode,
    houseType,
    income,
    number,
    orderNumber,
    orderTime,
    payMoney,
    payStatus,
    payTime,
    payType,
    saleWay,
    scale,
    serialNumber,
    specialApplicationType,
    specialOffer,
    transType,
    type,
  }=dealCenterDetailIncome;
  const goback=()=>{
    dispatch(routerRedux.goBack());
  }
	return(
		<div>
      <DxPanel title='订单信息'>
        <div>
          <p>时间：{orderTime}</p>
          <p>流水号：{number}</p>
          <p>订单编号：{orderNumber}</p>
          <p>支付状态：{payStatus}</p>
          <p>支付时间：{payTime}</p>
          <p>支付流水号：{serialNumber}</p>
          <p>交易类型：{transType}</p>
          <p>支付金额：<span className='payMoney'>{payMoney}元</span></p>
          <p>支付方式：{payType}</p>
          {type=='新房'?<div>
            <p>优惠信息：<span className='specialOffer'>{specialOffer}</span></p>
            <p>适用类型：{specialApplicationType}</p>
          </div>:''}
          <p>支付客户：{customer}</p>
          <p>客户电话：{customerPhone}</p>
        </div>
      </DxPanel>
      <DxPanel title='房源信息'>
        <div>
          <p>房源类型：{houseType}</p>
          <p>租售方式：{saleWay}</p>
          <p>房源：{house}</p>
          {type=='新房'?'':<p>房源编号：{houseCode}</p>}
        </div>
      </DxPanel>
      <DxPanel title='收益'>
        <p>{income}元（{scale}%）</p>
      </DxPanel>
      <Button onClick={goback} type='ghost'>返回</Button>
		</div>
	)
}


DealCenterDetailIncome.propTypes = {

};
function mapStateToProps({dealCenterDetailIncome }) {
	return { dealCenterDetailIncome }
}

export default connect(mapStateToProps)(DealCenterDetailIncome)
