import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Menu, Dropdown, Icon, message,Button} from 'antd';
import './waitingDeal.css';

import EarnestRefundShow from '../../../../components/Modals/EarnestRefundShow';
import EarnestRefundInput from '../../../../components/Modals/EarnestRefundInput';
import DownpaymentRefundShow from '../../../../components/Modals/DownpaymentRefundShow';
import DownpaymentRefundInput from '../../../../components/Modals/DownpaymentRefundInput';
import BrokerageRefundShow from '../../../../components/Modals/BrokerageRefundShow';
import BrokerageRefundInput from '../../../../components/Modals/BrokerageRefundInput';
import ApplyDeal from '../../../../components/Modals/ApplyDeal';
import HousingDischarge from '../../../../components/Modals/HousingDischarge';

//引入过户申请modal add by jc
import ApplyTransfer from '../../../../components/Modals/ApplyTransfer'

function WaitingDeal({dispatch, secondDeal  }) {
	const {
		earnestRefundModalVisible,
	}=secondDeal;
	//模拟房源信息数据源
	const housingDetailData={
		fyzt:'在售',
		gpsj:'2016-12-12',
		fybh:'332005469041',
		fybt:'远洋山水 2室1厅 85㎡',
		szxq:'远洋山水',
		szdq:'北京市-海淀区',
		fyhx:'2室1厅',
		jzmj:'85㎡',
		tlmj:'80㎡',
		totalMount:'300万',
		zcdk:'支持',
		zxqk:'精装修',
		fwcx:'南',
		szlc:'高层',
		fynd:'2016',
		fyts:'满五唯一    学区房    近地铁',
	};
	//模拟数据
	const data = [];
	const state=[
		{lastAction:'已缴纳意向金',state:'补传协议'},
		{lastAction:'已缴纳意向金',state:'退款待审核'},
		{lastAction:'已缴纳意向金',state:'等待财务审核'},
		{lastAction:'已缴纳意向金',state:'退款审核驳回'},
		{lastAction:'已缴纳意向金',state:'财务审核驳回'},
		{lastAction:'已缴纳意向金',state:'已完成退款'},

		{lastAction:'已缴纳首付款',state:'补传协议'},
		{lastAction:'已缴纳首付款',state:'退款待审核'},
		{lastAction:'已缴纳首付款',state:'退款财务待审核'},
		{lastAction:'已缴纳首付款',state:'退款审核驳回'},
		{lastAction:'已缴纳首付款',state:'财务审核驳回'},
		{lastAction:'已缴纳首付款',state:'已完成退款'},

		{lastAction:'已缴纳佣金',state:'补传协议'},
		{lastAction:'已缴纳佣金',state:'退款待审核'},
		{lastAction:'已缴纳佣金',state:'退款财务待审核'},
		{lastAction:'已缴纳佣金',state:'退款审核已驳回'},
		{lastAction:'已缴纳佣金',state:'退款财务审核驳回'},
		{lastAction:'已缴纳佣金',state:'已完成退款'},

		{lastAction:'申请贷款',state:'等待受理'},
		{lastAction:'申请贷款',state:'贷款已受理'},
		{lastAction:'申请贷款',state:'贷款申请驳回'},
		{lastAction:'申请贷款',state:'贷款已批'},

		{lastAction:'申请过户',state:'等待受理'},
		{lastAction:'申请过户',state:'过户申请已驳回'},
		{lastAction:'申请过户',state:'已完成过户'},

		{lastAction:'申请成交',state:'成交待审核'},
		{lastAction:'申请成交',state:'等待财务审核'},
		{lastAction:'申请成交',state:'成交审核驳回'},
		{lastAction:'申请成交',state:'成交财务审核驳回'},

		{lastAction:'房屋解押',state:'解押申请中'},
		{lastAction:'房屋解押',state:'解押申请已驳回'},
		{lastAction:'房屋解押',state:'解押已受理'},
		{lastAction:'房屋解押',state:'解押已批款'},
	];
	for (let i = 0; i <33; i++) {

		data.push({
			key: i,
			id: i+1,
			broker: '黄岳	',
			tel:133255859999,
			community:'远洋山水',
			wuyeType:'普通住宅',
			houseInfo:'A区/1号/1幢/2003室',
			client:'森哥',
			dealWay:'合作成交',
			uploadDealTime:'2016-10-24 19:00',
			businessHanding:'张三',
			businessState:state[i],
			handingTime:'2016-10-24 19:00',
		});
	}
	const handleToHouseInfo=()=>{
		dispatch(routerRedux.push({
			pathname:'/dealManagement/secondHouseSellDeal/HouseInfo',
			state:{housingDetailData},
		}));
	};
	const columns = [{
		title: '序号',
		dataIndex: 'id',
	}, {
		title: '经纪人',
		dataIndex: 'broker',
		render:(text, record) => {
			let toogleColor=()=>{
				if(record.businessState.lastAction=='已缴纳首付款'){
					return {color:'#FF9900'};
				}else if(record.businessState.lastAction=='已缴纳佣金'){
					return {color:'#199ED8'}
				}else if(record.businessState.lastAction=='申请贷款'){
					return {color:'#663366'}
				}else if(record.businessState.lastAction=='申请过户'||record.businessState.lastAction=='申请成交'||record.businessState.lastAction=='房屋解押'){
					return {color:'#0000FF'}
				}
			};
			return (
				<span style={toogleColor()}>{text}</span>
			)
		}
	}, {
		title: '电话',
		dataIndex: 'tel',
	}, {
		title: '所属小区',
		dataIndex: 'community',
	}, {
		title: '物业类型',
		dataIndex: 'wuyeType',
	}, {
		title: '房源信息',
		dataIndex: 'houseInfo',
		render:(text,record)=>{
			return (
				<a onClick={handleToHouseInfo}>{text}</a>
			)
		}
	}, {
		title: '客户 ',
		dataIndex: 'client',
	}, {
		title: '成交方式',
		dataIndex: 'dealWay',
	}, {
		title: '报成交时间',
		dataIndex: 'uploadDealTime',
	}, {
		title: '业务办理',
		dataIndex: 'businessHanding',
	}, {
		title: '业务状态',
		dataIndex: 'businessState',
		render:(text,record)=>{
			let handleClick=(record)=>{
				//意向金退款申请弹出框操作
				if(
					(record.businessState.lastAction=='已缴纳意向金'&& record.businessState.state=='退款待审核')
					||(record.businessState.lastAction=='已缴纳意向金'&& record.businessState.state=='等待财务审核')
					||(record.businessState.lastAction=='已缴纳意向金'&& record.businessState.state=='已完成退款')
				){
					dispatch({
						type:'secondDeal/setState',
						payload:{
							earnestRefundModalVisible:true,
							EarnestShowButton:'default',
						}
					})
				}else if(
					(record.businessState.lastAction=='已缴纳意向金'&& record.businessState.state=='退款审核驳回')
					||(record.businessState.lastAction=='已缴纳意向金'&& record.businessState.state=='财务审核驳回')
				){
					dispatch({
						type:'secondDeal/setState',
						payload:{
							EarnestShowButton:'重新申请',
							earnestRefundModalVisible:true,
						}
					})
				}else if(
					(record.businessState.lastAction=='已缴纳意向金'&& record.businessState.state=='补传协议')
				){
						alert('我是跳转');
				}
				//首付款退款申请弹出框操作/
				else if(
					(record.businessState.lastAction=='已缴纳首付款'&& record.businessState.state=='补传协议')
				){
					alert('我是跳转');
				}
				else if(
					(record.businessState.lastAction=='已缴纳首付款'&& record.businessState.state=='退款待审核')
				){
					dispatch({
						type:'secondDeal/setState',
						payload:{
							downpaymentShowButton:'撤回申请',
							downpaymentShowVisible:true,
						}
					})
				}
				else if(
					(record.businessState.lastAction=='已缴纳首付款'&& record.businessState.state=='退款审核驳回')
				){
					dispatch({
						type:'secondDeal/setState',
						payload:{
							downpaymentShowButton:'重新申请',
							downpaymentShowVisible:true,
						}
					})
				}else if(
					(record.businessState.lastAction=='已缴纳首付款'&& record.businessState.state=='退款财务待审核')
					||(record.businessState.lastAction=='已缴纳首付款'&& record.businessState.state=='财务审核驳回')
					||(record.businessState.lastAction=='已缴纳首付款'&& record.businessState.state=='已完成退款')
				){
					dispatch({
						type:'secondDeal/setState',
						payload:{
							downpaymentShowButton:'default',
							downpaymentShowVisible:true,
						}
					})
				}
				//佣金退款申请弹出框操作/
				(
					(record.businessState.lastAction=='已缴纳佣金'&& record.businessState.state=='退款财务待审核')
					||(record.businessState.lastAction=='已缴纳佣金'&& record.businessState.state=='已完成退款')
				)&& dispatch({
							type:'secondDeal/setState',
							payload:{
								BrokerageRefundShowButton:'default',
								BrokerageRefundShowVisible:true,
							}
						});

				(
					(record.businessState.lastAction=='已缴纳佣金'&& record.businessState.state=='退款审核已驳回')
					||(record.businessState.lastAction=='已缴纳佣金'&& record.businessState.state=='退款财务审核驳回')
				)&& dispatch({
						type:'secondDeal/setState',
						payload:{
							BrokerageRefundShowButton:'重新申请',
							BrokerageRefundShowVisible:true,
						}
					});

				(record.businessState.lastAction=='已缴纳佣金'&& record.businessState.state=='退款待审核')
				&& dispatch({
						type:'secondDeal/setState',
						payload:{
							BrokerageRefundShowButton:'撤回申请',
							BrokerageRefundShowVisible:true,
						}
					});

				//申请成交弹出框操作
				(record.businessState.lastAction=='申请成交')
				&& dispatch({
					type:'secondDeal/setState',
					payload:{
						ApplyDealVisible:true,
						ApplyDeal_status:'申请成交',
					}
				});
				//房屋解押弹出框操作
				(record.businessState.lastAction=='房屋解押')
				&& dispatch({
					type:'secondDeal/setState',
					payload:{
						HousingDischargeVisible:true,
						HousingDischarge_status:'解押申请已驳回',
					}
			})
			};
			let condition=()=>{
				if(
					record.businessState.state=='退款审核驳回'
					||record.businessState.state=='财务审核驳回'
					||record.businessState.state=='退款审核已驳回'
					||record.businessState.state=='退款财务审核驳回'
					||record.businessState.state=='贷款申请驳回'
					||record.businessState.state=='过户申请已驳回'
					||record.businessState.state=='成交审核驳回'
					||record.businessState.state=='成交财务审核驳回'
					||record.businessState.state=='解押申请已驳回'
				){
					return true;
				}return false;
			};
			return (
				<div>
					<p>{text.lastAction}</p>
					<p style={{cursor:'pointer',color:condition()?'red':'#108ee9'}} onClick={()=>{handleClick(record)}}>{text.state}</p>
				</div>
			)
		},
	}, {
		title: '办理时间',
		dataIndex: 'handingTime',
	}, {
		title:'操作',
		render:(text,record)=>{
			//控制业务办理显示的子功能点
			let menuItems=[];
			if(record.businessState.lastAction=='已缴纳意向金'&&record.businessState.state=='补传协议'){
				menuItems=[{
					key:'sqtk',text:'申请退款'
				}, {
					key:'sfk',text:'首付款'
				}, {
					key:'gfyj',text:'购房佣金'
				}, {
					key:'dkfq',text:'贷款分期'
				}];
			}else if (record.businessState.lastAction=='已缴纳意向金'&&record.businessState.state=='退款待审核'){
				menuItems=[{
					key:'chsq',text:'撤回申请'
				}, {
					key:'sfk',text:'首付款'
				}, {
					key:'gfyj',text:'购房佣金'
				}, {
					key:'dkfq',text:'贷款分期'
				}];
			}else if (record.businessState.lastAction=='已缴纳首付款'&&record.businessState.state=='补传协议'){
				menuItems=[{
					key:'sqtk',text:'申请退款'
				}, {
					key:'gfyj',text:'购房佣金'
				}, {
					key:'dkfq',text:'贷款分期'
				}];
			}else if (record.businessState.lastAction=='已缴纳首付款'&&record.businessState.state=='退款待审核'){
				menuItems=[{
					key:'chsq',text:'撤回申请'
				}, {
					key:'gfyj',text:'购房佣金'
				}, {
					key:'dkfq',text:'贷款分期'
				}];
			}else if (record.businessState.lastAction=='已缴纳佣金'&&record.businessState.state=='补传协议'){
				menuItems=[{
					key:'sqtk',text:'申请退款'
				}, {
					key:'dkfq',text:'贷款分期'
				}, {
					key:'ghbl',text:'过户办理'
				}, {
					key:'blcj',text:'办理成交'
				}];
			}else if (record.businessState.lastAction=='已缴纳佣金'&&record.businessState.state=='退款待审核'){
				menuItems=[{
					key:'chsq',text:'撤回申请'
				}, {
					key:'dkfq',text:'贷款分期'
				}, {
					key:'ghbl',text:'过户办理'
				}, {
					key:'blcj',text:'办理成交'
				}];
			}else if (
				(record.businessState.lastAction=='申请贷款'&&record.businessState.state=='贷款已受理')
				||(record.businessState.lastAction=='申请贷款'&&record.businessState.state=='等待受理')
			){
				menuItems=[{
					key:'chsq',text:'撤回申请'
				}, {
					key:'ghbl',text:'过户办理'
				}, {
					key:'blcj',text:'办理成交'
				}];
			}else if (
				(record.businessState.lastAction=='申请贷款'&&record.businessState.state=='贷款申请驳回')
				||(record.businessState.lastAction=='申请过户'&&record.businessState.state=='等待受理')
				||(record.businessState.lastAction=='申请过户'&&record.businessState.state=='过户申请已驳回')
				||(record.businessState.lastAction=='申请过户'&&record.businessState.state=='已完成过户')
			){
				menuItems=[{
					key:'cxsq',text:'重新申请'
				},  {
					key:'ghbl',text:'过户办理'
				}, {
					key:'blcj',text:'办理成交'
				}, {
					key:'yxjtk',text:'意向金退款'
				}, {
					key:'sfktk',text:'首付款退款'
				}, {
					key:'yjtk',text:'佣金退款'
				}];
			}else if (
				(record.businessState.lastAction=='申请成交'&&record.businessState.state=='成交待审核')
			){
				menuItems=[{
					key:'chsq',text:'撤回申请'
				}, {
					key:'yxjtk',text:'意向金退款'
				}, {
					key:'sfktk',text:'首付款退款'
				}, {
					key:'yjtk',text:'佣金退款'
				}];
			}else if (
				(record.businessState.lastAction=='申请成交'&&record.businessState.state=='等待财务审核')
			){
				menuItems=[{
					key:'yxjtk',text:'意向金退款'
				}, {
					key:'sfktk',text:'首付款退款'
				}, {
					key:'yjtk',text:'佣金退款'
				}];
			}else if (
				(record.businessState.lastAction=='申请成交'&&record.businessState.state=='成交审核驳回')
				||(record.businessState.lastAction=='申请成交'&&record.businessState.state=='成交财务审核驳回')
			){
				menuItems=[{
					key:'cxsq',text:'重新申请'
				}, {
					key:'yxjtk',text:'意向金退款'
				}, {
					key:'sfktk',text:'首付款退款'
				}, {
					key:'yjtk',text:'佣金退款'
				}];
			}else if (
				(record.businessState.lastAction=='房屋解押'&&record.businessState.state=='解押申请中')
				||(record.businessState.lastAction=='房屋解押'&&record.businessState.state=='解押申请已驳回')
			){
				menuItems=[{
					key:'yxjtk',text:'意向金退款'
				}, {
					key:'sfktk',text:'首付款退款'
				}, {
					key:'yjtk',text:'佣金退款'
				}];
			}else if (
				(record.businessState.lastAction=='房屋解押'&&record.businessState.state=='解押已受理')
				||(record.businessState.lastAction=='房屋解押'&&record.businessState.state=='解押已批款')
			){
				menuItems=[{
					key:'yxj',text:'意向金'
				}, {
					key:'sfk',text:'首付款'
				}, {
					key:'gfyj',text:'购房佣金'
				}];
			}

			//给业务操作绑定事件
			let handleClick=(item)=>{

				//意向金__退款处理相应的点击效果(弹出框?跳转?)
				(item.key=='sqtk' && record.businessState.lastAction=='已缴纳意向金'&& record.businessState.state=='补传协议' )&&
					dispatch({
						type:'secondDeal/setState',
						payload:{
							earnestRefundInputVisible:true
						}
					});
				(item.key=='chsq' && record.businessState.lastAction=='已缴纳意向金'&& record.businessState.state=='退款待审核' )&&
					// message.info('此撤回功能效果没有给设计');
					dispatch({
						type:'secondDeal/setState',
						payload:{
							EarnestShowButton:'撤回申请',
							earnestRefundModalVisible:true,
						}
					});
				//首付款__退款处理相应的点击效果(弹出框?跳转?)
				(item.key=='sqtk' && record.businessState.lastAction=='已缴纳首付款'&& record.businessState.state=='补传协议' )&&
					// message.info('fff');
					dispatch({
						type:'secondDeal/setState',
						payload:{
							downpaymentInputVisible:true,
						}
					});
				(item.key=='chsq' && record.businessState.lastAction=='已缴纳首付款'&& record.businessState.state=='退款待审核' )&&
					// message.info('fff');
					dispatch({
						type:'secondDeal/setState',
						payload:{
							downpaymentShowVisible:true,
							downpaymentShowButton:'撤回申请',
						}
					});
				//佣金__退款处理相应的点击效果(弹出框?跳转?)
				(item.key=='chsq' && record.businessState.lastAction=='已缴纳佣金'&& record.businessState.state=='退款待审核' )&&
					// message.info('fff');
					dispatch({
						type:'secondDeal/setState',
						payload:{
							BrokerageRefundShowButton:'撤回申请',
							BrokerageRefundInputVisible:true,
						}
					});
				//申请成交
				(item.key=='cxsq' && record.businessState.lastAction=='申请成交')&&
					// message.info('fff');
					dispatch({
						type:'secondDeal/setState',
						payload:{
							ApplyDealVisible:true,
							ApplyDeal_status:'申请成交',
						}
					});
				(item.key=='chsq' && record.businessState.lastAction=='申请成交')&&
					// message.info('fff');
					dispatch({
						type:'secondDeal/setState',
						payload:{
							ApplyDealVisible:true,
							ApplyDeal_status:'成交待审核',
						}
					});

			};
			let menu=()=>{
				return (
					<Menu onClick={handleClick}>
						{
							menuItems.map((item)=>{
								return (
									<Menu.Item key={item.key}>
										<a>{item.text}</a>
									</Menu.Item>
								)
							})
						}
					</Menu>
				)
			};

			//给重新申请绑定事件
			let handleReApply=()=>{
				//意向金退款
				(
					(record.businessState.lastAction=='已缴纳意向金'&& record.businessState.state=='退款审核驳回')
					||record.businessState.lastAction=='已缴纳意向金'&& record.businessState.state=='财务审核驳回'
				)&&
					dispatch({
						type:'secondDeal/setState',
						payload:{
							earnestRefundInputVisible:true,
						}
					});
				//首付款退款
				(record.businessState.lastAction=='已缴纳首付款'&& record.businessState.state=='退款审核驳回')&&
					dispatch({
						type:'secondDeal/setState',
						payload:{
							downpaymentInputVisible:true,
						}
					});
				//佣金退款
				(
					(record.businessState.lastAction=='已缴纳佣金'&& record.businessState.state=='退款审核已驳回')
					||(record.businessState.lastAction=='已缴纳佣金'&& record.businessState.state=='退款财务审核驳回')
				)&&
					dispatch({
						type:'secondDeal/setState',
						payload:{
							BrokerageRefundInputVisible:true,
						}
					});



			};

			return (
				<div>
					{
						!(
							(record.businessState.lastAction==='已缴纳意向金' && record.businessState.state==='等待财务审核')
							||(record.businessState.lastAction==='已缴纳意向金' && record.businessState.state==='已完成退款')
							||(record.businessState.lastAction==='已缴纳首付款' && record.businessState.state==='退款财务待审核')
							||(record.businessState.lastAction==='已缴纳首付款' && record.businessState.state==='财务审核驳回')
							||(record.businessState.lastAction==='已缴纳首付款' && record.businessState.state==='已完成退款')
							||(record.businessState.lastAction==='已缴纳佣金' && record.businessState.state==='退款财务待审核')
							||(record.businessState.lastAction==='已缴纳佣金' && record.businessState.state==='已完成退款')
							||(record.businessState.lastAction==='申请贷款' && record.businessState.state==='贷款已批')
						)?
							!(
								(record.businessState.lastAction==='已缴纳意向金' && record.businessState.state==='退款审核驳回')
								||(record.businessState.lastAction==='已缴纳意向金' && record.businessState.state==='财务审核驳回')
								||(record.businessState.lastAction==='已缴纳首付款' && record.businessState.state==='退款审核驳回')
								||(record.businessState.lastAction==='已缴纳佣金' && record.businessState.state==='退款审核已驳回')
								||(record.businessState.lastAction==='已缴纳佣金' && record.businessState.state==='退款财务审核驳回')
							)?
								<span>
									<Dropdown overlay={menu()}>
										<span style={{color:'#108ee9'}} className="ant-dropdown-link" href="#">业务办理</span>
									</Dropdown>
								</span>
								:
								<span>
									<a onClick={handleReApply}>重新申请</a>
								</span>
							:
							null
					}
				</div>
			)
		}

	}, {
		render:(record)=>{
			const toDetailPage=()=>{
				alert('跳转到详情页');
			};
			return (
				<a onClick={toDetailPage}>详情</a>
			)
		}
	}];
	const pagination={
		// total:28,
		showTotal:total => `共 33 项`,
		pageSize:33,
		defaultCurrent:1,
		onChange:(page)=>{
			//dispatch到后台配置page参数,分页拉取数据;
		}
	};

	const EarnestRefundShowProps={

	};
	const EarnestRefundInputProps={

	};
	const DownpaymentRefundShowProps={

	};
	const DownpaymentRefundInputProps={

	};
	const HousingDischargeProps={

	};
	const BrokerageRefundShowProps={

	};
	const BrokerageRefundInputProps={

	};
	const ApplyDealProps={

	};
	//add by jc 模拟点击跳转到过户办理页面
	const toHandleTransfer=()=>{
		dispatch({
      type:'secondDeal/setState',
      payload:{
        currentChildDetail:'ApplyTransfer'
      }
    })
		dispatch(routerRedux.push('/dealManagement/secondHouseSellDeal/HandSellDetails'))
	}
	const waitDealHandleTransfer=()=>{
		dispatch({
			type:"secondDeal/setState",
			payload:{
				showHandleTransferModal:true,
				ApplyTransferCurrent:0,
				isApplyTransferWrote:false,
			}
		})
	}
	const rejectedHandleTransfer=()=>{
		dispatch({
			type:"secondDeal/setState",
			payload:{
				showHandleTransferModal:true,
				ApplyTransferCurrent:1,
				isApplyTransferWrote:false,
			}
		})
	}
	const completeHandleTransfer=()=>{
		dispatch({
			type:"secondDeal/setState",
			payload:{
				showHandleTransferModal:true,
				ApplyTransferCurrent:2,
				isApplyTransferWrote:false,
			}
		})
	}
	//以上内容是add by jc

	return (
		<div>
			<Button type="ghost" onClick={toHandleTransfer}>点击跳转到过户办理页面</Button>
			<Button type="ghost" onClick={waitDealHandleTransfer}>点击状态为等待受理的申请过户</Button>
			<Button type="ghost" onClick={rejectedHandleTransfer}>点击状态为过户申请已驳回的过户申请</Button>
			<Button type="ghost" onClick={completeHandleTransfer}>点击状态为已完成过户的过户申请</Button>
			<Table
				// rowSelection={rowSelection}
				columns={columns}
				dataSource={data}
				pagination={pagination}
			/>
			<EarnestRefundShow {...EarnestRefundShowProps}/>
			<EarnestRefundInput {...EarnestRefundInputProps}/>
			<DownpaymentRefundShow {...DownpaymentRefundShowProps}/>
			<DownpaymentRefundInput {...DownpaymentRefundInputProps}/>
			<BrokerageRefundShow {...BrokerageRefundShowProps}/>
			<BrokerageRefundInput {...BrokerageRefundInputProps}/>
			<ApplyDeal {...ApplyDealProps}/>
			<HousingDischarge {...HousingDischargeProps}/>
			<ApplyTransfer/>
		</div>
	);
}

WaitingDeal.propTypes = {
	data: PropTypes.array,
};
function mapStateToProps({ secondDeal }) {
	return { secondDeal };
}
export default connect(mapStateToProps)(WaitingDeal);
