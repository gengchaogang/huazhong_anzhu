import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Button,Input,Modal,message}from 'antd'
import './DealCenterSettlement.css';
import DxPanel from '../../../commons/components/DxPanel'
function DealCenterSettlement({dispatch,form,dealCenterSettlement}) {
	const {
		bank,
    canMoney,
    card,
    id,
    loginName,
    logo,
    name,
    tcAddress,
    tcName,
    totalMoney,
		payType,
		organization,
		money,
	}=dealCenterSettlement;
	//确认结算
	const established=()=>{
		Modal.confirm({
			title: '提示',
	    content: '确认要结算此账户吗？',
	    onOk() {
				if(money=='' || money=='0'){
					message.error('金额必须大于0')
					return
				}
	      dispatch({
					type:'dealCenterSettlement/established',
					payload:{
						id:id,
						money:money,
					}
				})
	    },
	    onCancel() {
	      console.log('Cancel');
	    },
		})
	}
	const goback=()=>{
    dispatch(routerRedux.goBack());
  }
	const getNumber=(e)=>{
		dispatch({
			type:'dealCenterSettlement/initialSuccess',
			payload:{money:e.target.value}
		})
	}
	return(
		<div>
		  <DxPanel title='账户信息'>
        <p>帐号：{loginName}</p>
        <p>交易中心名称：{tcName}</p>
        <p>地址：{tcAddress}</p>
      </DxPanel>
			<DxPanel title='结算银行卡'>
				<div>
					<span></span>
					<span>银行卡 {bank} {`(${card})`}</span>
					<p>开户名 {name}</p>
				</div>
			</DxPanel>
			<DxPanel title='账户余额'>
				<p>账户余额 {totalMoney}元</p>
				<p>可结算余额 {canMoney}元</p>
			</DxPanel>
			<DxPanel title='结算信息'>
				<div>
					转出金额
					<div className='input'>
						<Input type='number' onBlur={(e)=>{getNumber(e)}}/>
					</div>
				</div>
				<p>结算机构 {organization}</p>
				<p>结算方式 {payType}</p>
				<p className='gary'>注：到账时间请以结算机构和银行为准</p>
			</DxPanel>
			<Button type='primary' onClick={established}>确认结算</Button>
			<Button type='ghost' onClick={goback}>返回</Button>
		</div>
	)
}


DealCenterSettlement.propTypes = {

};
function mapStateToProps({dealCenterSettlement }) {
	return { dealCenterSettlement }
}

export default connect(mapStateToProps)(DealCenterSettlement)
