import React from 'react'
import {connect} from 'dva'
import { routerRedux,Link } from 'dva/router'
import {Table,Button,Tabs, message} from 'antd';
const TabPane = Tabs.TabPane;
import SearchInput from '../../../commons/View/SearchInput'

import SecondHandRentalDealAuditModal from '../../components/contractReview/SecondHandRentalDealAuditModal'
import SecondHandRentRefundAuditModal from '../../components/contractReview/SecondHandRentRefundAuditModal'

import AuditExplainModal from '../../components/contractReview/AuditExplainModal'
import './SecondHandHouseRentalAudit.css';
import '../../../commons/css/common.css';
import PromptModal from '../../../commons/View/PromptModal';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import {
	renderRentMeony,
	renderMoneyStr,
} from '../../../commons/utils/publicFunction'
/*****************************************************/
/*****************************************************/
/********** 合同审核：  二手房出租等功能 ***************/
/*****************************************************/
/*****************************************************/


function SecondHandHouseRentalAudit({dispatch,secondHandHouseRentalAudit}){
	const {
		activeKey,
		projectDealAudit,
		loadingShadow,
		projectDealAuditModal,
		refundAudit,
		refundAuditModal,
		tableLoading,
		resultData,
		promptObj,
		secondHouseRentalPage,
		intentMoneyAuditPage,
		initCommissionAuditPage,
		pagination,
	}=secondHandHouseRentalAudit;

	//组织返回的数据成表格需要的数据和相关操作
	const placeholdershow=(key)=>{
		// console.log(key,'keykey');
    let _key='';
    if(key=='dealAudit'){
      _key='请在此输入筛选关键字进行搜索，支持小区名称，成交经纪人'
      return _key
    }else if(key=='intentMoneyAudit'){
      _key='请在此输入筛选关键字进行搜索，支持所属小区，支付订单，支付客户'
      return _key
    }else{
			_key='请在此输入筛选关键字进行搜索，支持所属小区，支付订单，支付客户'
			return _key
		}
  }
	const searchInputProps={
		placeholder:placeholdershow(activeKey),
		searchFuc:(value)=>dispatch({
			type:'secondHandHouseRentalAudit/changeKeyWords',
			payload:value,
		}),
		clearFuc:(value)=>dispatch({
			type:'secondHandHouseRentalAudit/changeKeyWords',
			payload:'',
		}),
		type:'button',
		buttonTitle:'搜索',
	};


	const tableTagOnChange=(e)=>{
		dispatch({
			type:'secondHandHouseRentalAudit/changeTableTab',
			payload:e,
		})
		// dispatch({
		// 	type:'secondHandHouseRentalAudit/setState',
		// 	payload:{
		// 		activeKey:e,
		// 	}
		// });

		// //在此发起fetch请求
		// if(e==='dealAudit'){
		// 	dispatch({
		// 		type:'secondHandHouseRentalAudit/getInitSecondHandDealTableData',
		// 		payload:{
		// 			pageNo:0,
		// 			pageSize: secondHouseRentalPage.pageSize,
		// 		}
		// 	})
		// }
		// else if(e==='intentMoneyAudit'){
		// 	dispatch({
		// 		type:'secondHandHouseRentalAudit/getInitIntentMoneyAuditTableData',
		// 		payload:{
		// 			pageNo:0,
		// 			pageSize: intentMoneyAuditPage.pageSize,
		// 		}
		// 	})
		// }else if(e==='commissionAudit'){
		// 			dispatch({
		// 			type:'secondHandHouseRentalAudit/getInitCommissionAuditTableData',
		// 			payload:{
		// 				pageNo:0,
		// 				pageSize: initCommissionAuditPage.pageSize,
		// 			}
		// 		})
		// 	}
	};


	/** ---------------------二手房出租审核 start----------------------------- */
	const dealColumnsRender=(dataIndex,text,record)=>{
			const handleClick=()=>{
				dispatch({
					type:'secondHandHouseRentalAudit/setState',
					payload:{
						projectDealAuditModal:{
							...projectDealAuditModal,
							currentRecord:record,
							visible:true,
						}
					}
				});
			};

			// 审核点击
			const dealAduitClick=()=>{
				if (!commonUtil.isFirstClick()) {
					return;
				}

				// dispatch({
				// 	type:"secondHandHouseRentalAudit/getInitSecondHandDealData",
				// 	payload:{
				// 		applyId:{applyId:record.applyId},
				// 		url:"/miss-anzhu-secdhouse-tx-commit/audit/getDetails"
				// 	}
				// });
				// dispatch({
				// 	type:'secondHandHouseRentalAudit/setState',
				// 	payload:{
				// 		projectDealAuditModal:{
				// 			...projectDealAuditModal,
				// 			currentRecord:record,
				// 		}
				// 	}
				// });
				//审核模态框压入页面  by duxianqiu 2017/05/10
				dispatch(routerRedux.push({
					pathname:'/contractReview/secondHandHouseRentalAudit/shRentCommitContractAudit',
					state:{
						applyId:record.applyId,
						recordId:record.recordId,
					}
				}))
			}

			if(dataIndex=='sellingHouse'){
					return(
		        <span>{record.sellingHouse}/{record.totalHouse}</span>
					)
			}else if(dataIndex=='electricityPrivilege'){
					return (
		        <span>{text}个</span>
					)
			}else if(dataIndex=='status'){
					let _class = "passedTextColor";
					let _auditStatus = record.auditStatus;
					let _applyAuditStatus = record.applyAuditStatus;
					if (_auditStatus == '审核驳回' || _auditStatus == '撤回申请' || _applyAuditStatus === '已撤回申请') {
						_class = "rejectTextColor";
					}
					return (
						<div>
							<p>成交审核</p>
							<a className={_class} onClick={dealAduitClick}>{record.applyAuditStatus}</a>
						</div>
					)
			}else if(dataIndex=='operation'){
					// 二手房 成交
					let _auditStatus = record.auditStatus;
					let _applyAuditStatus = record.applyAuditStatus;
					if(_auditStatus == '等待审核' && _applyAuditStatus !== '已撤回申请') {
							return (<a className="clickA" onClick={dealAduitClick}>审核</a>)
					}else {
							return ('')
					}
			}
	};
	const paginationSecondHouseRentalDeal={
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: pagination.pageSize,
			current:pagination.current,
			defaultCurrent:1,
			total:pagination.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page)=>dispatch({
				type:'secondHandHouseRentalAudit/changePage',
				payload:page,
			})
	};
	const columnsDeal=[
		{
			title: '序号',
			dataIndex: 'applyId',
		},{
			title: '小区名称',
			dataIndex: 'communityName',
    },{
	    title:'物业类型',
      dataIndex:'propertyType',
		},{
			title: '成交房源',
			dataIndex: 'resourcesInfo',
			render:(text, record)=>{
				return fyxxRender(text, record)
			}
		},{
			title: '成交租金',
			dataIndex: 'actualRent',
			render:(text,record)=>renderRentMeony(text,record.propertyType)
		},{
	    title:'成交方式',
      dataIndex:'transactionMode'
    },{
			title:'成交经纪人',
			dataIndex:'brokerName',
		},{
			title:'成交佣金',
			dataIndex:'commissionAmount',
			render:(text, record)=>{
				return (
					<label>{text}元</label>
				)
			}
		},{
			title:'租期',
			dataIndex:'leaseTerm',
			render:(text)=>`${text}月`
		},{
			title: '成交时间',
			dataIndex: 'applyDateTime',
		},{
			title: '审核状态',
			dataIndex: 'status',
			render:(text,record)=>{
				return dealColumnsRender('status',text,record);
			}
		},{
			title: '操作',
			dataIndex:'operation',
			render:(text,record)=>{
				return dealColumnsRender('operation',text,record);
			}
		},
	];

	/** -----------------------意向金 start---------------------------------- */
	const refundColumnsRender=(dataIndex,text,record)=>{
		let handleClick=()=>{
			if(!!record){
				console.log('record.refundType  ', record.refundType)
				if(record.refundType==="购房定金"){
						// dispatch({
						// 	type:"secondHandHouseRentalAudit/getDetailsData",
						// 	payload:{
						// 		applyId:{applyId:record.applyId},
						// 		url:"/miss-anzhu-secdhouse-tx-intention/audit/getDetails"
						// 	}
						// })
						//审核模态框压入页面  by duxianqiu 2017/05/09
						dispatch(routerRedux.push({
							pathname:'/contractReview/secondHandHouseRentalAudit/shRentIntentsContractAudit',
							state:{
								applyId:record.applyId,
								recordId:record.recordId,
							}
						}))
				}else if(record.refundType==="佣金"){
						// dispatch({
						// 	type:"secondHandHouseRentalAudit/getDetailsData",
						// 	payload:{
						// 		applyId:{applyId:record.applyId},
						// 		url:"/miss-anzhu-secdhouse-tx-commission/audit/getDetails"
						// 	}
						// })
						//审核模态框压入页面  by duxianqiu 2017/05/10
						dispatch(routerRedux.push({
							pathname:'/contractReview/secondHandHouseRentalAudit/shRentCommissionContractAudit',
							state:{
								applyId:record.applyId,
								recordId:record.recordId,
							}
						}))
				}
				// dispatch({
				// 	type:'secondHandHouseRentalAudit/setState',
				// 	payload:{
				// 		refundAuditModal:{
				// 			...refundAuditModal,
				// 			currentRecord:record,
				// 			// visible:true,
				// 		}
				// 	}
				// });
			}
		};

		switch (dataIndex){
			case 'refundAuditStatus':
					let _class = "passedTextColor";
					let _refundAuditStatus = record.refundAuditStatus;
					let _applyAuditStatus = record.applyAuditStatus;
					if (_refundAuditStatus == '撤回申请' || _refundAuditStatus == '审核驳回' || _applyAuditStatus === '已撤回申请') {
						_class = 'rejectTextColor';
					}
					return (
	          <div>
							<p>
								{record.refundAuditStatus}
							</p>
							<a className={_class} onClick={handleClick}>{record.applyAuditStatus}</a>
	          </div>
					);
			case 'operation':
					if(record.refundAuditStatus==="等待审核" && _applyAuditStatus !== '已撤回申请'){
						return(<a className="clickA" onClick={handleClick}>审核</a>)
					}else{
						return;
					}
			default:
				break;
		}

	};

	const paginationIntentMoneyAudit={
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: pagination.pageSize,
			current:pagination.current,
			defaultCurrent:1,
			total:pagination.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page)=>dispatch({
				type:'secondHandHouseRentalAudit/changePage',
				payload:page,
			})
	};
	const intentMoneyAuditRefund=[
		{
			title: '序号',
			dataIndex: 'applyId',
		},{
			title: '所属小区',
			dataIndex: 'communityName',
		},{
			title:'物业类型',
			dataIndex:'propertyType',
		},{
			title:'房源信息',
			dataIndex:'resourcesInfo',
			render:(text, record)=>{
				return fyxxRender(text, record)
			}
		},
		// {
		// 	title: '退款类型',
		// 	dataIndex: 'refundType',
		// },
		{
			title:'支付订单',
			dataIndex:'orderNumber'
		},
		// {
		// 	title:'支付流水',
		// 	dataIndex:'serialNumber'
		// },
		{
			title: '退款金额',
			dataIndex: 'amount',
			render:(text, record)=>renderMoneyStr(text)
		},{
			title: '支付时间',
			dataIndex: 'paymentDateTime',
		},{
			title: '支付客户',
			dataIndex: 'customerName',
		},{
			title: '审核状态',
			dataIndex: 'refundAuditStatus',
			render:(text,record)=>{
				return refundColumnsRender('refundAuditStatus',text,record)
			}
		},{
			title: '操作',
			dataIndex: 'operation',
			render:(text,record)=>{
				return refundColumnsRender('operation',text,record)
			}
		},
	];

	const fyxxRender=(text, record)=>{
			let fyName = "";
			if (text != null && text.length > 2) {
					const _obj = JSON.parse(text);
					if (_obj['default']) {
							fyName = _obj['default'];
					}
			}
			return (
					<span>{fyName}</span>
			)
	}

	/** -----------------------意向金 start---------------------------------- */
	const paginationCommissionAudit={
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: pagination.pageSize,
			current:pagination.current,
			defaultCurrent:1,
			total:pagination.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page)=>dispatch({
				type:'secondHandHouseRentalAudit/changePage',
				payload:page,
			})
	};
	const commissionAuditRefund=[
		{
			title: '序号',
			dataIndex: 'applyId',
		},{
			title: '所属小区',
			dataIndex: 'communityName',
		},{
			title:'物业类型',
			dataIndex:'propertyType',
		},{
			title:'房源信息',
			dataIndex:'resourcesInfo',
			render:(text, record)=>{
				return fyxxRender(text, record)
			}
		},
		// {
		// 	title: '退款类型',
		// 	dataIndex: 'refundType',
		// },
		{
			title:'支付订单',
			dataIndex:'orderNumber'
		},
		// {
		// 	title:'支付流水',
		// 	dataIndex:'serialNumber'
		// },
		{
			title: '退款金额',
			dataIndex: 'amount',
			render:(text, record)=>renderMoneyStr(text)
		},{
			title: '支付时间',
			dataIndex: 'paymentDateTime',
		},{
			title: '支付客户',
			dataIndex: 'customerName',
		},{
			title: '审核状态',
			dataIndex: 'refundAuditStatus',
			render:(text,record)=>{
				return refundColumnsRender('refundAuditStatus',text,record)
			}
		},{
			title: '操作',
			dataIndex: 'operation',
			render:(text,record)=>{
				return refundColumnsRender('operation',text,record)
			}
		},
	];


	const onOkCallBack=()=>{
		dispatch({
			type:'secondHandHouseRentalAudit/closePrompt'
		})
	}
	const onCancelCallBack=()=>{}


	return (
    <div className="secondHandHouseRentalAudit">

			<SecondHandRentRefundAuditModal/>

		  <PromptModal zIndex={5000} {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
			<div style={{paddingTop:20}}>
	      <SearchInput {...searchInputProps}/>
			</div>
			<DxLoadingShadow visible={loadingShadow} />
			<div style={{paddingTop:20}}>
				<Tabs
					className='ant_tabs_anzhu'
					activeKey={activeKey}
					defaultActivKey="dealAudit"
					onChange={tableTagOnChange}
					type="card"
					>

						<TabPane tab='二手房出租审核' key='dealAudit'>
							<Table
								loading={tableLoading}
								dataSource={secondHouseRentalPage.content}
								columns={columnsDeal}
								pagination={paginationSecondHouseRentalDeal}
							/>
							<SecondHandRentalDealAuditModal/>
						</TabPane>

						<TabPane tab='二手房出租-意向金退款审核' key='intentMoneyAudit'>
							<Table
								loading={tableLoading}
								dataSource={intentMoneyAuditPage.content}
								columns={intentMoneyAuditRefund}
								pagination={paginationIntentMoneyAudit}
							/>
						</TabPane>

						<TabPane tab='二手房出租-佣金退款审核' key='commissionAudit'>
							<Table
								loading={tableLoading}
								dataSource={initCommissionAuditPage.content}
								columns={commissionAuditRefund}
								pagination={paginationCommissionAudit}
							/>
						</TabPane>

				</Tabs>
			</div>
    </div>
	)
}

function mapStateToProps({secondHandHouseRentalAudit}){
	return {secondHandHouseRentalAudit}
}

export default connect(mapStateToProps)(SecondHandHouseRentalAudit);
