import React from 'react'

import ReactDOM from 'react-dom'
import {connect} from 'dva'
import {Table,Button,Tabs, message} from 'antd';
const TabPane = Tabs.TabPane;
import SearchInput from '../../../commons/View/SearchInput'

import SecondHandDealAuditModal from '../../components/contractReview/SecondHandDealAuditModal'
import SecondHandRefundAuditModal from '../../components/contractReview/SecondHandRefundAuditModal'

import AuditExplainModal from '../../components/contractReview/AuditExplainModal'
import './secondHandHouseSalesAudit.css';
import '../../../commons/css/common.css';
import PromptModal from'../../../commons/View/PromptModal'
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import { routerRedux,Link } from 'dva/router'
import {
	renderUnitPriceStr,
	renderTotalMoneyStr,
	renderMoneyStr,
} from '../../../commons/utils/publicFunction'
/*****************************************************/
/*****************************************************/
/**********  二手房出售：成交、意向金、首付、佣金 *******/
/*****************************************************/
/*****************************************************/


// const intentionTableProps={
// 	columns:[
// 		{
// 			title: '序号',
// 			dataIndex: 'number',
// 		},{
// 			title: '所属小区',
// 			dataIndex: 'communityName',
// 		},{
// 			title:'物业类型',
// 			dataIndex:'propertyType',
// 		},{
// 			title:'房源信息',
// 			dataIndex:'resourcesInfo',
// 			render:(text, record)=>{
// 				return fyxxRender(text, record)
// 			}
// 		},{
// 			title: '退款类型',
// 			dataIndex: 'refundType',
// 		},{
// 			title:'支付订单',
// 			dataIndex:'orderNumber'
// 		},
// 		// {
// 		// 	title:'支付流水',
// 		// 	dataIndex:'serialNumber'
// 		// },
// 		{
// 			title: '退款金额',
// 			dataIndex: 'amount',
// 			render:(text)=>`${text}元`
// 			}
// 		},{
// 			title: '支付时间',
// 			dataIndex: 'paymentDateTime',
// 		},{
// 			title: '支付客户',
// 			dataIndex: 'customerName',
// 		},{
// 			title: '审核状态',
// 			dataIndex: 'refundAuditStatus',
// 			render:(text,record)=>{
// 				return refundColumnsRender('refundAuditStatus',text,record)
// 			}
// 		},{
// 			title: '操作',
// 			dataIndex: 'operation',
// 			render:(text,record)=>{
// 				return refundColumnsRender('operation',text,record)
// 			}
// 		},
// 	]
// }


function SecondHandHouseSalesAudit({dispatch,secondHandHouseSalesAudit}){
	const {
		activeKey,
		loadingShadow,
		projectDealAudit,
		projectDealAuditModal,
		refundAudit,
		refundAuditModal,
		tableLoading,
		resultData,
		promptObj,
		secondHouseDealList,
		initIntentMoneyAudit,
		secondHouseDealPage,
		intentMoneyAuditPage,
		initDownPaymentAuditTableDataPage,
		initCommissionAuditTableDataPage,
		pagination,
	}=secondHandHouseSalesAudit;

 	var {keyWords} = secondHandHouseSalesAudit;
	const placeholdershow=(key)=>{
		// console.log(key,'keykey');
    let _key='';
    if(key=='dealAudit'){
      _key='请在此输入筛选关键字进行搜索，支持所属小区，成交经纪人'
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
		// searchFuc:(value)=>{
		// 		console.log("搜索内容：", value);
		// 		dispatch({
		// 			type:'secondHandHouseSalesAudit/setState',
		// 			payload:{
		// 				keyWords:value,
		// 			}
		// 		});
		// 		keyWords = value;
		// 		setTimeout(function () {
		// 			sendSearch(activeKey);
		// 		}, 200);
		// },
		searchFuc:(value)=>dispatch({
			type:'secondHandHouseSalesAudit/searchKeyWord',
			payload:value,
		}),
		clearFuc:(value)=>dispatch({
			type:'secondHandHouseSalesAudit/searchKeyWord',
			payload:'',
		}),
		type:'button',
		buttonTitle:'搜索',
	};

	const tableTagOnChange=(e)=>{
		dispatch({
			type:'secondHandHouseSalesAudit/changeTableTab',
			payload:e,
		})
			// dispatch({
			// 	type:'secondHandHouseSalesAudit/setState',
			// 	payload:{
			// 		activeKey:e,
			// 	}
			// });
			// keyWords = '';
			// dispatch({
			// 	type:'secondHandHouseSalesAudit/setState',
			// 	payload:{
			// 		keyWords:'',
			// 	}
			// });
			// sendSearch(e);
	};

	// const sendSearch=(e)=>{
	//
	//
	// 	// console.log('sendSearch', keyWords)
	// 	// //在此发起fetch请求
	// 	// if (e === 'dealAudit') {
	// 	// 		dispatch({
	// 	// 			type:'secondHandHouseSalesAudit/getInitSecondHandDealTableData',
	// 	// 			payload:{
	// 	// 				pageNo:0,
	// 	// 				pageSize: paginationSecondHouseDeal.pageSize,
	// 	// 				keyWords:keyWords,
	// 	// 			}
	// 	// 		})
	// 	// }
	// 	// else if(e==='intentMoneyAudit'){
	// 	// 		// 二手房意向金退款审核
	// 	// 		dispatch({
	// 	// 			type:'secondHandHouseSalesAudit/getInitIntentMoneyAuditTableData',
	// 	// 			payload:{
	// 	// 				pageNo:0,
	// 	// 				pageSize: intentMoneyAuditPage.pageSize,
	// 	// 				keyWords:keyWords,
	// 	// 			}
	// 	// 		})
	// 	// }else if(e==='downPaymentAudit'){
	// 	// 		/** 二手房首付款退款审核 */
	// 	// 		dispatch({
	// 	// 			type:'secondHandHouseSalesAudit/getInitDownPaymentAuditTableData',
	// 	// 			payload:{
	// 	// 				pageNo:0,
	// 	// 				pageSize:initDownPaymentAuditTableDataPage.pageSize,
	// 	// 				keyWords:keyWords,
	// 	// 			}
	// 	// 		})
	// 	// }else if(e==='commissionAudit'){
	// 	// 			/** 二手房佣金退款审核列表 */
	// 	// 			dispatch({
	// 	// 				type:'secondHandHouseSalesAudit/getInitCommissionAuditTableData',
	// 	// 				payload:{
	// 	// 					pageNo:0,
	// 	// 					pageSize:initCommissionAuditTableDataPage.pageSize,
	// 	// 					keyWords:keyWords,
	// 	// 				}
	// 	// 			})
	// 	// 	}
	// }

	/** 审核状态：功能判断 */
	const dealColumnsRender=(dataIndex,text,record)=>{
		const handleClick=()=>{
			// dispatch({
			// 	type:'secondHandHouseSalesAudit/setState',
			// 	payload:{
			// 		projectDealAuditModal:{
			// 			...projectDealAuditModal,
			// 			currentRecord:record,
			// 			visible:true,
			// 		}
			// 	}
			// });
		};
		const dealAduitClick=()=>{
			if (!commonUtil.isFirstClick()) {
				return;
			}
			// dispatch({
			// 	type:"secondHandHouseSalesAudit/getInitSecondHandDealData",
			// 	payload:{
			// 		applyId:{applyId:record.applyId},
			// 		url:"/miss-anzhu-secdhouse-tx-commit/audit/getDetails"
			// 	}
			// });
			// dispatch({
			// 	type:'secondHandHouseSalesAudit/setState',
			// 	payload:{
			// 		projectDealAuditModal:{
			// 			...projectDealAuditModal,
			// 			currentRecord:record,
			// 		}
			// 	}
			// });
			//审核模态框压入页面 add by Duxianqiu 17/05/09
			dispatch(routerRedux.push({
				pathname:'/contractReview/secondHandHouseSalesAudit/shSellCommitContractAudit',
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
				if (_auditStatus == '审核驳回' || _auditStatus == '已撤回申请' || _auditStatus === '财务审核驳回' || _applyAuditStatus === '财务审核驳回' || _applyAuditStatus === '已撤回申请') {
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
				if(_auditStatus == '等待审核' && record.applyAuditStatus !== '已撤回申请' && _applyAuditStatus !== '财务审核驳回') {
						return (<a className="clickA" onClick={dealAduitClick}>审核</a>)
				}else {
						return ('')
				}
		}
	};
	/** 二手房成交审核  列表 columns */
	const columnsDeal=[
		{
			title: '序号',
			dataIndex: 'applyId',
      key: 'key',
		},{
			title: '所属小区',
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
			title: '成交单价',
			dataIndex: 'dealUnitPrice',
			render:(text,record)=>renderUnitPriceStr(record.unitPrice)
		},{
			title: '成交总价',
			dataIndex:'totalPrice',
			render:(text)=>renderTotalMoneyStr(text)
		},{
	    title:'成交方式',
      dataIndex:'transactionMode'
    },{
			title:'成交经纪人',
			dataIndex:'brokerName',
		},{
			title:'成交佣金',
			dataIndex:'commissionAmount',
			render:(text, record)=>renderMoneyStr(text)
		},{
			title: '成交时间',
			dataIndex: 'applyDateTime',
		},{
			title: '审核状态',
			dataIndex: 'auditStatus',
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
	const commonsTableProps={
		showQuickJumper:commonFinalCode.showQuickJumper,
		pageSize: pagination.pageSize,
		current:pagination.current,
		defaultCurrent:1,
		total:pagination.total,
		showTotal:total => `共${total}条数据`,
		onChange:(page)=>dispatch({
			type:'secondHandHouseSalesAudit/changePage',
			payload:page,
		}),
	}

	/** 二手房成交审核分页 */
	const paginationSecondHouseDeal={
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: pagination.pageSize,
			current:pagination.current,
			defaultCurrent:1,
			total:pagination.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page)=>dispatch({
				type:'secondHandHouseSalesAudit/changePage',
				payload:page,
			}),
			// onChange:(page,pageSize)=>{
			// 	dispatch({
			// 		type:'secondHandHouseSalesAudit/getInitSecondHandDealTableData',
			// 		payload:{
			// 			pageNo:page-1,
			// 			pageSize:secondHouseDealPage.pageSize,
			// 		}
			// 	})
			// },
	};


	/** 二手房意向金退款分页*/
	const paginationIntentMoneyAudit={
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: pagination.pageSize,
			current:pagination.current,
			defaultCurrent:1,
			total:pagination.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page)=>dispatch({
				type:'secondHandHouseSalesAudit/changePage',
				payload:page,
			}),
			// onChange:(page,pageSize)=>{
			// 	dispatch({
			// 		type:'secondHandHouseSalesAudit/getInitIntentMoneyAuditTableData',
			// 		payload:{
			// 			pageNo:page-1,
			// 			pageSize:intentMoneyAuditPage.pageSize,
			// 		}
			// 	})
			// },
	};

	/** 二手房首付款退款分页*/
	// const paginationInitDownPaymentAudit={
	// 		showQuickJumper:commonFinalCode.showQuickJumper,
	// 		pageSize: pagination.pageSize,
	// 		current:pagination.current,
	// 		defaultCurrent:1,
	// 		total:pagination.total,
	// 		showTotal:total => `共${total}条数据`,
	// 		onChange:(page)=>dispatch({
	// 			type:'secondHandHouseSalesAudit/changePage',
	// 			payload:page,
	// 		}),
	// 		// onChange:(page,pageSize)=>{
	// 		// 	dispatch({
	// 		// 		type:'secondHandHouseSalesAudit/getInitDownPaymentAuditTableData',
	// 		// 		payload:{
	// 		// 			pageNo:page-1,
	// 		// 			pageSize:initDownPaymentAuditTableDataPage.pageSize,
	// 		// 		}
	// 		// 	})
	// 		// },
	// };

	/** 二手房佣金退款分页*/
	const paginationInitCommissionAudit={
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: pagination.pageSize,
			current:pagination.current,
			defaultCurrent:1,
			total:pagination.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page)=>dispatch({
				type:'secondHandHouseSalesAudit/changePage',
				payload:page,
			}),
			// onChange:(page,pageSize)=>{
			// 	dispatch({
			// 		type:'secondHandHouseSalesAudit/getInitCommissionAuditTableData',
			// 		payload:{
			// 			pageNo:page-1,
			// 			pageSize:initCommissionAuditTableDataPage.pageSize,
			// 		}
			// 	})
			// },
	};

	const refundColumnsRender=(dataIndex,text,record)=>{
		let handleClick=()=>{
			if(!!record){
				// 点击审核意向金
				console.log('record.refundType-- >  ', record.refundType)
				if(record.refundType === "购房定金"){
					// dispatch({
					// 	type:"secondHandHouseSalesAudit/getDetailsData",
					// 	payload:{
					// 		applyId:{applyId:record.applyId},
					// 		url:"/miss-anzhu-secdhouse-tx-intention/audit/getDetails"
					// 	}
					// })
					//审核模态框压入页面  by 杜咸秋 2017/4/20
					dispatch(routerRedux.push({
						pathname:'/contractReview/secondHandHouseSalesAudit/shSellIntentsContractAudit',
						state:{
							applyId:record.applyId,
							recordId:record.recordId,
						}
					}))
				}else if(record.refundType === "首付款"){
					// dispatch({
					// 	type:"secondHandHouseSalesAudit/getDetailsData",
					// 	payload:{
					// 		applyId:{applyId:record.applyId},
					// 		url:"/miss-anzhu-secdhouse-tx-firstpayment/audit/getDetails"
					// 	}
					// })
					//审核模态框压入页面  by 杜咸秋 2017/5/5
					dispatch(routerRedux.push({
						pathname:'/contractReview/secondHandHouseSalesAudit/shSellDownPaymentContractAudit',
						state:{
							applyId:record.applyId,
							recordId:record.recordId,
						}
					}))
				}else if(record.refundType === "佣金"){
					// dispatch({
					// 	type:"secondHandHouseSalesAudit/getDetailsData",
					// 	payload:{
					// 		applyId:{applyId:record.applyId},
					// 		url:"/miss-anzhu-secdhouse-tx-commission/audit/getDetails"
					// 	}
					// })
					//审核模态框压入页面  by 杜咸秋 2017/5/9
					dispatch(routerRedux.push({
						pathname:'/contractReview/secondHandHouseSalesAudit/shSellCommissionContractAudit',
						state:{
							applyId:record.applyId,
							recordId:record.recordId,
						}
					}))
				}
				// /** 显示数据框 */
				// dispatch({
				// 	type:'secondHandHouseSalesAudit/setState',
				// 	payload:{
				// 		refundAuditModal:{
				// 			...refundAuditModal,
				// 			currentRecord:record,
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
					if (_refundAuditStatus == '已撤回申请' || _refundAuditStatus == '审核驳回' || _refundAuditStatus === '财务审核驳回' || _applyAuditStatus === '财务审核驳回' || _applyAuditStatus === '退款申请驳回' || _applyAuditStatus === '已撤回申请') {
						_class = 'rejectTextColor';
					}
					return (
						<div>
							<p>
								{record.refundAuditStatus}
							</p>
							<a className={_class} onClick={handleClick}>{_applyAuditStatus}</a>
						</div>
					);
			case 'operation':
					if(record.refundAuditStatus==="等待审核" && record.applyAuditStatus !== '已撤回申请'){
						return(<a className="clickA" onClick={handleClick}>审核</a>)
					}else{
						return;
					}
			default:
				break;
		}
	};


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
		{
			title:'支付流水',
			dataIndex:'serialNumber'
		},
		{
			title: '退款金额',
			dataIndex: 'amount',
			render:(text, record)=>{
				return (
					<label>{text}元</label>
				)
			}
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


	/** 审核返回 */
	const onOkCallBack=()=>{
		if(promptObj.todo==='closeModal'){
			dispatch({
				type:"secondHandHouseSalesAudit/togglePrompt",
				payload:{
					visible:false
				}
			})
		}
		if((promptObj.todo === "closeModalAndSendFetch")
			|| (promptObj.todo === 'closeModalAndSendDownPaymentFetch')
			|| (promptObj.todo === 'closeModalAndSendCommissionFetch') ){

			dispatch({
				type:'secondHandHouseSalesAudit/closeAllModal'
			})
			// // 完成
			// dispatch({
			// 	type:'auditExplainModal/closeModal',
			// 	payload:{
			// 		visible:false
			// 	}
			// });
			//
			// // 关闭成交审核框
			// dispatch({
			// 	type:'secondHandHouseSalesAudit/setState',
			// 	payload:{
			// 		projectDealAuditModal:{
			// 			...projectDealAuditModal,
			// 			visible:false,
			// 		}
			// 	}
			// });
			//
			// dispatch({
			// 	type:"secondHandHouseSalesAudit/togglePrompt",
			// 	payload:{
			// 		visible:false
			// 	}
			// });
			// dispatch({
			// 	type:"secondHandHouseSalesAudit/toggleRefundAuditModal",
			// 	payload:{
			// 		visible:false
			// 	}
			// });
			// dispatch({
			// 	type:'secondHandHouseSalesAudit/getActiveTabTableData'
			// })
			// //
			// // console.log('activeKey---    ', activeKey);
			// // if(activeKey === 'dealAudit') {
			// // 		// 重新加载成交审核列表列表
			// // 		dispatch({
			// // 			type:"secondHandHouseSalesAudit/getInitSecondHandDealTableData",
			// // 			payload:{
			// // 				pageNo: secondHouseDealPage.pageNo,
			// // 				pageSize: secondHouseDealPage.pageSize,
			// // 			}
			// // 		})
			// // }else if(activeKey === 'intentMoneyAudit') {
			// // 	dispatch({
			// // 		type:'secondHandHouseSalesAudit/getInitIntentMoneyAuditTableData',
			// // 		payload:{
			// // 			pageNo: intentMoneyAuditPage.pageNo,
			// // 			pageSize: intentMoneyAuditPage.pageSize,
			// // 		}
			// // 	})
			// // }else if(activeKey === 'downPaymentAudit') {
			// // 		dispatch({
			// // 				type:'secondHandHouseSalesAudit/getInitDownPaymentAuditTableData',
			// // 				payload:{
			// // 					pageNo: initDownPaymentAuditTableDataPage.pageNo,
			// // 					pageSize:initDownPaymentAuditTableDataPage.pageSize,
			// // 				}
			// // 		})
			// // }else if(activeKey === 'commissionAudit') {
			// // 	dispatch({
			// // 			type:'secondHandHouseSalesAudit/getInitCommissionAuditTableData',
			// // 			payload:{
			// // 				pageNo: initCommissionAuditTableDataPage.pageNo,
			// // 				pageSize:initCommissionAuditTableDataPage.pageSize,
			// // 			}
			// // 	})
			// // }
		}

	}

	const onCancelCallBack=()=>{}
	return (
    <div className="secondHandHouseSalesAudit">
			{
				/*
				意向金、首付、佣金 审核框
				*/
			}
			<SecondHandRefundAuditModal />

			<SecondHandDealAuditModal/>

			<DxLoadingShadow visible={loadingShadow} />
		  <PromptModal zIndex={5000} {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
			<div style={{paddingTop:20}}>
				<SearchInput id="searcId" {...searchInputProps} value={keyWords} />
			</div>
			<div style={{paddingTop:20}}>
				<Tabs
					activeKey={activeKey}
					className='ant_tabs_anzhu'
					defaultActivKey="dealAudit"
					onChange={tableTagOnChange}
					type="card"
					>
						<TabPane tab='二手房成交审核' key='dealAudit'>
							<Table
								loading={tableLoading}
								dataSource={secondHouseDealPage.content}
								columns={columnsDeal}
								pagination={paginationSecondHouseDeal}
							/>

						</TabPane>


						<TabPane tab='二手房意向金退款审核' key='intentMoneyAudit'>
							<Table
								loading={tableLoading}
								dataSource={intentMoneyAuditPage.content}
								columns={intentMoneyAuditRefund}
								pagination={paginationIntentMoneyAudit}
							/>
						</TabPane>

						{/*<TabPane tab='二手房首付款退款审核' key='downPaymentAudit'>
							<Table
								loading={tableLoading}
								dataSource={initDownPaymentAuditTableDataPage.content}
								columns={intentMoneyAuditRefund}
								pagination={paginationInitDownPaymentAudit}
							/>
						</TabPane>*/}

						<TabPane tab='二手房佣金退款审核' key='commissionAudit'>
							<Table
								loading={tableLoading}
								dataSource={initCommissionAuditTableDataPage.content}
								columns={intentMoneyAuditRefund}
								pagination={paginationInitCommissionAudit}
							/>
						</TabPane>

				</Tabs>
			</div>
    </div>
	)
}

function mapStateToProps({secondHandHouseSalesAudit}){
	return {secondHandHouseSalesAudit}
}

export default connect(mapStateToProps)(SecondHandHouseSalesAudit);
