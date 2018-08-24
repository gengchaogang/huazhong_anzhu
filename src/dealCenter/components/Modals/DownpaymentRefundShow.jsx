/**
 * Created by Jason on 2017/1/6.
 */
/**
 * Created by Jason on 2017/1/4.
 */
/**
 * Created by Jason on 2017/1/4.
 */

import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, Popconfirm, message } from 'antd';

const Step = Steps.Step;
function DownpaymentRefundShow({dispatch,secondDeal}){
	const {
		downpaymentShowButton,
		downpaymentShowVisible,
	}=secondDeal;
	//模拟步骤条状态
	const stepState={
		current:2,
		status:'finaly',
	};
	//模拟订单信息
	const data=[{
		orderNumber:332005469041,
		payment:'POS机支付/工商银行',
		SwiftNumber:65535,
		payTime:'2016-10-24 19:00',
		payClient:'Jason',
		dealTotalPrice:'250万',
		downpaymentRatio:'1%',
		earnestDeduction:'10000元',
		payedMoney:'10000元',
		payState:'已完成',
	}];
	//模拟退款理由
	const reasonsData={
		text:'我是退款文字理由',
		img:[{
			key:1,
			url:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
		},{
			key:2,
			url:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
		},{
			key:3,
			url:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
		}]
	};
	//模拟审核信息
	const shenHeInfo=[
		{
			key:1,
			text:'2015-10-24 19:00 由黄林枫 申请退款  等待 李白 退款审核。'
		},{
			key:2,
			text:'2015-10-24 19:00 由 李白 审核通过  等待财务 王颖 进行审核'
		},{
			key:3,
			text:'2015-10-24 19:00 由 财务 王颖 审核通过 等待执行退款'
		},{
			key:4,
			text:'2015-10-24 19:00 由 财务 王颖 已执行退款  1~2个工作日后 退款将退回原卡账户。'
		}
	];

	const columns=[{
		title:'支付订单',
		dataIndex:'orderNumber'
	}, {
		title:'支付方式',
		dataIndex:'payment'
	}, {
		title:'支付流水号',
		dataIndex:'SwiftNumber'
	}, {
		title:'支付时间',
		dataIndex:'payTime'
	}, {
		title:'支付客户',
		dataIndex:'payClient'
	}, {
		title:'成交总价',
		dataIndex:'dealTotalPrice'
	}, {
		title:'首付款比例',
		dataIndex:'downpaymentRatio'
	},
	// {
	// 	title:'意向金抵扣',
	// 	dataIndex:'earnestDeduction'
	// },
	{
		title:'支付金额',
		dataIndex:'payedMoney'
	}, {
		title:'支付状态',
		dataIndex:'payState'
	}, {
		title:'操作',
		render:(record)=>{
			return(
				<a>交易详情</a>
			)
		}
	}];
	const handleCancel=()=>{
		dispatch({
			type:'secondDeal/setState',
			payload:{
				downpaymentShowVisible:false,
				downpaymentShowButton:'default',
			}
		})
	};
	const showInputModal=()=>{
		dispatch({
			type:'secondDeal/setState',
			payload:{
				downpaymentShowVisible:false,
				downpaymentShowButton:'default',

				downpaymentInputVisible:true,
			}
		})
	};
	let confirm=()=> {
		//发起撤回请求
		setTimeout(() => {
			message.success('Click on Yes');
			dispatch({
				type:'secondDeal/setState',
				payload:{
					downpaymentShowVisible:false,
					downpaymentShowButton:'default',
				}
			})
		}, 2000);

	};

	let cancel=()=> {
		message.error('Click on No');
	};
	return(
		<Modal
			visible={downpaymentShowVisible}
			maskClosable={false}
			title="二手房--首付款退款申请"
			onCancel={handleCancel}
			footer={
				downpaymentShowButton==='重新申请'?
					[
						<Button key="reApply" type="primary" size="large" onClick={showInputModal}>重新申请</Button>,
						<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>
					]:
					downpaymentShowButton==='撤回申请'?
						[
							<Popconfirm  key="cancelApply" title="确认撤回申请?" onConfirm={confirm} onCancel={cancel} okText="是" cancelText="否">
								<Button type="primary" size="large">撤回申请</Button>
							</Popconfirm>,
							<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>,
						]:
						[
							<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>
						]
			}
		>
			<div>
				<Steps current={stepState.current} status={stepState.status}>
					<Step  title="申请退款" />
					<Step  title="退款审核" />
					<Step  title="财务审核" />
					<Step  title="执行退款" />
				</Steps>
				<div>
					<h4>订单信息</h4>
					<Table
						columns={columns}
						dataSource={data}
						pagination={false}
					/>
				</div>
				<div>
					<h4>退款理由</h4>
					<p>我是退款理由!咋滴啦???!!!</p>
					<ul className="tuiKuanImgs">
						{reasonsData.img.map((item)=>{
							return (
								<li key={item.key}>
									<img className={'判断宽高条件'?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
								</li>
							)
						})}
					</ul>
				</div>
				<div>
					<h4>审核信息</h4>
					<ul>
						{
							shenHeInfo.map((item)=>{
								return (
									<li key={item.key}><span>{item.text}</span></li>
								)
							})
						}
					</ul>
				</div>
			</div>
		</Modal>
	)
}
DownpaymentRefundShow.propTypes={
	downpaymentShowButton:PropTypes.string,
	downpaymentShowVisible:PropTypes.bool,

};
function mapStateToProps({ secondDeal }) {
	return { secondDeal };
}
export default connect(mapStateToProps)(DownpaymentRefundShow);
