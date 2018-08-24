import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {Button} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './ExpenditureDetail.css'
import defaultLogo from '../../../assets/images/img1.jpg'
function ExpenditureDetail({dispatch,expenditureDetail}) {
  const goback=()=>{
    dispatch(routerRedux.goBack());
  }
  const {
    accid,
		accountLoginName,
		accountLogo,
		accountName,
		accountPath,
		amount,
		bank,
		bankAccountName,
		bankLogo,
		clearingAgencise,
		clearingType,
		endNumber,
		expenseNumericalOrders,
		expenseStatus,
		expenseTime,
		expenseType,
		id,
		optUserLoginName,
		optUserName,
		optUserType,
		serviceFee,
		serviceScale,
    showFinishTime,//是否展示结算时间
		finishTime,//结算时间
		showBank,//是否展示银行卡信息
		city,// 开户行所在城市
		branchName,// 开户支行或分行全称
		showOpt,//是否展示操作人员
		showAccount,//是否展示账户信息
    showPayInfo,//是否显示支付信息
		customer,//支付人姓名
		customerPhone,//联系电话
		numericalOrder,//支付流水号
    credentialsPath,//结算凭证
  }=expenditureDetail;
  return (
    <div>
      <DxPanel title='支出状态'>
        <div className='margin'>状态：<span className='pay'>{expenseStatus}</span></div>
        <p className='margin'>支出流水号：{expenseNumericalOrders||'—'}</p>
        <p className='margin'>支出时间：{expenseTime}</p>
        <div>
          {showFinishTime==true && <p className='margin'>结算时间：{finishTime||'—'}</p>}
        </div>
      </DxPanel>
      <DxPanel title='支出信息'>
        <p className='margin'>支出类型：{expenseType}</p>
        <div className='margin'>支出金额：<span className='pay'>{amount||0}元</span></div>
        <div className='margin'>手续费：<span className='pay'>2元</span></div>
        <p className='margin'>结算机构：{clearingAgencise||'—'}</p>
        <p className='margin'>结算方式：{clearingType||'—'}</p>
        <div>
          {showPayInfo==true &&
            <div>
              <p className='margin'>支付人姓名：{customer||'—'}</p>
              <p className='margin'>联系电话：{customerPhone||'—'}</p>
              <p className='margin'>支付流水号：{numericalOrder||'—'}</p>
            </div>
          }
        </div>
        <div>
          {!!credentialsPath &&
          <div className='margin'>结算凭证：
            <span className='credentialsPath' style={{backgroundImage:`URL(${credentialsPath})`}}></span>
          </div>}
        </div>
      </DxPanel>
      {showBank==true &&
      <DxPanel title='银行卡'>
        <div className='margin marginflexspan'>
          <span>银行卡</span>
          {!!bankLogo && <span className='banklogo' style={{backgroundImage:`URL(${bankLogo})`}}></span>}
          <span>{bank}（{endNumber}）</span>
        </div>
        <p className='margin'>开户名：{bankAccountName||'—'}</p>
        <p className='margin'>开户行所在城市：{city||'—'}</p>
        <p className='margin'>身份证：{accid||'—'}</p>
        <p className='margin'>开户支行或分行全称：{branchName||'—'}</p>
      </DxPanel>}
      {showAccount==true &&
      <DxPanel title='账户信息'>
        <div>
          {!!accountLogo && <p className='margin tcLogo' style={{backgroundImage:`URL(${accountLogo})`}}></p>}
          <p className='margin'>账户 {accountLoginName||'—'}</p>
          <p className='margin'>姓名 {accountName||'—'}</p>
          <p className='margin'>城市 {accountPath||'—'}</p>
        </div>
      </DxPanel>}
      {showOpt==true &&
      <DxPanel title='操作记录'>
        <p className='margin'>操作人员：{optUserType} {optUserName} {optUserLoginName}</p>
      </DxPanel>}
      <Button type='ghost' onClick={goback}>返回</Button>
    </div>
  );
}

function mapStateToProps({expenditureDetail}) {
  return {expenditureDetail }
}

export default connect(mapStateToProps)(ExpenditureDetail);
