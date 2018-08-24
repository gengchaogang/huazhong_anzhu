import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Button,Radio,Tabs,DatePicker,Form}from 'antd'
import './BrokerDetailed.css';
import DxPanel from '../../../commons/components/DxPanel'
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group
const { MonthPicker, RangePicker } = DatePicker;
function BrokerDetailed({dispatch,brokerDetailed,form}) {
  const {
    type,
    area,
    bank,
    bankLogo,
    comment,
    commissionTime,
    commissionType,
    endNumber,
    house,
    houseType,
    knockdownTime,
    orderNumber,
    saleWay,
    scale,
    serialNumber,
    status,
    totalAmt,
    totalMoney,
    clearingTime,
    capitalType,
    project,
    prentice,
    prenticeLoginName,
    money,
    handingCharge,
    addTime,
    finishTime,
  }=brokerDetailed
	const goback=()=>{
    dispatch(routerRedux.goBack());
  }
  // console.log(type,area,'type');
	return(
		<div>
		  <DxPanel title='交易明细'>
        <div>
        {type=='佣金记录' && <div>
          <p>{status}</p>
          <p>原因：{comment}</p>
          <p>流水号：{serialNumber}</p>
          <p>类型：{commissionType}</p>
          <p>订单ID：{orderNumber}</p>
          <p>佣金金额：{totalAmt||0}元</p>
          <p>银行卡：{bank}</p>
          <p>销售房源：{house}</p>
          <p>房源类型：{houseType=='住宅'?'二手房':houseType}{saleWay}</p>
          <p>成交时间：{knockdownTime}</p>
          <p>结佣时间：{commissionTime}</p>
        </div>}
        {type=='收入' && <div>
          <p>{status}</p>
          <p>交易单号：{orderNumber}</p>
          {/*<p>项目：{project}</p>*/}
          <p>实际金额：{totalAmt||0}元</p>
          <p>类型：{capitalType}</p>
          <p>销售房源：{house}</p>
          <p>销售类型：{houseType=='住宅'?'二手房':houseType}{saleWay}</p>
          <p>经纪人：{prentice} {prenticeLoginName}</p>
          <p>成交时间：{knockdownTime}</p>
          <p>补贴发放：{clearingTime}</p>
        </div>}
        {type=='支出' && <div>
          <p>{status}</p>
          <p>流水号：{serialNumber}</p>
          <p>项目：{project}</p>
          <p>实际金额：{money}</p>
          <p>手续费：{handingCharge}元</p>
          <p>银行卡：{bank}</p>
          <p>提现时间：{addTime}</p>
          <p>到账时间：{finishTime}</p>
          <p>备注信息：{comment}</p>
        </div>}
        </div>
      </DxPanel>
			<Button onClick={goback} type='ghost'>返回</Button>
		</div>
	)
}


BrokerDetailed.propTypes = {

};
function mapStateToProps({brokerDetailed }) {
	return { brokerDetailed }
}

export default connect(mapStateToProps)(Form.create()(BrokerDetailed))
