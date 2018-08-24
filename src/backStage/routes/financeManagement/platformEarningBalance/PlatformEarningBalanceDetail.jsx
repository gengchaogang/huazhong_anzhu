import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {Button} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './PlatformEarningBalanceDetail.css'

function PlatformEarningBalanceDetail({dispatch,platformEarningBalanceDetail}) {
  const {
    amount,
    customer,
    customerPhone,
    earnings,
    house,
    houseCode,
    houseType,
    id,
    numericalOrder,
    orderNum,
    payTime,
    payType,
    saleWay,
    specialApplicationType,
    specialOffer,
    status,
    time,
    transType,
  }=platformEarningBalanceDetail;
  const goback=()=>{
    dispatch(routerRedux.goBack());
  }
  return (
    <div>
      <DxPanel title='订单详情'>
        <p className='margin'>时间：{time}</p>
        <p className='margin'>流水号：{numericalOrder}</p>
        <p className='margin'>订单编号：{orderNum}</p>
        <p className='margin'>支付状态：{status}</p>
        <p className='margin'>支付时间：{payTime}</p>
        <p className='margin'>支付流水号：{numericalOrder}</p>
        <p className='margin'>交易类型：{transType}</p>
        <div className='margin'>支付金额：<span className='pay'>{amount||0}元</span></div>
        <div>
          {houseType=='新房' && <div>
            <div className='margin'>优惠信息：<span className='youhui'>{specialOffer||'暂无'}</span></div>
            <p className='margin'>适用类型：{specialApplicationType}</p>
          </div>}
        </div>
        <div>
          {houseType!='新房' && <p className='margin'>支付方式：{payType}</p>}
        </div>
        <p className='margin'>支付客户：{customer}</p>
        <p className='margin'>客户电话：{customerPhone}</p>
      </DxPanel>
      <DxPanel title='房源信息'>
        <p className='margin'>房源类型：{houseType}</p>
        <p className='margin'>租售方式：{saleWay}</p>
        <p className='margin'>房源：{house}</p>
        <div>
          {houseType!='新房' && <p className='margin'>房源编号：{houseCode}</p>}
        </div>
      </DxPanel>
      <DxPanel title='收益'>
        <p>{earnings||0}元 {Math.round(earnings/amount*10000)/100.00+'%'}</p>
      </DxPanel>
      <Button type='ghost' onClick={goback}>返回</Button>
    </div>
  );
}

function mapStateToProps({platformEarningBalanceDetail}) {
  return {platformEarningBalanceDetail }
}

export default connect(mapStateToProps)(PlatformEarningBalanceDetail);
