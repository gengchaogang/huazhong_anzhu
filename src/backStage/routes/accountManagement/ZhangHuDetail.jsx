import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table, Button,Radio,Tabs,DatePicker,Form}from 'antd'
import './ZhangHuDetail.css';
import DxPanel from '../../../commons/components/DxPanel'
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group
const { MonthPicker, RangePicker } = DatePicker;
function ZhangHuDetail({dispatch,zhangHuDetail,form}) {
	const {
		amount,
		avatar,
		bank,
		endNumber,
		issuedCommission,
		loginName,
		logo,
		name,
		totalCommission,
		unIssuedCommission,
		userId,
		userType,
		type,
		isWallet,
		beginTime,
		endTime,
		walletDataSource,
		status,
		rangePickerValue,
		commissionDataSource,
		pageNo,
		total,
		loading,
	}=zhangHuDetail;
	const goback=()=>{
    dispatch(routerRedux.goBack());
  }
	//钱包
	const columnsWallet=[
		{
			title:'时间',
			dataIndex:'addTime',
		},
		{
			title:'项目',
			dataIndex:'capitalType',
		},
		{
			title:'金额',
			dataIndex:'totalAmt',
		},
		{
			title:'状态',
			dataIndex:'status',
		},
		{
			title:'操作',
			render:(text,record)=><span onClick={()=>{walletDetail(record)}} className='zhangHuDetail'>明细</span>
		},
	]
	const walletDetail=(key)=>{
		dispatch(routerRedux.push({
			pathname:'/accountManagement/zhangHuGuanLiBroker/brokerDetailed',
			state:{
				id:key.key,
				type:key.type,
			}
		}));
	}
	const callback=(key)=>{
		dispatch({
			type:'zhangHuDetail/initialSuccess',
			payload:{loading:true}
		})
		if(key=='钱包'){
			dispatch({
				type:'zhangHuDetail/findBrokerWalletBudget',
				payload:{
					beginTime:'',
					endTime:'',
					pageNo:0,
					type:'',
					userId:userId,
					status:'',
					rangePickerValue:[],
					isWallet:'钱包',
				}
			})
		}else{
			dispatch({
				type:'zhangHuDetail/findBrokerCommissionBudget',
				payload:{
					beginTime:'',
					endTime:'',
					pageNo:0,
					type:'',
					userId:userId,
					status:'',
					rangePickerValue:[],
					isWallet:'佣金记录',
				}
			})
		}
	}
	//钱包时间变化时的回调
	const onChangeWallet=(date, dateString)=>{
		dispatch({
			type:'zhangHuDetail/initialSuccess',
			payload:{loading:true}
		})
		if(date.length!=0){
			if(isWallet=='钱包'){
				dispatch({
					type:'zhangHuDetail/findBrokerWalletBudget',
					payload:{
						beginTime:dateString[0],
						endTime:dateString[1],
						rangePickerValue:date,
						pageNo:0,
						type:(type=='全部'?'':type),
						userId:userId,
						status:(status=='全部'?'':status),
						isWallet:'钱包',
					}
				})
			}else{
				dispatch({
					type:'zhangHuDetail/findBrokerCommissionBudget',
					payload:{
						beginTime:dateString[0],
						endTime:dateString[1],
						rangePickerValue:date,
						pageNo:0,
						type:(type=='全部'?'':type),
						userId:userId,
						status:(status=='全部'?'':status),
						isWallet:'佣金记录',
					}
				})
			}
		}else{
			if(isWallet=='钱包'){
				dispatch({
					type:'zhangHuDetail/findBrokerWalletBudget',
					payload:{
						beginTime:'',
						endTime:'',
						rangePickerValue:[],
						pageNo:0,
						type:(type=='全部'?'':type),
						userId:userId,
						status:(status=='全部'?'':status),
						isWallet:'钱包',
					}
				})
			}else{
				dispatch({
					type:'zhangHuDetail/findBrokerCommissionBudget',
					payload:{
						beginTime:'',
						endTime:'',
						rangePickerValue:[],
						pageNo:0,
						type:(type=='全部'?'':type),
						userId:userId,
						status:(status=='全部'?'':status),
						isWallet:'佣金记录',
					}
				})
			}
		}
	}
	//收入或者支出
	const isIncomeChange=(key)=>{
		dispatch({
			type:'zhangHuDetail/initialSuccess',
			payload:{loading:true}
		})
		dispatch({
			type:'zhangHuDetail/findBrokerWalletBudget',
			payload:{
				beginTime:beginTime,
				endTime:endTime,
				pageNo:0,
				type:(key.target.value=='全部'?'':key.target.value),
				userId:userId,
				status:'',
				rangePickerValue:rangePickerValue,
				isWallet:'钱包',
			}
		})
	}
	//支出时的状态
	const typeWalletChange=(key)=>{
		dispatch({
			type:'zhangHuDetail/initialSuccess',
			payload:{loading:true}
		})
		if(isWallet=='钱包'){
			dispatch({
				type:'zhangHuDetail/findBrokerWalletBudget',
				payload:{
					beginTime:beginTime,
					endTime:endTime,
					pageNo:0,
					type:(type=='全部'?'':type),
					userId:userId,
					rangePickerValue:rangePickerValue,
					status:(key.target.value=='全部'?'':key.target.value),
					isWallet:'钱包',
				}
			})
		}else{
			dispatch({
				type:'zhangHuDetail/findBrokerCommissionBudget',
				payload:{
					beginTime:beginTime,
					endTime:endTime,
					pageNo:0,
					type:(type=='全部'?'':type),
					userId:userId,
					rangePickerValue:rangePickerValue,
					status:(key.target.value=='全部'?'':key.target.value),
					isWallet:'佣金记录',
				}
			})
		}
	}
	//佣金记录列表
	const commissionColumns=[
		{
			title:'时间',
			dataIndex:'addTime'
		},
		{
			title:'订单ID',
			dataIndex:'orderNumber'
		},
		{
			title:'房源',
			dataIndex:'house'
		},
		{
			title:'佣金（元）',
			dataIndex:'totalAmt'
		},
		{
			title:'状态',
			dataIndex:'status'
		},
		{
			title:'操作',
			render:(text,record)=><span onClick={()=>{commissionDetail(record)}} className='zhangHuDetail'>明细</span>
		},
	]
	const commissionDetail=(key)=>{
		dispatch(routerRedux.push({
			pathname:'/accountManagement/zhangHuGuanLiBroker/brokerDetailed',
			state:{
				id:key.key,
				type:'佣金记录',
			}
		}));
	}
	//分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
			dispatch({
				type:'zhangHuDetail/initialSuccess',
				payload:{loading:true}
			})
    	if(isWallet=='钱包'){
				dispatch({
	        type:'zhangHuDetail/findBrokerWalletBudget',
	        payload:{
						beginTime:beginTime,
						endTime:endTime,
						pageNo:page-1,
						type:(type=='全部'?'':type),
						userId:userId,
						rangePickerValue:rangePickerValue,
						status:status,
						isWallet:'钱包',
	        }
	      })
			}else{
				dispatch({
	        type:'zhangHuDetail/findBrokerCommissionBudget',
	        payload:{
						beginTime:beginTime,
						endTime:endTime,
						pageNo:page-1,
						type:(type=='全部'?'':type),
						userId:userId,
						rangePickerValue:rangePickerValue,
						status:status,
						isWallet:'佣金记录',
	        }
	      })
			}
    }
  }
	return(
		<div>
		  <DxPanel title='帐号信息'>
        <p>帐号：{loginName}</p>
        <p>姓名：{name}</p>
      </DxPanel>
		  <DxPanel title='银行卡'>
				<div className='margin marginflexspan'>
          <span>银行卡</span>
          {!!logo && <span className='banklogo' style={{backgroundImage:`URL(${logo})`}}></span>}
          <span>{bank}（{endNumber}）</span>
        </div>
				<div className='tabs'>
          <Tabs onChange={callback} type="card">
            <TabPane tab="钱包" key="钱包">
							<div className='balanceMark'>
								<span>余额：{amount}元</span>
								<span>佣金金额：{totalCommission}元</span>
							</div>
							<div className='rangePicker'>
			          <RangePicker onChange={onChangeWallet} value={rangePickerValue} format='YYYY-MM-DD'/>
			        </div>
							<div className='classification'>
								<span>分类：</span>
								<RadioGroup defaultValue="全部" onChange={isIncomeChange} value={type}>
									<RadioButton value='全部'>全部</RadioButton>
									<RadioButton value="收入">收入</RadioButton>
					        <RadioButton value="支出">支出</RadioButton>
						    </RadioGroup>
							</div>
							{type=='收入'?'':
							<div className='classification'>
								<span>状态：</span>
								<RadioGroup defaultValue="全部" onChange={typeWalletChange} value={status==''?'全部':status}>
					        <RadioButton value="全部">全部</RadioButton>
					        <RadioButton value="进行中">进行中</RadioButton>
					        <RadioButton value="成功">成功</RadioButton>
					        <RadioButton value="失败">失败</RadioButton>
						    </RadioGroup>
							</div>}
							<Table
								dataSource={walletDataSource} columns={columnsWallet}
								pagination={pagination} loading={loading}
							/>
            </TabPane>
            <TabPane tab="佣金记录" key="佣金记录">
							<div className='balanceMark'>
								<span>未发放佣金：{unIssuedCommission}元</span>
								<span>已发放佣金：{issuedCommission}元</span>
								<span>累计获得佣金：{totalCommission}元</span>
							</div>
							<div className='rangePicker'>
			          <RangePicker onChange={onChangeWallet} value={rangePickerValue} format='YYYY-MM-DD'/>
			        </div>
							<div className='classification'>
								<span>状态：</span>
								<RadioGroup defaultValue="全部" onChange={typeWalletChange} value={status==''?'全部':status}>
					        <RadioButton value="全部">全部</RadioButton>
					        <RadioButton value="结算中">结算中</RadioButton>
					        <RadioButton value="已发放">已发放</RadioButton>
					        <RadioButton value="失败">失败</RadioButton>
						    </RadioGroup>
							</div>
							<Table columns={commissionColumns} dataSource={commissionDataSource}
								pagination={pagination} loading={loading}
							/>
            </TabPane>
          </Tabs>
        </div>
      </DxPanel>
			<Button onClick={goback} type='ghost'>返回</Button>
		</div>
	)
}


ZhangHuDetail.propTypes = {

};
function mapStateToProps({zhangHuDetail }) {
	return { zhangHuDetail }
}

export default connect(mapStateToProps)(Form.create()(ZhangHuDetail))
